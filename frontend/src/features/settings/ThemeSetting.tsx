import { useId } from 'react';
import { useTranslation } from 'react-i18next';

import { THEME_PREFERENCES } from '@/lib/theme';

import { useThemePreference } from './useThemePreference';

export function ThemeSetting() {
  const { t } = useTranslation();
  const [preference, setPreference] = useThemePreference();
  const hintId = useId();

  return (
    <fieldset aria-describedby={hintId} className="space-y-3">
      <legend className="text-base font-medium">{t('settings.appearance.theme')}</legend>
      <p id={hintId} className="text-sm text-muted-fg">
        {t('settings.appearance.themeHint')}
      </p>
      <div className="grid grid-cols-3 gap-2">
        {THEME_PREFERENCES.map((option) => (
          <label
            key={option}
            className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-input-border px-3 has-[:checked]:border-primary has-[:checked]:bg-primary-soft has-[:checked]:font-semibold has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus"
          >
            <input
              type="radio"
              name="theme"
              value={option}
              checked={preference === option}
              onChange={() => {
                setPreference(option);
              }}
              className="size-4 accent-primary focus-visible:outline-none"
            />
            {t(`settings.appearance.${option}`)}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
