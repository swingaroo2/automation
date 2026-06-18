# Design Doc: Cart

1. Read the feature

**App:** Saucedemo

**Feature:** Add to Cart

**Interacting with**

- inventory page
  - inventory list
    - add to cart button
  - cart link
  - cart link badge

**Test objectives**

- adding items to cart increments badge once per item
- adding/removing items to cart changes add to button text
- removing one item from cart decrements badge once

2. Create test design

**Test cases**

tc1: add one item to cart

- load inventory page
- assert starting state: empty cart
- add first item in list to cart
- assert text change in add to cart button
- assert cart badge increments to 1

tc2: add two items to cart

- load inventory page
- assert starting state: empty cart
- add first two items in list to cart
- assert text change in add to cart buttons
- assert cart badge increments to 2

tc3: remove item from one-item cart

- load inventory page
- assert starting state: empty cart
- add one item to cart
- assert cart badge increments to 1
- remove one item from cart
- assert text change in add to cart button
- assert cart badge disappears

tc4: remove item from >1-item cart

- load inventory page
- assert starting state: empty cart
- add two items to cart
- assert cart badge increments to 2
- remove one item from cart
- assert text change in add to cart buttons
- assert cart badge decrements to 1

**Assertions**

- empty cart: `expect(cartBadgeLocator).not.toBeAttached()`
- add to cart/remove button text: `expect(buttonLocator).toHaveText(${text})`
- cart badge count: `expect(cartBadgeLocator).toHaveText(${count})`

**Test Groupings**

- one `test-describe` block to hold all four tests. keep it simple.

**Locators**

- get add/remove to cart button: `${productListLocator}.nth(${index})`
- cart link: `locator('[data-test="shopping-cart-link"]')`
- cart link badge: `locator('[data-test="shopping-cart-link"]')`

Note:

- cart link didn't have anything user facing for me to use over the raw locator.
- prefer a single-button locator wrapped in a function that takes an index, over fetching all buttons
- enclosing POM class has productList locator

**POM Classes**

- no new POM classes, just update `InventoryPage.ts`
- encapsulates all locators defined above
- add/remove to cart button is accessed by helper function `getCartButton(index)`
- button actions performed with `addToCart(index)` and `removeFromCart(index)`
- badge count getter `getBadgeCount()` --> we'll see if this is actually needed

**Fixtures**

- no new fixtures, as everything is contained within existing fixture
