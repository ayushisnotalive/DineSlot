# DineSlot

DineSlot is a restaurant table-booking system with a Bun/Express backend and a React dashboard. Restaurant owners manage restaurants, tables, opening hours, and booking requests. Customers browse restaurants, request tables, receive status notifications, and manage their bookings. Administrators manage users and roles.

## Project Status

The core booking flow is implemented, including database-level overlap protection, booking status transitions, restaurant-hours validation, customer booking history, and email notifications.

| Area | Status |
|---|---|
| Authentication and role-based API protection | Implemented, with session-hardening work remaining |
| Restaurant and resource management | Implemented |
| Customer browsing and booking requests | Implemented |
| Concurrent booking protection | Implemented with PostgreSQL GiST exclusion constraint |
| Owner confirm/reject/cancel workflow | Implemented |
| Customer booking history and cancellation | Implemented |
| Booking email notifications | Implemented as fire-and-forget delivery |
| Admin user and role management | Implemented |
| Canonical REST API naming | Pending cleanup |
| Durable email retries/audit trail | Pending |
| Automated backend tests | Pending |

## Tech Stack

- **Backend:** Bun, TypeScript, Express 5
- **Database:** PostgreSQL with `pg`
- **Database constraints:** `pgcrypto`, `btree_gist`, GiST exclusion constraint for booking overlaps
- **Cache/rate limiting:** Redis with `ioredis`
- **Authentication:** JWT access tokens, opaque refresh tokens, SHA-256 refresh-token hashes
- **Password hashing:** Argon2id
- **Validation:** Zod
- **Security middleware:** Helmet, CORS, cookie-parser, role middleware
- **Email:** Resend
- **Frontend:** React 19, TypeScript, React Router, Axios, Vite, Tailwind CSS
- **Deployment references:** Docker, Railway backend, Vercel frontend origin

## Repository Layout

```text
DineSlot/
|-- Backend/       Bun + Express + PostgreSQL API
|-- dashboard/     React/Vite frontend
|-- architecture.md
|-- report.md      Detailed audit and flow comparison
|-- README.md
`-- LICENSE
```

Backend architecture and file responsibilities are documented in [architecture.md](architecture.md). The complete audit, endpoint coverage matrix, frontend integration review, and known drawbacks are in [report.md](report.md).

## Backend Flow

```text
HTTP request
	-> router
	-> validation / rate limit / authentication / role check
	-> domain handler in src/modules
	-> PostgreSQL or Redis
	-> JSON response
	-> optional Resend notification
```

The backend is a modular monolith. Routes compose middleware and domain handlers; handlers currently perform SQL directly through the PostgreSQL pool. See [architecture.md](architecture.md) for the detailed architecture and micro-architecture summaries.

## Current API Routes

All paths below are mounted by the backend as shown. The API naming is functional but not yet fully REST-consistent.

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/` | Public | Root service response |
| POST | `/api/auth/signup` | Public | Create a customer account |
| POST | `/api/auth/login` | Public | Login and issue tokens |
| POST | `/api/auth/refresh` | Refresh cookie | Rotate refresh session |
| GET | `/api/auth/me` | Authenticated | Read current user |
| POST | `/api/auth/logout` | Public/cookie | Clear auth cookies |
| POST | `/api/restaurant/createRestaurant` | Owner | Create restaurant |
| GET | `/api/restaurants/mine` | Authenticated | List owned restaurants |
| GET | `/api/restaurants` | Public | List restaurants |
| POST | `/api/resources/createResources` | Owner | Create table/resource |
| GET | `/api/restaurants/resources` | Authenticated/owner check | List owned resources |
| GET | `/api/public/resources` | Public | List public resources |
| POST | `/api/booking/createBookings` | Authenticated | Request booking |
| GET | `/api/Booking/getbookings` | Authenticated | List customer bookings |
| PATCH | `/api/cancel/bookings/:id/cancel` | Customer/owner | Cancel future booking |
| GET | `/api/bookings/owner` | Authenticated/owner filter | List owner bookings |
| PATCH | `/api/bookings/:id/status` | Owner | Confirm or reject booking |
| POST | `/api/admin/promote` | Admin | Promote user to owner |
| GET | `/api/admin/users` | Admin | List users |
| PATCH | `/api/admin/users/role` | Admin | Change user role |
| DELETE | `/api/auth/deleteUser` | Admin | Delete user |

## Local Setup

### Backend

```bash
cd Backend
bun install
cp example.env .env
# Fill DATABASE_URL, JWT secrets, REDIS_URL, RESEND_API_KEY, and EMAIL_FROM.
bun run src/infrastructure/DB/scripts/migrate.ts
bun run start
```

The backend package currently defines `start`, but does not yet define dedicated `migrate`, `test`, `lint`, or `build` aliases.

### Dashboard

```bash
cd dashboard
npm install
npm run dev
```

Other dashboard commands:

```bash
npm run build
npm run lint
npm run preview
```

Set `VITE_API_URL` when the API is not using the default local or production URL.

## Security Notes

- Passwords are hashed with Argon2id.
- Access tokens are short-lived JWTs.
- Refresh tokens are opaque and stored as hashes in PostgreSQL.
- Owner/admin backend operations use role checks and ownership checks.
- Booking overlap is enforced by PostgreSQL, not only by frontend or application logic.
- The current token model is mixed: access tokens are available to JavaScript/local state and cookies are also used. HttpOnly-cookie-only authentication, active CSRF protection, refresh-session revocation on logout, and refresh-token reuse detection remain hardening tasks.

## Remaining Work

These items are intentionally recorded as pending rather than presented as completed:

1. Remove duplicate restaurant-route registration and standardize API paths.
2. Add a consistent `/login` frontend entry or update every redirect/link to role-specific login paths.
3. Centralize logout so it clears React/API auth state and revokes the refresh session.
4. Decide on one token transport and wire CSRF protection if cookie authentication remains.
5. Make migrations safely repeatable for named constraints and repeated alterations.
6. Add durable email delivery with retries/outbox and notification audit state.
7. Add owner-hours editing, pagination, route fallback, and shared typed API utilities.
8. Add backend and frontend integration tests, including authorization and concurrent booking tests.