import { expect } from "@playwright/test";
import { test } from "../../helpers/fixtures/my-fixtures";
import { InventoryPage } from "../../helpers/page-objects/InventoryPage";

test.describe("Product Sort", () => {
  test("sort by name", async ({ inventoryPage }) => {
    await test.step("validate default state", async () => {
      await expect(inventoryPage.productSortActiveOption).toHaveText(
        InventoryPage.ProductSortOptions.NameAToZ,
      );
    });

    const nameSortOptions = [
      InventoryPage.ProductSortOptions.NameAToZ,
      InventoryPage.ProductSortOptions.NameZToA,
    ];

    for (const sortOption of nameSortOptions) {
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

    const priceSortOptions = [
      InventoryPage.ProductSortOptions.PriceHighToLow,
      InventoryPage.ProductSortOptions.PriceLowToHigh,
    ];

    for (const sortOption of priceSortOptions) {
      await test.step(`perform + validate sort: ${sortOption}`, async () => {
        await inventoryPage.selectProductSortOption(sortOption);
        const pricesActual = await inventoryPage.getProductPrices();
        const pricesWithoutDollar = pricesActual.map((value) =>
          Number(value.substring(1)),
        );
        const pricesExpected = [...pricesWithoutDollar].sort((a, b) => a - b);
        if (sortOption === InventoryPage.ProductSortOptions.PriceHighToLow) {
          pricesExpected.reverse();
        }
        const pricesExpectedFinal = pricesExpected.map((value) => `$${value}`);
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

  test("1 item added to empty cart", async ({ inventoryPage }) => {
    await test.step("add first inventory item to cart", async () => {
      const firstItemIndex = 0;
      await inventoryPage.addToCart(firstItemIndex);
      await expect(inventoryPage.getCartButton(firstItemIndex)).toHaveText(
        InventoryPage.CartButtonText.Remove,
      );
      await expect(inventoryPage.cartBadge).toHaveText("1");
    });
  });

  test("add 2 items to empty cart", async ({ inventoryPage }) => {
    await test.step("add first two inventory items to cart", async () => {
      const firstItemIndex = 0;
      const secondItemIndex = 1;
      await inventoryPage.addToCartMultiple(2);
      await expect(inventoryPage.getCartButton(firstItemIndex)).toHaveText(
        InventoryPage.CartButtonText.Remove,
      );
      await expect(inventoryPage.getCartButton(secondItemIndex)).toHaveText(
        InventoryPage.CartButtonText.Remove,
      );
      await expect(inventoryPage.cartBadge).toHaveText("2");
    });
  });

  test("remove 1 added item from cart", async ({ inventoryPage }) => {
    const firstItemIndex = 0;

    await test.step("add first inventory item to cart", async () => {
      await inventoryPage.addToCart(firstItemIndex);
      await expect(inventoryPage.getCartButton(firstItemIndex)).toHaveText(
        InventoryPage.CartButtonText.Remove,
      );
      await expect(inventoryPage.cartBadge).toHaveText("1");
    });

    await test.step("remove first inventory item from cart", async () => {
      await inventoryPage.removeFromCart(firstItemIndex);
      await expect(inventoryPage.getCartButton(firstItemIndex)).toHaveText(
        InventoryPage.CartButtonText.AddToCart,
      );
      await expect(inventoryPage.cartBadge).not.toBeAttached();
    });
  });

  test("remove 2 added items from cart", async ({ inventoryPage }) => {
    const firstItemIndex = 0;
    const secondItemIndex = 1;

    await test.step("add first two inventory items to cart", async () => {
      await inventoryPage.addToCartMultiple(2);
      await expect(inventoryPage.getCartButton(firstItemIndex)).toHaveText(
        InventoryPage.CartButtonText.Remove,
      );
      await expect(inventoryPage.getCartButton(secondItemIndex)).toHaveText(
        InventoryPage.CartButtonText.Remove,
      );
      await expect(inventoryPage.cartBadge).toHaveText("2");
    });

    await test.step("remove first two inventory items from cart", async () => {
      await inventoryPage.removeFromCartMultiple(2);
      await expect(inventoryPage.getCartButton(firstItemIndex)).toHaveText(
        InventoryPage.CartButtonText.AddToCart,
      );
      await expect(inventoryPage.getCartButton(secondItemIndex)).toHaveText(
        InventoryPage.CartButtonText.AddToCart,
      );
      await expect(inventoryPage.cartBadge).not.toBeAttached();
    });
  });

  // Many -> Many
  test("remove 1 item from 3-item cart: cart badge assertion", async ({
    inventoryPage,
  }) => {
    const existingItemCount = 3;

    await test.step(`precondition: add ${existingItemCount} items to cart`, async () => {
      await inventoryPage.addToCartMultiple(existingItemCount);
      await expect(inventoryPage.cartBadge).toHaveText(`${existingItemCount}`);
    });

    await test.step(`remove one item from ${existingItemCount}-item cart`, async () => {
      await inventoryPage.removeFromCart(0);
      await expect(inventoryPage.cartBadge).toHaveText(
        `${existingItemCount - 1}`,
      );
    });
  });

  test("remove 1 item from 3-item cart: inventory button assertion", async ({
    inventoryPage,
  }) => {
    await test.step("precondition: add three items to cart", async () => {
      const existingItemCount = 3;
      await inventoryPage.addToCartMultiple(existingItemCount);

      for (let itemIndex = 0; itemIndex < existingItemCount; itemIndex++) {
        await expect(inventoryPage.getCartButton(itemIndex)).toHaveText(
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

  // Many -> One
  test("remove 1 item from 2-item cart: cart badge assertion", async ({
    inventoryPage,
  }) => {
    const existingItemCount = 2;

    await test.step(`precondition: add ${existingItemCount} items to cart`, async () => {
      await inventoryPage.addToCartMultiple(existingItemCount);
      await expect(inventoryPage.cartBadge).toHaveText(`${existingItemCount}`);
    });

    await test.step(`remove 1 item from ${existingItemCount}-item cart`, async () => {
      await inventoryPage.removeFromCart(0);
      await expect(inventoryPage.cartBadge).toHaveText(
        `${existingItemCount - 1}`,
      );
    });
  });

  test("remove 1 item from 2-item cart: inventory button assertion", async ({
    inventoryPage,
  }) => {
    const existingItemCount = 2;
    await test.step(`precondition: add ${existingItemCount} to cart`, async () => {
      await inventoryPage.addToCartMultiple(existingItemCount);
      for (let itemIndex = 0; itemIndex < existingItemCount; itemIndex++) {
        await expect(inventoryPage.getCartButton(itemIndex)).toHaveText(
          InventoryPage.CartButtonText.Remove,
        );
      }
    });

    await test.step(`remove 1 item from ${existingItemCount}-item cart`, async () => {
      await inventoryPage.removeFromCart(0);
      await expect(inventoryPage.getCartButton(0)).toHaveText(
        InventoryPage.CartButtonText.AddToCart,
      );
      await expect(inventoryPage.getCartButton(1)).toHaveText(
        InventoryPage.CartButtonText.Remove,
      );
    });
  });
});
