
# Application Architecture

## Overview

The Customer Service Booking System uses a **feature-first React architecture**.

The application is divided into clear areas based on responsibility:

- shared UI components
- feature-specific components
- feature-specific hooks
- route-level pages
- layouts
- routing
- API communication
- shared types and utilities

The main goal of this architecture is to keep related functionality together while preventing route handling, API logic, UI components, and application state from becoming tightly coupled.

The high-level application flow is:


main.tsx
   ↓
BrowserRouter
   ↓
App.tsx
   ↓
Application Providers
   ↓
AppRoutes
   ↓
MainLayout
   ↓
Route Page
   ↓
Feature Components
   ↓
Feature Hooks
   ↓
API Layer
   ↓
Mock / Backend API




# Folder Structure


src/
│
├── api/
│   └── apiClient.ts
│
├── assets/
│
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── ButtonGroup.tsx
│   │   ├── Modal.tsx
│   │   └── DevToolbar.tsx
│   │
│   └── layout/
│       └── Navbar.tsx
│
├── features/
│   │
│   ├── services/
│   │   ├── components/
│   │   │   ├── ServiceCard.tsx
│   │   │   ├── AvailabilityModal.tsx
│   │   │   ├── ConfirmDeleteModal.tsx
│   │   │   ├── ServiceFormModal.tsx
│   │   │   └── TodayAvailabilityPill.tsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useServices.ts
│   │   │   └── useAvailability.ts
│   │   │
│   │   └── pages/
│   │       ├── ServiceListPage.tsx
│   │       └── ServiceDetailPage.tsx
│   │
│   ├── bookings/
│   │   ├── components/
│   │   │   ├── BookingList.tsx
│   │   │   ├── BookingModal.tsx
│   │   │   └── BookingConfirmationView.tsx
│   │   │
│   │   ├── hooks/
│   │   │   └── useBookings.ts
│   │   │
│   │   └── pages/
│   │       └── MyBookingsPage.tsx
│   │
│   └── booking-flow/
│       ├── components/
│       └── hooks/
│
├── hooks/
├── layouts/
│   └── MainLayout.tsx
│
├── routes/
│   └── AppRoutes.tsx
│
├── theme/
├── types/
├── utils/
│
├── App.tsx
├── main.tsx
├── App.css
└── index.css


The exact files may change as the application evolves, but the responsibility of each folder remains consistent.

---

# Feature Boundaries

The application is mainly divided into three functional areas.

## Services

The Services feature is responsible for displaying and managing available services.

It contains functionality such as:


Service listing
Service details
Service cards
Service creation/editing
Service deletion
Availability display
Availability lookup


Service-specific components and hooks remain inside:


features/services/


This prevents service-specific logic from being mixed with booking logic or shared UI.



## Bookings

The Bookings feature is responsible for existing customer bookings.

It includes functionality such as:


My Bookings
Booking list
Booking information
Booking confirmation display
Viewing the related service


Booking-specific React Query hooks and components are grouped inside:


features/bookings/




## Booking Flow

The booking flow handles the process of creating a new booking.

Conceptually:


Select Service
      ↓
Select Date
      ↓
Select Available Time Slot
      ↓
Enter Customer / Address Information
      ↓
Review Booking
      ↓
Confirm Booking
      ↓
Booking Confirmation


The confirmation is displayed within the same booking modal after a successful booking rather than requiring a separate page navigation.

The booking-flow area is kept separate when components or state belong specifically to the multi-step booking process rather than general booking management.



# Component Responsibilities

Components are divided according to how reusable and feature-specific they are.

## Shared Components

Reusable components that do not contain Services or Bookings business logic are stored under:


components/common/


Examples include:


Button
ButtonGroup
Modal



These components are designed to be reused across different features.

For example, `Button` does not know whether it is being used to create a booking, delete a service, or retry an API request.



## Layout Components

Reusable layout UI elements are stored under:


components/layout/


For example:


Navbar.tsx


These are individual UI pieces used to construct the overall application layout.



## Feature Components

Components that understand feature-specific data remain inside their related feature.

Examples:


features/services/components/ServiceCard.tsx

features/bookings/components/BookingList.tsx


A `ServiceCard` understands service information and therefore belongs to the Services feature rather than the global components directory.



## Pages

Pages represent route-level screens.

A component is considered a page when React Router renders it directly for a URL.

For example:


<Route
  path="/bookings"
  element={<MyBookingsPage />}
/>


Therefore:


MyBookingsPage


belongs inside:


features/bookings/pages/


Pages mainly coordinate feature components rather than containing all UI and business logic themselves.



# Layout and Routing

Routing is separated from `App.tsx`.

The route configuration is stored in:

```text
routes/AppRoutes.tsx
```

The common application layout is stored in:

```text
layouts/MainLayout.tsx
```

The relationship is:

```text
AppRoutes
   ↓
MainLayout
   ↓
Outlet
   ↓
Current Page
```

`MainLayout` is responsible for common application UI such as:

```text
Navbar
DevToolbar
Application container
```

React Router's `Outlet` renders the active route inside this layout.

This avoids repeating the Navbar and common application structure on every page.

---

# App.tsx Responsibility

`App.tsx` is intentionally kept small.

Its main responsibility is composing application-level providers and rendering the route configuration.

Conceptually:

```tsx
<QueryClientProvider client={queryClient}>
  <ToastProvider>
    <AppRoutes />
  </ToastProvider>
</QueryClientProvider>
```

Routing definitions, page components, and layout logic are kept outside `App.tsx`.

This keeps the application's root easy to understand and prevents it from becoming a large multi-purpose component.

---

# API and Service Layer

API communication is kept separate from UI components.

The general flow is:

```text
React Component
      ↓
Feature Hook
      ↓
API Function
      ↓
API Client
      ↓
Mock / Backend API
```

The shared API client is located under:


src/api/
```

For example:


apiClient.ts
```

It is responsible for common request behavior.

Feature-specific API operations are consumed through feature hooks rather than being called directly throughout the UI.

For example:

```text
ServiceListPage
      ↓
useServicesQuery()
      ↓
serviceApi.getServices()
      ↓
apiClient
```

This separates data retrieval from presentation.

A component such as `ServiceCard` does not need to know which endpoint was called or how the request was performed.

---

# React Query and Custom Hooks

TanStack React Query is used for server state.

Feature-specific hooks encapsulate React Query behavior.

Examples include:

```text
useServicesQuery
useAvailabilityQuery
useBookingsQuery
useBookingQuery
```

These hooks are responsible for operations such as:

```text
Fetching data
Caching data
Loading state
Error state
Refetching
Query invalidation
Mutation handling
```

The UI consumes the result of these hooks instead of manually implementing API state with `useEffect`.

For example:

```tsx
const servicesQuery = useServicesQuery(params);
```

The component can then respond to:

```tsx
servicesQuery.isLoading
servicesQuery.isError
servicesQuery.data
```

without needing to understand the lower-level API implementation.

---

# State Management

The application separates **server state** from **UI state**.

## Server State

Server-related data is handled by TanStack React Query.

Examples include:

```text
Services
Bookings
Availability
```

React Query handles caching, stale data, loading, errors, refetching, and mutations.

The Query Client also provides default configuration such as stale time and retry behavior.

---

## Local UI State

Temporary UI state is managed using React's built-in state management.

For example:

```tsx
const [devToolbarOpen, setDevToolbarOpen] = useState(false);
```

Other examples may include:

```text
Modal visibility
Selected date
Selected time slot
Selected service
Form state
Current booking-flow step
```

These values are kept close to the components that need them.

A global client-state library such as Redux is not currently required because the project does not contain sufficiently complex shared client-side state to justify it.

---

# Error Handling

Error handling is implemented at multiple levels.

## API / Query Errors

React Query exposes request errors to the UI.

For example:

```tsx
if (query.isError) {
  return <ErrorState />;
}
```

This allows pages and components to provide appropriate user feedback.

---

## Retry

Where appropriate, failed requests provide a Retry action.

For example:

```tsx
<Button onClick={() => query.refetch()}>
  Retry
</Button>
```

The React Query client also has retry behavior configured for queries.

---

## Form Validation Errors

Booking and service forms validate user input before performing mutations.

Validation errors are shown close to the relevant form fields or in a form-level error message.

This prevents invalid requests from being sent where possible.

---

## Booking Conflict Errors

Booking creation may fail when a selected time slot is no longer available.

This is treated differently from a generic request failure because the user needs to select another available slot.

The UI can refresh availability and allow the customer to make a new selection rather than treating the conflict as an unrecoverable application error.

---

## Loading and Empty States

The frontend explicitly handles:

```text
Loading state
Error state
Empty state
Success state
```

rather than assuming that API data will always be immediately available.

This avoids blank or misleading interfaces while asynchronous requests are running.

---

# Frontend and API Communication

The frontend follows an API-first approach.

UI components do not directly depend on hard-coded data structures scattered throughout the application.

Instead, the communication flow is:

```text
User Interaction
      ↓
Component / Page
      ↓
Feature Hook
      ↓
Query or Mutation
      ↓
API Service
      ↓
API Client
      ↓
Mock / Backend API
      ↓
Response
      ↓
React Query Cache
      ↓
Updated UI
```

For example, when creating a booking:

```text
Customer confirms booking
        ↓
Booking form calls mutation
        ↓
Booking API receives CreateBookingDto
        ↓
API validates / creates booking
        ↓
Booking response is returned
        ↓
Relevant React Query cache is updated or invalidated
        ↓
Booking confirmation is displayed
```

The frontend therefore depends on a defined API contract instead of directly manipulating the data source.

TypeScript DTOs and shared types help ensure that requests and responses follow the expected data structure.

---

# Example: Loading Services

A typical read operation follows this path:

```text
ServiceListPage
      ↓
useServicesQuery()
      ↓
serviceApi.getServices()
      ↓
apiClient
      ↓
GET services
      ↓
API response
      ↓
React Query cache
      ↓
ServiceListPage
      ↓
ServiceCard components
```

This allows the page to focus on rendering the correct state:

```text
Loading → loading UI
Error   → error UI
Empty   → empty state
Success → service cards
```

---

# Example: Creating a Booking

A mutation follows a similar pattern:

```text
BookingModal
      ↓
Validate form
      ↓
CreateBookingDto
      ↓
useCreateBookingMutation()
      ↓
bookingApi.createBooking()
      ↓
API
      ↓
Booking response
      ↓
Invalidate/update booking queries
      ↓
BookingConfirmationView
```

The successful booking data returned by the API is used to render the confirmation state.

This prevents the confirmation UI from constructing its own version of booking data.

---

# Architectural Benefits

This architecture was chosen to provide:

* **Clear separation of concerns** between routing, UI, API communication, and state management.
* **Feature isolation** so Services and Bookings can evolve independently.
* **Maintainability** because related files are kept together.
* **Reusability** through shared common UI components.
* **Testability** because hooks, pages, and presentational components can be tested independently.
* **Scalability** because new features can follow the same structure.
* **API-first development** because frontend behavior depends on defined request and response contracts.
* **Reduced duplication** by centralizing API, query, routing, and shared component behavior.


