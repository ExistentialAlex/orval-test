import { expect } from '@playwright/test';
import { Given, Then } from './fixtures';

Given('I visit the home page', async ({ page }) => {
  await page.goto('/');
});

Then('I see in title {string}', async ({ page }, keyword) => {
  await expect(page).toHaveTitle(new RegExp(keyword));
});
