<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { navGroups } from '@/router/nav'
import { t } from '@/i18n'

const route = useRoute()
const activePath = computed(() => route.path)

defineEmits<{ navigate: [] }>()
</script>

<template>
  <div
    class="flex h-full w-full flex-col border-r border-slate-200/70 bg-white/70 backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/60"
  >
    <RouterLink to="/" class="flex items-center gap-3 px-5 pb-5 pt-5" @click="$emit('navigate')">
      <div
        class="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 shadow-lg shadow-indigo-500/15 ring-1 ring-slate-200/60 dark:bg-slate-800 dark:ring-slate-700/60"
      >
        <img src="/logo.webp" alt="fafa" class="h-full w-full object-contain" />
      </div>
      <div class="min-w-0">
        <div class="text-[15px] font-semibold leading-tight text-slate-800 dark:text-slate-100">
          {{ t('app.name') }}
        </div>
        <div class="text-xs text-slate-500 dark:text-slate-400">
          {{ t('app.tagline') }}
        </div>
      </div>
    </RouterLink>

    <nav class="flex-1 overflow-y-auto px-3 pb-4">
      <div v-for="group in navGroups" :key="group.key" class="mt-4">
        <div
          class="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
        >
          {{ t(`nav.${group.key}`) }}
        </div>
        <div class="space-y-0.5">
          <RouterLink
            v-for="item in group.items"
            :key="item.path"
            :to="item.path"
            class="group relative flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[15px] transition-all"
            :class="
              activePath === item.path
                ? 'bg-slate-100/90 font-medium text-slate-900 dark:bg-slate-800/80 dark:text-slate-100'
                : 'text-slate-700 hover:bg-slate-100/70 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-slate-100'
            "
            @click="$emit('navigate')"
          >
            <span
              v-if="activePath === item.path"
              class="absolute -left-3 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-indigo-500 to-violet-500"
            />
            <div
              class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-sm transition-transform group-hover:scale-105"
              :class="[item.accent, activePath === item.path ? '' : 'opacity-80']"
            >
              <component :is="item.icon" class="h-4 w-4" />
            </div>
            <span class="truncate">{{ t(`nav.${item.key}`) }}</span>
          </RouterLink>
        </div>
      </div>
    </nav>
  </div>
</template>
