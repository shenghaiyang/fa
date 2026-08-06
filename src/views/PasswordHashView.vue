<script setup lang="ts">
import { ref } from 'vue'
import { argon2id, bcrypt } from 'hash-wasm'
import { NButton, NInput, NText } from 'naive-ui'
import { t } from '@/i18n'
import ToolPage from '@/components/ToolPage.vue'
import SegToggle from '@/components/SegToggle.vue'
import ResultRow from '@/components/ResultRow.vue'

const algo = ref<'argon2' | 'bcrypt'>('argon2')
const password = ref('')
const result = ref('')
const busy = ref(false)
const error = ref('')

const ALGO_OPTIONS = [
  { value: 'argon2', label: 'passwordHash.argon2', hint: 'm=19456, t=2, p=1' },
  { value: 'bcrypt', label: 'passwordHash.bcrypt', hint: 'cost=12' },
]

function randomSalt(bytes: number): Uint8Array {
  const salt = new Uint8Array(bytes)
  crypto.getRandomValues(salt)
  return salt
}

async function generate() {
  if (!password.value || busy.value) return
  busy.value = true
  error.value = ''
  result.value = ''
  try {
    if (algo.value === 'argon2') {
      result.value = await argon2id({
        password: password.value,
        salt: randomSalt(16),
        iterations: 2,
        parallelism: 1,
        memorySize: 19456,
        hashLength: 32,
        outputType: 'encoded',
      })
    } else {
      result.value = await bcrypt({
        password: password.value,
        salt: randomSalt(16),
        costFactor: 12,
        outputType: 'encoded',
      })
    }
  } catch (e) {
    error.value = String(e)
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <ToolPage desc-key="passwordHash.desc">
    <template #controls>
      <div class="space-y-2">
        <n-text depth="3" class="block text-[15px] font-medium">
          {{ t('passwordHash.algorithm') }}
        </n-text>
        <SegToggle v-model="algo" :options="ALGO_OPTIONS" />
      </div>

      <div class="space-y-2">
        <n-text depth="3" class="block text-[15px] font-medium">
          {{ t('passwordHash.passwordLabel') }}
        </n-text>
        <div class="flex gap-2">
          <n-input
            v-model:value="password"
            type="password"
            show-password-on="click"
            class="flex-1"
            :placeholder="t('common.placeholder')"
            @keyup.enter="generate"
          />
          <n-button type="primary" :disabled="!password || busy" :loading="busy" @click="generate">
            {{ t('common.submit') }}
          </n-button>
        </div>
        <n-text depth="3" class="block text-[13px]">
          {{ t('passwordHash.note') }}
        </n-text>
      </div>

      <n-text v-if="error" type="error" class="block text-[15px]">{{ error }}</n-text>
    </template>

    <template #results>
      <ResultRow v-if="result" :label="t('passwordHash.resultLabel')" :value="result" />
      <div v-else class="py-16 text-center text-[15px] text-slate-500 dark:text-slate-400">
        {{ t('common.noResult') }}
      </div>
    </template>
  </ToolPage>
</template>
