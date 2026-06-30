import { test, expect } from "@playwright/test";
import { Pages } from "../../test-data/enums";

test("checkboxes: end with both checked", async ({ page }) => {
  await page.goto(`${Pages.TheInternet}checkboxes`);
  const cb1 = page.getByRole("checkbox").first();
  const cb2 = page.getByRole("checkbox").nth(1);

  // Note: best practice to assert a known default state before performing the meat of the test
  await expect(cb1).not.toBeChecked();
  await expect(cb2).toBeChecked();

  await cb1.check();
  await cb2.check();

  await expect(cb1).toBeChecked();
  await expect(cb2).toBeChecked();
});
