import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        { path: '', name: 'home', component: () => import('@/views/HomeView.vue') },
        { path: 'hash', name: 'hash', component: () => import('@/views/HashView.vue') },
        {
          path: 'password-hash',
          name: 'password-hash',
          component: () => import('@/views/PasswordHashView.vue'),
        },
        { path: 'qrcode', name: 'qrcode', component: () => import('@/views/QrCodeView.vue') },
        {
          path: 'timestamp',
          name: 'timestamp',
          component: () => import('@/views/TimestampView.vue'),
        },
        { path: 'uuid', name: 'uuid', component: () => import('@/views/UuidView.vue') },
        { path: 'base64', name: 'base64', component: () => import('@/views/Base64View.vue') },
        { path: 'url', name: 'url', component: () => import('@/views/UrlView.vue') },
        { path: 'base', name: 'base', component: () => import('@/views/BaseView.vue') },
        { path: 'color', name: 'color', component: () => import('@/views/ColorView.vue') },
        {
          path: 'text-case',
          name: 'text-case',
          component: () => import('@/views/TextCaseView.vue'),
        },
      ],
    },
  ],
})

export default router
