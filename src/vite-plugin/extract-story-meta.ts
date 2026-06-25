import type { StoryMeta } from '../types/story-meta'
import { extractStoryDataFromFile } from './extract-story-data'

export function extractStoryMetaFromFile(filePath: string, storyId: string): StoryMeta {
  return extractStoryDataFromFile(filePath, storyId).meta
}
