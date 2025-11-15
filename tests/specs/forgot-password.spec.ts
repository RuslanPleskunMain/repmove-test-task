import { test, expect } from '../fixtures/authFixtures';
import { uniqueEmail } from '../../src/utils/dataFactory';

test.describe('Forgot password', () => {
  test('should send recovery link for valid email', async ({
    forgotPasswordPage,
    existingUser
  }) => {
    await forgotPasswordPage.open();
    await forgotPasswordPage.requestReset(existingUser.email);
    const toastText = await forgotPasswordPage.getResetToastText();
    expect(toastText).not.toMatch(/invalid/i);
  });

  test('should validate email format', async ({ forgotPasswordPage }) => {
    await forgotPasswordPage.open();
    await forgotPasswordPage.requestReset('invalid-email');
    await forgotPasswordPage.expectInvalidEmailError();
  });

  test('should surface error for unknown email', async ({ forgotPasswordPage }) => {
    await forgotPasswordPage.open();
    await forgotPasswordPage.requestReset(uniqueEmail());
    await forgotPasswordPage.expectToastText(/Invalid to reset password/i);
  });
});

