<script setup lang="ts">
import { NText } from 'naive-ui'
import { t } from '@/i18n'

defineProps<{ descKey: string }>()
</script>

<template>
  <div class="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
    <div class="mb-6 flex items-start gap-2.5">
      <div
        class="mt-1 h-5 w-1 shrink-0 rounded-full bg-gradient-to-b from-indigo-500 to-violet-500"
      />
      <n-text depth="3" class="block text-[15px] leading-relaxed">
        {{ t(descKey) }}
      </n-text>
    </div>

    <div class="grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
      <div class="space-y-6">
        <slot name="controls" />
      </div>
      <div class="min-w-0">
        <slot name="results" />
      </div>
    </div>
  </div>
</template>
