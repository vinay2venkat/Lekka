import { parseThemePreference, resolveTheme } from './theme';

describe('theme preference', () => {
  it.each(['system', 'light', 'dark'] as const)('keeps a valid stored value: %s', (value) => {
    expect(parseThemePreference(value)).toBe(value);
  });

  it.each([null, undefined, '', 'blue', 42, {}])('falls back to system for %j', (value) => {
    expect(parseThemePreference(value)).toBe('system');
  });

  it('follows the system only when the preference is system', () => {
    expect(resolveTheme('system', true)).toBe('dark');
    expect(resolveTheme('system', false)).toBe('light');
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('dark', false)).toBe('dark');
  });
});
