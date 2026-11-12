import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import './i18n';
import './index.css';
import { applyThemePreference, readStoredThemePreference } from './platform/theme';

// Apply a saved light/dark override before the first render to avoid a flash of the wrong theme.
applyThemePreference(readStoredThemePreference());

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
