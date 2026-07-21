import { test, expect } from "@playwright/test";
import { APIStatus, APIStatusText } from "../../test-data/enums";

const BASE_URL = "https://restful-booker.herokuapp.com";

enum RBEndpoints {
  Booking = "booking",
  Auth = "auth",
}

// MARK: Test Data

const SEED_DATA = {
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

const TEST_PAYLOAD = {
  firstname: "Johnny",
  lastname: "Bravo",
  totalprice: 42069,
  depositpaid: true,
  bookingdates: {
    checkin: "2026-04-26",
    checkout: "2026-06-26",
  },
  additionalneeds: "Lots of hairspray",
};

// MARK: Pre-test Hooks
let seedDataBookingId: number;
let authTokenCookie: string;

test.beforeAll(async ({ request }) => {
  const fullUrl = `${BASE_URL}/${RBEndpoints.Auth}`;
  const response = await request.post(fullUrl, {
    data: {
      username: "admin",
      password: "password123",
    },
  });

  const json = await response.json();
  authTokenCookie = json.token;
  expect(authTokenCookie).not.toBeNull();
  expect(typeof authTokenCookie).toBe("string");
});

// MARK: Describe Blocks
test.describe("GET /booking", () => {
  test("TC-restful-002: fetch bookings without filters", async ({
    request,
  }) => {
    const bookings = await request.get(`${BASE_URL}/${RBEndpoints.Booking}`);
    expect(bookings.ok()).toBeTruthy();

    const json = await bookings.json();
    expect(Array.isArray(json)).toBeTruthy();

    // scanning the whole array is prohibitively long.
    // as i don't control this array (like I would in a real test environment)
    // i will only scan a subset of elements
    for (const booking of json.slice(0, 3)) {
      expect(booking).toHaveProperty("bookingid");
      expect(typeof booking.bookingid).toBe("number");
    }
  });

  // NOTE: Filtering test cases will be added in a future session
});

test.describe("GET /booking/{id}", () => {
  test("TC-restful-003: fetch booking by valid id", async ({ request }) => {
    const seed_response = await request.post(
      `${BASE_URL}/${RBEndpoints.Booking}`,
      {
        data: SEED_DATA,
      },
    );

    const seed_json = await seed_response.json();
    const seedDataBookingId = seed_json.bookingid;

    const booking = await request.get(
      `${BASE_URL}/${RBEndpoints.Booking}/${seedDataBookingId}`,
    );
    expect(booking.ok()).toBeTruthy();
    expect(await booking.json()).toEqual(expect.objectContaining(SEED_DATA));
  });

  test("TC-restful-004: fetch booking by invalid id", async ({ request }) => {
    const booking = await request.get(`${BASE_URL}/${RBEndpoints.Booking}/0`);
    expect(booking.status()).toBe(APIStatus.HTTP404);
    expect(booking.statusText()).toBe(APIStatusText.NotFound);
  });
});

// TODO: Clean up other tests when done with new ones
test.describe("POST /booking", () => {
  test("TC-restful-005: create valid booking (+cleanup)", async ({
    request,
  }) => {
    const fullUrl = `${BASE_URL}/${RBEndpoints.Booking}`;
    const response = await request.post(fullUrl, { data: TEST_PAYLOAD });
    const json = await response.json();
    expect(response.status()).toBe(APIStatus.HTTP200);
    expect(json.bookingid).toBeGreaterThan(0);
    expect(typeof json.bookingid).toBe("number");
    expect(json.booking).toEqual(TEST_PAYLOAD);

    const deleteUrl = `${fullUrl}/${json.bookingid}`;
    const deleteResponse = await request.delete(deleteUrl, {
      headers: {
        Cookie: `token=${authTokenCookie}`,
      },
    });
    expect(deleteResponse.status()).toBe(APIStatus.HTTP201);
  });
});

test.describe("DELETE /booking/{id}", () => {
  let seedDataBookingId: number;
  test.beforeAll(async ({ request }) => {
    const seed_response = await request.post(
      `${BASE_URL}/${RBEndpoints.Booking}`,
      {
        data: SEED_DATA,
      },
    );

    const seed_json = await seed_response.json();
    seedDataBookingId = seed_json.bookingid;
  });

  test("TC-restful-006: delete existing booking", async ({ request }) => {
    const fullUrl = `${BASE_URL}/${RBEndpoints.Booking}/${seedDataBookingId}`;
    const deleteResponse = await request.delete(fullUrl, {
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${authTokenCookie}`,
      },
    });
    expect(deleteResponse.status()).toBe(APIStatus.HTTP201);

    const getResponse = await request.get(fullUrl);
    expect(getResponse.status()).toBe(APIStatus.HTTP404);
  });
});
