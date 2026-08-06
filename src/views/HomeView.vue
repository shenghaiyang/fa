<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ArrowRight } from '@lucide/vue'
import { navGroups } from '@/router/nav'
import { t } from '@/i18n'
</script>

<template>
  <div class="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
    <div class="mb-10 text-center">
      <div
        class="mx-auto mb-5 flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl bg-slate-100 shadow-xl shadow-indigo-500/10 ring-1 ring-slate-200/60 dark:bg-slate-800 dark:ring-slate-700/60"
      >
        <img src="/logo.webp" alt="fafa" class="h-full w-full object-contain" />
      </div>
      <h1 class="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
        {{ t('app.name') }}
      </h1>
      <p class="mt-2 text-base text-slate-500 dark:text-slate-400">
        {{ t('app.tagline') }}
      </p>
    </div>

    <div v-for="group in navGroups" :key="group.key" class="mb-10">
      <h2
        class="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
      >
        <span class="h-px w-6 bg-slate-300 dark:bg-slate-700" />
        {{ t(`nav.${group.key}`) }}
      </h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <RouterLink
          v-for="item in group.items"
          :key="item.path"
          :to="item.path"
          class="group flex items-center gap-4 rounded-2xl border border-slate-200/70 bg-white/80 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/10 dark:border-slate-800/70 dark:bg-slate-900/60 dark:hover:border-indigo-500/50"
        >
          <div
            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md"
            :class="item.accent"
          >
            <component :is="item.icon" class="h-5 w-5" />
          </div>
          <div class="min-w-0">
            <div class="font-medium text-slate-800 dark:text-slate-100">
              {{ t(`nav.${item.key}`) }}
            </div>
            <div class="truncate text-[13px] text-slate-500 dark:text-slate-400">
              {{ t(`desc.${item.key}`) }}
            </div>
          </div>
          <ArrowRight
            class="ml-auto h-4 w-4 shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-indigo-500 dark:text-slate-600"
          />
        </RouterLink>
      </div>
    </div>
  </div>
</template>
