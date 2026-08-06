<script setup lang="ts">
import { computed, ref } from 'vue'
import { v4, v7 } from 'uuid'
import { NInputNumber, NSwitch, NText } from 'naive-ui'
import { t } from '@/i18n'
import ToolPage from '@/components/ToolPage.vue'
import ResultRow from '@/components/ResultRow.vue'
import CopyButton from '@/components/CopyButton.vue'
import SegToggle from '@/components/SegToggle.vue'

const version = ref<'v4' | 'v7'>('v7')
const count = ref(1)
const hyphens = ref(true)

const VERSIONS = [
  { value: 'v4', label: 'uuid.v4' },
  { value: 'v7', label: 'uuid.v7' },
] as const

const list = computed(() => {
  const n = Math.max(1, Math.min(100, count.value || 1))
  const gen = version.value === 'v4' ? v4 : v7
  return Array.from({ length: n }, () => {
    const u = gen()
    return hyphens.value ? u : u.replaceAll('-', '')
  })
})

const allText = computed(() => list.value.join('\n'))
</script>

<template>
  <ToolPage desc-key="uuid.desc">
    <template #controls>
      <div class="space-y-1.5">
        <n-text depth="3" class="block text-[15px] font-medium">
          {{ t('uuid.version') }}
        </n-text>
        <SegToggle v-model="version" :options="VERSIONS" />
      </div>

      <div class="space-y-1.5">
        <n-text depth="3" class="block text-[15px] font-medium">
          {{ t('uuid.count') }} (1-100)
        </n-text>
        <n-input-number
          v-model:value="count"
          :min="1"
          :max="100"
          size="small"
          :style="{ width: '110px' }"
        />
      </div>

      <label
        class="flex cursor-pointer items-center gap-2 pb-1 text-[15px] text-slate-700 dark:text-slate-300"
      >
        <n-switch v-model:value="hyphens" size="small" />
        {{ t('uuid.hyphens') }}
      </label>
    </template>

    <template #results>
      <div class="mb-4 flex items-center justify-between">
        <span
          class="text-[13px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
        >
          {{ t('common.length') }}: {{ list.length }}
        </span>
        <CopyButton :value="allText" />
      </div>

      <div class="space-y-2">
        <ResultRow
          v-for="(u, i) in list"
          :key="`${version}-${hyphens}-${i}-${u}`"
          :label="`#${i + 1}`"
          :value="u"
        />
      </div>
    </template>
  </ToolPage>
</template>
