<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { allNavItems } from '@/router/nav'
import { t } from '@/i18n'
import SideNav from '@/components/SideNav.vue'
import TopBar from '@/components/TopBar.vue'

const route = useRoute()
const drawerOpen = ref(false)

const title = computed(() => {
  if (route.path === '/') return t('app.name')
  const item = allNavItems.find((n) => n.path === route.path)
  return item ? t(`nav.${item.key}`) : t('app.name')
})

function openDrawer() {
  drawerOpen.value = true
}
</script>

<template>
  <div class="flex h-dvh overflow-hidden">
    <aside class="hidden lg:flex lg:w-60 lg:shrink-0">
      <SideNav />
    </aside>

    <n-drawer
      v-model:show="drawerOpen"
      placement="left"
      :width="240"
      class="lg:hidden"
      :style="{ '--n-body-padding': '0' }"
    >
      <SideNav @navigate="drawerOpen = false" />
    </n-drawer>

    <div class="flex min-w-0 flex-1 flex-col">
      <TopBar :title="title" @menu-click="openDrawer" />
      <main class="min-h-0 flex-1 overflow-y-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>
