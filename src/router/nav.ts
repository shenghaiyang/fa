import type { Component } from 'vue'
import {
  Fingerprint,
  Hash,
  KeyRound,
  Clock,
  QrCode,
  Binary,
  Link,
  Sigma,
  Palette,
  CaseSensitive,
} from '@lucide/vue'

export interface NavItem {
  path: string
  key: string
  icon: Component
  accent: string
}

export interface NavGroup {
  key: 'generators' | 'converters'
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    key: 'generators',
    items: [
      { path: '/hash', key: 'hash', icon: Hash, accent: 'from-violet-500 to-purple-600' },
      {
        path: '/password-hash',
        key: 'passwordHash',
        icon: KeyRound,
        accent: 'from-rose-500 to-pink-600',
      },
      { path: '/qrcode', key: 'qrcode', icon: QrCode, accent: 'from-sky-500 to-blue-600' },
      {
        path: '/uuid',
        key: 'uuid',
        icon: Fingerprint,
        accent: 'from-emerald-500 to-teal-600',
      },
    ],
  },
  {
    key: 'converters',
    items: [
      {
        path: '/timestamp',
        key: 'timestamp',
        icon: Clock,
        accent: 'from-amber-500 to-orange-600',
      },
      { path: '/base64', key: 'base64', icon: Binary, accent: 'from-cyan-500 to-sky-600' },
      { path: '/url', key: 'url', icon: Link, accent: 'from-blue-500 to-indigo-600' },
      { path: '/base', key: 'base', icon: Sigma, accent: 'from-fuchsia-500 to-purple-600' },
      { path: '/color', key: 'color', icon: Palette, accent: 'from-pink-500 to-rose-600' },
      {
        path: '/text-case',
        key: 'textCase',
        icon: CaseSensitive,
        accent: 'from-lime-500 to-emerald-600',
      },
    ],
  },
]

export const allNavItems = navGroups.flatMap((g) => g.items)
