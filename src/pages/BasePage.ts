import { expect, Locator, Page } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  protected controlInput(formControlName: string): Locator {
    return this.page.locator(`app-input[formcontrolname="${formControlName}"] input`);
  }

  protected ngSelect(formControlNameOrPlaceholder: string): Locator {
    return this.page.locator(
      `ng-select[formcontrolname="${formControlNameOrPlaceholder}"], ng-select[placeholder="${formControlNameOrPlaceholder}"]`
    );
  }

  protected buttonByText(text: string | RegExp): Locator {
    return this.page.locator('button').filter({ hasText: text });
  }

  protected toastMessage(): Locator {
    return this.page.locator('.toast-message');
  }

  async goto(path: string) {
    await this.page.goto(path);
  }

  async fillControl(formControlName: string, value: string) {
    const input = this.controlInput(formControlName);
    await input.fill(value);
    await input.blur();
  }

  async selectFromDropdown(scope: Locator, optionText: string | RegExp) {
    await scope.click();
    const option = this.page.locator('div.ng-option').filter({ hasText: optionText }).first();
    await expect(option).toBeVisible();
    await option.click();
  }

  async expectToastText(text: string | RegExp) {
    await expect(this.toastMessage()).toContainText(text);
  }

  async waitForAuthLayoutToDisappear() {
    await this.page.locator('app-auth-layout').waitFor({ state: 'hidden' });
  }
}
