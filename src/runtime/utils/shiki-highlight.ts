import { createHighlighterCore, type HighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

let highlighterPromise: Promise<HighlighterCore> | null = null

const BUNDLED_THEMES = [
  'github-light',
  'github-dark',
] as const

export type UIShikiTheme = (typeof BUNDLED_THEMES)[number]

export const UISHIKI_THEME_OPTIONS: { id: UIShikiTheme; label: string }[] = [
  { id: 'github-light', label: 'GitHub' },
  { id: 'github-dark', label: 'GitHub Dark' },
]

async function getHighlighter(): Promise<HighlighterCore> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: [
        import('shiki/themes/github-light.mjs'),
        import('shiki/themes/github-dark.mjs'),
      ],
      langs: [
        import('shiki/langs/vue.mjs')
      ],
      engine: createJavaScriptRegexEngine()
    })
  }
  return highlighterPromise
}

export async function highlightUiStoriesSnippet(
  source: string,
  theme: UIShikiTheme = 'github-light',
): Promise<string> {
  const h = await getHighlighter()
  return h.codeToHtml(source.trimEnd(), {
    lang: 'vue',
    theme,
  })
}
