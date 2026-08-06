<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import {
  NConfigProvider,
  NGlobalStyle,
  NMessageProvider,
  darkTheme,
  zhCN,
  enUS,
  dateZhCN,
  dateEnUS,
} from 'naive-ui'
import { locale } from '@/i18n'
import { theme } from '@/stores/theme'

const isDark = computed(() => {
  const t = theme.value
  if (t === 'dark') return true
  if (t === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
})

const lang = computed(() => (locale.value === 'zh' ? zhCN : enUS))
const dateLang = computed(() => (locale.value === 'zh' ? dateZhCN : dateEnUS))

const themeOverrides = {
  common: {
    primaryColor: '#6366f1',
    primaryColorHover: '#818cf8',
    primaryColorPressed: '#4f46e5',
    primaryColorSuppl: '#6366f1',
    infoColor: '#6366f1',
    fontSize: '15px',
    fontSizeSmall: '14px',
    fontSizeMedium: '15px',
    fontSizeLarge: '16px',
    borderRadius: '10px',
    borderRadiusSmall: '8px',
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif',
    fontFamilyMono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
  },
  Card: {
    borderRadius: '16px',
    borderColor: 'rgba(148, 163, 184, 0.25)',
  },
  Input: {
    borderRadius: '12px',
  },
  Button: {
    borderRadiusMedium: '10px',
    borderRadiusSmall: '8px',
  },
  RadioButton: {
    borderRadius: '10px',
    colorActive: '#6366f1',
    textColorActive: '#ffffff',
    borderColorActive: '#6366f1',
  },
}

watchEffect(() => {
  document.documentElement.classList.toggle('dark', isDark.value)
  document.documentElement.style.colorScheme = isDark.value ? 'dark' : 'light'
})
</script>

<template>
  <n-config-provider
    :theme="isDark ? darkTheme : null"
    :locale="lang"
    :date-locale="dateLang"
    :theme-overrides="themeOverrides"
  >
    <n-message-provider placement="top">
      <n-global-style />
      <router-view />
    </n-message-provider>
  </n-config-provider>
</template>
