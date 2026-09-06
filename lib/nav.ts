import { ScanSearch, LayoutDashboard, Store, Trophy, type LucideIcon } from 'lucide-react'

export interface NavItem {
  href: string
  labelKey: string
  short: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { href: '/', labelKey: 'nav.scanner', short: 'Scan', icon: ScanSearch },
  { href: '/dashboard', labelKey: 'nav.dashboard', short: 'Risk', icon: LayoutDashboard },
  { href: '/markets', labelKey: 'nav.markets', short: 'Markets', icon: Store },
  { href: '/leaderboard', labelKey: 'nav.ranks', short: 'Ranks', icon: Trophy },
]

export function isNavActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}
