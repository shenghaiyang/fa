import { ref } from 'vue'

export type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'fa-theme'

function detect(): Theme {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'light' || saved === 'dark' || saved === 'system') return saved
  return 'system'
}

export const theme = ref<Theme>(detect())

export function setTheme(t: Theme) {
  theme.value = t
  localStorage.setItem(STORAGE_KEY, t)
}
