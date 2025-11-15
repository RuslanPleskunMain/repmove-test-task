import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private readonly emailError = this.page.locator('app-input[formcontrolname="email"] .__error');
  private readonly passwordError = this.page.locator('app-input[formcontrolname="password"] .__error');

  async open() {
    await this.goto('/auth/sign-in');
  }

  async signIn(email: string, password: string) {
    await this.setEmail(email);
    await this.setPassword(password);
    await this.submit();
  }

  async setEmail(email: string) {
    await this.controlInput('email').fill(email);
  }

  async setPassword(password: string) {
    await this.controlInput('password').fill(password);
  }

  async submit() {
    await this.buttonByText('Sign In').first().click();
  }

  signInButton() {
    return this.buttonByText('Sign In').first();
  }

  async expectOnSignInPage() {
    await expect(this.page).toHaveURL(/\/auth\/sign-in$/, { timeout: 15_000 });
    await expect(this.signInButton()).toBeVisible();
  }

  toastLocator() {
    return this.toastMessage();
  }

  emailErrorLocator() {
    return this.emailError;
  }

  passwordErrorLocator() {
    return this.passwordError;
  }
}

