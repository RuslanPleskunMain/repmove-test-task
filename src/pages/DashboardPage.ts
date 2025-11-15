import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  private readonly logoutNavButton = this.page.getByText('Log out', { exact: true });
  private readonly onboardingModal = this.page.locator('app-payment-start-trial-modal');

  async expectAuthenticated() {
    await this.page.locator('app-auth-layout').waitFor({ state: 'detached', timeout: 15_000 });
    if (await this.onboardingModal.count()) {
      await expect(this.onboardingModal).toBeVisible();
      return;
    }
    await expect(this.logoutNavButton).toBeVisible();
  }

  async logout() {
    if (await this.onboardingModal.count()) {
      await this.page.locator('ngb-modal-window button:has-text("Logout")').click();
    } else {
      await this.logoutNavButton.click();
    }
    await this.page.locator('app-auth-layout').waitFor({ state: 'attached' });
  }

  async navigateTo(path: string) {
    await this.page.goto(path);
  }
}
