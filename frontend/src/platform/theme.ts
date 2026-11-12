import { parseThemePreference, type ThemePreference } from '@/lib/theme';

// A UI preference, not financial data, so localStorage is fine here (02: UI state).
const STORAGE_KEY = 'lekka.theme';

export function readStoredThemePreference(): ThemePreference {
  try {
    return parseThemePreference(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    // Storage can be blocked (private mode, site data disabled). Follow the system.
    return 'system';
  }
}

export function storeThemePreference(preference: ThemePreference): void {
  try {
    if (preference === 'system') window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, preference);
  } catch {
    // Not persisted; the choice still applies for this visit.
  }
}

/**
 * CSS follows prefers-color-scheme by default; an explicit choice is written to
 * <html data-theme>, which the tokens in index.css respond to.
 */
export function applyThemePreference(
  preference: ThemePreference,
  root: HTMLElement = document.documentElement,
): void {
  if (preference === 'system') delete root.dataset['theme'];
  else root.dataset['theme'] = preference;
}
