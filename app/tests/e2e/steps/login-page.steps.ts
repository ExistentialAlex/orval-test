import { expect } from '@playwright/test';
import { Given, Then, When } from './fixtures';

Given('I visit the login page', async ({ loginPage }) => {
  await loginPage.goto();
});

When('I enter email {string}', async ({ loginPage }, email: string) => {
  await loginPage.addEmail(email);
});

When('I select organisation {string}', async ({ loginPage }, organisation: string) => {
  await loginPage.selectOrganisation(organisation);
});

When('I submit the login form', async ({ loginPage }) => {
  await loginPage.submit();
});

Then('I am redirected to the dashboard', async ({ page, t }) => {
  await expect(page.getByText(t('app.pages.dashboard.title'))).toHaveText(
    t('app.pages.dashboard.title'),
  );
});

Then('An error is displayed', async ({ page }) => {
  await expect(page.getByText('Organisation is required')).toBeInViewport();
});
