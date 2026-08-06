<script setup lang="ts">
import { computed, ref } from 'vue'
import { NText } from 'naive-ui'
import { t } from '@/i18n'
import ToolPage from '@/components/ToolPage.vue'
import AppInput from '@/components/AppInput.vue'
import ResultRow from '@/components/ResultRow.vue'
import SegToggle from '@/components/SegToggle.vue'

const input = ref('')
const from = ref<'auto' | 2 | 8 | 10 | 16>('auto')

const FROM_OPTIONS: { value: 'auto' | 2 | 8 | 10 | 16; label: string }[] = [
  { value: 'auto', label: 'base.auto' },
  { value: 2, label: 'base.binary' },
  { value: 8, label: 'base.octal' },
  { value: 10, label: 'base.decimal' },
  { value: 16, label: 'base.hex' },
]

const DIGITS = {
  2: '01',
  8: '01234567',
  10: '0123456789',
  16: '0123456789abcdefABCDEF',
}

function stripPrefix(raw: string, base: number): string {
  let s = raw
  if (base === 2 && /^0b/i.test(s)) s = s.slice(2)
  else if (base === 8 && /^0o/i.test(s)) s = s.slice(2)
  else if (base === 16 && /^0x/i.test(s)) s = s.slice(2)
  return s
}

const value = computed<bigint | null>(() => {
  const raw = input.value.trim()
  if (!raw) return null
  let base: number
  if (from.value === 'auto') {
    if (/^0b[01]+$/i.test(raw)) base = 2
    else if (/^0o[0-7]+$/i.test(raw)) base = 8
    else if (/^0x[0-9a-fA-F]+$/i.test(raw)) base = 16
    else base = 10
  } else {
    base = from.value
  }
  const s = stripPrefix(raw, base)
  if (!s || ![...s].every((c) => DIGITS[base as keyof typeof DIGITS].includes(c))) return null
  try {
    const prefix = base === 2 ? '0b' : base === 8 ? '0o' : base === 16 ? '0x' : ''
    return BigInt(prefix + s)
  } catch {
    return null
  }
})

const results = computed(() => {
  if (value.value === null) return null
  const v = value.value
  return {
    binary: '0b' + v.toString(2),
    octal: '0o' + v.toString(8),
    decimal: v.toString(10),
    hex: '0x' + v.toString(16),
  }
})
</script>

<template>
  <ToolPage desc-key="base.desc">
    <template #controls>
      <div class="space-y-2">
        <n-text depth="3" class="block text-[15px] font-medium">
          {{ t('base.inputLabel') }}
        </n-text>
        <AppInput v-model="input" :placeholder="t('common.placeholder')" spellcheck="false" />
      </div>

      <div class="space-y-2">
        <n-text depth="3" class="block text-[15px] font-medium">
          {{ t('base.from') }}
        </n-text>
        <SegToggle v-model="from" :options="FROM_OPTIONS" />
      </div>
    </template>

    <template #results>
      <div
        v-if="!input.trim()"
        class="py-16 text-center text-[15px] text-slate-500 dark:text-slate-400"
      >
        {{ t('common.noResult') }}
      </div>
      <template v-else-if="results">
        <div class="space-y-3">
          <ResultRow :label="t('base.binary')" :value="results.binary" />
          <ResultRow :label="t('base.octal')" :value="results.octal" />
          <ResultRow :label="t('base.decimal')" :value="results.decimal" />
          <ResultRow :label="t('base.hex')" :value="results.hex" />
        </div>
      </template>
      <n-text v-else type="error" class="block text-[15px]">
        {{ t('base.invalid') }}
      </n-text>
    </template>
  </ToolPage>
</template>
