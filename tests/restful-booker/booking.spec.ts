import { test, expect } from "@playwright/test";
import { APIStatus, APIStatusText } from "../../test-data/enums";

// I'm testing multiple different sites in this project, so I'll refrain from using a config to set baseURL
const BASE_URL = "https://restful-booker.herokuapp.com";
const BOOKING_ENDPOINT = "booking";
const BOOKING_PAYLOAD = {
  firstname: "Sally",
  lastname: "Brown",
  totalprice: 111,
  depositpaid: true,
  bookingdates: {
    checkin: "2026-02-23",
    checkout: "2026-10-23",
  },
  additionalneeds: "Breakfast",
};
let bookingId: number;

test.beforeAll(async ({ request }) => {
  const response = await request.post(`${BASE_URL}/${BOOKING_ENDPOINT}`, {
    data: BOOKING_PAYLOAD,
  });

  const json = await response.json();
  bookingId = json.bookingid;
});

test.describe("GET /booking", () => {
  test("TC-restful-002: fetch bookings, no filters", async ({ request }) => {
    const bookings = await request.get(`${BASE_URL}/${BOOKING_ENDPOINT}`);
    expect(bookings.ok()).toBeTruthy();

    const json = await bookings.json();
    expect(Array.isArray(json));

    // scanning the whole array is prohibitively long.
    // as i don't control this array (like I would in a real test environment)
    // i will only scan the first 3 elements
    for (const booking of json.slice(3)) {
      expect(booking).toHaveProperty("bookingid");
      expect(typeof booking.bookingid).toBe("number");
    }
  });

  // NOTE: Filtering test cases will be added in a future session
});

test.describe("GET /booking/{id}", () => {
  test("TC-restful-003: valid booking id", async ({ request }) => {
    const booking = await request.get(
      `${BASE_URL}/${BOOKING_ENDPOINT}/${bookingId}`,
    );
    expect(booking.ok()).toBeTruthy();
    expect(await booking.json()).toEqual(
      expect.objectContaining(BOOKING_PAYLOAD),
    );
  });

  test("TC-restful-004: invalid booking id", async ({ request }) => {
    const booking = await request.get(`${BASE_URL}/${BOOKING_ENDPOINT}/0`);
    expect(booking.status()).toEqual(APIStatus.HTTP404);
    expect(booking.statusText()).toEqual(APIStatusText.NotFound);
  });
});
