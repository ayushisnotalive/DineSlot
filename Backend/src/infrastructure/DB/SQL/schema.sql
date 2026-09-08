CREATE SCHEMA IF NOT EXISTS booking;

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS btree_gist;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type
        WHERE typname = 'booking_status'
        AND typnamespace = 'booking'::regnamespace
    ) THEN
        CREATE TYPE booking.booking_status AS ENUM (
            'pending',
            'confirmed',
            'cancelled'
        );
    END IF;
END
$$;

CREATE TABLE IF NOT EXISTS booking.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mobile_no VARCHAR(20),
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Added separately via ALTER TABLE so it applies correctly even if
-- the users table already existed before this column was introduced.
ALTER TABLE booking.users
ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'customer'
CHECK (role IN ('customer', 'owner', 'admin'));

CREATE TABLE IF NOT EXISTS booking.restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    owner_id UUID NOT NULL REFERENCES booking.users(id),
    address VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS booking.resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES booking.restaurants(id),
    name VARCHAR(100) NOT NULL,
    type_of_table VARCHAR(50) NOT NULL,
    booking_class VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS booking.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    resource_id UUID NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status booking.booking_status NOT NULL DEFAULT 'pending',
    type_of_table VARCHAR(50) NOT NULL,
    booking_class VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_user
        FOREIGN KEY (user_id)
        REFERENCES booking.users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_booking_resource
        FOREIGN KEY (resource_id)
        REFERENCES booking.resources(id)
        ON DELETE CASCADE
);

-- Valid time ranges only.
ALTER TABLE booking.bookings
ADD CONSTRAINT chk_booking_time_order
CHECK (start_time < end_time);

-- The double-booking fix: no two non-cancelled bookings for the same
-- resource may have overlapping time ranges. Enforced by Postgres at
-- write time — no application-level lock or transaction trick can
-- bypass this, and it stays correct even if new code paths insert
-- bookings later (admin tools, imports, etc).
ALTER TABLE booking.bookings
ADD CONSTRAINT no_overlapping_bookings
EXCLUDE USING gist (
    resource_id WITH =,
    tsrange(start_time, end_time) WITH &&
)
WHERE (status <> 'cancelled');

CREATE INDEX IF NOT EXISTS idx_booking_resource_time
ON booking.bookings(resource_id, start_time);

CREATE INDEX IF NOT EXISTS idx_booking_user
ON booking.bookings(user_id);

CREATE TABLE IF NOT EXISTS booking.refresh_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES booking.users(id)
        ON DELETE CASCADE,

    token_hash TEXT NOT NULL UNIQUE,

    expires_at TIMESTAMPTZ NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    revoked_at TIMESTAMPTZ,

    replaced_by UUID
        REFERENCES booking.refresh_sessions(id)
);

-- One-time admin seed. Safe to re-run: does nothing if the account
-- doesn't exist yet, or already has this role.
-- If the account doesn't exist yet, sign up with this email first,
-- then re-run this statement.
UPDATE booking.users
SET role = 'admin'
WHERE email = 'testdeploy1@gmail.com';