<script setup lang="ts">
import { ref, watch } from 'vue'
import { md5, sha1, sha256, sha512, sha3, blake3 } from 'hash-wasm'
import { NText } from 'naive-ui'
import { t } from '@/i18n'
import ToolPage from '@/components/ToolPage.vue'
import AppTextarea from '@/components/AppTextarea.vue'
import ResultRow from '@/components/ResultRow.vue'

const input = ref('')
const results = ref<Record<string, string>>({})

interface AlgoDef {
  key: string
  name: string
  run: (data: string) => Promise<string>
}

const algos: AlgoDef[] = [
  { key: 'md5', name: 'MD5', run: md5 },
  { key: 'sha1', name: 'SHA-1', run: sha1 },
  { key: 'sha256', name: 'SHA-256', run: sha256 },
  { key: 'sha512', name: 'SHA-512', run: sha512 },
  { key: 'sha3-256', name: 'SHA3-256', run: (d) => sha3(d, 256) },
  { key: 'sha3-512', name: 'SHA3-512', run: (d) => sha3(d, 512) },
  { key: 'blake3', name: 'BLAKE3', run: blake3 },
]

let runId = 0
watch(input, async (value) => {
  const id = ++runId
  if (!value) {
    results.value = {}
    return
  }
  const out: Record<string, string> = {}
  await Promise.all(
    algos.map(async (algo) => {
      try {
        out[algo.key] = await algo.run(value)
      } catch {
        out[algo.key] = ''
      }
    }),
  )
  if (id === runId) results.value = out
})
</script>

<template>
  <ToolPage desc-key="hash.desc">
    <template #controls>
      <div class="space-y-2">
        <n-text depth="3" class="block text-[15px] font-medium">
          {{ t('hash.inputLabel') }}
        </n-text>
        <AppTextarea v-model="input" :placeholder="t('common.placeholder')" spellcheck="false" />
      </div>
    </template>

    <template #results>
      <div v-if="!input" class="py-16 text-center text-[15px] text-slate-500 dark:text-slate-400">
        {{ t('common.noResult') }}
      </div>
      <div v-else class="space-y-3">
        <ResultRow
          v-for="algo in algos"
          :key="algo.key"
          :label="algo.name"
          :value="results[algo.key] || ''"
        />
      </div>
    </template>
  </ToolPage>
</template>
