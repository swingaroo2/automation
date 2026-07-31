import { defineConfig, devices } from "@playwright/test";

const SAUCE_DEMO_BASE_URL = "https://www.saucedemo.com";
const THE_INTERNET_BASE_URL = "https://the-internet.herokuapp.com";
const DEMOSITE_BASE_URL = "https://demoqa.com";
const RESTFUL_BOOKER_BASE_URL = "https://restful-booker.herokuapp.com";

const includeWebkit =
  process.platform !== "linux" ||
  process.env.PW_INCLUDE_WEBKIT === "1" ||
  process.env.PLAYWRIGHT_INCLUDE_WEBKIT === "1";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "retain-on-failure",
  },

  /* Configure projects by platform, not by shared browser-only buckets. */
  projects: [
    {
      name: "saucedemo-setup-chromium",
      testMatch: "**/saucedemo/setup.auth.ts",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: SAUCE_DEMO_BASE_URL,
        storageState: undefined,
      },
    },
    {
      name: "saucedemo-chromium",
      testMatch: "**/saucedemo/**/*.spec.ts",
      dependencies: ["saucedemo-setup-chromium"],
      use: {
        ...devices["Desktop Chrome"],
        baseURL: SAUCE_DEMO_BASE_URL,
        storageState: ".auth/saucedemo-chromium.json",
      },
    },
    {
      name: "saucedemo-setup-firefox",
      testMatch: "**/saucedemo/setup.auth.ts",
      use: {
        ...devices["Desktop Firefox"],
        baseURL: SAUCE_DEMO_BASE_URL,
        storageState: undefined,
      },
    },
    {
      name: "saucedemo-firefox",
      testMatch: "**/saucedemo/**/*.spec.ts",
      dependencies: ["saucedemo-setup-firefox"],
      use: {
        ...devices["Desktop Firefox"],
        baseURL: SAUCE_DEMO_BASE_URL,
        storageState: ".auth/saucedemo-firefox.json",
      },
    },
    ...(includeWebkit
      ? [
          {
            name: "saucedemo-setup-webkit",
            testMatch: "**/saucedemo/setup.auth.ts",
            use: {
              ...devices["Desktop Safari"],
              baseURL: SAUCE_DEMO_BASE_URL,
              storageState: undefined,
            },
          },
          {
            name: "saucedemo-webkit",
            testMatch: "**/saucedemo/**/*.spec.ts",
            dependencies: ["saucedemo-setup-webkit"],
            use: {
              ...devices["Desktop Safari"],
              baseURL: SAUCE_DEMO_BASE_URL,
              storageState: ".auth/saucedemo-webkit.json",
            },
          },
        ]
      : []),
    {
      name: "the-internet-chromium",
      testMatch: "**/the-internet/**/*.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: THE_INTERNET_BASE_URL,
      },
    },
    {
      name: "demosite-chromium",
      testMatch: "**/demosite/**/*.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: DEMOSITE_BASE_URL,
      },
    },
    {
      name: "restful-booker-api",
      testMatch: "**/restful-booker/**/*.spec.ts",
      use: { baseURL: RESTFUL_BOOKER_BASE_URL },
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
