import { readFileSync } from 'node:fs'
import { parse as parseSfc, type SFCDescriptor } from 'vue/compiler-sfc'
import {
  parse as parseTemplate,
  NodeTypes,
  type ElementNode,
  type IfNode,
  type ForNode,
  type TemplateChildNode,
} from '@vue/compiler-dom'
import type { StoryMeta } from '../types/story-meta'

const VARIANT_TAGS = new Set(['UIStoriesVariant', 'uis-variant'])

export interface StoryExtractResult {
  meta: StoryMeta
  variantSources: string[]
}

function extractExportedObjectLiteral(source: string, exportName: string): Record<string, unknown> | null {
  const re = new RegExp(`export\\s+const\\s+${exportName}\\b[^=]*=\\s*`, 'm')
  const m = source.match(re)
  if (!m || m.index === undefined)
    return null

  let i = m.index + m[0].length
  while (i < source.length && /\s/.test(source[i]!))
    i++

  if (source[i] !== '{')
    return null

  let depth = 0
  const start = i
  let inStr: '"' | '\'' | '`' | null = null
  let escaped = false

  for (; i < source.length; i++) {
    const c = source[i]!

    if (inStr) {
      if (escaped) {
        escaped = false
        continue
      }
      if (c === '\\') {
        escaped = true
        continue
      }
      if (c === inStr) {
        inStr = null
        continue
      }
      continue
    }

    if (c === '"' || c === '\'' || c === '`') {
      inStr = c as '"' | '\'' | '`'
      continue
    }

    if (c === '{')
      depth++
    else if (c === '}')
      depth--

    if (depth === 0) {
      const slice = source.slice(start, i + 1)
      try {
        return new Function(`return (${slice})`)() as Record<string, unknown>
      }
      catch {
        return null
      }
    }
  }

  return null
}

function collectScriptSources(descriptor: SFCDescriptor): string {
  if (descriptor.script?.content)
    return descriptor.script.content
  return ''
}

function defaultMetaFromStoryId(storyId: string): StoryMeta {
  const segments = storyId.split('--').filter(Boolean)
  const last = segments[segments.length - 1] ?? storyId
  const name = humanizeSegment(last)
  const directory = segments.length > 1
    ? segments.slice(0, -1).map(humanizeSegment)
    : ['Stories']

  return { name, directory }
}

function humanizeSegment(raw: string): string {
  return raw
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, ch => ch.toUpperCase())
}

function normalizeMeta(raw: Record<string, unknown> | null, storyId: string): StoryMeta {
  const defaults = defaultMetaFromStoryId(storyId)
  if (!raw)
    return defaults

  const name = typeof raw.name === 'string' ? raw.name : defaults.name
  const directory = Array.isArray(raw.directory)
    ? raw.directory.map(String)
    : defaults.directory

  const figma = typeof raw.figma === 'string' ? raw.figma : undefined
  const tags = typeof raw.tags === 'string' ? [raw.tags] : Array.isArray(raw.tags) ? raw.tags.map(String) : undefined
  let description: string | string[] | undefined
  if (typeof raw.description === 'string')
    description = raw.description
  else if (Array.isArray(raw.description))
    description = raw.description.map(String)
  else
    description = undefined

  return { name, directory, figma, description, tags }
}

function leadingSpaceCount(line: string): number {
  const m = /^(\s*)/.exec(line)
  return m ? m[1].length : 0
}

export function normalizeVariantSlotIndent(snippet: string): string {
  let lines = snippet.replace(/\r\n/g, '\n').split('\n').map(l => l.trimEnd())
  while (lines.length && !lines[0].trim())
    lines.shift()
  while (lines.length && !lines[lines.length - 1].trim())
    lines.pop()
  if (lines.length === 0)
    return ''

  const leads = lines.map((l) => {
    return l.trim() ? leadingSpaceCount(l) : -1
  })
  const meaningful = leads.filter((n): n is number => n >= 0)
  const globalMin = Math.min(...meaningful)

  if (globalMin > 0) {
    return lines
      .map(l => (l.trim() ? l.slice(globalMin) : l))
      .join('\n')
      .trimEnd()
  }

  const restLeads = lines.slice(1).map(l => (l.trim() ? leadingSpaceCount(l) : Number.POSITIVE_INFINITY))
  const finite = restLeads.filter(n => n !== Number.POSITIVE_INFINITY)
  const strip = finite.length ? Math.min(...finite) : 0

  return lines
    .map((l, i) => {
      if (!l.trim())
        return l
      if (i === 0)
        return l.trimStart()
      if (strip > 0 && leadingSpaceCount(l) >= strip)
        return l.slice(strip)
      return l
    })
    .join('\n')
    .trimEnd()
}

function extractVariantInner(templateSrc: string, el: ElementNode): string {
  if (el.children.length > 0) {
    return templateSrc
      .slice(
        el.children[0]!.loc.start.offset,
        el.children[el.children.length - 1]!.loc.end.offset,
      )
      .replace(/\r\n/g, '\n')
  }

  const full = templateSrc.slice(el.loc.start.offset, el.loc.end.offset)
  if (/^<\s*(?:UIStoriesVariant|uis-variant)\b[^>]*\/>\s*$/is.test(full))
    return ''

  return full
    .replace(/^<\s*(?:UIStoriesVariant|uis-variant)\b[^>]*>/is, '')
    .replace(/<\/\s*(?:UIStoriesVariant|uis-variant)\s*>$/is, '')
    .replace(/\r\n/g, '\n')
    .trim()
}

function walkVariantNodes(nodes: TemplateChildNode[] | undefined, templateSrc: string, out: string[]) {
  if (!nodes)
    return

  for (const n of nodes) {
    if (n.type === NodeTypes.ELEMENT) {
      const el = n as ElementNode
      if (VARIANT_TAGS.has(el.tag))
        out.push(normalizeVariantSlotIndent(extractVariantInner(templateSrc, el)))
      walkVariantNodes(el.children, templateSrc, out)
    }
    else if (n.type === NodeTypes.IF) {
      for (const b of (n as IfNode).branches)
        walkVariantNodes(b.children, templateSrc, out)
    }
    else if (n.type === NodeTypes.FOR) {
      walkVariantNodes((n as ForNode).children, templateSrc, out)
    }
  }
}

function extractMetaFromDescriptor(
  descriptor: SFCDescriptor,
  source: string,
  storyId: string,
): StoryMeta {
  const scriptCombined = collectScriptSources(descriptor)
  const raw = extractExportedObjectLiteral(scriptCombined, 'storyMeta')
    ?? extractExportedObjectLiteral(source, 'storyMeta')

  return normalizeMeta(raw, storyId)
}

function extractVariantSourcesFromDescriptor(
  descriptor: SFCDescriptor,
  filePath: string,
): string[] {
  if (!descriptor.template?.content)
    return []

  const content = descriptor.template.content
  const ast = parseTemplate(content, { filename: filePath })
  if (ast.errors?.length)
    return []

  const out: string[] = []
  walkVariantNodes(ast.children, content, out)
  return out
}

/** Single read + SFC parse; extracts sidebar meta and variant snippet sources. */
export function extractStoryDataFromFile(filePath: string, storyId: string): StoryExtractResult {
  const source = readFileSync(filePath, 'utf-8')
  const { descriptor, errors } = parseSfc(source, { filename: filePath })

  if (errors?.length) {
    return {
      meta: defaultMetaFromStoryId(storyId),
      variantSources: [],
    }
  }

  return {
    meta: extractMetaFromDescriptor(descriptor, source, storyId),
    variantSources: extractVariantSourcesFromDescriptor(descriptor, filePath),
  }
}
