# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.ts >> Intelligence Query Engine UI >> should load the home page and show total profiles
- Location: tests\app.spec.ts:9:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Intelligence Query Engine UI', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     // We assume the app is running on localhost:5173 for tests
> 6  |     await page.goto('http://localhost:5173');
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/
  7  |   });
  8  | 
  9  |   test('should load the home page and show total profiles', async ({ page }) => {
  10 |     await expect(page.locator('h1')).toContainText('InsightaLabs');
  11 |     await expect(page.locator('text=Profiles Identified')).toBeVisible();
  12 |     const totalCount = await page.locator('span.text-indigo-400').first().textContent();
  13 |     expect(parseInt(totalCount || '0')).toBeGreaterThan(0);
  14 |   });
  15 | 
  16 |   test('should search using natural language', async ({ page }) => {
  17 |     const searchInput = page.locator('input[placeholder*="Ask in plain English"]');
  18 |     await searchInput.fill('young males from nigeria');
  19 |     await page.locator('button:has-text("Search")').click();
  20 |     
  21 |     // Wait for data to update
  22 |     await expect(page.locator('text=Analyzing Intelligence...')).toBeVisible();
  23 |     await expect(page.locator('text=Analyzing Intelligence...')).not.toBeVisible();
  24 |     
  25 |     // Chidi Igwe is a known result for this query
  26 |     await expect(page.locator('text=Chidi Igwe')).toBeVisible();
  27 |   });
  28 | 
  29 |   test('should filter by gender', async ({ page }) => {
  30 |     const genderSelect = page.locator('select').first();
  31 |     await genderSelect.selectOption('female');
  32 |     
  33 |     // Check if cards update
  34 |     await expect(page.locator('text=female').first()).toBeVisible();
  35 |     await expect(page.locator('text=male').first()).not.toBeVisible();
  36 |   });
  37 | });
  38 | 
```