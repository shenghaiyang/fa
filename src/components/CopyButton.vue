<script setup lang="ts">
import { NButton, NIcon, NTooltip, useMessage } from 'naive-ui'
import { Check, Copy } from '@lucide/vue'
import { ref } from 'vue'
import { t } from '@/i18n'

const props = withDefaults(defineProps<{ value?: string }>(), { value: '' })

const message = useMessage()
const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

async function copy() {
  if (!props.value) return
  try {
    await navigator.clipboard.writeText(props.value)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = props.value
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    ta.remove()
  }
  copied.value = true
  message.success(t('common.copied'), { duration: 1200 })
  clearTimeout(timer)
  timer = setTimeout(() => (copied.value = false), 1200)
}
</script>

<template>
  <n-tooltip>
    <template #trigger>
      <n-button
        quaternary
        circle
        size="small"
        :disabled="!value"
        :class="
          copied
            ? 'text-emerald-500'
            : 'text-slate-400 hover:text-indigo-500 dark:text-slate-500 dark:hover:text-indigo-300'
        "
        @click="copy"
      >
        <template #icon>
          <n-icon :component="copied ? Check : Copy" :size="15" />
        </template>
      </n-button>
    </template>
    {{ copied ? t('common.copied') : t('common.copy') }}
  </n-tooltip>
</template>
