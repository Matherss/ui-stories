import { createHighlighter, type Highlighter } from 'shiki'

let highlighterPromise: Promise<Highlighter> | null = null

const BUNDLED_THEMES = [
  'vitesse-light',
  'vitesse-dark',
  'github-light',
  'github-dark',
] as const

export type UIShikiTheme = (typeof BUNDLED_THEMES)[number]

export const UISHIKI_THEME_OPTIONS: { id: UIShikiTheme; label: string }[] = [
  { id: 'vitesse-light', label: 'Vitesse' },
  { id: 'vitesse-dark', label: 'Vitesse Dark' },
  { id: 'github-light', label: 'GitHub' },
  { id: 'github-dark', label: 'GitHub Dark' },
]

async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [...BUNDLED_THEMES],
      langs: ['vue', 'html'],
    })
  }
  return highlighterPromise
}

export async function highlightUiStoriesSnippet(
  source: string,
  theme: UIShikiTheme = 'vitesse-light',
): Promise<string> {
  const h = await getHighlighter()
  return h.codeToHtml(source.trimEnd(), {
    lang: 'vue',
    theme,
  })
}
