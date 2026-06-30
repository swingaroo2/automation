import { test, expect } from "@playwright/test";
import { APIStatus, APIStatusText } from "../../test-data/enums";

// I'm testing multiple different sites in this project, so I'll refrain from using a config to set baseURL
const BASE_URL = "https://restful-booker.herokuapp.com";
const HC_ENDPOINT = "ping";

test(`TC-restful-001: should confirm API health`, async ({ request }) => {
  const healthCheck = await request.get(`${BASE_URL}/${HC_ENDPOINT}`);
  expect(healthCheck.status()).toEqual(APIStatus.HTTP201);
  expect(healthCheck.statusText()).toEqual(APIStatusText.Created);
});
