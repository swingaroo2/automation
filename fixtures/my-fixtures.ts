import base from "@playwright/test";
import { LoginPage } from "../page-objects/LoginPage";
import * as fs from "fs";

type TestUser = {
  partition: string;
  username: string;
  password: string;
  errorMessage: string;
};

type MyFixtures = {
  loginPage: LoginPage;
  testUsers: TestUser[];
};

const testUsersFilePath = "automation/test-data/test_users.json";
export const testUsers = JSON.parse(
  fs.readFileSync(testUsersFilePath, "utf-8"),
) as TestUser[];

export const test = base.extend<MyFixtures>({
  testUsers: async ({}, use) => {
    await use(testUsers);
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },
});
