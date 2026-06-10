
import { test, Page, Locator } from "@playwright/test"
import { Pages } from "../../helpers/enums"

class DropdownListPage {
    private readonly page: Page
    dropdownHeader: Locator
    dropdownList: Locator

    constructor(page: Page) {
        this.page = page
        this.dropdownHeader = page.getByRole('heading', { name: 'Dropdown List' })
        this.dropdownList = page.locator('#dropdown')
    }
}

test('dropdowns', async ({ page }) => {
    await page.goto(`${Pages.TheInternet}dropdown`)
    const dlp = new DropdownListPage(page)

    // the docs seem to recommend selectOption using the internal label ("1" or "2") rather than the element value ("Option 1" or "Option 2")
    // I disagree with this design choice since the former is not user-facing, while the latter is
    // How is selecting by the internal label anything but bad practice?
    await page.locator('#dropdown').selectOption({ label: "Option 1" });
    await page.locator('#dropdown').selectOption({ label: "Option 2" });
})
