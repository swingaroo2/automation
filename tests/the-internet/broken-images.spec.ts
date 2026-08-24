/**
 * Broken Images
 *
 * Endpoints
 * - /broken_images (page)
 * - ** /asdf.jpg (broken image 1)
 * - ** /hjkl.jpg (broken image 2)
 * - ** /img/avatar-blank.jpg (healthy image)
 *
 * Locators
 * - brokenImagesHeading: page.getByRole("heading", { name: "Broken Images" })
 * - images: ${image container}.getByRole("img")
 * - NOTE: use image container to scope out "Fork me on Github"
 *
 * Assertions (loose code)
 * =============
 *
 * API Testing
 * - expect(asdfResponse.status()).toBe(APIStatus.HTTP404)
 * - expect(hjklResponse.status()).toBe(APIStatus.HTTP404)
 * - expect(avatarBlankResponse.status()).toBe(APIStatus.HTTP200)
 *
 * Image UI Validation
 * - await expect(brokenImagesHeading).toBeVisible()
 * - await expect()
 */

import { test, expect } from "@playwright/test";
import { APIStatus } from "../../test-data/restful-booker/status";

test("TC-brokenImages-001: Validate image fetch API", async ({ page }) => {
  const asdfResponse = page.waitForResponse("**/asdf.jpg");
  const hjklResponse = page.waitForResponse("**/hjkl.jpg");
  const avatarBlankResponse = page.waitForResponse("**/img/avatar-blank.jpg");
  await page.goto("/broken_images");

  expect((await asdfResponse).status()).toBe(APIStatus.HTTP404);
  expect((await hjklResponse).status()).toBe(APIStatus.HTTP404);
  expect((await avatarBlankResponse).status()).toBe(APIStatus.HTTP200);

  await expect(page).toHaveURL(
    "https://the-internet.herokuapp.com/broken_images",
  );
});

test("TC-brokenImages-002: Validate images are visible on page", async ({
  page,
}) => {
  await page.goto("/broken_images");
  await expect(page).toHaveURL(
    "https://the-internet.herokuapp.com/broken_images",
  );

  const brokenImagesHeader = page.getByRole("heading", {
    name: "Broken Images",
  });

  const images = page.locator("#content div").getByRole("img");
  await expect(brokenImagesHeader).toBeVisible();
  await expect(images).toHaveCount(3);
});
