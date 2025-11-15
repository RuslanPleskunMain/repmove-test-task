import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export type RegistrationData = {
  firstName: string;
  lastName: string;
  companyName: string;
  industry: string;
  countryCode: string;
  phoneNumber: string;
  email: string;
  password: string;
};

export class RegistrationPage extends BasePage {
  private readonly onboardingModal = this.page.locator('app-payment-start-trial-modal');

  async open() {
    await this.goto('/auth/sign-up');
  }

  async fillForm(data: RegistrationData) {
    await this.fillControl('firstName', data.firstName);
    await this.fillControl('lastName', data.lastName);
    await this.fillControl('companyName', data.companyName);
    await this.selectIndustry(data.industry);
    await this.fillControl('email', data.email);
    await this.selectCountry(data.countryCode);
    await this.fillPhone(data.phoneNumber);
    await this.fillControl('password', data.password);
  }

  async submit() {
    await this.buttonByText('Sign Up').first().click();
  }

  async registerNewUser(data: RegistrationData) {
    await this.fillForm(data);
    await this.submit();
  }

  async selectIndustry(industry: string) {
    const dropdown = this.ngSelect('industry');
    await this.selectFromDropdown(dropdown, industry);
  }

  async selectCountry(countryCode: string) {
    const dropdown = this.ngSelect('Country');
    await this.selectFromDropdown(dropdown, countryCode);
  }

  async setEmail(email: string) {
    await this.fillControl('email', email);
  }

  async setPassword(password: string) {
    await this.fillControl('password', password);
  }

  async fillPhone(number: string) {
    const input = this.page.locator('app-phone-number input').nth(1);
    await input.fill(number);
    await input.blur();
  }

  onboardingModalLocator() {
    return this.onboardingModal;
  }

  async logoutFromOnboardingModal() {
    const modalLogout = this.page.locator('ngb-modal-window button:has-text("Logout")');
    if (await modalLogout.count()) {
      await Promise.all([
        this.page.waitForURL('**/auth/sign-in', { timeout: 15_000 }),
        modalLogout.first().click()
      ]);
      await this.page.waitForLoadState('networkidle');
      await expect(this.page.locator('form button:has-text("Sign In")').first()).toBeVisible();
      return;
    }

    const navLogout = this.page.getByText('Log out', { exact: true });
    if (await navLogout.count()) {
      await Promise.all([
        this.page.waitForURL('**/auth/sign-in', { timeout: 15_000 }),
        navLogout.first().click()
      ]);
      await this.page.waitForLoadState('networkidle');
      await expect(this.page.locator('form button:has-text("Sign In")').first()).toBeVisible();
    }
  }

  toastLocator() {
    return this.toastMessage();
  }

  emailErrorLocator() {
    return this.page.locator('app-input[formcontrolname="email"] .__error');
  }

  passwordErrorLocator() {
    return this.page.locator('app-input[formcontrolname="password"] .__error');
  }

  requiredFieldErrors() {
    return this.page.locator('.__error').filter({ hasText: /required/i });
  }
}

