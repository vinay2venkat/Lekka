// @vitest-environment node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { contrastRatio } from './contrast';

const css = readFileSync(fileURLToPath(new URL('../index.css', import.meta.url)), 'utf8');

function block(selector: string): Record<string, string> {
  const start = css.indexOf(selector);
  if (start < 0) throw new Error(`Selector not found: ${selector}`);
  const open = css.indexOf('{', start);
  const close = css.indexOf('}', open);
  const tokens: Record<string, string> = {};
  for (const m of css.slice(open + 1, close).matchAll(/--lk-([a-z-]+):\s*(#[0-9a-f]{6})/gi)) {
    if (m[1] && m[2]) tokens[m[1]] = m[2];
  }
  return tokens;
}

const themes = {
  light: block(':root {'),
  darkSystem: block(":root:not([data-theme='light'])"),
  darkExplicit: block(":root[data-theme='dark']"),
};

const pair = (t: Record<string, string>, a: string, b: string): number => {
  const fa = t[a];
  const fb = t[b];
  if (!fa || !fb) throw new Error(`Missing token ${a} or ${b}`);
  return contrastRatio(fa, fb);
};

describe('design tokens', () => {
  it('defines the same dark palette for the system preference and the explicit override', () => {
    expect(themes.darkSystem).toEqual(themes.darkExplicit);
  });

  describe.each([
    ['light', themes.light],
    ['dark', themes.darkExplicit],
  ])('%s theme', (_name, t) => {
    it.each([
      ['fg', 'bg'],
      ['fg', 'surface'],
      ['muted-fg', 'bg'],
      ['muted-fg', 'surface'],
      ['primary', 'bg'],
      ['primary', 'surface'],
      ['primary-fg', 'primary'],
      ['accent-fg', 'accent'],
      ['fg', 'primary-soft'],
      ['success', 'surface'],
      ['warning', 'surface'],
      ['danger', 'surface'],
    ])('text %s on %s meets 4.5:1', (a, b) => {
      expect(pair(t, a, b)).toBeGreaterThanOrEqual(4.5);
    });

    it.each([
      ['focus', 'bg'],
      ['focus', 'surface'],
      ['input-border', 'surface'],
    ])('non-text %s on %s meets 3:1', (a, b) => {
      expect(pair(t, a, b)).toBeGreaterThanOrEqual(3);
    });
  });
});
