# DESIGN-mocking-001

**URL pattern**

- Page: `https://demoqa.com/books`
- URL: `https://demoqa.com/BookStore/v1/Books`
- Pattern: '\*\*/Bookstore/v1/Books'

**Stub payload**

```json
{
  "books": [
    {
      "isbn": "9781449325862",
      "title": "Browser? I'm not sure about that one, boss.",
      "subTitle": "A Working Introduction",
      "author": "Richard E. Silverman",
      "publish_date": "2020-06-04T08:48:39.000Z",
      "publisher": "O'Reilly Media",
      "pages": 234,
      "description": "This pocket guide is the perfect on-the-job companion to Git, the distributed version control system. It provides a compact, readable introduction to Git for new users, as well as a reference to common commands and procedures for those of you with Git exp",
      "website": "http://chimera.labs.oreilly.com/books/1230000000561/index.html"
    },
    {
      "isbn": "9781449331818",
      "title": "Mobile is Cringe",
      "subTitle": "A JavaScript and jQuery Developer's Guide",
      "author": "Addy Osmani",
      "publish_date": "2020-06-04T09:11:40.000Z",
      "publisher": "O'Reilly Media",
      "pages": 254,
      "description": "With Learning JavaScript Design Patterns, you'll learn how to write beautiful, structured, and maintainable JavaScript by applying classical and modern design patterns to the language. If you want to keep your code efficient, more manageable, and up-to-da",
      "website": "http://www.addyosmani.com/resources/essentialjsdesignpatterns/book/"
    },
    {
      "isbn": "9781449337711",
      "title": "Sorry, can you repeat that?",
      "subTitle": "Harnessing the Power of the Web",
      "author": "Glenn Block et al.",
      "publish_date": "2020-06-04T09:12:43.000Z",
      "publisher": "O'Reilly Media",
      "pages": 238,
      "description": "Design and build Web APIs for a broad range of clients—including browsers and mobile devices—that can adapt to change over time. This practical, hands-on guide takes you through the theory and tools you need to build evolvable HTTP services with Microsoft",
      "website": "http://chimera.labs.oreilly.com/books/1234000001708/index.html"
    }
  ]
}
```

**Assertions (what and how)**

- `TC-demosite-001`: number of books in list `equals` the number of books in the test payload (is payload successfully injected?)
- `TC-demosite-002`: title of each book `equals` title of each book in payload (do the modifications made in the payload hold?)

**Locators**

- Number of cells: `getByRole("table").getByRole("link").count()`
- Book titles: `getByRole("table").getByRole("link")`

**POM vs spec ownership**

POM owns

- locators (see above)
- helpers
  - getBookList(): string[] // [book titles]

spec ownership

- tests
  - number of books matches test payload
  - for each book: title matches respective title in test payload
- logic performed on returned data from helpers

fixture owns

- seeding the book list with test payload
  - calls `page.route` to intercept `Books` endpoint
  - calls `fulfill` to inject test payload
  - test setup should be independent of POM since page should not know how the tests want to use it
- NOTE: install book list route before calling `goto` helper

**File layout**

- POM: `automation/helpers/page-objects/demosite/BookList.ts`
- spec: `automation/tests/demosite/bookList.spec.ts`
- fixture: `automation/helpers/fixtures/demosite-fixtures.ts`
