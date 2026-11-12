import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('production build loads with no console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => {
    errors.push(error.message);
  });

  await page.goto('/');
  await expect(page).toHaveTitle('Lekka');
  await expect(page.getByRole('heading', { level: 1, name: 'Home' })).toBeVisible();
  await page.goto('/settings');
  await expect(page.getByRole('heading', { level: 1, name: 'Settings' })).toBeVisible();
  expect(errors).toEqual([]);
});

for (const colorScheme of ['light', 'dark'] as const) {
  for (const path of ['/', '/settings']) {
    test(`${path} has no axe violations in ${colorScheme} mode`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(results.violations).toEqual([]);
    });
  }
}
