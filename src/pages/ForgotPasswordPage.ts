import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ForgotPasswordPage extends BasePage {
  async open() {
    await this.goto('/auth/forgot-password');
  }

  async requestReset(email: string) {
    await this.fillControl('email', email);
    await this.buttonByText('Send Recovery Link').click();
  }

  async expectInvalidEmailError() {
    const error = this.page.locator('app-input[formcontrolname="email"] .__error');
    await expect(error).toHaveText(/invalid email address/i);
  }

  async expectResetToast() {
    await this.expectToastText(/reset password|recovery/i);
  }

  async getResetToastText() {
    const toast = this.toastMessage();
    await expect(toast).toBeVisible();
    return toast.first().innerText();
  }
}

