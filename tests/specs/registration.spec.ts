import { test, expect } from '../fixtures/authFixtures';
import { registrationDataFactory, uniqueEmail } from '../../src/utils/dataFactory';

test.describe('Registration flows', () => {
  test('R-01/R-02: should register new user and show onboarding modal', async ({
    registrationPage,
    loginPage
  }) => {
    const data = registrationDataFactory();

    await registrationPage.open();
    await registrationPage.registerNewUser(data);
    await expect(registrationPage.onboardingModalLocator()).toBeVisible();
    await registrationPage.logoutFromOnboardingModal();
    await expect(loginPage.signInButton()).toBeVisible();
  });

  test('R-13: should block duplicate email registration', async ({ registrationPage }) => {
    const data = registrationDataFactory();

    await registrationPage.open();
    await registrationPage.registerNewUser(data);
    await expect(registrationPage.onboardingModalLocator()).toBeVisible();
    await registrationPage.logoutFromOnboardingModal();

    await registrationPage.open();
    await registrationPage.registerNewUser({ ...data, phoneNumber: '412345679' });
    await expect(registrationPage.toastLocator()).toContainText(/Invalid to sign up/i);
  });

  test('R-14: should show required field validation when submitting empty form', async ({
    registrationPage
  }) => {
    await registrationPage.open();
    await registrationPage.submit();
    const errorsLocator = registrationPage.requiredFieldErrors();
    await expect(errorsLocator.first()).toBeVisible();
    const errorCount = await errorsLocator.count();
    expect(errorCount).toBeGreaterThan(0);
  });

  test('R-10: should validate email format on registration form', async ({ registrationPage }) => {
    await registrationPage.open();
    await registrationPage.setEmail('invalid-email');
    await registrationPage.submit();
    await expect(registrationPage.emailErrorLocator()).toHaveText(/invalid email address/i);
  });

  test('R-11: should enforce password policy', async ({ registrationPage }) => {
    await registrationPage.open();
    await registrationPage.setPassword('123');
    await registrationPage.submit();
    await expect(registrationPage.passwordErrorLocator()).toHaveText(/min length/i);
  });

  test('E-01: should accept plus-addressing emails', async ({ registrationPage }) => {
    const data = registrationDataFactory({ email: uniqueEmail('repauto', 'plus-address') });
    await registrationPage.open();
    await registrationPage.registerNewUser(data);
    await expect(registrationPage.onboardingModalLocator()).toBeVisible();
    await registrationPage.logoutFromOnboardingModal();
  });
});

