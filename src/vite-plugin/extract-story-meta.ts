import { readFileSync } from 'node:fs'
import { parse } from 'vue/compiler-sfc'
import type { StoryMeta } from '../types/story-meta'

function extractExportedObjectLiteral(source: string, exportName: string): Record<string, unknown> | null {
  // Allow a type annotation: `export const storyMeta: StoryMeta = { ... }`
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

/** Plain `<script>` only (not setup): `export const storyMeta` is not allowed in `<script setup>`. */
function collectScriptSources(descriptor: ReturnType<typeof parse>['descriptor']): string {
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

export function extractStoryMetaFromFile(filePath: string, storyId: string): StoryMeta {
  const source = readFileSync(filePath, 'utf-8')
  const { descriptor, errors } = parse(source, { filename: filePath })
  if (errors?.length)
    return defaultMetaFromStoryId(storyId)

  const scriptCombined = collectScriptSources(descriptor)
  const raw = extractExportedObjectLiteral(scriptCombined, 'storyMeta')
    ?? extractExportedObjectLiteral(source, 'storyMeta')

  return normalizeMeta(raw, storyId)
}
