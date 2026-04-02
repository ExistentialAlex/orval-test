import type { MessageSchema } from '<project-name>-i18n';
import type { ShapeOf } from '<project-name>-types';
import { test as base, createBdd } from 'playwright-bdd';
import { i18nFixture, LoginPage } from '@/fixtures';

export interface TestContext {
  yourTestData?: string;
}

interface Fixtures {
  loginPage: LoginPage;
  testContext: TestContext;
  t: (k: ShapeOf<MessageSchema> | (string & {}), params?: Record<string, unknown>) => string;
}

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page)); // Login page object
  },
  // eslint-disable-next-line no-empty-pattern
  testContext: async ({}, use) => {
    const context: TestContext = {};
    await use(context); // Share test context between test steps
  },
  t: async ({ locale }, use) => {
    use(await i18nFixture(locale)); // Internationalisation
  },
});

export const { Given, When, Then } = createBdd(test);
