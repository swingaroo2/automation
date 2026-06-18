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

  test("assert one item added to cart", async ({ inventoryPage }) => {
    await test.step("add first inventory item to cart", async () => {
      const index = 0;
      await inventoryPage.addToCart(index);
      await expect(inventoryPage.getCartButton(index)).toHaveText("Remove");
      await expect(inventoryPage.cartBadge).toHaveText("1");
    });
  });

  test("add two items to cart", async ({ inventoryPage }) => {
    await test.step("add first two inventory items to cart", async () => {
      const index = 0;
      const index2 = 1;
      await inventoryPage.addToCart(index);
      await inventoryPage.addToCart(index2);
      await expect(inventoryPage.getCartButton(index)).toHaveText("Remove");
      await expect(inventoryPage.getCartButton(index2)).toHaveText("Remove");
      await expect(inventoryPage.cartBadge).toHaveText("2");
    });
  });

  test("remove one item from cart", async ({ inventoryPage }) => {
    const index = 0;

    await test.step("add first inventory item to cart", async () => {
      await inventoryPage.addToCart(index);
      await expect(inventoryPage.getCartButton(index)).toHaveText("Remove");
      await expect(inventoryPage.cartBadge).toHaveText("1");
    });

    await test.step("remove first inventory item from cart", async () => {
      await inventoryPage.removeFromCart(index);
      await expect(inventoryPage.getCartButton(index)).toHaveText(
        "Add to cart",
      );
      await expect(inventoryPage.cartBadge).not.toBeAttached();
    });
  });

  test("remove two items from cart", async ({ inventoryPage }) => {
    const index = 0;
    const index2 = 1;

    await test.step("add first two inventory items to cart", async () => {
      await inventoryPage.addToCart(index);
      await inventoryPage.addToCart(index2);
      await expect(inventoryPage.getCartButton(index)).toHaveText("Remove");
      await expect(inventoryPage.getCartButton(index2)).toHaveText("Remove");
      await expect(inventoryPage.cartBadge).toHaveText("2");
    });

    await test.step("remove first two inventory items from cart", async () => {
      await inventoryPage.removeFromCart(index);
      await inventoryPage.removeFromCart(index2);
      await expect(inventoryPage.getCartButton(index)).toHaveText(
        "Add to cart",
      );
      await expect(inventoryPage.getCartButton(index2)).toHaveText(
        "Add to cart",
      );
      await expect(inventoryPage.cartBadge).not.toBeAttached();
    });
  });
});
