/**
 * Login Tests
 * - valid login test
 * - both fields empty test
 */

import { test, expect, Page, Locator } from "@playwright/test"
import { Pages } from "../helpers/enums"

enum TestData {
    ValidUsername = 'standard_user',
    ValidPassword = 'secret_sauce'
}

/**
 * I wrote this for practice with implementing POM. 
 * In reality, a small test file like this doesn't need a dedicated object modeling the login page
 */
class LoginPage {
    private readonly page: Page
    usernameField: Locator
    passwordField: Locator
    loginButton: Locator
    errorView: Locator

    constructor(page: Page) {
        this.page = page
        this.usernameField = page.getByRole('textbox', { name: "Username" })
        this.passwordField = page.getByRole('textbox', { name: "Password" })
        this.loginButton = page.getByRole('button', { name: "Login" })
        this.errorView = page.getByRole('heading').filter({ hasText: "Epic sadface" })
    }
}

test.beforeEach(async ({ page }) => {
    await page.goto(Pages.SauceDemo)
})

// partition 1
test('valid username + valid password', async ({ page }) => {
    const lp = new LoginPage(page)
    const productsPageLabel = page.locator('[data-test="title"]')

    await lp.usernameField.fill(TestData.ValidUsername)
    expect(lp.usernameField).toHaveValue(TestData.ValidUsername)

    await lp.passwordField.fill(TestData.ValidPassword)
    expect(lp.passwordField).toHaveValue(TestData.ValidPassword)

    await lp.loginButton.click()
    expect(productsPageLabel).toHaveText("Products")
})

// partition 4
test('empty username + empty password', async ({ page }) => {
    const lp = new LoginPage(page)
    await lp.loginButton.click()
    expect(lp.errorView).toHaveText('Epic sadface: Username is required')
})

