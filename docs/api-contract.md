# Customer Service Booking API Contract

## Overview

This document defines the API contract used by the customer service booking frontend. The current implementation will use an in-memory mock API, but the contract is designed so that it can later be replaced by a real HTTP backend without changing UI components.

## Base URL

```text
/api/v1
```

## Content Type

Requests and responses use:

```yaml
Content-Type: application/json
```

## Standard Error Response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid data.",
    "fieldErrors": {
      "scheduledAt": "A booking date and time is required."
    }
  }
}
```

## Required Endpoints

| Method | Endpoint                             | Purpose                       |
| ------ | ------------------------------------ | ----------------------------- |
| GET    | `/services`                          | List and filter services      |
| GET    | `/services/{serviceId}`              | Retrieve one service          |
| GET    | `/services/{serviceId}/availability` | Retrieve available time slots |
| POST   | `/bookings`                          | Create a booking              |
| GET    | `/bookings`                          | List customer bookings        |
| GET    | `/bookings/{bookingId}`              | Retrieve booking details      |

## 1. List Services

### Request

```http
GET /api/v1/services
```

### Purpose

Returns services available for customer booking. Supports search and category filtering.

### Query Parameters

| Parameter  | Type   | Required | Description                                      |
| ---------- | ------ | -------- | ------------------------------------------------ |
| `search`   | string | No       | Searches service name, description, and provider |
| `category` | string | No       | Filters services by category                     |

Example:

```http
GET /api/v1/services?search=cleaning&category=Home
```

### Success Response

Status: `200 OK`

```json
{
  "data": [
    {
      "id": "service-001",
      "name": "Home Cleaning",
      "description": "Professional home cleaning service.",
      "category": "Home",
      "provider": {
        "id": "provider-001",
        "name": "CleanCare Services"
      },
      "price": 2500,
      "currency": "NPR",
      "durationMinutes": 120,
      "rating": 4.8,
      "imageUrl": "/images/home-cleaning.jpg"
    }
  ],
  "meta": {
    "total": 1
  }
}
```

### Status Codes

| Status | Meaning                         |
| ------ | ------------------------------- |
| `200`  | Services retrieved successfully |
| `400`  | Invalid query parameters        |
| `500`  | Unexpected server error         |
| `503`  | Service temporarily unavailable |

### Validation Errors

- `search` must be a string.
- `category` must be a supported category.
- Leading and trailing search whitespace is ignored.

### UI Behaviour

- **Loading:** Display service-card skeletons while the request is pending.
- **Empty:** Display an empty-state message when `data` is empty.
- **Error:** Display an error message with a retry action.
- **Success:** Display the returned services as selectable cards.





## 2. Get Service Details

### Request

```http
GET /api/v1/services/{serviceId}
```

### Purpose

Returns complete information for one service.

### Path Parameters

| Parameter   | Type   | Required | Description               |
| ----------- | ------ | -------- | ------------------------- |
| `serviceId` | string | Yes      | Unique service identifier |

Example:

```http
GET /api/v1/services/service-001
```

### Success Response

Status: `200 OK`

```json
{
  "data": {
    "id": "service-001",
    "name": "Home Cleaning",
    "description": "Professional cleaning for apartments and houses.",
    "category": "Home",
    "provider": {
      "id": "provider-001",
      "name": "CleanCare Services"
    },
    "price": 2500,
    "currency": "NPR",
    "durationMinutes": 120,
    "rating": 4.8,
    "reviewCount": 126,
    "imageUrl": "/images/home-cleaning.jpg"
  }
}
```

### Status Codes

| Status | Meaning                         |
| ------ | ------------------------------- |
| `200`  | Service retrieved successfully  |
| `400`  | Invalid service identifier      |
| `404`  | Service does not exist          |
| `500`  | Unexpected server error         |
| `503`  | Service temporarily unavailable |

### Error Response

Status: `404 Not Found`

```json
{
  "error": {
    "code": "SERVICE_NOT_FOUND",
    "message": "The requested service could not be found."
  }
}
```

### UI Behaviour

- **Loading:** Display a service-details skeleton.
- **Empty/Not found:** Display a service-not-found state with a link back to the service list.
- **Error:** Display an error message with retry and back actions.
- **Success:** Display the service information and a booking action.





## 3. Get Service Availability

### Request

```http
GET /api/v1/services/{serviceId}/availability
```

### Purpose

Returns available time slots for a service on a selected date.

### Path Parameters

| Parameter   | Type   | Required | Description               |
| ----------- | ------ | -------- | ------------------------- |
| `serviceId` | string | Yes      | Unique service identifier |

### Query Parameters

| Parameter | Type   | Required | Description                 |
| --------- | ------ | -------- | --------------------------- |
| `date`    | string | Yes      | Date in `YYYY-MM-DD` format |

Example:

```http
GET /api/v1/services/service-001/availability?date=2026-09-05
```

### Success Response

Status: `200 OK`

```json
{
  "data": {
    "serviceId": "service-001",
    "date": "2026-09-05",
    "timezone": "Asia/Kathmandu",
    "slots": [
      {
        "startTime": "09:00",
        "endTime": "11:00",
        "available": true
      },
      {
        "startTime": "12:00",
        "endTime": "14:00",
        "available": false
      }
    ]
  }
}
```

### Status Codes

| Status | Meaning                                         |
| ------ | ----------------------------------------------- |
| `200`  | Availability retrieved successfully             |
| `400`  | Date is missing or invalid                      |
| `404`  | Service does not exist                          |
| `500`  | Unexpected server error                         |
| `503`  | Availability service is temporarily unavailable |

### Validation Rules

- `date` is required.
- `date` must use `YYYY-MM-DD`.
- Past dates are invalid.
- Only available slots can be selected for booking.

### Empty Response Behaviour

A valid date with no available appointments returns `200 OK`:

```json
{
  "data": {
    "serviceId": "service-001",
    "date": "2026-09-05",
    "timezone": "Asia/Kathmandu",
    "slots": []
  }
}
```

### UI Behaviour

- **Loading:** Disable slot selection and show a loading indicator.
- **Empty:** Explain that no slots are available and allow another date to be selected.
- **Error:** Show an error message with a retry action.
- **Success:** Display available and unavailable slots with distinct states.

## 4. Create Booking

### Request

```http
POST /api/v1/bookings
```

### Purpose

Creates a booking for a selected service, date, time slot, customer, and address.

### Request Body

```json
{
  "serviceId": "service-001",
  "customerId": "customer-001",
  "addressId": "address-001",
  "scheduledDate": "2026-09-05",
  "startTime": "09:00"
}
```

### Request Fields

| Field           | Type   | Required | Description                            |
| --------------- | ------ | -------- | -------------------------------------- |
| `serviceId`     | string | Yes      | Selected service                       |
| `customerId`    | string | Yes      | Customer making the booking            |
| `addressId`     | string | Yes      | Address where the service will occur   |
| `scheduledDate` | string | Yes      | Date in `YYYY-MM-DD` format            |
| `startTime`     | string | Yes      | Selected slot time in `HH:mm` format   |

### Success Response

Status: `201 Created`

```json
{
  "data": {
    "id": "booking-001",
    "bookingNumber": "CSB-2026-0001",
    "service": {
      "id": "service-001",
      "name": "Home Cleaning"
    },
    "provider": {
      "id": "provider-001",
      "name": "CleanCare Services"
    },
    "customerId": "customer-001",
    "addressId": "address-001",
    "scheduledDate": "2026-09-05",
    "startTime": "09:00",
    "endTime": "11:00",
    "price": 2500,
    "currency": "NPR",
    "status": "confirmed",
    "createdAt": "2026-08-31T10:30:00Z"
  }
}
```

### Status Codes

| Status | Meaning                                      |
| ------ | -------------------------------------------- |
| `201`  | Booking created successfully                 |
| `400`  | Request body is malformed                    |
| `404`  | Service, customer, or address does not exist |
| `409`  | Selected slot is no longer available         |
| `422`  | Request failed validation                    |
| `500`  | Unexpected server error                      |
| `503`  | Booking service is temporarily unavailable   |

### Validation Error

Status: `422 Unprocessable Entity`

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please correct the highlighted fields.",
    "fieldErrors": {
      "scheduledDate": "A future date is required.",
      "startTime": "A time slot is required."
    }
  }
}
```

### Slot Conflict Error

Status: `409 Conflict`

```json
{
  "error": {
    "code": "SLOT_UNAVAILABLE",
    "message": "The selected time slot is no longer available."
  }
}
```

### Business Rules

- The service, customer, and address must exist.
- The booking date cannot be in the past.
- The selected slot must belong to the selected service and date.
- An unavailable slot cannot be booked.
- A successful booking makes the selected slot unavailable.
- The server determines the price, duration, provider, and booking status.

### UI Behaviour

- **Submitting:** Disable the confirmation button and show progress.
- **Validation error:** Display field-specific messages without clearing valid selections.
- **Conflict:** Explain that the slot was taken and refresh availability.
- **Server error:** Preserve the form and provide a retry action.
- **Success:** Navigate to the booking-confirmation screen.
