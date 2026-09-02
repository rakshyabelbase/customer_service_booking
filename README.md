# Customer Service Booking System

A small production-style React application for browsing services, checking availability, creating bookings, and managing existing bookings.

The project focuses on frontend architecture, API-first development, reusable components, state handling, testing, and maintainability.

## Features

- Browse and filter services
- View service details and available booking slots
- Create a booking and view its confirmation
- View customer bookings and their associated services
- Create, edit, and delete services
- Loading, empty, error, and validation states
- Booking slot conflict handling
- Browser-based mock API integration

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- TanStack React Query
- Jest
- React Testing Library
- Lucide React

## Getting Started

Install dependencies:

```bash
npm install
```

Start the application:

```bash
npm run dev
```

The mock API runs in the browser, so no separate API server is required.

Run tests:

```bash
npm test
```

Create a production build:

```bash
npm run build
```

See [docs/setup.md](docs/setup.md) for prerequisites, environment configuration, mock API details, and additional test commands.

## Project Structure

The project follows a feature-first architecture:

```text
src/
|-- api/
|   |-- client/
|   |-- mock/
|   `-- services/
|-- components/
|   |-- common/
|   `-- layout/
|-- features/
|   |-- bookings/
|   `-- services/
|-- layouts/
|-- routes/
|-- test-utils/
|-- types/
`-- utils/
```

Feature-specific components, hooks, and pages live in their respective feature folders. Shared UI components remain in `components/`.

See [docs/architecture.md](docs/architecture.md) for the complete architecture explanation.

## Documentation

Detailed documentation is available in the `docs/` directory:

- [Architecture](docs/architecture.md) — application structure and responsibilities
- [Technical decisions](docs/decisions.md) — key decisions and alternatives considered
- [API contract](docs/api-contract.md) — frontend API contract and endpoint definitions
- [Setup](docs/setup.md) — installation, environment setup, mock API, and tests

## Testing

Automated tests cover important service and booking flows, including list and detail rendering, booking interactions, validation, conflicts, and loading and error states.

```bash
npm test
```

## Architecture Summary

```text
Route Page
    |
    v
Feature Components
    |
    v
Feature Hooks
    |
    v
TanStack React Query
    |
    v
API Layer
    |
    v
Browser Mock API
```

This separation keeps the UI, data fetching, routing, and business functionality easier to understand, test, and maintain.
