import { defineNuxtModule, addVitePlugin, createResolver, extendPages } from '@nuxt/kit'
import { glob } from 'tinyglobby'
import { uiStoriesVitePlugin } from './vite-plugin'
import type { ComponentsDir, ComponentsOptions } from '@nuxt/schema'

function isNuxtPrepare(): boolean {
  const p = (globalThis as { process?: { argv?: string[] } }).process
  return Array.isArray(p?.argv) && p.argv.includes('prepare')
}

const verbose = !isNuxtPrepare()

const uisLog = (message: string, type: 'info' | 'warning' | 'error' = 'info') => {
  if (!verbose) return;
  
  const color = type === 'info' ? '\x1b[36m' : type === 'warning' ? '\x1b[33m' : '\x1b[31m'
  console.log(`${color}[ui-stories]\x1b[0m ${type === 'info' ? '✔' : type === 'warning' ? '⚠️' : '❌'} ${message}`)
}


function nodeEnv(key: string): string | undefined {
  const proc = (globalThis as Record<string, unknown>).process as { env?: Record<string, string | undefined> } | undefined
  return proc?.env?.[key]
}

/** Pretty URL for the startup log: absolute in dev, pathname only when not dev. */
function formatStoriesDevUrl(nuxt: {
  options: {
    dev?: boolean
    app: { baseURL?: string }
    devServer?: { host?: string; port?: number; https?: unknown }
  }
}, route: string): string {
  const base = (nuxt.options.app.baseURL || '/').replace(/\/+$/, '')
  const path = route.startsWith('/') ? route : `/${route}`
  const pathname = `${base || ''}${path}`

  if (!nuxt.options.dev)
    return pathname

  const ds = nuxt.options.devServer
  const port = Number(ds?.port ?? nodeEnv('NUXT_PORT') ?? nodeEnv('PORT') ?? 3000)
  let host = ds?.host
  if (!host || host === '0.0.0.0' || host === '::')
    host = 'localhost'
  const protocol = ds?.https ? 'https' : 'http'
  return `${protocol}://${host}:${port}${pathname}`
}

export interface ModuleOptions {
  enabled?: boolean
  route: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'ui-stories',
    configKey: 'uiStories',
    compatibility: {
      nuxt: '^4.0.0',
    },
  },
  defaults: {
    enabled: true,
    route: '/stories',
  },

  async setup(options, nuxt) {
    const enabled = options.enabled

    if (!enabled) {
      uisLog('⚠️ ui-stories disabled')
      return
    }

    uisLog(`enabled at ${formatStoriesDevUrl(nuxt, options.route)}`, 'info')

    const resolver = createResolver(import.meta.url)

    const srcDir = nuxt.options.srcDir
    const storyPaths = await glob('**/*.story.vue', {
      cwd: srcDir,
      absolute: true,
      ignore: ['node_modules/**', '.nuxt/**', 'dist/**'],
    })

    if (storyPaths.length === 0) {
      uisLog('⚠️ No .story.vue files found')
      return
    }

    const storyMap: Record<string, string> = {}

    for (const fullPath of storyPaths) {
      const rel = fullPath.slice(srcDir.length + 1).replace(/\.story\.vue$/, '')
      const id = rel.replace(/\//g, '--')
      storyMap[id] = fullPath
    }

    addVitePlugin(() => uiStoriesVitePlugin(storyMap))
    uisLog(`found ${Object.keys(storyMap).length} stories`, 'info')

    extendPages((pages) => {
      pages.push({
        name: 'ui-stories-index',
        path: options.route + '/:id?',
        file: resolver.resolve('./runtime/pages/index.vue'),
      })
      uisLog(`added stories page at ${options.route + '/:id?'}`, 'info')
    })

    nuxt.options.runtimeConfig.public.uiStories = {
      ...(nuxt.options.runtimeConfig.public.uiStories as object || {}),
      route: options.route,
    }
    uisLog(`added runtime config public.uiStories.route: ${options.route}`, 'info')

    nuxt.options.css ||= []
    nuxt.options.css.push(resolver.resolve('./runtime/styles/uis.css'))

    nuxt.hook('components:dirs', (dirs: ComponentsOptions['dirs']) => {
      for (const dir of dirs as ComponentsDir[]) {
        dir.ignore = dir.ignore || []
        dir.ignore.push('**/*.story.vue')
      }

      dirs.push({
        path: resolver.resolve('./runtime/components'),
        prefix: 'UIStories',
        pathPrefix: false,
      })
    })
  },
})
