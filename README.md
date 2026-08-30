# Table Booking System

A multi-tenant restaurant table reservation backend. Restaurant owners can register their restaurant, add bookable tables, and manage incoming bookings. Customers can create accounts and book available tables, with the system preventing double-bookings at the database level even under concurrent requests.

## Tech Stack

- **Runtime:** Bun + TypeScript
- **Framework:** Express
- **Database:** PostgreSQL (hosted on Neon)
- **Auth:** JWT (access + refresh tokens), argon2/bcrypt password hashing
- **Validation:** Zod
- **Deployment:** Docker, Railway

## Architecture

The codebase follows a layered structure:

```
routes → modules (handlers) → services → infrastructure
```

- **infrastructure/** — DB connection pool, environment validation, password hashing utilities
- **services/** — JWT signing/verification, validation schemas
- **api/middleware/** — authentication, CSRF, rate limiting
- **modules/** — route handlers, grouped by domain (auth, restaurant, resource, booking)

## Key Design Decisions

**Double-booking prevention (transactions + row locking).**
Booking creation checks for overlapping time ranges on a resource inside a database transaction using `SELECT ... FOR UPDATE`. This locks matching rows for the duration of the transaction, so a second concurrent request checking the same resource/time window has to wait until the first transaction commits or rolls back. A plain `UNIQUE` constraint can't express "no overlapping time ranges," only exact duplicates — so this required row-level locking, not just a constraint.

**Snapshotting `type_of_table` / `booking_class` on `Booking`.**
These fields exist on both `Resource` and `Booking`. This is intentional denormalization: if a table's classification changes later, historical bookings retain the classification that was true at booking time, preserving accuracy for analytics.

**User enumeration prevention on login.**
Login returns an identical "Invalid email or password" message and status code whether the account doesn't exist or the password is wrong. Returning different messages would let an attacker discover which emails have accounts on the system without ever guessing a password.

**Authentication vs. authorization, kept explicit.**
`authenticate` middleware verifies the JWT and establishes *who* the requester is. Ownership checks (e.g., does this user own this restaurant before letting them add a table to it) are handled separately in each handler. Keeping these distinct prevents a whole class of bugs where "logged in" quietly gets treated as "allowed to do anything."

**httpOnly cookies + CSRF double-submit pattern.**
Access and refresh tokens are stored in `httpOnly` cookies, making them inaccessible to JavaScript and resistant to XSS. A separate, non-`httpOnly` CSRF token is issued alongside them, meant to be read by frontend JS and sent back as a header on state-changing requests, since cookies alone are auto-attached by the browser regardless of request origin.

**Database-level uniqueness as the real guard, not just application checks.**
Signup checks for an existing email before inserting, but that check alone has a race condition (two simultaneous signups with the same email could both pass the check before either inserts). The actual guarantee is a `UNIQUE` constraint on `email`, with the application catching Postgres's `23505` violation code and returning a clean `409` instead of a generic error.

## API Endpoints

| Method | Path | Auth required | Description |
|--------|------|----------------|--------------|
| POST | /api/auth/signup | No | Create a new user account |
| POST | /api/auth/login | No | Log in, issues access + refresh tokens |
| POST | /api/auth/refresh | No (refresh token cookie) | Issue a new access token |
| POST | /restaurants | Yes | Create a restaurant (caller becomes owner) |
| POST | /resources | Yes | Add a table to a restaurant (owner-only) |
| POST | /bookings | Yes | Book a table (transaction-safe conflict check) |
| GET | /bookings/me | Yes | List the current user's bookings |
| PATCH | /bookings/:id/cancel | Yes | Cancel a booking (customer or restaurant owner) |

## Known Limitations / Next Steps

- Refresh tokens are reissued on each `/refresh` call but reuse detection (tracking token families in the DB to detect and respond to token theft) isn't implemented yet.
- CSRF middleware is written but not yet wired into all protected routes.
- Rate limiting middleware exists but isn't yet applied.
- No frontend yet — API-only, tested via Postman. An owner dashboard is in progress.

## Running Locally

```bash
cd Backend
bun install
cp .env.example .env   # fill in real values
bun run scripts/migrate.ts
bun run start
```