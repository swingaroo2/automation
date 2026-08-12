import { expect } from "@playwright/test";
import { test } from "../../helpers/fixtures/demosite/demosite-fixtures";
import testBooks from "../../test-data/demosite/test_books.json";

test("TC-demosite-001: Book count matches the payload", async ({
  bookList,
}) => {
  await expect(bookList.bookTitleList).toHaveCount(testBooks.books.length);
});

test("TC-demosite-002: Book titles match the test payload", async ({
  bookList,
}) => {
  await expect(bookList.bookTitleList).toHaveText(
    testBooks.books.map((x) => x.title),
  );
});
