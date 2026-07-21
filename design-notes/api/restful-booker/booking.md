# booking.md

**Test Case:** `TC-restful-002`

**Base URL:** `https://restful-booker.herokuapp.com`
**Endpoint:** `/booking`
**Method:** GET
**Test File:** `booking.spec.ts` | describe: "GET /booking"
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
**Test File:** `booking.spec.ts` | describe: "GET /booking/{id}"
**Test Data:**

id=${id returned from POSTing below JSON to `/booking` in `beforeAll` block}

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
**Test File:** `booking.spec.ts` | describe: "GET /booking/{id}"
**Test Data:** id=0 (0 is always an invalid bookingid)
**Assertions:** A `404` status code and `Not Found` status text. Use `HTTP404` in `APIStatus` enum and `Not Found` in `APIStatusText` enum.

---

**Test Case:** `TC-restful-005`

**Base URL:** `https://restful-booker.herokuapp.com`
**Endpoint:** `/booking`
**Method:** POST
**Test File:** `booking.spec.ts` | describe: "POST /booking"
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
**Test File:** `booking.spec.ts` | describe: "DELETE /booking/{id}"
**Test Data**

Authorization Header:

- Enterprise backend docs would not surface an auth token. Will need to authenticate with a POST to `/auth` endpoint.
- username: admin | password: password123
- Auth will be set in a separate `beforeAll` hook, placed before the seed data `beforeAll` hook. Create file-scoped global to capture auth token.

URL Params: id=${id returned from POSTing below JSON to `/booking` in `beforeAll` block}

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
