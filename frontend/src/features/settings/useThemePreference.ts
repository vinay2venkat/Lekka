import { useCallback, useState } from 'react';

import type { ThemePreference } from '@/lib/theme';
import {
  applyThemePreference,
  readStoredThemePreference,
  storeThemePreference,
} from '@/platform/theme';

export function useThemePreference(): [ThemePreference, (next: ThemePreference) => void] {
  const [preference, setPreference] = useState<ThemePreference>(readStoredThemePreference);

  const update = useCallback((next: ThemePreference) => {
    setPreference(next);
    storeThemePreference(next);
    applyThemePreference(next);
  }, []);

  return [preference, update];
}
