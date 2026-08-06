<script setup lang="ts">
import { NInput } from 'naive-ui'

defineProps<{ modelValue: string }>()
defineEmits<{ 'update:modelValue': [value: string] }>()

defineOptions({ inheritAttrs: false })
</script>

<template>
  <n-input
    :value="modelValue"
    class="w-full"
    v-bind="$attrs"
    @update:value="$emit('update:modelValue', $event)"
  />
</template>
