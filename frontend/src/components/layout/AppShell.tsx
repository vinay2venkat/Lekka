import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router';

import { Logo } from './Logo';
import { NavLinks } from './NavLinks';

/**
 * 05 Navigation: a bottom bar on phones and a sidebar from the md breakpoint (768 px) up.
 * There is a single <nav> landmark; only its layout changes between the two.
 */
export function AppShell() {
  const { t } = useTranslation();
  return (
    <div className="min-h-dvh md:flex">
      <a
        href="#main"
        className="sr-only z-50 rounded-lg bg-surface px-4 py-2 focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        {t('app.skipToContent')}
      </a>

      <div className="contents md:flex md:min-h-dvh md:w-60 md:shrink-0 md:flex-col md:gap-6 md:border-r md:border-border md:bg-surface md:p-4">
        <div className="hidden items-center gap-2 px-2 md:flex">
          <Logo />
          <span className="text-lg font-semibold">{t('app.name')}</span>
        </div>
        <nav
          aria-label={t('nav.label')}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] md:static md:border-0 md:bg-transparent md:pb-0"
        >
          <NavLinks />
        </nav>
      </div>

      <div className="flex min-h-dvh flex-1 flex-col">
        <header className="flex items-center gap-2 border-b border-border bg-surface px-4 py-3 md:hidden">
          <Logo className="size-7" />
          <span className="text-lg font-semibold">{t('app.name')}</span>
        </header>

        <main
          id="main"
          tabIndex={-1}
          className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 pb-24 focus:outline-none md:pb-6"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
