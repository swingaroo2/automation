import { test, expect } from "@playwright/test";
import {
  APIStatus,
  APIStatusText,
} from "../../test-data/restful-booker/status";

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

const TEST_PAYLOAD_POST = {
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

const UPDATED_PAYLOAD_PUT = {
  firstname: "Wally",
  lastname: "Browne",
  totalprice: 112,
  depositpaid: false,
  bookingdates: {
    checkin: "2024-02-23",
    checkout: "2024-10-23",
  },
  additionalneeds: "Even more breakfast",
};

// MARK: Pre-test Hooks
let authTokenCookie: string;

test.beforeAll(async ({ request }) => {
  const fullUrl = `/auth`;
  const authResponse = await request.post(fullUrl, {
    data: {
      username: "admin",
      password: "password123",
    },
  });

  const json = await authResponse.json();
  authTokenCookie = json.token;
  expect(authResponse.status()).toBe(APIStatus.HTTP200);
  expect(authTokenCookie).not.toBeNull();
  expect(typeof authTokenCookie).toBe("string");
});

// MARK: Describe Blocks
test.describe("GET /booking", () => {
  test("TC-restful-002: fetch bookings without filters", async ({
    request,
  }) => {
    const bookings = await request.get(`/booking`);
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
    const seed_response = await request.post(`/booking`, {
      data: SEED_DATA,
    });

    const seed_json = await seed_response.json();
    const seedDataBookingId = seed_json.bookingid;

    const booking = await request.get(`/booking/${seedDataBookingId}`);
    expect(booking.ok()).toBeTruthy();
    expect(await booking.json()).toEqual(expect.objectContaining(SEED_DATA));
  });

  test("TC-restful-004: fetch booking by invalid id", async ({ request }) => {
    const booking = await request.get(`/booking/0`);
    expect(booking.status()).toBe(APIStatus.HTTP404);
    expect(booking.statusText()).toBe(APIStatusText.NotFound);
  });
});

test.describe("POST /booking", () => {
  test("TC-restful-005: create valid booking (+cleanup)", async ({
    request,
  }) => {
    const fullUrl = `/booking`;
    const response = await request.post(fullUrl, { data: TEST_PAYLOAD_POST });
    const json = await response.json();
    expect(response.status()).toBe(APIStatus.HTTP200);
    expect(json.bookingid).toBeGreaterThan(0);
    expect(typeof json.bookingid).toBe("number");
    expect(json.booking).toEqual(TEST_PAYLOAD_POST);

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
    const seed_response = await request.post(`/booking`, {
      data: SEED_DATA,
    });

    const seed_json = await seed_response.json();
    seedDataBookingId = seed_json.bookingid;
  });

  test("TC-restful-006: delete existing booking", async ({ request }) => {
    const fullUrl = `/booking/${seedDataBookingId}`;
    const deleteResponse = await request.delete(fullUrl, {
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${authTokenCookie}`,
      },
    });
    const getResponse = await request.get(fullUrl);
    expect(deleteResponse.status()).toBe(APIStatus.HTTP201);
    expect(getResponse.status()).toBe(APIStatus.HTTP404);
  });
});

test.describe("PUT /booking/{id}", () => {
  let seedDataBookingId: number;
  test.beforeAll(async ({ request }) => {
    const seed_response = await request.post(`/booking`, {
      data: SEED_DATA,
    });

    const seed_json = await seed_response.json();
    seedDataBookingId = seed_json.bookingid;
  });

  test.afterAll(async ({ request }) => {
    const endpoint = `/booking/${seedDataBookingId}`;
    const deleteResponse = await request.delete(endpoint, {
      headers: {
        Cookie: `token=${authTokenCookie}`,
      },
    });
    expect(deleteResponse.status()).toBe(APIStatus.HTTP201);
  });

  test("TC-restful-007: update existing booking", async ({ request }) => {
    const fullUrl = `/booking/${seedDataBookingId}`;
    const putResponse = await request.put(fullUrl, {
      headers: {
        Cookie: `token=${authTokenCookie}`,
      },
      data: UPDATED_PAYLOAD_PUT,
    });
    const putResponseJson = await putResponse.json();
    expect(putResponse.status()).toBe(APIStatus.HTTP200);
    expect(putResponseJson).toEqual(UPDATED_PAYLOAD_PUT);

    const getResponse = await request.get(fullUrl);
    const getResponseJson = await getResponse.json();
    expect(getResponse.status()).toBe(APIStatus.HTTP200);
    expect(getResponseJson).toEqual(UPDATED_PAYLOAD_PUT);
  });

  test("TC-restful-008: no-auth booking update fails with 403", async ({
    request,
  }) => {
    const endpoint = `/booking/${seedDataBookingId}`;

    await test.step("assert: failed no-auth PUT", async () => {
      const putResponse = await request.put(endpoint, {
        data: UPDATED_PAYLOAD_PUT,
      });
      expect(putResponse.status()).toBe(APIStatus.HTTP403);
    });

    await test.step("assert: seed data not updated by failed PUT", async () => {
      const getResponse = await request.get(endpoint);
      const getResponseJson = await getResponse.json();
      expect(getResponse.status()).toBe(APIStatus.HTTP200);
      expect(getResponseJson).toEqual(SEED_DATA);
    });
  });
});
