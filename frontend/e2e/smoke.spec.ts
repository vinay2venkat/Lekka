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
  await expect(page.getByRole('heading', { level: 1, name: 'Lekka' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('home page has no axe violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});
