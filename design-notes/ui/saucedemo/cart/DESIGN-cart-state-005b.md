# Design Doc: Cart

1. Read the feature

**App:** Saucedemo

**Feature:** Cart

**UI Elements I'm Interacting with:**

- inventory items
  - Add to Cart / Remove button
- cart icon badge

**Test Objectives**

- Add and Remove items to cart under different preconditions
  - cart (is empty, has one item, has multiple items)

2. Create test design

**Test Cases**

`TC-cart-state-005b`: Multiple items + Remove Item [count > 2] => Multiple items

tc1: cart badge assertion

Preconditions

- load inventory page
- add items 1, 2, and 3 to cart
- `assert` starting state
  - `assert` cart badge has text 3

Test

- remove item 1 from cart
- `assert` expected 'Many' state
  - `assert` cart badge has text 2

tc2: inventory button assertion

Preconditions

- load inventory page
- add items 1, 2, and 3 to cart
- `assert` starting state
  - `assert` items 1, 2, and 3 have "Remove" button text

Test

- remove item 1 from cart
- `assert` expected 'Many' state
  - `assert` item 1 has "Add to Cart" button text and items 2 and 3 have "Remove" text

"Many" is tested through the combination of asserting badge text and the number of "Add to Cart" and "Remove" buttons. Cart state cannot be directly observed in a user-facing way, so I decided this is the next best option.

**Assertions**

Preconditions

- empty cart: `expect(cartBadgeLocator).not.toBeAttached()`
- add to cart/remove button text: `expect(buttonLocator).toHaveText(${text})`
- cart badge count: `expect(cartBadgeLocator).toHaveText(${count})`

**Test Groupings**

- add new test to existing `test-describe` block

**Locators**

should be able to use existing locators. come back here if that is not true.

**POM Classes**

- Add multi-add/remove utility functions to `InventoryPage.ts`

**Fixtures**

- No new fixtures, existing one is sufficient
