import { Locator, Page, test, expect } from "@playwright/test"
import { Pages } from "../../helpers/enums"

// class CheckboxesPage {
//     private readonly page: Page
//     checkboxesHeader: Locator

//     // I'm wary to create properties for all checkboxes, since there could potentially be many, or a dynamic number of them
//     // I think it's cleaner to not include a POM for this page
//     checkboxesForm: Locator

//     constructor(page: Page) {
//         this.page = page
//         this.checkboxesHeader = page.getByRole('heading', { name: 'Checkboxes' })
//         this.checkboxesForm = page.getByRole('form')
//     }
// }

test('checkboxes: end with both checked', async ({ page }) => {
    await page.goto(`${Pages.TheInternet}checkboxes`)
    const cb1 = page.getByRole('checkbox').first()
    const cb2 = page.getByRole('checkbox').nth(1)
    const isCb1Checked = await cb1.isChecked()
    const isCb2Checked = await cb2.isChecked()

    await expect(cb1).not.toBeChecked()
    await expect(cb2).toBeChecked()   
    
    await cb1.check()
    await cb2.check()

    await expect(cb1).toBeChecked()
    await expect(cb2).toBeChecked()
})