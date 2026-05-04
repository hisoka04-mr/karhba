-- Add renting_purpose column to bookings table
-- This stores the purpose of renting per booking (moved from signup to booking time)
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS renting_purpose TEXT;

-- Optional: Add a comment for clarity
COMMENT ON COLUMN bookings.renting_purpose IS 'Purpose of renting: tourism, business, commute, or occasion';
