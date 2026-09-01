import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/exit_intent");
  await expect(page).toHaveURL(
    "https://the-internet.herokuapp.com/exit_intent",
  );
});

test("TC-exitIntent-001: show modal, close modal", async ({ page }) => {
  const exitIntentHeading = page.getByRole("heading", { name: "Exit Intent" });
  const bodyText = page.getByText(
    "Mouse out of the viewport pane and see a modal window appear.",
    { exact: true },
  );
  const modal = page.locator(".modal");
  const modalHeading = modal.getByRole("heading", {
    name: "This is a modal window",
  });
  const modalBodyText = modal.getByText(
    "It's commonly used to encourage a user to take an action (e.g., give their e-mail address to sign up for something).",
    { exact: true },
  );
  const modalCloseText = modal.getByText("Close");

  await test.step("assert starting state", async () => {
    await expect(exitIntentHeading).toBeVisible();
    await expect(bodyText).toBeVisible();
    await expect(modal).toBeHidden();
  });

  await test.step("move mouse to show modal and assert modal content visibility", async () => {
    await page.locator("html").dispatchEvent("mouseleave", { clientY: 0 });
    await expect(modal).toBeVisible();
    await expect(modalHeading).toBeVisible();
    await expect(modalBodyText).toBeVisible();
    await expect(modalCloseText).toBeVisible();
  });

  await test.step("close modal, assert modal hidden", async () => {
    await modalCloseText.click();
    await expect(modal).toBeHidden();
  });
});
