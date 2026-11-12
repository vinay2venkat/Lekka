import { useTranslation } from 'react-i18next';

import { ThemeSetting } from './ThemeSetting';

export function SettingsPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t('settings.title')}</h1>
      <section
        aria-labelledby="settings-appearance"
        className="space-y-4 rounded-card border border-border bg-surface p-4"
      >
        <h2 id="settings-appearance" className="text-lg font-semibold">
          {t('settings.appearance.title')}
        </h2>
        <ThemeSetting />
      </section>
    </div>
  );
}
