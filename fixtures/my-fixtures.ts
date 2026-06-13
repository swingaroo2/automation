import base from "@playwright/test";
import { LoginPage } from "../page-objects/LoginPage";
import testUsersRaw from "../test-data/test_users.json";

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

export const testUsers = JSON.parse(JSON.stringify(testUsersRaw)) as TestUser[];

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
