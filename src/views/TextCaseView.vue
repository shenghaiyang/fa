<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  camelCase,
  pascalCase,
  snakeCase,
  constantCase,
  kebabCase,
  trainCase,
  capitalCase,
} from 'change-case'
import { NText } from 'naive-ui'
import { t } from '@/i18n'
import ToolPage from '@/components/ToolPage.vue'
import AppTextarea from '@/components/AppTextarea.vue'
import ResultRow from '@/components/ResultRow.vue'

const input = ref('')

interface CaseItem {
  label: string
  value: (s: string) => string
}

const items: CaseItem[] = [
  { label: 'textCase.lowerCamel', value: camelCase },
  { label: 'textCase.upperCamel', value: pascalCase },
  { label: 'textCase.snake', value: snakeCase },
  { label: 'textCase.shoutySnake', value: constantCase },
  { label: 'textCase.kebab', value: kebabCase },
  {
    label: 'textCase.shoutyKebab',
    value: (s) => kebabCase(s).toUpperCase(),
  },
  { label: 'textCase.train', value: trainCase },
  { label: 'textCase.title', value: capitalCase },
]

const results = computed(() =>
  input.value.trim()
    ? items.map((item) => ({ label: item.label, value: item.value(input.value) }))
    : [],
)
</script>

<template>
  <ToolPage desc-key="textCase.desc">
    <template #controls>
      <div class="space-y-2">
        <n-text depth="3" class="block text-[15px] font-medium">
          {{ t('textCase.inputLabel') }}
        </n-text>
        <AppTextarea v-model="input" :placeholder="t('common.placeholder')" spellcheck="false" />
      </div>
    </template>

    <template #results>
      <div
        v-if="!input.trim()"
        class="py-16 text-center text-[15px] text-slate-500 dark:text-slate-400"
      >
        {{ t('common.noResult') }}
      </div>
      <div v-else class="space-y-3">
        <ResultRow
          v-for="item in results"
          :key="item.label"
          :label="t(item.label)"
          :value="item.value"
        />
      </div>
    </template>
  </ToolPage>
</template>
