import { expect } from "@playwright/test";
import { test } from "../../fixtures/my-fixtures";
import { InventoryPage } from "../../page-objects/InventoryPage";

test.describe("Product Sort", () => {
  test("sort by name", async ({ inventoryPage }) => {
    await test.step("validate default state", async () => {
      await expect(inventoryPage.productSortActiveOption).toHaveText(
        InventoryPage.ProductSortOptions.NameAToZ,
      );
    });

    const nameSorts = Object.values([
      InventoryPage.ProductSortOptions.NameAToZ,
      InventoryPage.ProductSortOptions.NameZToA,
    ]);

    for (const sortOption of nameSorts) {
      await test.step(`perform + validate sort: ${sortOption}`, async () => {
        await inventoryPage.selectProductSortOption(sortOption);
        const namesActual = await inventoryPage.getProductNames();
        const namesExpected = [...namesActual].sort();
        if (sortOption === InventoryPage.ProductSortOptions.NameZToA) {
          namesExpected.reverse();
        }
        expect(namesActual).toEqual(namesExpected);
      });
    }
  });

  test("sort by price", async ({ inventoryPage }) => {
    await test.step("validate default state", async () => {
      await expect(inventoryPage.productSortActiveOption).toHaveText(
        InventoryPage.ProductSortOptions.NameAToZ,
      );
    });

    const priceSorts = Object.values([
      InventoryPage.ProductSortOptions.PriceHighToLow,
      InventoryPage.ProductSortOptions.PriceLowToHigh,
    ]);

    for (const sortOption of priceSorts) {
      await test.step(`perform + validate sort: ${sortOption}`, async () => {
        await inventoryPage.selectProductSortOption(sortOption);
        const pricesActual = await inventoryPage.getProductPrices();
        const pricesNoDollar = pricesActual.map((value: string) =>
          Number(value.substring(1)),
        );
        const pricesExpected = [...pricesNoDollar].sort((a, b) => a - b);
        if (sortOption === InventoryPage.ProductSortOptions.PriceHighToLow) {
          pricesExpected.reverse();
        }
        const pricesExpectedFinal = pricesExpected.map(
          (value: number) => `$${value}`,
        );
        expect(pricesActual).toEqual(pricesExpectedFinal);
      });
    }
  });
});

test.describe("Cart", () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await test.step("assert starting state: empty cart", async () => {
      await expect(inventoryPage.cartBadge).not.toBeAttached();
    });
  });

  test("one item added to empty cart", async ({ inventoryPage }) => {
    await test.step("add first inventory item to cart", async () => {
      const index = 0;
      await inventoryPage.addToCart(index);
      await expect(inventoryPage.getCartButton(index)).toHaveText(
        InventoryPage.CartButtonText.Remove,
      );
      await expect(inventoryPage.cartBadge).toHaveText("1");
    });
  });

  test("add two items to empty cart", async ({ inventoryPage }) => {
    await test.step("add first two inventory items to cart", async () => {
      const index = 0;
      const index2 = 1;
      await inventoryPage.addToCartMultiple(2);
      await expect(inventoryPage.getCartButton(index)).toHaveText(
        InventoryPage.CartButtonText.Remove,
      );
      await expect(inventoryPage.getCartButton(index2)).toHaveText(
        InventoryPage.CartButtonText.Remove,
      );
      await expect(inventoryPage.cartBadge).toHaveText("2");
    });
  });

  test("remove one added item from cart", async ({ inventoryPage }) => {
    const index = 0;

    await test.step("add first inventory item to cart", async () => {
      await inventoryPage.addToCart(index);
      await expect(inventoryPage.getCartButton(index)).toHaveText(
        InventoryPage.CartButtonText.Remove,
      );
      await expect(inventoryPage.cartBadge).toHaveText("1");
    });

    await test.step("remove first inventory item from cart", async () => {
      await inventoryPage.removeFromCart(index);
      await expect(inventoryPage.getCartButton(index)).toHaveText(
        InventoryPage.CartButtonText.AddToCart,
      );
      await expect(inventoryPage.cartBadge).not.toBeAttached();
    });
  });

  test("remove two added items from cart", async ({ inventoryPage }) => {
    const index = 0;
    const index2 = 1;

    await test.step("add first two inventory items to cart", async () => {
      await inventoryPage.addToCartMultiple(2);
      await expect(inventoryPage.getCartButton(index)).toHaveText(
        InventoryPage.CartButtonText.Remove,
      );
      await expect(inventoryPage.getCartButton(index2)).toHaveText(
        InventoryPage.CartButtonText.Remove,
      );
      await expect(inventoryPage.cartBadge).toHaveText("2");
    });

    await test.step("remove first two inventory items from cart", async () => {
      await inventoryPage.removeFromCartMultiple(2);
      await expect(inventoryPage.getCartButton(index)).toHaveText(
        InventoryPage.CartButtonText.AddToCart,
      );
      await expect(inventoryPage.getCartButton(index2)).toHaveText(
        InventoryPage.CartButtonText.AddToCart,
      );
      await expect(inventoryPage.cartBadge).not.toBeAttached();
    });
  });

  test("remove item from cart with multiple existing items: cart badge assertion", async ({
    inventoryPage,
  }) => {
    const numExistingItems = 3;

    await test.step("preconditions: add three items to cart", async () => {
      await inventoryPage.addToCartMultiple(numExistingItems);
      await expect(inventoryPage.cartBadge).toHaveText(`${numExistingItems}`);
    });

    await test.step("remove one item from three-item cart", async () => {
      await inventoryPage.removeFromCart(0);
      await expect(inventoryPage.cartBadge).toHaveText(
        `${numExistingItems - 1}`,
      );
    });
  });

  test("remove item from cart with multiple existing items: inventory button assertion", async ({
    inventoryPage,
  }) => {
    const numExistingItems = 3;

    await test.step("preconditions: add three items to cart", async () => {
      await inventoryPage.addToCartMultiple(numExistingItems);

      for (let idx = 0; idx < numExistingItems; idx++) {
        await expect(inventoryPage.getCartButton(idx)).toHaveText(
          InventoryPage.CartButtonText.Remove,
        );
      }
    });

    await test.step("remove one item from three-item cart", async () => {
      await inventoryPage.removeFromCart(0);
      await expect(inventoryPage.getCartButton(0)).toHaveText(
        InventoryPage.CartButtonText.AddToCart,
      );
      await expect(inventoryPage.getCartButton(1)).toHaveText(
        InventoryPage.CartButtonText.Remove,
      );
      await expect(inventoryPage.getCartButton(2)).toHaveText(
        InventoryPage.CartButtonText.Remove,
      );
    });
  });
});
