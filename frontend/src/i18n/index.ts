import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';

// v1 is English only (ADR-017). Slice 0.6 adds plural rules, Intl helpers and the
// remaining i18n conventions; this is the minimum so every string goes through t().
export const defaultNS = 'translation';
export const resources = { en: { translation: en } } as const;

void i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources,
  defaultNS,
  interpolation: { escapeValue: false },
  returnNull: false,
});

export { i18n };
