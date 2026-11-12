import { House, Settings, type LucideIcon } from 'lucide-react';

export interface NavItem {
  to: string;
  labelKey: 'nav.home' | 'nav.settings';
  Icon: LucideIcon;
}

// Only screens that exist are listed (no placeholder tabs). Activity, Add, Plan and More
// join as their Phase 1 slices land; see 05 Navigation for the final order.
export const NAV_ITEMS: readonly NavItem[] = [
  { to: '/', labelKey: 'nav.home', Icon: House },
  { to: '/settings', labelKey: 'nav.settings', Icon: Settings },
];
