<script setup lang="ts">
import { computed, ref } from 'vue'
import { NText } from 'naive-ui'
import { t } from '@/i18n'
import ToolPage from '@/components/ToolPage.vue'
import AppTextarea from '@/components/AppTextarea.vue'
import ResultRow from '@/components/ResultRow.vue'
import SegToggle from '@/components/SegToggle.vue'

type Mode = 'encode' | 'decode'

const mode = ref<Mode>('encode')
const input = ref('')

const MODES: { value: Mode; label: string }[] = [
  { value: 'encode', label: 'url.modeEncode' },
  { value: 'decode', label: 'url.modeDecode' },
]

function percentEncode(str: string): string {
  return encodeURIComponent(str).replace(
    /[!'()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
  )
}

function percentDecode(str: string): string {
  return decodeURIComponent(str)
}

const result = computed(() => {
  if (!input.value) return { value: '', error: '' }
  try {
    return {
      value: mode.value === 'encode' ? percentEncode(input.value) : percentDecode(input.value),
      error: '',
    }
  } catch (e) {
    return { value: '', error: String(e) }
  }
})
</script>

<template>
  <ToolPage desc-key="url.desc">
    <template #controls>
      <SegToggle v-model="mode" :options="MODES" />

      <div class="space-y-2">
        <n-text depth="3" class="block text-[15px] font-medium">
          {{ t('common.input') }}
        </n-text>
        <AppTextarea v-model="input" :placeholder="t('common.placeholder')" spellcheck="false" />
        <n-text depth="3" class="block text-[13px]">
          {{ t('url.note') }}
        </n-text>
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
