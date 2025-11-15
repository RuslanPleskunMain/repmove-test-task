import { test as base, TestInfo } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { LoginPage } from '../../src/pages/LoginPage';
import { RegistrationPage } from '../../src/pages/RegistrationPage';
import { DashboardPage } from '../../src/pages/DashboardPage';
import { ForgotPasswordPage } from '../../src/pages/ForgotPasswordPage';

type ExistingUser = {
  email: string;
  password: string;
};

type AuthFixtures = {
  loginPage: LoginPage;
  registrationPage: RegistrationPage;
  dashboardPage: DashboardPage;
  forgotPasswordPage: ForgotPasswordPage;
  existingUser: ExistingUser;
};

const LOCAL_USER_PATH = path.resolve(process.cwd(), '.auth-user.json');

const readLocalUser = (): ExistingUser | null => {
  if (!fs.existsSync(LOCAL_USER_PATH)) {
    return null;
  }

  try {
    const contents = fs.readFileSync(LOCAL_USER_PATH, 'utf-8');
    const parsed: ExistingUser = JSON.parse(contents);
    if (parsed.email && parsed.password) {
      return parsed;
    }
  } catch (error) {
    console.warn('Unable to parse .auth-user.json:', error);
  }

  return null;
};

const buildExistingUserFixture = async (
  {}: Record<string, never>,
  use: (fixtures: ExistingUser) => Promise<void>,
  testInfo: TestInfo
) => {
  const envEmail = process.env.TEST_USER_EMAIL;
  const envPassword = process.env.TEST_USER_PASSWORD;
  const localUser = readLocalUser();

  if (envEmail && envPassword) {
    await use({ email: envEmail, password: envPassword });
    return;
  }

  if (localUser) {
    await use(localUser);
    return;
  }

  testInfo.skip(
    'Set TEST_USER_EMAIL / TEST_USER_PASSWORD env vars or run "npm run setup:test-user" to generate a reusable account.'
  );
};

export const test = base.extend<AuthFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  registrationPage: async ({ page }, use) => {
    await use(new RegistrationPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  forgotPasswordPage: async ({ page }, use) => {
    await use(new ForgotPasswordPage(page));
  },
  existingUser: [buildExistingUserFixture, { auto: false }]
});

export const expect = test.expect;

