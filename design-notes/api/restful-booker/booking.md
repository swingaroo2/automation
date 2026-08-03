# booking.md

**Test Case:** `TC-restful-002`

**Base URL:** `https://restful-booker.herokuapp.com`
**Endpoint:** `/booking`
**Method:** GET
**Test File:** `automation/tests/restful-booker/booking.spec.ts` | describe: "GET /booking"
**Test Data:** None
**Assertions:**

1. `200` status code (use `APIStatus.HTTP200` enum case to represent `200`)
2. Nonempty array, every element contains number representing bookingid. Example shape below:

```json
HTTP/1.1 200 OK

[
  {
    "bookingid": 1
  },
  {
    "bookingid": 2
  },
  {
    "bookingid": 3
  },
  {
    "bookingid": 4
  }
]
```

---

**Test Case:** `TC-restful-003`

**Base URL:** `https://restful-booker.herokuapp.com`
**Endpoint:** `/booking/{id}`
**Method:** GET (with POST in `beforeAll` to seed the DB)
**Test File:** `automation/tests/restful-booker/booking.spec.ts` | describe: "GET /booking/{id}"
**Test Data:**

id=seedDataBookingId

**Assertions:**

1. A `200` status code (use `APIStatus.HTTP200` enum case to represent `200`)
2. A booking JSON object, exactly matching the JSON below, used to seed the array. Use `HTTP200` case in `APIStatus` enum.

```json
HTTP/1.1 200 OK

{
    "bookingid": Number,
    "firstname": "Sally",
    "lastname": "Brown",
    "totalprice": 111,
    "depositpaid": true,
    "bookingdates": {
        "checkin": "2026-02-23",
        "checkout": "2026-10-23"
    },
    "additionalneeds": "Breakfast"
}
```

---

**Test Case:** `TC-restful-004`

**Base URL:** `https://restful-booker.herokuapp.com`
**Endpoint:** `/booking/{id}`
**Method:** GET
**Test File:** `automation/tests/restful-booker/booking.spec.ts` | describe: "GET /booking/{id}"
**Test Data:** id=0 (0 is always an invalid bookingid)
**Assertions:** A `404` status code and `Not Found` status text. Use `HTTP404` in `APIStatus` enum and `Not Found` in `APIStatusText` enum.

---

**Test Case:** `TC-restful-005`

**Base URL:** `https://restful-booker.herokuapp.com`
**Endpoint:** `/booking`
**Method:** POST
**Test File:** `automation/tests/restful-booker/booking.spec.ts` | describe: "POST /booking"
**Test Data:**

No URL params

Use the following JSON in the request body

```json
{
  "firstname": "Johnny",
  "lastname": "Bravo",
  "totalprice": 42069,
  "depositpaid": true,
  "bookingdates": {
    "checkin": "2026-04-26",
    "checkout": "2026-06-26"
  },
  "additionalneeds": "Lots of hairspray"
}
```

**Assertions**

1. POST request returns `200` HTTP status code. (use `APIStatus.HTTP200` enum case to represent `200`)
2. The `bookingid` on the JSON response body is valid (greater than zero, Number-type). Verifies successfully created booking.
3. The booking returned in the JSON response body matches the booking sent in the request. Verifies correct booking created.
4. HTTP status code `201` on the DELETE response
   **Notes**

- DELETE the created booking to practice test cleanup, acknowledging the backend self-sanitizes every 10 minutes
- See `TC-restful-006` for details on handling auth token

---

**Test Case:** `TC-restful-006`

**Base URL:** `https://restful-booker.herokuapp.com`
**Endpoint:** `/booking/{id}`
**Method:** DELETE
**Test File:** `automation/tests/restful-booker/booking.spec.ts` | describe: "DELETE /booking/{id}"
**Test Data**

Authorization Header:

- Enterprise backend docs would not surface an auth token. Will need to authenticate with a POST to `/auth` endpoint.
- username: admin | password: password123
- Auth will be set in a separate `beforeAll` hook, placed before the seed data `beforeAll` hook. Create file-scoped global to capture auth token.

URL Params: id = (obtained from test seed data response)

Seed Data:

```json
{
  "firstname": "Sally",
  "lastname": "Brown",
  "totalprice": 111,
  "depositpaid": true,
  "bookingdates": {
    "checkin": "2026-02-23",
    "checkout": "2026-10-23"
  },
  "additionalneeds": "Breakfast"
}
```

**Assertions**

1. HTTP response code is `201` (use `APIStatus.HTTP201` enum case to represent `201`)
2. A GET request on the `bookingid` for Sally Brown returns a `404` HTTP code (use `APIStatus.HTTP404` enum case to represent `404`)

---

**Test Case:** `TC-restful-007`

**Base URL:** `https://restful-booker.herokuapp.com`
**Endpoint:** `/booking/{id}`
**Expected Response:** `200`
**Method:** PUT
**Test File:** `automation/tests/restful-booker/booking.spec.ts` | describe: "PUT /booking/{id}"
**Test Data**

URL Params: id = (obtained from test seed data response)

Seed Data (owned by test)

```json
{
  "firstname": "Sally",
  "lastname": "Brown",
  "totalprice": 111,
  "depositpaid": true,
  "bookingdates": {
    "checkin": "2026-02-23",
    "checkout": "2026-10-23"
  },
  "additionalneeds": "Breakfast"
}
```

Updated Booking

```json
{
  "firstname": "Wally",
  "lastname": "Browne",
  "totalprice": 112,
  "depositpaid": false,
  "bookingdates": {
    "checkin": "2024-02-23",
    "checkout": "2024-10-23"
  },
  "additionalneeds": "Even more breakfast"
}
```

**Assertions**

1. HTTP status code `200` (use `APIStatus.HTTP200` to represent code)
2. Response body matches the expected updated booking
3. Follow-up GET request on the updated booking id returns `200` (use `APIStatus.HTTP200` to represent code)
4. Follow-up GET request on the updated booking id returns the updated booking

**Notes**

- Auth not mentioned in docs as a requirement for this endpoint...but it's required
- Use test-local bookingid to delete seeded booking as rep of habit

---

**Test Case:** TC-restful-008
**Base URL:** `https://restful-booker.herokuapp.com`
**Endpoint:** `/booking/{id}`
**Method:** PUT
**Expected Response:** `403` (no auth token)
**Test File:** `automation/tests/restful-booker/booking.spec.ts` | describe "PUT /booking/{id}"
**Test Data**

URL Params: id = (obtained from test seed data response)

Seed Data (owned by test)

```json
{
  "firstname": "Sally",
  "lastname": "Brown",
  "totalprice": 111,
  "depositpaid": true,
  "bookingdates": {
    "checkin": "2026-02-23",
    "checkout": "2026-10-23"
  },
  "additionalneeds": "Breakfast"
}
```

Updated Booking

```json
{
  "firstname": "Wally",
  "lastname": "Browne",
  "totalprice": 112,
  "depositpaid": false,
  "bookingdates": {
    "checkin": "2024-02-23",
    "checkout": "2024-10-23"
  },
  "additionalneeds": "Even more breakfast"
}
```

**Assertions**

Note: not sending auth token cookie to trigger 403

1. Failed no-auth PUT
2. Seed data not updated by failed PUT
3. Successful DELETE of seed data

**Notes**

- Use test-local bookingid to delete seeded booking as rep of habit. Auth token used here, outside of main assertions, to prevent test data leakage
- Match the request pattern of `TC-restful-007` to isolate the absent auth token as the diff between tests
- Prevent ride-along auth token by not adding it to the header. Hitting the `/auth` endpoint alone won't add it to the PUT request.
