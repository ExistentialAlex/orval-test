import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page.fixture';

export class LoginPage extends BasePage {
  private readonly emailInput: Locator;
  private readonly organisationSelect: Locator;
  private readonly submitButton: Locator;

  constructor(public readonly page: Page) {
    super(page);

    this.emailInput = this.page.getByTestId('login-form:email');
    this.organisationSelect = this.page.getByTestId('login-form:organisation');
    this.submitButton = this.page.getByTestId('login-form:submit');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async addEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async selectOrganisation(organisation: string) {
    await this.selectValueFromSelect(this.organisationSelect, organisation);
  }

  async submit() {
    await this.submitButton.click();
  }

  async login(email: string, organisation: string) {
    await this.goto();
    await this.addEmail(email);
    await this.selectOrganisation(organisation);
    await this.submit();
    await this.page.waitForURL('/');
  }
}
