import { Locator, Page } from "@playwright/test";

export class BookList {
  private readonly page: Page;
  readonly bookTitleList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.bookTitleList = page.getByRole("table").getByRole("link");
  }

  async goto() {
    await this.page.goto("/books");
  }
}
