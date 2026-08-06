<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import QRCode from 'qrcode'
import { NButton, NText } from 'naive-ui'
import { t } from '@/i18n'
import ToolPage from '@/components/ToolPage.vue'
import AppInput from '@/components/AppInput.vue'
import SegToggle from '@/components/SegToggle.vue'
import CopyButton from '@/components/CopyButton.vue'

const text = ref('')
const level = ref<'L' | 'M' | 'Q' | 'H'>('M')
const canvasRef = ref<HTMLCanvasElement | null>(null)
const dataUrl = ref('')
const error = ref('')

const LEVELS = [
  { value: 'L', label: 'L', hint: '7%', raw: true },
  { value: 'M', label: 'M', hint: '15%', raw: true },
  { value: 'Q', label: 'Q', hint: '25%', raw: true },
  { value: 'H', label: 'H', hint: '30%', raw: true },
] as const

let runId = 0
watch([text, level], async ([val, lv]) => {
  const id = ++runId
  error.value = ''
  dataUrl.value = ''
  if (!val) return
  await nextTick()
  const canvas = canvasRef.value
  if (!canvas) return
  try {
    await QRCode.toCanvas(canvas, val, { errorCorrectionLevel: lv, margin: 2, width: 256 })
    if (id !== runId) return
    dataUrl.value = canvas.toDataURL('image/png')
  } catch (e) {
    error.value = String(e)
  }
})

function download() {
  if (!dataUrl.value) return
  const a = document.createElement('a')
  a.href = dataUrl.value
  a.download = 'qrcode.png'
  a.click()
}
</script>

<template>
  <ToolPage desc-key="qrcode.desc">
    <template #controls>
      <div class="space-y-2">
        <n-text depth="3" class="block text-[15px] font-medium">
          {{ t('qrcode.textLabel') }}
        </n-text>
        <AppInput v-model="text" :placeholder="t('common.placeholder')" spellcheck="false" />
      </div>

      <div class="space-y-2">
        <n-text depth="3" class="block text-[15px] font-medium">
          {{ t('qrcode.level') }} · {{ t('qrcode.levelDesc') }}
        </n-text>
        <SegToggle v-model="level" :options="LEVELS" />
      </div>

      <n-text v-if="error" type="error" class="block text-[15px]">{{ error }}</n-text>
    </template>

    <template #results>
      <div
        v-if="text"
        class="flex flex-col items-center gap-5 rounded-2xl border border-slate-200/70 bg-white/80 p-8 dark:border-slate-800/70 dark:bg-slate-900/50"
      >
        <canvas ref="canvasRef" class="h-64 w-64 rounded-xl [image-rendering:pixelated]" />
        <div class="flex items-center gap-2">
          <CopyButton :value="text" />
          <n-button size="small" secondary round :disabled="!dataUrl" @click="download">
            <template #icon>
              <svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4">
                <path
                  d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z"
                />
                <path
                  d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z"
                />
              </svg>
            </template>
            {{ t('qrcode.download') }}
          </n-button>
        </div>
      </div>
      <div v-else class="py-16 text-center text-[15px] text-slate-500 dark:text-slate-400">
        {{ t('common.noResult') }}
      </div>
    </template>
  </ToolPage>
</template>
