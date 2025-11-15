import { chromium } from '@playwright/test';
import path from 'path';
import { promises as fs } from 'fs';
import { RegistrationPage } from '../src/pages/RegistrationPage';
import { DashboardPage } from '../src/pages/DashboardPage';
import { registrationDataFactory } from '../src/utils/dataFactory';

const BASE_URL = process.env.REPMOVE_BASE_URL ?? 'https://dev-repmove-enterprise.web.app';
const OUTPUT_PATH = path.resolve(process.cwd(), '.auth-user.json');

async function createTestUser() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const registrationPage = new RegistrationPage(page);
  const dashboardPage = new DashboardPage(page);
  const registrationData = registrationDataFactory();

  await page.goto(`${BASE_URL}/auth/sign-up`, { waitUntil: 'networkidle' });
  await registrationPage.registerNewUser(registrationData);
  await dashboardPage.expectAuthenticated();
  await dashboardPage.logout();
  await browser.close();

  const credentials = {
    email: registrationData.email,
    password: registrationData.password
  };

  await fs.writeFile(OUTPUT_PATH, JSON.stringify(credentials, null, 2), 'utf-8');

  console.log('\n✅ Test user created successfully.');
  console.log(`Email: ${credentials.email}`);
  console.log(`Password: ${credentials.password}`);
  console.log(`\nSaved to ${OUTPUT_PATH}.`);
  console.log('Export as env vars or append to your .env file:');
  console.log(`TEST_USER_EMAIL=${credentials.email}`);
  console.log(`TEST_USER_PASSWORD=${credentials.password}\n`);
}

createTestUser().catch(error => {
  console.error('Failed to create test user:\n', error);
  process.exit(1);
});

