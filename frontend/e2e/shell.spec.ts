import { expect, test, type Page } from '@playwright/test';

test.describe('app shell layout', () => {
  test('uses a bottom bar on phones and a sidebar on desktop', async ({ page, isMobile }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Main' });
    await expect(nav).toBeVisible();
    const box = await nav.boundingBox();
    const viewport = page.viewportSize();
    if (!box || !viewport) throw new Error('Layout not measurable');

    if (isMobile) {
      expect(Math.round(box.y + box.height)).toBe(viewport.height);
      expect(box.width).toBe(viewport.width);
    } else {
      expect(box.x).toBeLessThan(300);
      expect(box.y).toBeLessThan(viewport.height / 2);
    }
  });

  test('nav links are at least 44 by 44 px', async ({ page }) => {
    await page.goto('/');
    const links = page.getByRole('navigation', { name: 'Main' }).getByRole('link');
    await expect(links).toHaveCount(2);
    for (const link of await links.all()) {
      const box = await link.boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(44);
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
  });

  test('keyboard users can skip to content and move between pages', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Keyboard journey is for desktop');
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to main content' });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main')).toBeFocused();

    await page.getByRole('link', { name: 'Settings' }).focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/settings$/);
    await expect(page.getByRole('link', { name: 'Settings' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });
});

test.describe('theme', () => {
  const bodyBackground = (page: Page) =>
    page.evaluate(() => getComputedStyle(document.body).backgroundColor);

  test('follows the system colour scheme by default', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    expect(await bodyBackground(page)).toBe('rgb(14, 21, 20)');
    await page.emulateMedia({ colorScheme: 'light' });
    expect(await bodyBackground(page)).toBe('rgb(246, 248, 247)');
  });

  test('an explicit choice overrides the system and survives a reload', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/settings');
    await page.getByRole('radio', { name: 'Dark' }).check();
    expect(await bodyBackground(page)).toBe('rgb(14, 21, 20)');

    await page.reload();
    await expect(page.getByRole('radio', { name: 'Dark' })).toBeChecked();
    expect(await bodyBackground(page)).toBe('rgb(14, 21, 20)');

    await page.emulateMedia({ colorScheme: 'dark' });
    await page.getByRole('radio', { name: 'Light' }).check();
    expect(await bodyBackground(page)).toBe('rgb(246, 248, 247)');
  });
});

test('serves the logo icons', async ({ request }) => {
  for (const path of [
    '/favicon.svg',
    '/favicon.ico',
    '/pwa-192x192.png',
    '/pwa-512x512.png',
    '/maskable-icon-512x512.png',
  ]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
  }
});
