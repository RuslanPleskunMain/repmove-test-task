import { test, expect } from '../fixtures/authFixtures';

test.describe('Access control', () => {
  test('Protected routes should redirect unauthenticated users', async ({ dashboardPage, loginPage }) => {
    await dashboardPage.navigateTo('/app/dashboard');
    await expect(loginPage.signInButton()).toBeVisible();
  });

  test('L-03/E-08: should honor deep-link after login', async ({
    dashboardPage,
    loginPage,
    existingUser
  }) => {
    await dashboardPage.navigateTo('/app/dashboard');
    await expect(loginPage.signInButton()).toBeVisible();
    await loginPage.signIn(existingUser.email, existingUser.password);
    await dashboardPage.expectAuthenticated();
    await dashboardPage.logout();
  });

  test('R-03: authenticated users should be redirected away from auth pages', async ({
    loginPage,
    dashboardPage,
    existingUser
  }) => {
    await loginPage.open();
    await loginPage.signIn(existingUser.email, existingUser.password);
    await dashboardPage.expectAuthenticated();
    await loginPage.open();
    await dashboardPage.expectAuthenticated();
    await dashboardPage.logout();
  });
});
