<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { NInputNumber, NSwitch, NText } from 'naive-ui'
import { t } from '@/i18n'
import ToolPage from '@/components/ToolPage.vue'
import AppInput from '@/components/AppInput.vue'
import ResultRow from '@/components/ResultRow.vue'
import SegToggle from '@/components/SegToggle.vue'

type Mode = 'now' | 'from' | 'to'

const mode = ref<Mode>('now')
const withMillis = ref(false)
const offset = ref<number | null>(null)
const epochInput = ref('')
const datetimeInput = ref('')
const nowTs = ref('')

const MODES: { value: Mode; label: string }[] = [
  { value: 'now', label: 'timestamp.modeNow' },
  { value: 'from', label: 'timestamp.modeFrom' },
  { value: 'to', label: 'timestamp.modeTo' },
]

const offsetHours = computed(() => (offset.value === null ? null : offset.value))

const offsetLabel = computed(() => {
  const h = offsetHours.value
  if (h === null) return 'UTC'
  return h >= 0 ? `UTC+${h}` : `UTC${h}`
})

function pad(n: number, len = 2) {
  return String(n).padStart(len, '0')
}

function wallTime(d: Date, tzOffsetHours: number, millis: boolean) {
  const shifted = new Date(d.getTime() + d.getTimezoneOffset() * 60_000 + tzOffsetHours * 3600_000)
  const base = `${shifted.getFullYear()}-${pad(shifted.getMonth() + 1)}-${pad(shifted.getDate())} ${pad(shifted.getHours())}:${pad(shifted.getMinutes())}:${pad(shifted.getSeconds())}`
  return millis ? `${base}.${pad(shifted.getMilliseconds(), 3)}` : base
}

function localWall(d: Date, millis: boolean) {
  const base = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  return millis ? `${base}.${pad(d.getMilliseconds(), 3)}` : base
}

function refreshNow() {
  nowTs.value = withMillis.value ? String(Date.now()) : String(Math.floor(Date.now() / 1000))
}

const nowLocal = computed(() =>
  nowTs.value ? localWall(new Date(Number(nowTs.value)), withMillis.value) : '',
)
const nowOffset = computed(() => {
  if (!nowTs.value) return ''
  return wallTime(new Date(Number(nowTs.value)), offsetHours.value ?? 0, withMillis.value)
})

const fromInvalid = computed(
  () => epochInput.value !== '' && !Number.isFinite(Number(epochInput.value)),
)
const fromMs = computed(() => {
  if (!Number.isFinite(Number(epochInput.value))) return null
  const v = Number(epochInput.value)
  return withMillis.value ? v : v * 1000
})
const fromLocal = computed(() =>
  fromMs.value === null ? '' : localWall(new Date(fromMs.value), withMillis.value),
)
const fromOffset = computed(() => {
  if (fromMs.value === null) return ''
  return wallTime(new Date(fromMs.value), offsetHours.value ?? 0, withMillis.value)
})

function parseDatetime(s: string): Date | null {
  const m = s.trim().match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?$/)
  if (!m) return null
  const [, y, mo, d, h, mi, se, msRaw] = m
  const ms = msRaw ? Number(msRaw.padEnd(3, '0')) : 0
  const date = new Date(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi), Number(se), ms)
  if (
    date.getFullYear() !== Number(y) ||
    date.getMonth() !== Number(mo) - 1 ||
    date.getDate() !== Number(d)
  ) {
    return null
  }
  return date
}

const toInvalid = computed(
  () => datetimeInput.value !== '' && parseDatetime(datetimeInput.value) === null,
)

const toResult = computed(() => {
  const date = parseDatetime(datetimeInput.value)
  if (!date) return null
  const oh = offsetHours.value
  const ms = oh === null ? date.getTime() : date.getTime() - oh * 3600_000
  return { seconds: String(Math.floor(ms / 1000)), millis: String(ms) }
})

watch(withMillis, () => {
  if (mode.value === 'now') refreshNow()
})

refreshNow()
</script>

<template>
  <ToolPage desc-key="timestamp.desc">
    <template #controls>
      <div class="space-y-2">
        <n-text depth="3" class="block text-[15px] font-medium">
          {{ t('timestamp.modeLabel') }}
        </n-text>
        <SegToggle v-model="mode" :options="MODES" />
      </div>

      <div class="flex flex-wrap items-center gap-x-6 gap-y-3">
        <label
          class="flex cursor-pointer items-center gap-2 text-[15px] text-slate-700 dark:text-slate-300"
        >
          <n-switch v-model:value="withMillis" size="small" />
          {{ t('timestamp.withMillis') }}
        </label>
        <div class="flex items-center gap-2">
          <span class="text-[15px] text-slate-600 dark:text-slate-400">{{
            t('common.offset')
          }}</span>
          <n-input-number
            v-model:value="offset"
            size="small"
            :style="{ width: '110px' }"
            placeholder="0"
          />
        </div>
      </div>

      <template v-if="mode === 'now'">
        <n-button type="primary" block @click="refreshNow">
          {{ t('common.refresh') }}
        </n-button>
      </template>

      <template v-else-if="mode === 'from'">
        <div class="space-y-2">
          <n-text depth="3" class="block text-[15px] font-medium">
            {{ t('timestamp.epochLabel') }}
          </n-text>
          <AppInput v-model="epochInput" type="number" :placeholder="t('common.placeholder')" />
          <n-text v-if="fromInvalid" type="error" class="block text-[13px]">
            {{ t('timestamp.invalidEpoch') }}
          </n-text>
        </div>
      </template>

      <template v-else>
        <div class="space-y-2">
          <n-text depth="3" class="block text-[15px] font-medium">
            {{ t('timestamp.datetimeLabel') }}
          </n-text>
          <AppInput
            v-model="datetimeInput"
            :placeholder="t('common.placeholder')"
            spellcheck="false"
          />
          <n-text v-if="toInvalid" type="error" class="block text-[13px]">
            {{ t('timestamp.invalidDatetime') }}
          </n-text>
        </div>
      </template>
    </template>

    <template #results>
      <template v-if="mode === 'now'">
        <div
          class="mb-4 rounded-2xl border border-indigo-200/60 bg-gradient-to-br from-indigo-50 to-violet-50 px-5 py-4 dark:border-indigo-500/20 dark:from-indigo-500/10 dark:to-violet-500/10"
        >
          <n-text depth="3" class="mb-1 block text-[13px] font-semibold uppercase tracking-wide">
            {{ t('timestamp.nowLabel') }}
          </n-text>
          <div
            class="break-all font-mono text-2xl font-semibold text-indigo-600 dark:text-indigo-300"
          >
            {{ nowTs }}
          </div>
        </div>
        <div class="grid gap-3 sm:grid-cols-2">
          <ResultRow :label="t('common.timeLocal')" :value="nowLocal" />
          <ResultRow :label="offsetLabel" :value="nowOffset" />
        </div>
      </template>

      <template v-else-if="mode === 'from'">
        <div v-if="fromLocal" class="grid gap-3 sm:grid-cols-2">
          <ResultRow :label="t('common.timeLocal')" :value="fromLocal" />
          <ResultRow :label="offsetLabel" :value="fromOffset" />
        </div>
        <div v-else class="py-16 text-center text-[15px] text-slate-500 dark:text-slate-400">
          {{ t('common.noResult') }}
        </div>
      </template>

      <template v-else>
        <div v-if="toResult" class="grid gap-3 sm:grid-cols-2">
          <ResultRow :label="t('timestamp.resultSeconds')" :value="toResult.seconds" />
          <ResultRow :label="t('timestamp.resultMillis')" :value="toResult.millis" />
        </div>
        <div v-else class="py-16 text-center text-[15px] text-slate-500 dark:text-slate-400">
          {{ t('common.noResult') }}
        </div>
      </template>
    </template>
  </ToolPage>
</template>
