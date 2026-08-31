import { test as setup, expect, type TestInfo } from "@playwright/test";
import { LoginPage } from "../../helpers/page-objects/saucedemo/LoginPage";
import { validTestUser } from "../../helpers/fixtures/saucedemo/saucedemo-fixtures";

function getStorageStatePath(testInfo: TestInfo) {
  if (testInfo.project.name === "saucedemo-setup-chromium") {
    return ".auth/saucedemo-chromium.json";
  }

  if (testInfo.project.name === "saucedemo-setup-firefox") {
    return ".auth/saucedemo-firefox.json";
  }

  return ".auth/saucedemo-webkit.json";
}

setup("saucedemo auth setup", async ({ page }, testInfo) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.performLogin(validTestUser.username, validTestUser.password);

  await expect(page).toHaveURL(/inventory\.html/);
  await page.context().storageState({ path: getStorageStatePath(testInfo) });
});
