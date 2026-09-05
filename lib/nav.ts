import { ScanSearch, LayoutDashboard, Trophy, type LucideIcon } from 'lucide-react'

export interface NavItem {
  href: string
  index: string
  labelKey: string
  short: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { href: '/', index: '01', labelKey: 'nav.scanner', short: 'Scan', icon: ScanSearch },
  { href: '/dashboard', index: '02', labelKey: 'nav.dashboard', short: 'Risk', icon: LayoutDashboard },
  { href: '/leaderboard', index: '03', labelKey: 'nav.ranks', short: 'Ranks', icon: Trophy },
]
