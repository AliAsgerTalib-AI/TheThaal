import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('home page renders hero section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /orchestrate/i })).toBeVisible();
    await expect(page.getByText('Heritage Intelligence')).toBeVisible();
    await expect(page.getByRole('button', { name: /orchestrate the symphony/i })).toBeVisible();
  });

  test('nav brand logo is visible', async ({ page }) => {
    const logo = page.locator('nav').getByText('The Thaal').first();
    await expect(logo).toBeVisible();
  });

  test('desktop nav shows Master List, About Us, Archive, Contribute', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(page.locator('nav').getByRole('button', { name: /master list/i })).toBeVisible();
    await expect(page.locator('nav').getByRole('button', { name: /about us/i })).toBeVisible();
    await expect(page.locator('nav').getByRole('button', { name: /archive/i })).toBeVisible();
    await expect(page.locator('nav').getByRole('button', { name: /contribute/i })).toBeVisible();
  });

  test('mobile menu toggles open and closed', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const menuButton = page.locator('nav button.md\\:hidden');
    await menuButton.click();
    await expect(page.getByRole('button', { name: /master list/i }).last()).toBeVisible();
    await menuButton.click();
    await expect(page.getByRole('button', { name: /master list/i }).last()).not.toBeVisible();
  });

  test('clicking logo returns to home from another page', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.locator('nav').getByRole('button', { name: /about us/i }).click();
    await expect(page.getByText(/about us/i).first()).toBeVisible();
    await page.locator('nav').locator('[class*="cursor-pointer"]').first().click();
    await expect(page.getByRole('heading', { name: /orchestrate/i })).toBeVisible();
  });
});
