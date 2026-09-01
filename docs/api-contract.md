# Customer Service Booking API Contract

## Overview

This document defines the RESTful API contract for the Customer Service Booking system. The contract specifies endpoint schemas, parameters, request/response payload types, standard error structures, and UI behavioral contracts for loading, empty, and error states.

- **Base URL:** `/api/v1`
- **Content-Type:** `application/json`

---

## Standard Response & Error Formats

### Standard Single Resource Response (`ApiResponse<T>`)

```json
{
  "data": { ... }
}
```

### Standard List Resource Response (`ApiListResponse<T>`)

```json
{
  "data": [ ... ],
  "meta": {
    "total": 12
  }
}
```

### Standard Error Response (`ApiErrorPayload`)

```json
{
  "error": {
    "code": "VALIDATION_ERROR | NOT_FOUND | CONFLICT | INTERNAL_SERVER_ERROR",
    "message": "Human-readable summary message.",
    "fieldErrors": {
      "fieldName": "Specific validation failure description."
    }
  }
}
```

---

## Endpoints Overview

| Method | Endpoint | Purpose |
| :--- | :--- | :--- |
| `GET` | `/api/v1/services` | List & filter services |
| `GET` | `/api/v1/services/{service_id}` | Retrieve service details |
| `POST` | `/api/v1/services` | Create new service |
| `PUT` | `/api/v1/services/{service_id}` | Update existing service |
| `DELETE` | `/api/v1/services/{service_id}` | Delete service |
| `GET` | `/api/v1/services/{service_id}/availability` | Query available booking time slots |
| `POST` | `/api/v1/bookings` | Create new booking |
| `GET` | `/api/v1/bookings` | List customer bookings |
| `GET` | `/api/v1/bookings/{booking_id}` | Retrieve booking details |

---

## 1. List Services

### HTTP Method & Path
`GET /api/v1/services`

### Purpose
Retrieve a list of available services, optionally filtered by search keyword or category.

### Request Parameters
- **Query Parameters:**
  - `search` (string, optional): Search keyword against service name or description.
  - `category` (string, optional): Filter by category name (e.g., `"Home Cleaning"`, `"Plumbing"`, `"Electrical"`, `"Appliance"`).

### Request Body
None (`GET`).

### Response Body
Status: `200 OK`
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

### HTTP Status Codes
- `200 OK`: Request succeeded.
- `400 Bad Request`: Malformed query parameters.
- `500 Internal Server Error`: Unexpected server error.

### Validation Errors (400 Bad Request)
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid query parameters provided.",
    "fieldErrors": {
      "category": "Category parameter must be a string."
    }
  }
}
```

### Business Errors
None.

### UI Behavior
- **Loading:** Display grid of skeleton service cards while `isLoading` is true.
- **Empty:** Display friendly empty-state illustration when `data` array is empty, with a button to reset filters.
- **Error:** Render red error banner with error message and an interactive **Retry** button invoking `refetch()`.

---

## 2. Get Service Details

### HTTP Method & Path
`GET /api/v1/services/{service_id}`

### Purpose
Retrieve detailed specifications for a specific service by ID.

### Request Parameters
- **Path Parameters:**
  - `service_id` (string, required): Unique service ID.

### Request Body
None (`GET`).

### Response Body
Status: `200 OK`
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

### HTTP Status Codes
- `200 OK`: Service found.
- `404 Not Found`: Service does not exist.
- `500 Internal Server Error`: Unexpected server error.

### Business Errors (404 Not Found)
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Service with ID 'service-999' was not found."
  }
}
```

### UI Behavior
- **Loading:** Display skeleton placeholder for detail panel.
- **Empty / Not Found:** Show "Service Not Found" notice with a button returning to service list.
- **Error:** Show error message + Retry action.

---

## 3. Create Service

### HTTP Method & Path
`POST /api/v1/services`

### Purpose
Create a new service offering.

### Request Parameters
None.

### Request Body
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

### Response Body
Status: `201 Created`
```json
{
  "data": {
    "id": "service-005",
    "name": "AC Maintenance & Repair",
    "description": "Full HVAC diagnostic and coil cleaning.",
    "category": "Appliance",
    "provider": {
      "id": "prov-05",
      "name": "CoolTech Solutions"
    },
    "price": 1800,
    "currency": "NPR",
    "durationMinutes": 90,
    "rating": 5.0,
    "imageUrl": ""
  }
}
```

### HTTP Status Codes
- `201 Created`: Service created successfully.
- `400 Bad Request`: Field validation failure.
- `500 Internal Server Error`: Unexpected server error.

### Validation Errors (400 Bad Request)
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Service validation failed.",
    "fieldErrors": {
      "name": "Service name is required.",
      "price": "Price must be a positive number greater than 0.",
      "durationMinutes": "Duration must be at least 15 minutes."
    }
  }
}
```

### Business Errors
None.

### UI Behavior
- **Loading:** Disable form inputs; display spinner on modal submit button.
- **Error:** Show inline field validation messages under inputs (for 400) or general alert banner for server errors (500).
- **Success:** Close modal, trigger success toast, and invalidate `['services']` query cache to refetch updated list.

---

## 4. Update Service

### HTTP Method & Path
`PUT /api/v1/services/{service_id}`

### Purpose
Modify existing service specifications.

### Request Parameters
- **Path Parameters:**
  - `service_id` (string, required): ID of service to update.

### Request Body
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

### Response Body
Status: `200 OK`
```json
{
  "data": {
    "id": "service-001",
    "name": "Updated Home Deep Cleaning",
    "description": "Enhanced residential deep cleaning service.",
    "category": "Home Cleaning",
    "provider": {
      "id": "prov-01",
      "name": "CleanCare Premium"
    },
    "price": 2800,
    "currency": "NPR",
    "durationMinutes": 150,
    "rating": 4.8,
    "imageUrl": "/images/cleaning.png"
  }
}
```

### HTTP Status Codes
- `200 OK`: Updated successfully.
- `400 Bad Request`: Validation failure.
- `404 Not Found`: Service ID not found.
- `500 Internal Server Error`: Unexpected server error.

### UI Behavior
- **Loading:** Disable modal controls; display spinner on "Save Changes" button.
- **Error:** Keep modal open; display inline error messages or top error alert.
- **Success:** Close modal, display success toast notification, and invalidate queries (`queryClient.invalidateQueries`).

---

## 5. Delete Service

### HTTP Method & Path
`DELETE /api/v1/services/{service_id}`

### Purpose
Remove a service from the system.

### Request Parameters
- **Path Parameters:**
  - `service_id` (string, required): Unique service ID.

### Request Body
None (`DELETE`).

### Response Body
Status: `204 No Content` (empty body).

### HTTP Status Codes
- `204 No Content`: Service deleted.
- `404 Not Found`: Service not found.
- `409 Conflict`: Service cannot be deleted because active bookings exist.
- `500 Internal Server Error`: Unexpected server error.

### Business Error (409 Conflict)
```json
{
  "error": {
    "code": "ACTIVE_BOOKINGS_CONFLICT",
    "message": "Cannot delete service 'service-001' because it has active active/confirmed customer bookings."
  }
}
```

### UI Behavior
- **Loading:** Show spinner on delete confirmation dialog button.
- **Conflict Error (409):** Show modal alert explaining that the service cannot be deleted due to active customer bookings.
- **Success:** Close confirmation modal, display success toast, invalidate service query cache.

---

## 6. Get Service Availability

### HTTP Method & Path
`GET /api/v1/services/{service_id}/availability`

### Purpose
Retrieve available date and time slots for a service.

### Request Parameters
- **Path Parameters:** `service_id` (string)
- **Query Parameters:** `date` (string `YYYY-MM-DD`, optional, defaults to current date).

### Response Body
Status: `200 OK`
```json
{
  "data": {
    "serviceId": "service-001",
    "date": "2026-09-01",
    "timezone": "Asia/Kathmandu",
    "slots": [
      { "startTime": "09:00", "endTime": "11:00", "available": true },
      { "startTime": "11:30", "endTime": "13:30", "available": false },
      { "startTime": "14:00", "endTime": "16:00", "available": true }
    ]
  }
}
```

### HTTP Status Codes
- `200 OK`: Slot availability retrieved.
- `404 Not Found`: Service not found.
- `500 Internal Server Error`: Server error.

### UI Behavior
- **Loading:** Render slot skeletons.
- **Empty:** Show notice if no slots exist for the selected date.
- **Success:** Render interactive time slot badges (green for available, disabled gray for booked).

---

## 7. Create Booking

### HTTP Method & Path
`POST /api/v1/bookings`

### Purpose
Book a service time slot for a customer.

### Request Body
```json
{
  "serviceId": "service-001",
  "customerName": "Ramesh Adhikari",
  "customerEmail": "ramesh@example.com",
  "customerPhone": "9841234567",
  "scheduledDate": "2026-09-01",
  "startTime": "09:00"
}
```

### Response Body
Status: `201 Created`
```json
{
  "data": {
    "id": "booking-101",
    "bookingNumber": "CSB-2026-0101",
    "serviceId": "service-001",
    "serviceName": "Home Deep Cleaning",
    "customerName": "Ramesh Adhikari",
    "customerEmail": "ramesh@example.com",
    "scheduledDate": "2026-09-01",
    "startTime": "09:00",
    "endTime": "11:00",
    "status": "confirmed",
    "createdAt": "2026-08-31T22:00:00Z"
  }
}
```

### HTTP Status Codes
- `201 Created`: Booking confirmed.
- `400 Bad Request`: Validation failure.
- `409 Conflict`: Selected slot has already been booked by another customer.
- `500 Internal Server Error`: Server error.

### Business Error (409 Conflict)
```json
{
  "error": {
    "code": "SLOT_UNAVAILABLE",
    "message": "The time slot 09:00 on 2026-09-01 is no longer available."
  }
}
```

### UI Behavior
- **Loading:** Disable submission, display loading indicator.
- **Conflict:** Refresh availability slots and inform user to choose another time.
- **Success:** Display booking confirmation dialog with booking reference number.

---

## 8. List Bookings

### HTTP Method & Path
`GET /api/v1/bookings`

### Response Body
Status: `200 OK`
```json
{
  "data": [
    {
      "id": "booking-101",
      "bookingNumber": "CSB-2026-0101",
      "serviceId": "service-001",
      "serviceName": "Home Deep Cleaning",
      "customerName": "Ramesh Adhikari",
      "scheduledDate": "2026-09-01",
      "startTime": "09:00",
      "status": "confirmed"
    }
  ],
  "meta": { "total": 1 }
}
```

---

## 9. Get Booking Details

### HTTP Method & Path
`GET /api/v1/bookings/{booking_id}`

### Response Body
Status: `200 OK`
```json
{
  "data": {
    "id": "booking-101",
    "bookingNumber": "CSB-2026-0101",
    "serviceId": "service-001",
    "serviceName": "Home Deep Cleaning",
    "customerName": "Ramesh Adhikari",
    "scheduledDate": "2026-09-01",
    "startTime": "09:00",
    "endTime": "11:00",
    "status": "confirmed"
  }
}
```
