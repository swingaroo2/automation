import { test, expect } from "@playwright/test";

/**
 * Test Design
 *
 * Endpoint: /basic_auth
 *
 * Basic Auth: admin/admin
 *
 * Locators
 * - Basic Auth heading: getByRole("heading", { name: "Basic Auth" })
 * - body text: getByText("Congratulations! You must have the proper credentials.")
 *
 * Assertion Routing: Post Auth
 * - await expect(basicAuthHeading).toBeVisible()
 * - await expect(congratsText).toBeVisible()
 */

test.beforeEach(async ({ page }) => {
  await page.goto("/basic_auth");
  await expect(page).toHaveURL("https://the-internet.herokuapp.com/basic_auth");
});

test.use({
  httpCredentials: {
    username: "admin",
    password: "admin",
  },
});

test("TC-basicAuth-001: confirm basic auth performed", async ({ page }) => {
  const basicAuthHeading = page.getByRole("heading", { name: "Basic Auth " });
  const congratsText = page.getByText(
    "Congratulations! You must have the proper credentials.",
  );
  await expect(basicAuthHeading).toBeVisible();
  await expect(congratsText).toBeVisible();
});
