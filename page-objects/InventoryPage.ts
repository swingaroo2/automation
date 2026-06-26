import { Locator, Page } from "@playwright/test";
import { LoginPage } from "./LoginPage";
import { Logins } from "../test-data/enums";

export class InventoryPage {
  private readonly loginPage: LoginPage;

  readonly productSortActiveOption: Locator;
  readonly productSortDropdown: Locator;

  readonly productList: Locator;
  readonly productListNames: Locator;
  readonly productListPrices: Locator;

  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.loginPage = new LoginPage(page);

    this.productSortActiveOption = page.locator(".active_option");
    this.productSortDropdown = page.getByRole("combobox");

    this.productList = page.locator(
      ".inventory_list .inventory_item .inventory_item_description",
    );
    this.productListNames = this.productList.locator(".inventory_item_name");
    this.productListPrices = this.productList.locator(".inventory_item_price");

    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  async goto() {
    await this.loginPage.goto();
    await this.loginPage.performLogin(Logins.StandardUser, Logins.Password);
  }

  async selectProductSortOption(newOption: string) {
    await this.productSortDropdown.selectOption({ label: newOption });
  }

  async getProductNames(): Promise<string[]> {
    return await this.productListNames.allTextContents();
  }

  async getProductPrices(): Promise<string[]> {
    return await this.productListPrices.allTextContents();
  }

  async addToCart(index: number) {
    await this.productList
      .nth(index)
      .getByRole("button", { name: InventoryPage.CartButtonText.AddToCart })
      .click();
  }

  async addToCartMultiple(numberOfItems: number) {
    for (let idx = 0; idx < numberOfItems; idx++) {
      await this.addToCart(idx);
    }
  }

  async removeFromCart(index: number) {
    await this.productList
      .nth(index)
      .getByRole("button", { name: InventoryPage.CartButtonText.Remove })
      .click();
  }

  async removeFromCartMultiple(numberOfItems: number) {
    for (let idx = 0; idx < numberOfItems; idx++) {
      await this.removeFromCart(idx);
    }
  }

  getCartButton(index: number): Locator {
    return this.productList.nth(index).getByRole("button");
  }
}

export namespace InventoryPage {
  export const ProductSortOptions = {
    NameAToZ: "Name (A to Z)",
    NameZToA: "Name (Z to A)",
    PriceHighToLow: "Price (high to low)",
    PriceLowToHigh: "Price (low to high)",
  } as const;

  export const CartButtonText = {
    AddToCart: "Add to cart",
    Remove: "Remove",
  };
}
