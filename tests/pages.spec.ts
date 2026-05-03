import { test, expect } from '@playwright/test';

test.describe('Page navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 1280, height: 800 });
  });

  test('About Us page opens and closes', async ({ page }) => {
    await page.locator('nav').getByRole('button', { name: /about us/i }).click();
    await expect(page.getByText(/about/i).first()).toBeVisible();
    // Navigating back home via logo resets the view
    await page.locator('nav').locator('[class*="cursor-pointer"]').first().click();
    await expect(page.getByText('Heritage Intelligence')).toBeVisible();
  });

  test('Master List page opens', async ({ page }) => {
    await page.locator('nav').getByRole('button', { name: /master list/i }).click();
    // Master List page should be visible and replace the hero
    await expect(page.getByText('Heritage Intelligence')).not.toBeVisible();
  });

  test('Archive page opens', async ({ page }) => {
    await page.locator('nav').getByRole('button', { name: /archive/i }).click();
    await expect(page.getByText('Heritage Intelligence')).not.toBeVisible();
  });

  test('only one page is open at a time', async ({ page }) => {
    await page.locator('nav').getByRole('button', { name: /about us/i }).click();
    await page.locator('nav').getByRole('button', { name: /master list/i }).click();
    // After switching, About should be gone and Master List visible
    await expect(page.getByText('Heritage Intelligence')).not.toBeVisible();
  });
});
