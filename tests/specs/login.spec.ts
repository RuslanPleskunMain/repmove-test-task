import { test, expect } from '../fixtures/authFixtures';
import { uniqueEmail } from '../../src/utils/dataFactory';

test.describe('Login flows', () => {
  test('L-01/L-02: should sign in and log out with valid credentials', async ({
    loginPage,
    dashboardPage,
    existingUser
  }) => {
    await loginPage.open();
    await loginPage.signIn(existingUser.email, existingUser.password);
    await dashboardPage.expectAuthenticated();
    await dashboardPage.logout();
    await expect(loginPage.signInButton()).toBeVisible();
  });

  test('L-11: should block invalid credentials', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.signIn(uniqueEmail(), 'WrongPassword!123');
    await expect(loginPage.toastLocator()).toContainText(/Invalid to login/i);
  });

  test('L-12: should require email and password', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.submit();
    await expect(loginPage.emailErrorLocator()).toHaveText(/enter your email address/i);
    await expect(loginPage.passwordErrorLocator()).toHaveText(/password is required/i);
  });

  test('L-10: should validate email format', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.setEmail('invalid-email');
    await loginPage.submit();
    await expect(loginPage.emailErrorLocator()).toHaveText(/invalid email address/i);
  });

  test('L-13: should trim whitespace around email before login', async ({
    loginPage,
    dashboardPage,
    existingUser
  }) => {
    await loginPage.open();
    await loginPage.signIn(`  ${existingUser.email}  `, existingUser.password);
    await dashboardPage.expectAuthenticated();
    await dashboardPage.logout();
  });
});

