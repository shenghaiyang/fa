<script setup lang="ts">
import { NRadioButton, NRadioGroup } from 'naive-ui'
import { t } from '@/i18n'

export interface SegOption {
  value: string | number
  label: string
  hint?: string
  raw?: boolean
}

defineProps<{ options: readonly SegOption[]; modelValue: string | number }>()
const emit = defineEmits<{ 'update:modelValue': [value: string | number] }>()
</script>

<template>
  <n-radio-group
    :value="modelValue"
    size="small"
    class="w-full sm:w-auto"
    @update:value="emit('update:modelValue', $event as string | number)"
  >
    <n-radio-button
      v-for="opt in options"
      :key="String(opt.value)"
      :value="opt.value"
      class="flex-1 sm:flex-none"
    >
      <span class="whitespace-nowrap">
        {{ opt.raw ? opt.label : t(opt.label) }}
        <span v-if="opt.hint" class="ml-0.5 text-[13px] opacity-75">({{ opt.hint }})</span>
      </span>
    </n-radio-button>
  </n-radio-group>
</template>
