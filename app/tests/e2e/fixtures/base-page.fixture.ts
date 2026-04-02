import type { Locator, Page } from '@playwright/test';

export class BasePage {
  constructor(public readonly page: Page) {}

  async selectValueFromSelect(inputLocator: Locator, valueToSelect: string) {
    await inputLocator.click();
    await this.page.getByLabel(valueToSelect, { exact: true }).getByText(valueToSelect).click();
  }

  async selectValueFromSelectMenu(inputLocator: Locator, valueToSelect: string) {
    await inputLocator.click();
    await this.page.getByRole('listbox').getByRole('combobox').fill(valueToSelect);
    await this.page.getByRole('listbox').getByText(valueToSelect, { exact: true }).click();
  }

  async clickElement(locator: Locator) {
    await locator.evaluate((element) => (element as HTMLButtonElement).click());
  }

  async clearOverlays(): Promise<void> {
    await this.page.keyboard.press('Escape');
  }
}
