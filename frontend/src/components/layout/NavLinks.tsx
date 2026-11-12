import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

import { cn } from '@/lib/utils';

import { NAV_ITEMS } from './navItems';

/** One list of links, laid out as a bottom bar on phones and a vertical sidebar list from md up. */
export function NavLinks() {
  const { t } = useTranslation();
  return (
    <ul className="flex justify-around md:flex-col md:justify-start md:gap-1">
      {NAV_ITEMS.map(({ to, labelKey, Icon }) => (
        <li key={to} className="flex-1 md:flex-none">
          <NavLink
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex min-h-11 min-w-11 flex-col items-center justify-center gap-0.5 rounded-lg px-2 py-1 text-xs',
                'transition-colors duration-200 ease-standard',
                'md:flex-row md:justify-start md:gap-3 md:px-3 md:py-2 md:text-sm',
                isActive
                  ? 'bg-primary-soft font-semibold text-fg'
                  : 'text-muted-fg hover:bg-primary-soft/60 hover:text-fg',
              )
            }
          >
            {({ isActive }) => (
              <>
                {/* Active state is shown by weight, background and aria-current, never colour alone. */}
                <Icon aria-hidden="true" className="size-5" strokeWidth={isActive ? 2.5 : 2} />
                <span>{t(labelKey)}</span>
              </>
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
