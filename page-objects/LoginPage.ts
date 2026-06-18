import { Page, Locator } from "@playwright/test";
import { Pages } from "../test-data/enums";

export class LoginPage {
  private readonly page: Page;
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;
  readonly errorView: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameField = page.getByRole("textbox", { name: "Username" });
    this.passwordField = page.getByRole("textbox", { name: "Password" });
    this.loginButton = page.getByRole("button", { name: "Login" });
    this.errorView = page
      .getByRole("heading")
      .filter({ hasText: "Epic sadface" });
  }

  async goto() {
    await this.page.goto(Pages.SauceDemoLogin);
  }

  async fillLoginFields(username: string = "", password: string = "") {
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
  }

  async clickLoginButton() {
    await this.loginButton.click();
  }

  async performLogin(username: string = "", password: string = "") {
    await this.fillLoginFields(username, password);
    await this.clickLoginButton();
  }
}
