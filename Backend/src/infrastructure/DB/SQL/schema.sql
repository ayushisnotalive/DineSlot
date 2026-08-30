CREATE SCHEMA IF NOT EXISTS booking;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE booking.booking_status AS ENUM (
    'pending',
    'confirmed',
    'cancelled'
);

CREATE TABLE IF NOT EXISTS booking.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mobile_no VARCHAR(20),
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

CREATE INDEX IF NOT EXISTS idx_booking_resource_time
ON booking.bookings(resource_id, start_time);

CREATE INDEX IF NOT EXISTS idx_booking_user
ON booking.bookings(user_id);