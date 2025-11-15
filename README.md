# RepMove QA Automation Suite

Playwright + TypeScript UI automation targeting RepMove's staging environment (`https://dev-repmove-enterprise.web.app`).  
The suite covers login, registration, forgot-password, and access-control scenarios described in `docs/test-plan.md`.

## Prerequisites

- Node.js 18+
- npm 9+
- Installed Playwright browsers (handled via `npx playwright install`)

## Setup

```bash
npm install
npx playwright install
```

### Generate / configure login credentials

You have two options:

1. **Auto-provision a disposable staging user** (recommended).  
   Run the helper script which signs up a fresh account via the UI and stores the creds in `.auth-user.json`:

   ```bash
   npm run setup:test-user
   ```

   Copy the printed `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` pairs into your shell environment or `.env` file.

2. **Provide an existing account manually.**  
   Create an `.env` file (or export env vars) with credentials for a staging user that can log in:

```
TEST_USER_EMAIL=<existing user email>
TEST_USER_PASSWORD=<password>

# Optional overrides
# REPMOVE_BASE_URL=https://dev-repmove-enterprise.web.app
```

If neither env vars nor `.auth-user.json` are available, tests that rely on the `existingUser` fixture will be skipped with a helpful message.

## Running Tests

- Run the entire suite headlessly:

  ```bash
  npm test
  ```

- Run headed / debug mode:

  ```bash
  npm run test:headed
  ```

- Filter by file or title with Playwright's CLI, e.g.:

  ```bash
  npx playwright test tests/specs/login.spec.ts
  npx playwright test --grep \"R-13\"
  ```

- View the last HTML report:

  ```bash
  npm run test:report
  ```

Artifacts (screenshots, traces, videos) are stored under `test-results/` and included automatically for failures.

## Project Structure

```
docs/test-plan.md           # Scope, scenarios, assumptions
src/pages/*.ts              # Page Object classes
src/utils/dataFactory.ts    # Test data builders
tests/fixtures/*.ts         # Reusable fixtures
tests/specs/*.spec.ts       # Test suites (login, registration, etc.)
playwright.config.ts        # Global Playwright config
```

## Notes

- Registration tests create disposable users via timestamped emails (plus-addressing).
- Some flows open onboarding modals after registration; page objects encapsulate dismiss logic.
- The `existingUser` fixture requires credentials; keep them restricted to staging accounts only.