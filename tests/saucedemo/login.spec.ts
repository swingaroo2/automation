import { expect } from "@playwright/test";
import { test, testUsers } from "../../fixtures/my-fixtures";
import { Pages } from "../../test-data/enums";

test.describe("Login Tests", () => {
  for (const user of testUsers) {
    test(`login -- ${user.partition}`, async ({ loginPage, page }) => {
      await expect(loginPage.usernameField).toBeEmpty();
      await expect(loginPage.passwordField).toBeEmpty();

      await loginPage.fillLoginFields(user.username, user.password);
      await loginPage.clickLoginButton();

      if (user.errorMessage) {
        await expect(loginPage.errorView).toBeVisible();
        await expect(loginPage.errorView).toHaveText(user.errorMessage);
        await expect(page).toHaveURL(Pages.SauceDemoLogin);
      } else {
        await expect(loginPage.errorView).not.toBeVisible();
        await expect(page).toHaveURL(Pages.SauceDemoInventory);
        const expectedTitle = "Products";
        await expect(page.locator(".title")).toHaveText(expectedTitle);
      }
    });
  }
});

/**
 * More tests
 * - navigate to inventory page without logging in
 * - reload/navigate after firing logout request
 */
