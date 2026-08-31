[![Playwright Tests](https://github.com/swingaroo2/automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/swingaroo2/automation/actions/workflows/playwright.yml)

# QA Automation Portfolio

Playwright and TypeScript test automation covering UI and API workflows. The suite demonstrates maintainable test design, data isolation, and actionable reporting against public practice applications.

## Coverage

- **SauceDemo:** login, product sorting, cart state, authenticated storage state, and Chromium/Firefox coverage.
- **The Internet:** authentication, dynamic loading, DOM interactions, dropdowns, checkboxes, and broken-image checks.
- **DemoQA:** book-list tests using route interception and local test data.
- **RESTful Booker:** health, CRUD, authentication, and cleanup-aware API tests.

## Run Locally

Tested with Node 24.20.0 and npm 11.19.0.

```bash
npm ci
npx playwright install --with-deps
npm test
```

Useful focused commands:

```bash
npm run test:restful-booker
npm run test:saucedemo:chromium
npm run test:the-internet
npm run lint
npm run format:check
npm run show-report
```

WebKit is excluded on Linux by default because of a platform-specific Playwright issue. Run it deliberately with `PW_INCLUDE_WEBKIT=1 npm run test:saucedemo:webkit`.

## Test Design

Tests are grouped by target application in `tests/`. Reusable UI behavior is modeled in `helpers/page-objects/`, fixtures centralize setup and data loading in `helpers/fixtures/`, and test inputs live in `test-data/`. Design decisions, test cases, locators, and API contracts are recorded in [design-notes](design-notes/). Note that the more brief design notes are written inline in their respective `spec` files.

The checked-in credentials target only public practice applications: SauceDemo, The Internet, and RESTful Booker. They are intentional training fixtures, not production credentials. Do not commit real credentials or environment files.

## CI and Reporting

GitHub Actions runs the suite on pushes and pull requests, then uploads the HTML Playwright report as an artifact. Traces are retained for failed tests to support diagnosis.
