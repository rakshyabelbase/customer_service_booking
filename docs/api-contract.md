# API Contract

## Overview

This document defines the API contract used by the Customer Service Booking frontend.

The frontend communicates with a mock REST API using JSON.

* **Base URL:** `/api/v1`
* **Content-Type:** `application/json`

The API contract is designed so that the frontend can be developed independently from a real backend while keeping request and response structures consistent.

---

# Standard Response Format

## Single Resource

```json
{
  "data": {}
}
```

## List Response

```json
{
  "data": [],
  "meta": {
    "total": 0
  }
}
```

## Error Response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed.",
    "fieldErrors": {
      "fieldName": "Validation message"
    }
  }
}
```

`fieldErrors` is optional and is mainly returned for validation failures.

---

# Common Error Codes

| Code                       | Description                                             |
| -------------------------- | ------------------------------------------------------- |
| `VALIDATION_ERROR`         | Request data or parameters are invalid                  |
| `NOT_FOUND`                | Requested resource does not exist                       |
| `CONFLICT`                 | Request conflicts with existing data                    |
| `SLOT_UNAVAILABLE`         | Selected booking slot is no longer available            |
| `ACTIVE_BOOKINGS_CONFLICT` | Service cannot be deleted because active bookings exist |
| `INTERNAL_SERVER_ERROR`    | Unexpected server error                                 |

---

# Endpoints Overview

| Method   | Endpoint                            | Description                    |
| -------- | ----------------------------------- | ------------------------------ |
| `GET`    | `/services`                         | List and filter services       |
| `GET`    | `/services/:serviceId`              | Get service details            |
| `POST`   | `/services`                         | Create a service               |
| `PUT`    | `/services/:serviceId`              | Update a service               |
| `DELETE` | `/services/:serviceId`              | Delete a service               |
| `GET`    | `/services/:serviceId/availability` | Get service availability       |
| `POST`   | `/bookings`                         | Create a booking               |
| `GET`    | `/bookings`                         | List bookings                  |
| `GET`    | `/bookings/:bookingId`              | Get a booking                  |
| `PATCH`  | `/bookings/:bookingId`              | Update or reschedule a booking |
| `DELETE` | `/bookings/:bookingId`              | Delete/cancel a booking        |

All paths below are relative to:

```text
/api/v1
```

---

# Core Resource Shapes

## Service

```json
{
  "id": "service-001",
  "name": "Home Deep Cleaning",
  "description": "Comprehensive cleaning for homes and apartments.",
  "category": "Home Cleaning",
  "provider": {
    "id": "prov-01",
    "name": "CleanCare Services"
  },
  "price": 2500,
  "currency": "NPR",
  "durationMinutes": 120,
  "rating": 4.8,
  "imageUrl": "/images/cleaning.png"
}
```

---

## Booking

```json
{
  "id": "booking-101",
  "bookingNumber": "CSB-2026-0101",
  "serviceId": "service-001",
  "serviceName": "Home Deep Cleaning",
  "provider": {
    "id": "prov-01",
    "name": "CleanCare Services"
  },
  "customerName": "Aarav Sharma",
  "customerEmail": "aarav@example.com",
  "customerPhone": "9841000001",
  "serviceAddress": "Lazimpat Road, Kathmandu 44600",
  "scheduledDate": "2026-09-02",
  "startTime": "09:00",
  "endTime": "11:00",
  "price": 2500,
  "currency": "NPR",
  "status": "confirmed",
  "createdAt": "2026-08-30T10:00:00Z"
}
```

---

# Services

## 1. List Services

```http
GET /services
```

Returns all available services.

### Optional Query Parameters

| Parameter  | Type   | Description                           |
| ---------- | ------ | ------------------------------------- |
| `search`   | string | Search by service name or description |
| `category` | string | Filter by service category            |

### Example

```http
GET /services?search=cleaning&category=Home%20Cleaning
```

### Response

```json
{
  "data": [
    {
      "id": "service-001",
      "name": "Home Deep Cleaning",
      "description": "Comprehensive cleaning for homes and apartments.",
      "category": "Home Cleaning",
      "provider": {
        "id": "prov-01",
        "name": "CleanCare Services"
      },
      "price": 2500,
      "currency": "NPR",
      "durationMinutes": 120,
      "rating": 4.8,
      "imageUrl": "/images/cleaning.png"
    }
  ],
  "meta": {
    "total": 1
  }
}
```

### Status Codes

* `200 OK`
* `400 Bad Request`
* `500 Internal Server Error`

---

## 2. Get Service Details

```http
GET /services/:serviceId
```

Returns a single service.

### Example

```http
GET /services/service-001
```

### Response

```json
{
  "data": {
    "id": "service-001",
    "name": "Home Deep Cleaning",
    "description": "Comprehensive cleaning for homes and apartments.",
    "category": "Home Cleaning",
    "provider": {
      "id": "prov-01",
      "name": "CleanCare Services"
    },
    "price": 2500,
    "currency": "NPR",
    "durationMinutes": 120,
    "rating": 4.8,
    "imageUrl": "/images/cleaning.png"
  }
}
```

### Status Codes

* `200 OK`
* `404 Not Found`
* `500 Internal Server Error`

---

## 3. Create Service

```http
POST /services
```

### Request

```json
{
  "name": "AC Maintenance & Repair",
  "description": "Full HVAC diagnostic and coil cleaning.",
  "category": "Appliance",
  "price": 1800,
  "currency": "NPR",
  "durationMinutes": 90,
  "providerName": "CoolTech Solutions"
}
```

### Success

```text
201 Created
```

The response contains the newly created service inside `data`.

### Validation Example

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Service validation failed.",
    "fieldErrors": {
      "name": "Service name is required.",
      "price": "Price must be greater than 0."
    }
  }
}
```

### Status Codes

* `201 Created`
* `400 Bad Request`
* `500 Internal Server Error`

---

## 4. Update Service

```http
PUT /services/:serviceId
```

Updates an existing service.

### Request

```json
{
  "name": "Updated Home Deep Cleaning",
  "description": "Enhanced residential deep cleaning service.",
  "category": "Home Cleaning",
  "price": 2800,
  "currency": "NPR",
  "durationMinutes": 150,
  "providerName": "CleanCare Premium"
}
```

### Status Codes

* `200 OK`
* `400 Bad Request`
* `404 Not Found`
* `500 Internal Server Error`

---

## 5. Delete Service

```http
DELETE /services/:serviceId
```

Deletes an existing service.

### Success

```text
204 No Content
```

### Active Booking Conflict

A service with active bookings cannot be deleted.

```json
{
  "error": {
    "code": "ACTIVE_BOOKINGS_CONFLICT",
    "message": "Cannot delete this service because active bookings exist."
  }
}
```

### Status Codes

* `204 No Content`
* `404 Not Found`
* `409 Conflict`
* `500 Internal Server Error`

---

# Availability

## 6. Get Service Availability

```http
GET /services/:serviceId/availability
```

Returns available time slots for a service.

### Query Parameters

| Parameter | Type         | Required | Description                |
| --------- | ------------ | -------- | -------------------------- |
| `date`    | `YYYY-MM-DD` | No       | Date to check availability |

### Example

```http
GET /services/service-001/availability?date=2026-09-02
```

### Response

```json
{
  "data": {
    "serviceId": "service-001",
    "date": "2026-09-02",
    "timezone": "Asia/Kathmandu",
    "slots": [
      {
        "startTime": "09:00",
        "endTime": "11:00",
        "available": true
      },
      {
        "startTime": "11:30",
        "endTime": "13:30",
        "available": false
      },
      {
        "startTime": "14:00",
        "endTime": "16:00",
        "available": true
      }
    ]
  }
}
```

### Status Codes

* `200 OK`
* `404 Not Found`
* `500 Internal Server Error`

---

# Bookings

## 7. Create Booking

```http
POST /bookings
```

Creates a booking for an available service time slot.

### Request

```json
{
  "serviceId": "service-001",
  "customerName": "Ramesh Adhikari",
  "customerEmail": "ramesh@example.com",
  "customerPhone": "9841234567",
  "serviceAddress": "Lazimpat Road, Kathmandu 44600",
  "scheduledDate": "2026-09-02",
  "startTime": "09:00"
}
```

### Response

```json
{
  "data": {
    "id": "booking-101",
    "bookingNumber": "CSB-2026-0101",
    "serviceId": "service-001",
    "serviceName": "Home Deep Cleaning",
    "provider": {
      "id": "prov-01",
      "name": "CleanCare Services"
    },
    "customerName": "Ramesh Adhikari",
    "customerEmail": "ramesh@example.com",
    "serviceAddress": "Lazimpat Road, Kathmandu 44600",
    "scheduledDate": "2026-09-02",
    "startTime": "09:00",
    "endTime": "11:00",
    "status": "confirmed"
  }
}
```

### Validation Rules

* `serviceId` must identify an existing service.
* `customerName` is required.
* `customerEmail` must contain a valid email address.
* `serviceAddress` is required.
* `scheduledDate` must be a valid `YYYY-MM-DD` date.
* The booking date cannot be in the past.
* `startTime` must match an available service slot.

### Slot Conflict

Availability may change between selecting a slot and submitting the booking.

If another customer has already booked the selected slot, the API returns:

```text
409 Conflict
```

```json
{
  "error": {
    "code": "SLOT_UNAVAILABLE",
    "message": "The selected time slot is no longer available."
  }
}
```

The frontend should refresh availability and allow the customer to choose another slot.

### Status Codes

* `201 Created`
* `400 Bad Request`
* `404 Not Found`
* `409 Conflict`
* `500 Internal Server Error`

---

## 8. List Bookings

```http
GET /bookings
```

Returns customer bookings.

### Optional Query Parameters

| Parameter   | Type   | Description              |
| ----------- | ------ | ------------------------ |
| `serviceId` | string | Filter by service        |
| `status`    | string | Filter by booking status |

Supported statuses:

```text
confirmed
cancelled
completed
```

### Response

```json
{
  "data": [
    {
      "id": "booking-101",
      "bookingNumber": "CSB-2026-0101",
      "serviceId": "service-001",
      "serviceName": "Home Deep Cleaning",
      "provider": {
        "id": "prov-01",
        "name": "CleanCare Services"
      },
      "customerName": "Aarav Sharma",
      "customerEmail": "aarav@example.com",
      "customerPhone": "9841000001",
      "serviceAddress": "Lazimpat Road, Kathmandu 44600",
      "scheduledDate": "2026-09-02",
      "startTime": "09:00",
      "endTime": "11:00",
      "price": 2500,
      "currency": "NPR",
      "status": "confirmed",
      "createdAt": "2026-08-30T10:00:00Z"
    }
  ],
  "meta": {
    "total": 1
  }
}
```

### Status Codes

* `200 OK`
* `500 Internal Server Error`

---

## 9. Get Booking

```http
GET /bookings/:bookingId
```

Returns one booking by ID.

### Status Codes

* `200 OK`
* `404 Not Found`
* `500 Internal Server Error`

---

## 10. Update / Reschedule Booking

```http
PATCH /bookings/:bookingId
```

Updates booking information or changes the selected date/time.

### Example Request

```json
{
  "customerName": "Aarav Sharma",
  "customerEmail": "aarav@example.com",
  "customerPhone": "9841000001",
  "scheduledDate": "2026-09-04",
  "startTime": "10:30",
  "notes": "Rescheduled due to travel."
}
```

Only fields that need to change are required in a PATCH request.

### Slot Conflict

If the new time slot is unavailable:

```text
409 Conflict
```

```json
{
  "error": {
    "code": "SLOT_UNAVAILABLE",
    "message": "The selected time slot is no longer available."
  }
}
```

### Status Codes

* `200 OK`
* `400 Bad Request`
* `404 Not Found`
* `409 Conflict`
* `500 Internal Server Error`

---

## 11. Delete Booking

```http
DELETE /bookings/:bookingId
```

Deletes or cancels an existing booking.

### Success

```text
204 No Content
```

### Status Codes

* `204 No Content`
* `404 Not Found`
* `500 Internal Server Error`

---

# Frontend Integration

The frontend does not call API endpoints directly from presentational components.

The communication flow is:

```text
Page / Component
      ↓
Feature Hook
      ↓
TanStack React Query
      ↓
Feature API Function
      ↓
API Client
      ↓
Mock API
```

TanStack React Query manages:

* fetching
* loading state
* error state
* caching
* mutations
* refetching
* query invalidation


