import { test, expect } from "@playwright/test";
const HC_ENDPOINT = "ping";

test("TC-restful-001: fetch API health", async ({ request }) => {
  const healthCheck = await request.get(`/${HC_ENDPOINT}`);
  expect(healthCheck.ok()).toBeTruthy();
});
