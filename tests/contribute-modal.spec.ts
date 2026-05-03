import { test, expect } from '@playwright/test';

test.describe('Archive page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 1280, height: 800 });
  });

  test('Archive page opens from nav', async ({ page }) => {
    await page.locator('nav').getByRole('button', { name: /archive/i }).click();
    await expect(page.getByText('Heritage Intelligence')).not.toBeVisible();
  });

  test('Archive page closes and returns home via logo', async ({ page }) => {
    await page.locator('nav').getByRole('button', { name: /archive/i }).click();
    await expect(page.getByText('Heritage Intelligence')).not.toBeVisible();
    await page.locator('nav').locator('[class*="cursor-pointer"]').first().click();
    await expect(page.getByText('Heritage Intelligence')).toBeVisible();
  });
});
