import { RegistrationData } from '../pages/RegistrationPage';

const BASE_EMAIL = 'repauto';
const EMAIL_DOMAIN = 'example.com';

export const timestamp = () => Date.now();

export const uniqueEmail = (prefix = BASE_EMAIL, tag?: string) => {
  const suffix = tag ? `${tag}+${timestamp()}` : `${timestamp()}`;
  return `${prefix}+${suffix}@${EMAIL_DOMAIN}`;
};

export const registrationDataFactory = (overrides: Partial<RegistrationData> = {}): RegistrationData => ({
  firstName: 'Test',
  lastName: `User${timestamp().toString().slice(-4)}`,
  companyName: `QA Company ${timestamp().toString().slice(-3)}`,
  industry: 'Distributor',
  countryCode: '+61',
  phoneNumber: '412345678',
  email: uniqueEmail(),
  password: 'Password123!',
  ...overrides
});

