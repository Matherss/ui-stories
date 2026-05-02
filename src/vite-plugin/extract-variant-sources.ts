import { readFileSync } from 'node:fs'
import { parse as parseSfc } from 'vue/compiler-sfc'
import {
  parse as parseTemplate,
  NodeTypes,
  type ElementNode,
  type IfNode,
  type ForNode,
  type TemplateChildNode,
} from '@vue/compiler-dom'

const VARIANT_TAGS = new Set(['UIStoriesVariant', 'uis-variant'])

function leadingSpaceCount(line: string): number {
  const m = /^(\s*)/.exec(line)
  return m ? m[1].length : 0
}

/**
 * Strips leftover indentation from the parent `<UIStoriesVariant>`:
 * if the first line has no indent but following lines have more, subtracts the shared minimum from the tail only;
 * otherwise subtracts the shared minimum from all non-empty lines (like textwrap.dedent).
 */
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

function walk(nodes: TemplateChildNode[] | undefined, templateSrc: string, out: string[]) {
  if (!nodes)
    return

  for (const n of nodes) {
    if (n.type === NodeTypes.ELEMENT) {
      const el = n as ElementNode
      if (VARIANT_TAGS.has(el.tag))
        out.push(normalizeVariantSlotIndent(extractVariantInner(templateSrc, el)))
      walk(el.children, templateSrc, out)
    }
    else if (n.type === NodeTypes.IF) {
      for (const b of (n as IfNode).branches)
        walk(b.children, templateSrc, out)
    }
    else if (n.type === NodeTypes.FOR) {
      walk((n as ForNode).children, templateSrc, out)
    }
  }
}

/** Template source fragments inside each `<UIStoriesVariant>` in tree order (same as mount order). */
export function extractVariantTemplateSources(filePath: string): string[] {
  const source = readFileSync(filePath, 'utf-8')
  const { descriptor, errors } = parseSfc(source, { filename: filePath })
  if (errors?.length || !descriptor.template?.content)
    return []

  const content = descriptor.template.content
  const ast = parseTemplate(content, { filename: filePath })
  if (ast.errors?.length)
    return []

  const out: string[] = []
  walk(ast.children, content, out)
  return out
}
