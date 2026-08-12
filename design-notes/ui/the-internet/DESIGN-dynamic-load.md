# DESIGN-dynamic-load.md

**Project:** the-internet
**Location**

- design note: `/automation/design-notes`
- spec file: `/automation/tests/the-internet/dynamic-load.spec.ts`

## Locators + Assertions

Note: all post-loading assertions set a 10 second timeout

**Start button**

- `page.getByRole("button", { name: "Start" })`
- action: `.click()`
- assertions
  - before click: `await expect(locator).toBeVisible()`
  - after click (while loading): `await expect(locator).toBeHidden()`
  - after click (after loading): `await expect(locator).toBeHidden()`

**Loading... text**

- `page.locator('#loading').getByText("Loading...")`
- dynamic, starts hidden, appears on button click, hides after 5s
- assertions
  - before click: `await expect(locator).toBeHidden()`
  - after click (while loading): `await expect(locator).toBeVisible()`
  - after click (after loading): `await expect(locator).toBeHidden()`

**Progress bar image**

- `page.locator('#loading').getByRole('img')`
- dynamic, starts hidden, appears on button click, hides after 5s
- assertions
  - before click: `await expect(locator).toBeHidden()`
  - after click (while loading): `await expect(locator).toBeVisible()`
  - after click (after loading): `await expect(locator).toBeHidden()`

**Hello World! text**

- `page.getByRole('heading', { name: 'Hello World!' })`
- dynamic, shows after loading text/progress bar image disappear after 5s
- assertions
  - before click: `await expect(locator).toBeHidden()`
  - after click (while loading): `await expect(locator).toBeHidden()`
  - after click (after loading): `await expect(locator).toBeVisible()`

## User Journey/Assertion Routing

### Initial State

- Start button: `await expect(locator).toBeVisible()`
- Loading... text: `await expect(locator).toBeHidden()`
- Progress bar: `await expect(locator).toBeHidden()`
- Hello World!: `await expect(locator).toBeHidden()`

**Click:** `await expect(locator).toBeVisible().click()`

### During Load

- Start button: `await expect(locator).toBeHidden()`
- Loading... text: `await expect(locator).toBeVisible()`
- Progress bar: `await expect(locator).toBeVisible()`
- Hello World!: `await expect(locator).toBeHidden()`

### After Load

- Start button: `await expect(locator).toBeHidden()`
- Loading... text: `await expect(locator).toBeHidden()`
- Progress bar: `await expect(locator).toBeHidden()`
- Hello World!: `await expect(locator).toBeVisible()`

## Test Data

None

## Refinement Notes

1. The named example is _Example 1: Element on page that is hidden_. Hidden elements exist in the DOM, but are not visible. `toHaveText()` will match hidden locators as it checks the DOM rather than visually scanning the page like a user. Furthermore, this assertion isn't designed to check visibility, it's designed to check text, which doesn't suit a visibility test. To assert visibility, favor `toBeVisible()` or `toBeHidden()` as more precise and accurate options to verify an element was revealed or hidden.

2. UI tests map out user journeys, which include visually observing non-clickable UI elements like loading bars. On principle, the loading indicator should be tested with visibility/hidden assertions (see Locators + Assertions section for assertion details, not gonna re-write them here).

3. The timeout widens for any post-loading assertions. The loading container is hardcoded to show for the same 5s length as the default Playwright assertion timeout. Assertion timeouts are independent of each other, which leads to a timeout race. Widening post-loading assertions prevents this race.
