import { test, expect } from "@playwright/test";

test.describe("Dynamic Loading 1", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dynamic_loading/1");
    await expect(page).toHaveURL(
      "https://the-internet.herokuapp.com/dynamic_loading/1",
    );
  });

  test("TC-dynamicLoad1-001: click start button + assert dynamic content", async ({
    page,
  }) => {
    const startButton = page.getByRole("button", { name: "Start" });
    const loadingText = page.locator("#loading").getByText("Loading...");
    const progressBar = page.locator("#loading").getByRole("img");
    const helloWorldText = page.getByRole("heading", { name: "Hello World!" });

    await test.step("assert: initial state", async () => {
      await expect(startButton).toBeVisible();
      await expect(loadingText).toBeHidden();
      await expect(progressBar).toBeHidden();
      await expect(helloWorldText).toBeHidden();
    });

    await test.step("click Start button", async () => {
      await startButton.click();
    });

    await test.step("assert: load in-progress state", async () => {
      await expect(startButton).toBeHidden();
      await expect(loadingText).toBeVisible();
      await expect(progressBar).toBeVisible();
      await expect(helloWorldText).toBeHidden();
    });

    await test.step("assert: load completed state", async () => {
      const postLoadTimeout = 10_000;
      await expect(startButton).toBeHidden({ timeout: postLoadTimeout });
      await expect(loadingText).toBeHidden({ timeout: postLoadTimeout });
      await expect(progressBar).toBeHidden({ timeout: postLoadTimeout });
      await expect(helloWorldText).toBeVisible({ timeout: postLoadTimeout });
    });
  });
});
