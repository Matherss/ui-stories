import type { Plugin } from 'vite'
import type { StoryMeta } from './types/story-meta'
import { extractStoryMetaFromFile } from './vite-plugin/extract-story-meta'
import { extractVariantTemplateSources } from './vite-plugin/extract-variant-sources'
export function uiStoriesVitePlugin(storyMap: Record<string, string>): Plugin {
  const virtualModuleId = 'virtual:stories'
  const resolvedVirtualModuleId = `\0${virtualModuleId}`

  return {
    name: 'ui-stories:vite-plugin',
    resolveId(id) {
      if (id === virtualModuleId)
        return resolvedVirtualModuleId
    },
    load(id) {
      if (id !== resolvedVirtualModuleId)
        return

      for (const path of Object.values(storyMap))
        this.addWatchFile(path)

      const imports: string[] = []
      const exportsMap: string[] = []
      const metaEntries: string[] = []
      const variantEntries: string[] = []

      for (const [storyId, path] of Object.entries(storyMap)) {
        const varName = `story_${storyId.replace(/[^a-zA-Z0-9_]/g, '_')}`
        imports.push(`import ${varName} from '${path}'`)
        exportsMap.push(`  "${storyId}": ${varName}`)

        const meta: StoryMeta = extractStoryMetaFromFile(path, storyId)
        metaEntries.push(`  "${storyId}": ${JSON.stringify(meta)}`)

        const chunks = extractVariantTemplateSources(path)
        variantEntries.push(`  "${storyId}": ${JSON.stringify(chunks)}`)
      }

      return `${imports.join(';\n')};\nexport const stories = {\n${exportsMap.join(',\n')}\n};\nexport const storiesMeta = {\n${metaEntries.join(',\n')}\n};\nexport const storyVariantSources = {\n${variantEntries.join(',\n')}\n}`    },
  }
}
