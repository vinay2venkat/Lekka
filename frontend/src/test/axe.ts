import axe from 'axe-core';

/** Run axe on a rendered container and return violations (empty means pass). */
export async function axeViolations(container: Element): Promise<axe.Result[]> {
  const results = await axe.run(container, {
    // jsdom cannot compute colour contrast; Playwright covers it in a real browser.
    rules: { 'color-contrast': { enabled: false } },
  });
  return results.violations;
}
