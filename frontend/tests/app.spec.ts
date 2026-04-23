import { test, expect } from '@playwright/test';

test.describe('Intelligence Query Engine UI', () => {
  test.beforeEach(async ({ page }) => {
    // We assume the app is running on localhost:5173 for tests
    await page.goto('http://localhost:5173');
  });

  test('should load the home page and show total profiles', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('InsightaLabs');
    await expect(page.locator('text=Profiles Identified')).toBeVisible();
    const totalCount = await page.locator('span.text-indigo-400').first().textContent();
    expect(parseInt(totalCount || '0')).toBeGreaterThan(0);
  });

  test('should search using natural language', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Ask in plain English"]');
    await searchInput.fill('young males from nigeria');
    await page.locator('button:has-text("Search")').click();
    
    // Wait for data to update
    await expect(page.locator('text=Analyzing Intelligence...')).toBeVisible();
    await expect(page.locator('text=Analyzing Intelligence...')).not.toBeVisible();
    
    // Chidi Igwe is a known result for this query
    await expect(page.locator('text=Chidi Igwe')).toBeVisible();
  });

  test('should filter by gender', async ({ page }) => {
    const genderSelect = page.locator('select').first();
    await genderSelect.selectOption('female');
    
    // Check if cards update
    await expect(page.locator('text=female').first()).toBeVisible();
    await expect(page.locator('text=male').first()).not.toBeVisible();
  });
});
