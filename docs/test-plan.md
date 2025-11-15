# QA Automation Test Plan — Login & Registration (RepMove Dev)

**System Under Test (SUT):** http://dev-repmove-enterprise.web.app/  
**Test Type:** UI E2E (black-box) via browser  
**Automation Stack:** Playwright + TypeScript

---

## 0) Objective

Validate that users can register, log in, and log out reliably; that client/server validations are surfaced correctly; and that route guarding/session handling behave as expected in staging.

## 1) Scope of Testing

**In Scope**

- Login: form rendering, required fields, client format checks, success path, redirects, server errors.
- Registration: form rendering, validation, success flow, duplicate handling.
- Access Control: protected routes force auth, redirects away from auth screens when already logged in.
- UI/UX & security signals: password masking, error phrasing, button states.

**Out of Scope**

- Email inbox verification, API contract tests, DB checks.
- Security pen-tests, performance/load, SSO providers not exposed in UI.

## 2) Automated Scenarios

### Positive Test Scenarios
- **L-01 / L-02** Valid existing user logs in and logs out, landing on the default page.
- **L-03** Deep-link to protected route redirects to login, then back after auth.
- **R-01** New user registers with valid unique data and sees success path.
- **R-03** Auth state hygiene: visiting `/login` or `/register` while signed in redirects to home.

### Negative Test Scenarios
- **L-10** Invalid email format blocked client-side.
- **L-11** Wrong password or unknown email shows generic error.
- **L-12** Blank email/password show required-field validation.
- **L-13** Email with surrounding spaces is trimmed before auth.
- **R-10** Invalid email format blocked during registration.
- **R-11** Weak password (length/complexity) surfaces validation.
- **R-13** Duplicate email shows server error.
- **R-14** Required fields empty show inline errors.

### Edge / Other Flows
- **E-01** Plus-addressing emails accepted.
- **E-08** Deep-link return path preserved after login.
- **E-09** Repeated failed logins show consistent generic errors.
- **Forgot Password** Recovery link flow, invalid format, and unknown email handling.

## 5) Assumptions & Out-of-Scope

- Staging is stable; no CAPTCHA/2FA unless visible.
- One valid test user exists (or can be created).
- Password policy provides user-visible feedback.
- Post-registration behavior is deterministic.

Out-of-scope reiteration: email inbox checks, API/DB assertions, penetration testing, performance, non-UI auth providers.

## 6) Test Data Strategy

- Unique emails: timestamp or plus addressing (e.g., `repauto+<epoch>@example.com`).
- Duplicate checks: reuse a known registered email.
- Disabled account: only if fixture exists; otherwise document gap.
- Password policy: cover min length and complexity explicitly.

## 7) Environment & Tooling

- URL: `https://dev-repmove-enterprise.web.app`
- Browser: Chromium (default); optional smoke on Firefox/WebKit.
- Network: default.
- Artifacts: Playwright traces, screenshots, video on failure.

## 8) Entry / Exit Criteria

**Entry:** Environment reachable, accounts ready, blockers triaged.  
**Exit:** All positive scenarios pass, negative/edge cases covered, no critical auth defects open.

## 9) Reporting & Traceability

- Map scenario IDs (L-xx, R-xx, E-xx) to automated tests.
- CI output: Playwright HTML report + traces.
- Share summary with pass/fail counts and known issues.

## 10) Risks & Mitigations

- Flaky environment/auth services → scoped retries, tracing, quarantine flag if env-related.
- Email verification dependency → validate UI messaging only.
- Rate limiting / lockouts → rotate users, document if encountered.
