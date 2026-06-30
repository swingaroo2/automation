import base from "@playwright/test";
import { LoginPage } from "../page-objects/LoginPage";
import { InventoryPage } from "../page-objects/InventoryPage";
import * as fs from "fs";
import * as path from "path";

type TestUser = {
  partition: string;
  username: string;
  password: string;
  errorMessage: string;
};

type MyFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
};

// Note: readFileSync resolves relative paths from CWD at runetime
// Note: modules imported at collection time need to be error free for tests to be successfully collected
const testUsersFilePath = path.join(
  __dirname,
  "../../test-data/test_users.json",
);
export const testUsers = JSON.parse(
  fs.readFileSync(testUsersFilePath, "utf-8"),
) as TestUser[];

export const test = base.extend<MyFixtures>({
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
