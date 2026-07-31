import base from "@playwright/test";
import { LoginPage } from "../../page-objects/saucedemo/LoginPage";
import { InventoryPage } from "../../page-objects/saucedemo/InventoryPage";
import * as fs from "fs";
import * as path from "path";

type TestUser = {
  partition: string;
  username: string;
  password: string;
  errorMessage: string;
};

type SauceDemoFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
};

const testUsersFilePath = path.join(
  __dirname,
  "../../../test-data/saucedemo/test_users.json",
);
export const testUsers = JSON.parse(
  fs.readFileSync(testUsersFilePath, "utf-8"),
) as TestUser[];

export const test = base.extend<SauceDemoFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },

  inventoryPage: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.goto();
    await use(inventoryPage);
  },
});
