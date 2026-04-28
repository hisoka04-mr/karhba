-- ============================================================
-- FIX: Accept/Reject bookings
-- Run this in Supabase SQL Editor
-- ============================================================

-- Create a SECURITY DEFINER function so the server action can
-- update booking status without being blocked by RLS.
-- Ownership is verified inside the function itself.

CREATE OR REPLACE FUNCTION update_booking_status(
  p_booking_id UUID,
  p_new_status TEXT,
  p_owner_id UUID
)
RETURNS void AS $$
BEGIN
  -- Only allow valid statuses
  IF p_new_status NOT IN ('confirmed', 'cancelled', 'completed') THEN
    RAISE EXCEPTION 'Invalid status: %', p_new_status;
  END IF;

  -- Update only if the caller is actually the owner
  UPDATE public.bookings
  SET status = p_new_status,
      updated_at = NOW()
  WHERE id = p_booking_id
    AND owner_id = p_owner_id;

  -- Check a row was actually updated
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Booking not found or you are not the owner';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
