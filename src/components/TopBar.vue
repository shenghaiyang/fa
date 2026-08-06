<script setup lang="ts">
import { h } from 'vue'
import { NButton, NIcon, NDropdown, NText } from 'naive-ui'
import { Check, ChevronDown, Languages, Menu, Monitor, Moon, Sun } from '@lucide/vue'
import { locale, setLocale, t, type Locale } from '@/i18n'
import { theme, setTheme, type Theme } from '@/stores/theme'

defineProps<{ title?: string }>()
defineEmits<{ menuClick: [] }>()

const THEME_ICON: Record<Theme, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
}

const THEME_ORDER: Theme[] = ['light', 'dark', 'system']

function themeOption(th: Theme) {
  return {
    label: () =>
      h('div', { class: 'flex items-center justify-between gap-8' }, [
        h('div', { class: 'flex items-center gap-2' }, [
          h(THEME_ICON[th], { class: 'h-4 w-4 text-slate-500 dark:text-slate-400' }),
          h(NText, null, { default: () => t(`theme.${th}`) }),
        ]),
        theme.value === th ? h(Check, { class: 'h-4 w-4 text-indigo-500' }) : null,
      ]),
    key: th,
  }
}

const themeOptions = THEME_ORDER.map(themeOption)

function langOption(label: string, value: Locale) {
  return {
    label: () =>
      h('div', { class: 'flex items-center justify-between gap-6' }, [
        h(NText, null, { default: () => label }),
        locale.value === value ? h(Check, { class: 'h-4 w-4 text-indigo-500' }) : null,
      ]),
    key: value,
  }
}

const langOptions = [langOption('简体中文', 'zh'), langOption('English', 'en')]
</script>

<template>
  <header
    class="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-slate-200/70 bg-white/80 px-4 backdrop-blur sm:px-6 dark:border-slate-800/70 dark:bg-slate-900/70"
  >
    <div class="flex min-w-0 items-center gap-2">
      <div class="lg:hidden">
        <n-button quaternary circle @click="$emit('menuClick')">
          <template #icon
            ><n-icon><Menu /></n-icon
          ></template>
        </n-button>
      </div>
      <h1 class="truncate text-[17px] font-semibold text-slate-800 dark:text-slate-100">
        {{ title ?? '' }}
      </h1>
    </div>
    <div class="flex items-center gap-1">
      <n-dropdown trigger="click" :options="themeOptions" @select="(k) => setTheme(k as Theme)">
        <n-button quaternary class="text-slate-500 hover:text-indigo-500 dark:text-slate-400">
          <template #icon>
            <n-icon :component="THEME_ICON[theme]" :size="18" />
          </template>
          <span class="hidden text-sm font-medium sm:inline">{{ t(`theme.${theme}`) }}</span>
          <n-icon :size="14" class="ml-0.5 text-slate-400"><ChevronDown /></n-icon>
        </n-button>
      </n-dropdown>
      <n-dropdown trigger="click" :options="langOptions" @select="(k) => setLocale(k as Locale)">
        <n-button quaternary class="text-slate-500 hover:text-indigo-500 dark:text-slate-400">
          <template #icon>
            <n-icon :size="18"><Languages /></n-icon>
          </template>
          <span class="hidden text-sm font-medium sm:inline">{{
            locale === 'zh' ? '中文' : 'EN'
          }}</span>
          <n-icon :size="14" class="ml-0.5 text-slate-400"><ChevronDown /></n-icon>
        </n-button>
      </n-dropdown>
    </div>
  </header>
</template>
