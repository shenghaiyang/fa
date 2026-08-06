<script setup lang="ts">
import { computed, ref } from 'vue'
import { fromByteArray, toByteArray } from 'base64-js'
import { NSwitch, NText } from 'naive-ui'
import { t } from '@/i18n'
import ToolPage from '@/components/ToolPage.vue'
import AppTextarea from '@/components/AppTextarea.vue'
import ResultRow from '@/components/ResultRow.vue'
import SegToggle from '@/components/SegToggle.vue'

type Mode = 'encode' | 'decode'

const mode = ref<Mode>('encode')
const input = ref('')
const urlSafe = ref(false)
const noPadding = ref(false)

const MODES: { value: Mode; label: string }[] = [
  { value: 'encode', label: 'base64.modeEncode' },
  { value: 'decode', label: 'base64.modeDecode' },
]

function toSafe(s: string) {
  return s.replace(/\+/g, '-').replace(/\//g, '_')
}

function fromSafe(s: string) {
  return s.replace(/-/g, '+').replace(/_/g, '/')
}

function isValidUtf8(bytes: Uint8Array): boolean {
  try {
    new TextDecoder('utf-8', { fatal: true }).decode(bytes)
    return true
  } catch {
    return false
  }
}

const result = computed(() => {
  if (!input.value) return { value: '', error: '' }
  try {
    if (mode.value === 'encode') {
      const bytes = new TextEncoder().encode(input.value)
      let out = fromByteArray(bytes)
      if (urlSafe.value) out = toSafe(out)
      if (noPadding.value) out = out.replace(/=+$/, '')
      return { value: out, error: '' }
    }
    let s = fromSafe(input.value)
    const padding = s.length % 4
    if (padding === 1) throw new Error('invalid base64 length')
    if (padding) s += '='.repeat(4 - padding)
    const bytes = toByteArray(s)
    if (isValidUtf8(bytes)) return { value: new TextDecoder('utf-8').decode(bytes), error: '' }
    return {
      value: Array.from(bytes, (b) => b.toString(16).padStart(2, '0').toUpperCase()).join(' '),
      error: '',
    }
  } catch (e) {
    return { value: '', error: String(e) }
  }
})
</script>

<template>
  <ToolPage desc-key="base64.desc">
    <template #controls>
      <SegToggle v-model="mode" :options="MODES" />

      <div v-if="mode === 'encode'" class="flex flex-wrap items-center gap-x-6 gap-y-3">
        <label
          class="flex cursor-pointer items-center gap-2 text-[15px] text-slate-700 dark:text-slate-300"
        >
          <n-switch v-model:value="urlSafe" size="small" />
          {{ t('base64.urlSafe') }}
        </label>
        <label
          class="flex cursor-pointer items-center gap-2 text-[15px] text-slate-700 dark:text-slate-300"
        >
          <n-switch v-model:value="noPadding" size="small" />
          {{ t('base64.noPadding') }}
        </label>
      </div>

      <div class="space-y-2">
        <n-text depth="3" class="block text-[15px] font-medium">
          {{ t('common.input') }}
        </n-text>
        <AppTextarea v-model="input" :placeholder="t('common.placeholder')" spellcheck="false" />
      </div>

      <n-text v-if="result.error" type="error" class="block text-[15px]">{{ result.error }}</n-text>
    </template>

    <template #results>
      <ResultRow v-if="result.value" :label="t('common.output')" :value="result.value" />
      <div v-else class="py-16 text-center text-[15px] text-slate-500 dark:text-slate-400">
        {{ t('common.noResult') }}
      </div>
    </template>
  </ToolPage>
</template>
