import { applyThemePreference, readStoredThemePreference, storeThemePreference } from './theme';

describe('theme storage', () => {
  afterEach(() => {
    window.localStorage.clear();
    delete document.documentElement.dataset['theme'];
  });

  it('round-trips an explicit choice and clears it for system', () => {
    storeThemePreference('dark');
    expect(readStoredThemePreference()).toBe('dark');
    storeThemePreference('system');
    expect(window.localStorage.getItem('lekka.theme')).toBeNull();
    expect(readStoredThemePreference()).toBe('system');
  });

  it('ignores a corrupted stored value', () => {
    window.localStorage.setItem('lekka.theme', 'neon');
    expect(readStoredThemePreference()).toBe('system');
  });

  it('falls back to system when storage throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError');
    });
    expect(() => {
      storeThemePreference('dark');
    }).not.toThrow();
    expect(readStoredThemePreference()).toBe('system');
  });

  it('sets data-theme only for an explicit choice', () => {
    applyThemePreference('dark');
    expect(document.documentElement.dataset['theme']).toBe('dark');
    applyThemePreference('system');
    expect(document.documentElement.dataset['theme']).toBeUndefined();
  });
});
