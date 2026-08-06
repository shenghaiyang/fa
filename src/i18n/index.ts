import { ref, watchEffect } from 'vue'
import { zh } from './zh'
import { en } from './en'
import type { ZhDict } from './zh'

export type Locale = 'zh' | 'en'
export type MessageDict = ZhDict

const dicts: Record<Locale, MessageDict> = { zh, en }

const STORAGE_KEY = 'fa-locale'

function detect(): Locale {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'zh' || saved === 'en') return saved
  return navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}

export const locale = ref<Locale>(detect())

export function setLocale(l: Locale) {
  locale.value = l
  localStorage.setItem(STORAGE_KEY, l)
  document.documentElement.lang = l
}

watchEffect(() => {
  document.documentElement.lang = locale.value
})

export function t(path: string): string
export function t(path: string, params: Record<string, string | number>): string
export function t(path: string, params?: Record<string, string | number>): string {
  const keys = path.split('.')
  let node: unknown = dicts[locale.value]
  for (const key of keys) {
    if (node && typeof node === 'object' && key in node) {
      node = (node as Record<string, unknown>)[key]
    } else {
      return path
    }
  }
  if (typeof node !== 'string') return path
  if (!params) return node
  return node.replace(/\{(\w+)\}/g, (_, k: string) => (k in params ? String(params[k]) : `{${k}}`))
}
