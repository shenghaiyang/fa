<script setup lang="ts">
import { computed, ref } from 'vue'
import Color from 'color'
import { NText } from 'naive-ui'
import { t } from '@/i18n'
import ToolPage from '@/components/ToolPage.vue'
import AppInput from '@/components/AppInput.vue'
import ResultRow from '@/components/ResultRow.vue'

const input = ref('')

const result = computed(() => {
  const raw = input.value.trim()
  if (!raw) return null
  let c: ReturnType<typeof Color>
  try {
    c = Color(raw)
  } catch {
    return { error: true }
  }
  const r = Math.round(c.red())
  const g = Math.round(c.green())
  const b = Math.round(c.blue())
  const a = c.alpha()
  const hex = c.hex()
  const alphaHex = Math.round(a * 255)
    .toString(16)
    .padStart(2, '0')
  const h = c.hue()
  const sl = c.saturationl()
  const l = c.lightness()
  const hsla = a === 1 ? `hsla(${h}, ${sl}%, ${l}%, 1)` : c.hsl().string()
  return {
    hex,
    rgba: `rgba(${r}, ${g}, ${b}, ${a})`,
    rgbaHex: `${hex}${alphaHex}`,
    argbHex: `#${alphaHex}${hex.slice(1)}`,
    hsla,
    css: `rgba(${r}, ${g}, ${b}, ${a})`,
  }
})
</script>

<template>
  <ToolPage desc-key="color.desc">
    <template #controls>
      <div class="space-y-2">
        <n-text depth="3" class="block text-[15px] font-medium">
          {{ t('color.inputLabel') }}
        </n-text>
        <AppInput v-model="input" :placeholder="t('common.placeholder')" spellcheck="false" />
      </div>
      <n-text v-if="result?.error" type="error" class="block text-[15px]">
        {{ t('color.invalid') }}
      </n-text>
    </template>

    <template #results>
      <div
        v-if="!input.trim()"
        class="py-16 text-center text-[15px] text-slate-500 dark:text-slate-400"
      >
        {{ t('common.noResult') }}
      </div>
      <template v-else-if="result && !result.error">
        <div
          class="mb-4 flex items-center gap-5 rounded-2xl border border-slate-200/70 bg-white/80 p-5 dark:border-slate-800/70 dark:bg-slate-900/50"
        >
          <div
            class="h-20 w-20 shrink-0 rounded-xl border border-slate-200 shadow-inner dark:border-slate-700"
            :style="{ backgroundColor: result.css }"
          />
          <div class="min-w-0 flex-1">
            <n-text depth="3" class="mb-1 block text-[13px] font-semibold uppercase tracking-wide">
              {{ t('color.preview') }}
            </n-text>
            <code class="break-all font-mono text-[15px] text-slate-800 dark:text-slate-200">{{
              result.css
            }}</code>
          </div>
        </div>
        <div class="space-y-3">
          <ResultRow :label="t('color.hex')" :value="result.hex" />
          <ResultRow :label="t('color.rgba')" :value="result.rgba" />
          <ResultRow :label="t('color.rgbaHex')" :value="result.rgbaHex" />
          <ResultRow :label="t('color.argbHex')" :value="result.argbHex" />
          <ResultRow :label="t('color.hsla')" :value="result.hsla" />
        </div>
      </template>
    </template>
  </ToolPage>
</template>
