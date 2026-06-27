# Design Doc: Cart

1. Read the feature

**App:** Saucedemo

**Feature:** Cart

**UI Elements I'm Interacting with:**

- inventory items
  - Add to Cart / Remove button
- cart icon badge

**Test Objectives**

- Remove 1 item from cart with 2 existing items: many items -> one item [count == 2]

2. Create test design

**Test Cases**

`TC-cart-state-005a`: Multiple items + Remove Item [count == 2] => One item

tc1: cart badge assertion

Preconditions

- load inventory page
- add items 1 and 2 to cart
- `assert` starting state
  - `assert` cart badge has text 2

Test

- remove item 1 from cart
- `assert` expected 'One' state
  - `assert` cart badge has text 1

tc2: inventory button assertion

Preconditions

- load inventory page
- add items 1 and 2 to cart
- `assert` starting state
  - `assert` items 1 and 2 have "Remove" button text

Test

- remove item 1 from cart
- `assert` expected 'One' state
  - `assert` item 1 has "Add to Cart" button text and item 2 has "Remove" text

**Assertions**

- cart badge count: `expect(cartBadgeLocator).toHaveText(${count})`
- add to cart/remove button text: `expect(buttonLocator).toHaveText(${text})`

**Test Groupings**

- add new test to existing `test-describe` block

**Locators**

should be able to use existing locators in `InventoryPage.ts`. come back here if that is not true.

**POM Classes**

- Use existing `InventoryPage.ts`

**Fixtures**

- No new fixtures, existing one is sufficient

**Other**

- Will add new tests to existing spec file. Still relevant to Cart `describe` grouping.
