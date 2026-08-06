<script setup lang="ts">
import { NText } from 'naive-ui'
import CopyButton from '@/components/CopyButton.vue'

defineProps<{ label: string; value?: string }>()
</script>

<template>
  <div
    class="flex items-start justify-between gap-4 rounded-xl border border-slate-200/70 bg-white/80 px-4 py-3 transition-colors hover:border-indigo-200 dark:border-slate-800/70 dark:bg-slate-900/50 dark:hover:border-indigo-500/30"
  >
    <div class="min-w-0 flex-1">
      <n-text depth="3" class="mb-1 block text-[13px] font-semibold tracking-wide">
        {{ label }}
      </n-text>
      <div class="w-full select-text">
        <slot>
          <code
            class="block w-full break-all whitespace-pre-wrap font-mono text-[15px] leading-relaxed text-slate-800 dark:text-slate-200"
            >{{ value }}</code
          >
        </slot>
      </div>
    </div>
    <div class="shrink-0 pt-0.5">
      <CopyButton :value="value" />
    </div>
  </div>
</template>
