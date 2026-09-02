
## Decision 1: Use a Feature-First Project Architecture

### What was chosen?

The application uses a feature-first folder structure.

Feature-specific code is grouped together under the `features` directory.

Example:


src/
├── features/
│   ├── services/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── pages/
│   │
│   ├── bookings/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── pages/
│   │
│   └── booking-flow/


Shared UI components remain outside the feature folders:


components/
├── common/
└── layout/


### Why was it chosen?

The application contains clearly separated business areas such as services, bookings, and the booking flow.

Keeping the files related to each feature together makes the project easier to navigate and maintain.

For example, developers working on the Services feature can find its:

* components
* hooks
* pages

inside one folder instead of searching across several unrelated directories.

This structure also makes it easier to add new features without making the global `components` and `hooks` folders increasingly difficult to manage.

### What alternatives were considered?

A type-based structure was considered:


components/
pages/
hooks/
services/


In this approach, all components would be stored together, all hooks together, and all pages together.

### Why were the alternatives rejected?

A type-based structure works well for very small applications, but as the application grows, files belonging to the same feature become scattered across multiple directories.

For example, the booking feature could require developers to work across:


components/bookings/
pages/
hooks/
api/


The feature-first approach keeps related functionality closer together and provides better scalability and maintainability.



## Decision 2: Use TanStack React Query for Server State

### What was chosen?

TanStack React Query is used for retrieving, caching, refreshing, and updating API data.

Examples include:


useServices
useAvailability
useBookings


React Query handles server-related states such as:


loading
error
success
refetching
cached data


### Why was it chosen?

The application relies heavily on server-style data such as:

* services
* service availability
* bookings

React Query provides built-in mechanisms for:

* caching API responses
* tracking loading states
* tracking error states
* retrying failed requests
* invalidating stale data
* refetching updated information

For example, after creating or updating a booking, the relevant booking queries can be invalidated so that the UI receives fresh data.

This reduces the amount of manual asynchronous state management required inside components.

### What alternatives were considered?

The main alternatives considered were:

1. `useEffect` and `useState`
2. Redux
3. manually storing fetched data in application context

### Why were the alternatives rejected?

Using `useEffect` and `useState` for every API request would require manually implementing:

* loading state
* error state
* caching
* retries
* refetching
* stale-data management

Redux would provide global state management but would add unnecessary complexity for this application's server data requirements.

React Query is more specifically designed for asynchronous server state and therefore provides a simpler and more appropriate solution.



## Decision 3: Centralize Routing with React Router

### What was chosen?

React Router is used for application navigation.

Routing configuration is kept inside:


src/routes/AppRoutes.tsx


The common application layout is kept separately in:


src/layouts/MainLayout.tsx


The high-level structure is:


main.tsx
   ↓
BrowserRouter
   ↓
App.tsx
   ↓
AppRoutes
   ↓
MainLayout
   ↓
Outlet
   ↓
Current Route Page


### Why was it chosen?

Keeping route configuration separate from `App.tsx` gives each file a clear responsibility.

`App.tsx` handles application-level providers.

`AppRoutes.tsx` handles URL-to-page mapping.

`MainLayout.tsx` handles common page structure such as:

* Navbar
* DevToolbar
* page container

React Router's `Outlet` allows routed pages to be rendered inside the common layout without duplicating layout components.

### What alternatives were considered?

Two alternatives were considered.

The first was keeping all routes directly inside `App.tsx`.

The second was putting route definitions directly inside `MainLayout`.

### Why were the alternatives rejected?

Keeping all routing inside `App.tsx` caused the file to become responsible for too many concerns:

* providers
* navigation
* layouts
* route definitions

Putting routes directly inside `MainLayout` would also mix two different responsibilities: layout composition and route configuration.

Separating them makes the architecture easier to understand, test, and extend.



## Decision 4: Use Local State and React Query Instead of a Global State Library

### What was chosen?

The application does not use Redux or another dedicated global state management library.

Instead:

* React Query manages server state.
* `useState` manages temporary UI state.
* props and callbacks are used for communication between closely related components.

Examples of local UI state include:

* modal visibility
* selected service
* selected date
* selected time slot
* DevToolbar visibility

### Why was it chosen?

The current application does not contain complex client-side global state that needs to be shared across many unrelated parts of the application.

Most persistent data comes from the API and is already managed effectively by React Query.

Temporary interface state belongs close to the component that uses it.




is more appropriately managed inside the layout than inside a global store.

### What alternatives were considered?

The main alternatives considered were:

* Redux Toolkit
* Zustand
* React Context for application-wide state

### Why were the alternatives rejected?

Introducing a global state library would add:

* additional dependencies
* additional configuration
* more abstractions
* more files
* additional state synchronization concerns

without solving a real problem in the current scope of the application.

If future requirements introduce complex shared client-side state, a global state solution could be reconsidered.

For the current project, local state plus React Query keeps the implementation simpler and easier to maintain.



## Decision 5: Separate API/Data Logic from UI Components

### What was chosen?

API communication and data-fetching logic are kept outside presentational UI components.

The project separates responsibilities between:


API layer
    ↓
Feature hooks
    ↓
Pages/components


For example:


API
 ↓
useServices()
 ↓
ServiceListPage
 ↓
ServiceCard


Feature-specific React Query hooks are stored inside their related feature:


features/services/hooks/
features/bookings/hooks/


### Why was it chosen?

UI components should mainly be responsible for rendering information and handling user interaction.

They should not need to understand:

* API endpoints
* HTTP implementation
* request configuration
* caching rules
* query keys

Keeping these responsibilities separate makes components easier to:

* understand
* test
* reuse
* maintain

It also allows the API implementation to change without requiring major modifications to the UI.

### What alternatives were considered?

API calls could have been made directly inside page or component files.

For example:


useEffect(() => {
  fetch('/services')
    .then(...)
});


### Why were the alternatives rejected?

Making requests directly inside UI components tightly couples the interface to the API implementation.

It also leads to repeated code for:

* loading states
* errors
* retries
* caching
* request handling

Using a separate API layer together with custom React Query hooks provides clearer separation of concerns.



## Decision 6: Separate Shared Components from Feature-Specific Components

### What was chosen?

Only genuinely reusable components are stored in:


src/components/


For example:


components/common/
├── Button.tsx
├── ButtonGroup.tsx
├── Modal.tsx
└── ...

components/layout/
└── Navbar.tsx


Feature-specific components remain inside their feature.

For example:


features/services/components/
├── ServiceCard.tsx
├── AvailabilityModal.tsx
└── ServiceFormModal.tsx

features/bookings/components/
├── BookingList.tsx
├── BookingModal.tsx
└── BookingConfirmationView.tsx


### Why was it chosen?

A `Button` can be reused throughout the application and does not understand the Services or Bookings domain.

A `ServiceCard`, however, understands service-specific data and behavior and therefore belongs to the Services feature.

This distinction prevents the global components directory from becoming a collection of unrelated business components.

### What alternatives were considered?

All React components could have been placed inside one global:


components/


directory.

### Why were the alternatives rejected?

As the project grows, a single global component directory becomes increasingly difficult to navigate.

It also becomes unclear whether a component is:

* globally reusable
* service-specific
* booking-specific
* layout-specific

Separating shared and feature-specific components makes component ownership clearer.



## Decision 7: Keep the Booking Flow Modal-Based

### What was chosen?

The booking workflow is handled inside a modal instead of navigating the user through several separate pages.

The workflow includes:


Service
  ↓
Select date
  ↓
Select time
  ↓
Customer details
  ↓
Confirm booking
  ↓
Booking confirmation


After the booking succeeds, the confirmation is displayed within the same booking flow rather than navigating to a separate confirmation page.

### Why was it chosen?

The booking process is relatively short and directly related to the service the user is currently viewing.

Keeping the flow in a modal:

* preserves the user's context
* avoids unnecessary page transitions
* creates a smoother booking experience
* keeps closely related booking steps together

The confirmation can replace the form content after a successful booking, giving the user immediate feedback without requiring another navigation.

### What alternatives were considered?

Two main alternatives were considered.

The first was creating a separate URL for every booking step.

For example:


/services/1/book
/services/1/book/date
/services/1/book/customer
/bookings/confirmation/123


The second was navigating to a dedicated booking confirmation page after submission.

### Why were the alternatives rejected?

A multi-page booking flow would introduce additional routing complexity for a relatively small workflow.

A separate confirmation page was also unnecessary because confirmation is part of the immediate result of submitting the booking.

The modal approach provides a simpler interaction while still keeping the booking logic organized into reusable components.

A route-based flow could be reconsidered if the booking workflow becomes significantly larger or needs independently shareable/bookmarkable steps.



