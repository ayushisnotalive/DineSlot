# Table_Booking_System
An open-source full-stack table booking system built with Bun and TypeScript. It features a clean, intuitive interface and can be seamlessly integrated into your restaurant for table reservations.



# ER_MODEL

```text
┌─────────────────────────┐
│          users          │
├─────────────────────────┤
│ id (PK)                 │
│ name                    │
│ email                   │
│ mobile_no               │
│ password_hash           │
│ created_at              │
└────────────┬────────────┘
             │
             │ owner_id (FK)
             │
             │ 1 user ────────< many restaurants
             ▼
┌─────────────────────────┐
│      restaurants        │
├─────────────────────────┤
│ id (PK)                 │
│ name                    │
│ owner_id (FK → users.id)│
│ address                 │
│ created_at              │
└────────────┬────────────┘
             │
             │ restaurant_id (FK)
             │
             │ 1 restaurant ──< many resources
             ▼
┌─────────────────────────┐
│        resources        │
├─────────────────────────┤
│ id (PK)                 │
│ restaurant_id (FK)      │
│ name                    │
│ type_of_table           │
│ booking_class           │
│ created_at              │
└────────────┬────────────┘
             │
             │ resource_id (FK)
             │
             │ 1 resource ────< many bookings
             ▼
┌─────────────────────────┐
│        bookings         │
├─────────────────────────┤
│ id (PK)                 │
│ user_id (FK → users.id) │
│ resource_id (FK)        │
│ start_time              │
│ end_time                │
│ status                  │
│ type_of_table (snapshot)│
│ booking_class (snapshot)│
│ created_at              │
└─────────────────────────┘
             ▲
             │
             │ user_id (FK)
             │
             │ 1 user ────────< many bookings
             │
             └─────────────── users.id
```





# MVP Architecture - Table Booking System

```text

┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                                │
│         (Postman/curl for now — no frontend yet)              │
└───────────────────────────┬────────────────────────────────┘
                             │ HTTP requests (cookies: accessToken,
                             │ refreshToken, csrfToken)
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    EXPRESS APP (app.ts)                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  MIDDLEWARE LAYER                                       │  │
│  │  - authenticate.ts  → verifies JWT, sets req.userId     │  │
│  │  - csrf.ts           → validates csrf token (not wired) │  │
│  │  - rate_limit.ts     → throttles requests (not wired)   │  │
│  │  - validator.ts      → generic validation helper        │  │
│  └───────────────────────────────────────────────────────┘  │
│                             │                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  ROUTES → MODULES (controllers/handlers)                │  │
│  │                                                          │  │
│  │  /signup, /login          → modules/auth                │  │
│  │  /restaurants              → modules/restaurant  (NEW)  │  │
│  │  /resources                 → modules/resource   (NEW)  │  │
│  │  /bookings                  → modules/booking    (NEXT) │  │
│  └───────────────────────────────────────────────────────┘  │
│                             │                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  SERVICES LAYER                                          │  │
│  │  - jwt.ts        → sign/verify access & refresh tokens   │  │
│  │  - auth.validator.ts → zod schemas                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                             │                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  INFRASTRUCTURE LAYER                                    │  │
│  │  - db.ts     → pg Pool connection                        │  │
│  │  - env.ts    → validated env vars (zod)                  │  │
│  │  - hashing.ts→ bcrypt hash/verify                         │  │
│  └───────────────────────────────────────────────────────┘  │
└───────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                     POSTGRESQL (booking schema)                │
│                                                                 │
│   users ──< restaurants ──< resources ──< bookings >── users   │
│  (owns)      (owns tables)   (gets booked)   (makes booking)   │
└─────────────────────────────────────────────────────────────┘

```


# Full end-to-end Every Route

```text
1. SIGNUP
   Client → POST /signup { name, email, mobile_no, password }
          → validate with zod (registerSchema) → parsed.data
          → check email uniqueness (SELECT, best-effort)
          → hash password (bcrypt)
          → INSERT into users (DB UNIQUE constraint = real guard)
             → catches 23505 → 409 if duplicate
          → generate accessToken (15m)
          → set httpOnly cookies: accessToken, csrfToken
          → 201 { user }

2. LOGIN
   Client → POST /login { email, password }
          → validate with zod (loginSchema) → parsed.data
          → SELECT user by email
          → if no user → generic 401 "Invalid email or password"
          → bcrypt.compare(password, password_hash)
          → if invalid → same generic 401 (prevents user enumeration)
          → generate accessToken (15m) + refreshToken (7d)
          → set httpOnly cookies: accessToken, refreshToken, csrfToken
          → 200 { user }

3. AUTHENTICATED REQUEST (any protected route)
   Client → request with accessToken cookie attached automatically
          → authenticate middleware:
              - reads req.cookies.accessToken
              - jwt.verify() with JWT_ACCESS_SECRET
              - if missing/invalid/expired → 401
              - if valid → sets req.userId, calls next()
          → route handler runs, trusts req.userId (never client-provided)

4. CREATE RESTAURANT (owner action)
   Client → POST /restaurants { name, address }  [authenticate required]
          → zod validate → parsed.data
          → INSERT restaurant with owner_id = req.userId (from token, not body)
          → 201 { restaurant }

5. CREATE RESOURCE / TABLE (owner action)
   Client → POST /resources { restaurant_id, name, type_of_table, booking_class }
          → zod validate
          → AUTHORIZATION check:
              SELECT id FROM restaurants WHERE id=$1 AND owner_id=req.userId
              → 0 rows → 403 (not your restaurant)
          → INSERT resource
          → 201 { resource }

6. CREATE BOOKING (customer action)
   Client → POST /bookings { resource_id, start_time, end_time, type_of_table, booking_class }
          → zod validate (dates, valid range)
          → BEGIN transaction
          → SELECT ... FOR UPDATE (check overlapping active bookings on resource_id)
          → if conflict → ROLLBACK → 409 "already booked"
          → if free → INSERT booking (user_id = req.userId, status='pending')
          → COMMIT
          → 201 { booking }

7. TOKEN REFRESH
   Client → POST /refresh (refreshToken cookie sent automatically)
          → verify refreshToken with JWT_REFRESH_SECRET
          → if valid → issue new accessToken, set cookie
          → if invalid/expired → 401, force re-login
```