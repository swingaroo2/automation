import { test, expect } from "@playwright/test";

/**
 * Locators
 * - modal: page.locator("#modal")
 *      - heading: modalLocator.getByRole("heading", { name: "This is a modal window" })
 *      - body: modalLocator.getByRole("paragraph", { name: "It's commonly used to encourage a user to take an action (e.g., give their e-mail address to sign up for something or disable their ad blocker)." })
 *      - closed: modalLocator.getByRole("paragraph", { name: "Close" })
 * - page header: page.getByRole("heading", { name: "..."})
 * - text: page.getByRole("paragraph", { name: "..." })
 * - link: page.getByRole("link", { name: "click here" })
 *
 * User Journey
 * - nav to entry_ad page
 * - assert modal and text locators are visible
 * - click "Close"
 * - assert modal is not visible
 * - assert main page locator visibility
 * - click link (ideally clear cookies if possible)
 * - click heading main page locator (should also dismiss modal)
 * - re-assert main page locator visibility
 *
 * Note:
 * - is it possible to clear cookies and site data programmatically from browserContext?
 * - this is an html modal, not a browser dialog. can't use page.on("dialog")
 */

test.beforeEach(async ({ page }) => {
  await page.goto("/entry_ad");
  await expect(page).toHaveURL("https://the-internet.herokuapp.com/entry_ad");
});

test("TC-entryAd-001: read, dismiss, and re-enable ad modal", async ({
  page,
}) => {
  const modal = page.locator(".modal");
  const modalHeading = modal.getByRole("heading", {
    name: "THIS IS A MODAL WINDOW",
  });
  const modalBody = modal.getByText(
    "It's commonly used to encourage a user to take an action",
  );
  const closeModal = modal.getByText("Close", { exact: true });

  const pageHeading = page.getByRole("heading", { name: "Entry Ad" });
  const pageText = page.getByText("Displays an ad on page load.", {
    exact: true,
  });
  const subsequentPageLoadText = page.getByText(
    "If closed, it will not appear on subsequent page loads.",
    { exact: true },
  );
  const reEnableAdLink = page.getByRole("link", { name: "click here" });
  const reEnableAdText = page.locator("p").filter({
    has: reEnableAdLink,
  });

  await test.step("assert modal content", async () => {
    await expect(modal).toBeVisible();
    await expect(modalHeading).toBeVisible();
    await expect(modalBody).toBeVisible();
    await expect(closeModal).toBeVisible();
  });

  await test.step("dismiss modal and assert page content", async () => {
    await closeModal.click();

    await expect(modal).toBeHidden();
    await expect(pageHeading).toBeVisible();
    await expect(pageText).toBeVisible();
    await expect(subsequentPageLoadText).toBeVisible();
    await expect(reEnableAdText).toBeVisible();
    await expect(reEnableAdText).toContainText("To re-enable it, click here.");
    await expect(reEnableAdLink).toBeVisible();
  });

  await test.step("re-enable and dismiss modal by clicking outside", async () => {
    await reEnableAdLink.click();
    await page.reload();
    await expect(modal).toBeVisible();

    const pageHeadingBox = await pageHeading.boundingBox();
    if (!pageHeadingBox) {
      throw new Error(
        "Entry Ad heading is not available for an outside click.",
      );
    }

    await page.mouse.click(
      pageHeadingBox.x + pageHeadingBox.width / 2,
      pageHeadingBox.y + pageHeadingBox.height / 2,
    );

    await expect(modal).toBeHidden();
    await expect(pageHeading).toBeVisible();
  });
});
