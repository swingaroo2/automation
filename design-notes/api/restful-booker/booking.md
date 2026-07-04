# booking.md

**Deferred:** DB cleanup with DELETE

**Test Case:** `TC-restful-002`

**Base URL:** `https://restful-booker.herokuapp.com`
**Endpoint:** `/booking`
**Method:** GET
**Test File:** `booking.spec.ts` | describe: "GET /booking"
**Input/Query Params:** None
**Assertions:**

1. `200` status code
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

**Location:** `qa-training/automation/design-notes/api/restful-booker/booking.md`
**Note:** The training protocol did not direct creation of test cases for filtering the output with query params. Calling that out here.

---

**Test Case:** `TC-restful-003`

**Base URL:** `https://restful-booker.herokuapp.com`
**Endpoint:** `/booking/{id}`
**Method:** GET (with POST in `beforeAll` to seed the DB)
**Test File:** `booking.spec.ts` | describe: "GET /booking/{id}"
**Input/Query Params:** id=${id returned from posting below JSON to `/booking`}
**Assertions:**

1. A `200` status code
2. A booking JSON object, exactly matching the object below used to seed the array. Use `HTTP200` case in `APIStatus` enum.

```json
HTTP/1.1 200 OK

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

**Location:** `qa-training/automation/design-notes/api/restful-booker/booking.md`

---

**Test Case:** `TC-restful-004`

**Base URL:** `https://restful-booker.herokuapp.com`
**Endpoint:** `/booking/{id}`
**Method:** GET
**Test File:** `booking.spec.ts` | describe: "GET /booking/{id}"
**Input/Query Params:** id=0 (0 is always an invalid bookingid)
**Assertions:** A `404` status code and `Not Found` status text. Use `HTTP404` in `APIStatus` enum and `Not Found` in `APIStatusText` enum.

**Location:** `qa-training/automation/design-notes/api/restful-booker/booking.md`
