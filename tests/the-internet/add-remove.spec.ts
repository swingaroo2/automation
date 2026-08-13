import { test, expect } from "@playwright/test";

/**
 * Test Design
 *
 * Locators
 * - Add Element: page.getByRole('button', { name: 'Add Element' })
 * - Delete: page.getByRole('button', { name: 'Delete' })
 *      deleteButtons.first() for the click location
 *
 * User Routing: Initial State
 * - await expect(deleteButtons).toHaveCount(0)
 * - await expect(addElementButton).toBeVisible()
 *
 * User Routing: Click(s)
 * - in loop on clickCounts (1..<clickCounts)
 *  - await addElementButton.click()
 *      - await expect(await deleteButtons).toHaveCount(n)
 * - second loop to click delete
 *  - await deleteButtons.first().click()
 *
 *
 * User Routing: End State
 * - await expect(deleteButtons).toHaveCount(0)
 */

test.beforeEach(async ({ page }) => {
  await page.goto("/add_remove_elements/");
  await expect(page).toHaveURL(
    "https://the-internet.herokuapp.com/add_remove_elements/",
  );
});

test("TC-addRemove-001: click Add Element a random number of times", async ({
  page,
}) => {
  const clickCount = randomInt(1, 5);
  const addRemoveElementsHeading = page.getByRole("heading", {
    name: "Add/Remove Elements",
  });
  const addElementButton = page.getByRole("button", {
    name: "Add Element",
  });
  const deleteButtons = page.getByRole("button", { name: "Delete" });

  await test.step("assert: initial state", async () => {
    await expect(addRemoveElementsHeading).toBeVisible();
    await expect(addElementButton).toBeVisible();
    await expect(deleteButtons).toHaveCount(0);
  });

  await test.step(`click Add Element ${clickCount} times`, async () => {
    for (var i = 1; i <= clickCount; i++) {
      await addElementButton.click();
      await expect(deleteButtons).toHaveCount(i);
    }
  });

  await test.step(`click Delete ${clickCount} times`, async () => {
    for (var i = 1; i <= clickCount; i++) {
      await deleteButtons.first().click();
      await expect(deleteButtons).toHaveCount(clickCount - i);
    }
  });

  await test.step("assert: end state", async () => {
    await expect(deleteButtons).toHaveCount(0);
  });
});

// Helper functions
function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
