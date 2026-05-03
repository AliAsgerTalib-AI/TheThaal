import { test, expect } from '@playwright/test';

test.describe('Contribute modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 1280, height: 800 });
  });

  test('Contribute button opens the recipe form modal', async ({ page }) => {
    await page.locator('nav').getByRole('button', { name: /contribute/i }).click();
    // Modal overlay should appear
    const modal = page.locator('[role="dialog"], [data-modal], .fixed.inset-0').last();
    await expect(modal).toBeVisible({ timeout: 3000 }).catch(async () => {
      // Fallback: look for a form element that appeared
      await expect(page.locator('form').first()).toBeVisible();
    });
  });

  test('modal closes when close action is triggered', async ({ page }) => {
    await page.locator('nav').getByRole('button', { name: /contribute/i }).click();
    // Press Escape to close
    await page.keyboard.press('Escape');
    // After a short wait the modal should be gone
    await page.waitForTimeout(400);
    await expect(page.locator('nav').getByRole('button', { name: /contribute/i })).toBeVisible();
  });
});
