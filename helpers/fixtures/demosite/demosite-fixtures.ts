import base from "@playwright/test";
import { BookList } from "../../page-objects/demosite/BookList";
import testBooks from "../../../test-data/demosite/test_books.json";

type DemoSiteFixtures = {
  bookList: BookList;
};

export const test = base.extend<DemoSiteFixtures>({
  bookList: async ({ page }, use) => {
    const bookList = new BookList(page);

    await page.route("**/BookStore/v1/Books", async (route) => {
      await route.fulfill({ json: testBooks });
    });

    await bookList.goto();
    await use(bookList);
  },
});
