import type { Plugin } from 'vite'
import { extractStoryDataFromFile } from './vite-plugin/extract-story-data'

const VARIANT_SOURCES_QUERY = '?uis-variant-sources'
const VARIANT_SOURCES_PREFIX = '\0uis-variant-sources:'

export function uiStoriesVitePlugin(storyMap: Record<string, string>): Plugin {
  const virtualModuleId = 'virtual:stories'
  const resolvedVirtualModuleId = `\0${virtualModuleId}`

  const pathToStoryId = new Map(
    Object.entries(storyMap).map(([id, path]) => [path.replace(/\\/g, '/'), id]),
  )

  function storyIdForPath(filePath: string): string {
    const normalized = filePath.replace(/\\/g, '/')
    return pathToStoryId.get(normalized) ?? pathToStoryId.get(filePath) ?? ''
  }

  function isStoryPath(filePath: string): boolean {
    return pathToStoryId.has(filePath.replace(/\\/g, '/'))
  }

  return {
    name: 'ui-stories:vite-plugin',
    enforce: 'pre',
    resolveId(id) {
      if (id === virtualModuleId)
        return resolvedVirtualModuleId

      if (id.endsWith(VARIANT_SOURCES_QUERY)) {
        const filePath = id.slice(0, -VARIANT_SOURCES_QUERY.length)
        if (isStoryPath(filePath))
          return `${VARIANT_SOURCES_PREFIX}${filePath.replace(/\\/g, '/')}`
      }
    },
    load(id) {
      if (id.startsWith(VARIANT_SOURCES_PREFIX)) {
        const filePath = id.slice(VARIANT_SOURCES_PREFIX.length)
        const storyId = storyIdForPath(filePath)
        const { variantSources } = extractStoryDataFromFile(filePath, storyId)
        return `export default ${JSON.stringify(variantSources)}`
      }

      if (id !== resolvedVirtualModuleId)
        return

      for (const path of Object.values(storyMap))
        this.addWatchFile(path)

      const storyLoaderEntries: string[] = []
      const metaEntries: string[] = []
      const variantLoaderEntries: string[] = []

      for (const [storyId, path] of Object.entries(storyMap)) {
        const importPath = path.replace(/\\/g, '/')
        const variantImportPath = `${importPath}${VARIANT_SOURCES_QUERY}`

        storyLoaderEntries.push(`  "${storyId}": () => import('${importPath}')`)
        variantLoaderEntries.push(`  "${storyId}": () => import('${variantImportPath}')`)

        const { meta } = extractStoryDataFromFile(path, storyId)
        metaEntries.push(`  "${storyId}": ${JSON.stringify(meta)}`)
      }

      return [
        `export const storyLoaders = {\n${storyLoaderEntries.join(',\n')}\n};`,
        `export const storiesMeta = {\n${metaEntries.join(',\n')}\n};`,
        `export const storyVariantSourceLoaders = {\n${variantLoaderEntries.join(',\n')}\n};`,
      ].join('\n')
    },
  }
}
