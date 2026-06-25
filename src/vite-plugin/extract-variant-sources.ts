export { normalizeVariantSlotIndent } from './extract-story-data'
import { extractStoryDataFromFile } from './extract-story-data'

/** Template source fragments inside each `<UIStoriesVariant>` in tree order (same as mount order). */
export function extractVariantTemplateSources(filePath: string): string[] {
  return extractStoryDataFromFile(filePath, '').variantSources
}
