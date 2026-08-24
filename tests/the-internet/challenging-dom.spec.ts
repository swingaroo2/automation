import { test, expect, Page, Locator } from "@playwright/test";

/**
 * Test Design
 *
 * What to test
 * - "button" identity and text
 * - table columns and rows
 * - click events on edit and delete links
 * - canvas text (is this even possible??)
 *
 * NOTE: this one merits a page object IMO
 *
 * Locators: Button links
 * - page.getByRole("link", { name: "qux", exact: true })
 * - page.getByRole("link", { name: "foo", exact: true })
 * - page.getByRole("link", { name: 'baz', exact: true })
 *
 * Locators: table + headers + columns + rows
 * - table: page.getByRole("table")
 * - column headers: page.getByRole("columnheader")
 * - column x:
 */

class ChallengingDomPage {
  private readonly page: Page;

  readonly button: Locator;
  readonly alertButton: Locator;
  readonly successButton: Locator;
  private readonly table: Locator;
  readonly canvas: Locator;

  constructor(page: Page) {
    this.page = page;
    this.button = page.locator('[class="button"]');
    this.alertButton = page.locator('[class="button alert"]');
    this.successButton = page.locator('[class="button success"]');
    this.table = page.getByRole("table");
    this.canvas = page.locator("canvas");
  }

  async goto() {
    await this.page.goto("/challenging_dom");
  }

  async clickButton() {
    await this.button.click();
  }

  async clickAlertButton() {
    await this.alertButton.click();
  }

  async clickSuccessButton() {
    await this.successButton.click();
  }

  getTableColumnHeaders() {
    return this.table.getByRole("columnheader");
  }

  getTableColumn(columnNumber: number) {
    return this.table.locator(`tbody tr td:nth-child(${columnNumber})`);
  }

  getAllTableRows(excludeHeaderRow: boolean = false) {
    return excludeHeaderRow
      ? this.table.locator(`tbody tr`)
      : this.table.getByRole("row");
  }
}

test.beforeEach(async ({ page }) => {
  // Occasionally, tests against this page return a 500 before the corresponding test ever starts
  // This block captures those errors. In a workplace environment, I'd have access to the ear of the
  // people who built the page.
  page.on("response", async (response) => {
    if (response.status() >= 500) {
      console.log(response.status(), response.url());
    }
  });

  await new ChallengingDomPage(page).goto();
});

test('TC-challengingDOM-001: click the "buttons"', async ({ page }) => {
  const pom = new ChallengingDomPage(page);

  await expect(pom.button).toBeVisible();
  await expect(pom.alertButton).toBeVisible();
  await expect(pom.successButton).toBeVisible();

  await pom.clickButton();
  await pom.clickAlertButton();
  await pom.clickSuccessButton();
});

test("TC-challengingDOM-002: validate text columns", async ({ page }) => {
  const pom = new ChallengingDomPage(page);
  const rows = pom.getAllTableRows();
  const columnHeaders = pom.getTableColumnHeaders();

  await expect(columnHeaders).toHaveCount(7);
  await expect(columnHeaders).toHaveText([
    "Lorem",
    "Ipsum",
    "Dolor",
    "Sit",
    "Amet",
    "Diceret",
    "Action",
  ]);
  await expect(rows).toHaveCount(11);

  const expectedColumns = [
    "Iuvaret",
    "Apeirian",
    "Adipisci",
    "Definiebas",
    "Consequuntur",
    "Phaedrum",
  ];
  for (const [index, prefix] of expectedColumns.entries()) {
    await expect(pom.getTableColumn(index + 1)).toHaveText(
      Array.from({ length: 10 }, (_, row) => `${prefix}${row}`),
    );
  }
});

test("TC-challengingDOM-003: validate action column", async ({ page }) => {
  const pom = new ChallengingDomPage(page);
  const columnCount = (await pom.getTableColumnHeaders().all()).length;
  const actionColumn = pom.getTableColumn(columnCount);
  for (
    let rowIdx = 0;
    rowIdx < (await pom.getAllTableRows(true).count());
    rowIdx++
  ) {
    let actionRow = actionColumn.nth(rowIdx);

    const editLink = actionRow.getByRole("link", { name: "edit" });
    const deleteLink = actionRow.getByRole("link", { name: "delete" });

    await editLink.click();
    await deleteLink.click();

    await expect(editLink).toBeVisible();
    await expect(deleteLink).toBeVisible();
  }
});

test("TC-challengingDOM-004: canvas is rendered", async ({ page }) => {
  const canvas = page.locator("canvas");

  await expect(canvas).toBeVisible();

  const hasPixels = await canvas.evaluate((element) => {
    const canvas = element as HTMLCanvasElement;
    const context = canvas.getContext("2d");

    if (!context) return false;

    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;

    return pixels.some((value) => value !== 0);
  });

  expect(hasPixels).toBe(true);
});
