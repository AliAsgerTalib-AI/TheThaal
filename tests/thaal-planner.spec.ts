import { test, expect } from '@playwright/test';

test.describe('Thaal Planner', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 1280, height: 800 });
  });

  test('hero CTA opens the Thaal Planner', async ({ page }) => {
    await page.getByRole('button', { name: /orchestrate the symphony/i }).click();
    // Planner replaces the hero section
    await expect(page.getByText('Heritage Intelligence')).not.toBeVisible();
  });

  test('planner mounts without crashing', async ({ page }) => {
    await page.getByRole('button', { name: /orchestrate the symphony/i }).click();
    // No uncaught errors — page is still interactive
    await expect(page.locator('body')).toBeVisible();
    // The brand nav must still be present
    await expect(page.locator('nav').getByText('The Thaal').first()).toBeVisible();
  });
});
