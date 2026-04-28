-- ============================================================
-- KARHBA DASHBOARD FIX: Run this in Supabase SQL Editor
-- Fixes: bookings not showing on dashboard, RLS, RPC
-- ============================================================

-- 1. BOOKINGS RLS: Ensure owners can see bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Drop and recreate SELECT policies for bookings
DROP POLICY IF EXISTS "Owners can view bookings on their cars" ON public.bookings;
DROP POLICY IF EXISTS "Renters can view own bookings" ON public.bookings;

-- Owner can view bookings via direct owner_id OR via car ownership
CREATE POLICY "Owners can view bookings on their cars"
ON public.bookings FOR SELECT
USING (
  auth.uid() = owner_id
  OR EXISTS (
    SELECT 1 FROM public.cars
    WHERE public.cars.id = public.bookings.car_id
    AND public.cars.owner_id = auth.uid()
  )
);

-- Renters can view their own bookings
CREATE POLICY "Renters can view own bookings"
ON public.bookings FOR SELECT
USING (auth.uid() = renter_id);

-- 2. PROFILES RLS: Allow owners to see renter profiles (critical for JOIN)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Keep existing public read policy OR add owner-renter visibility
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Owners can view renter profiles" ON public.profiles;

-- Allow all authenticated users to view profiles (needed for joins)
CREATE POLICY "Enable read access for all users"
ON public.profiles FOR SELECT
USING (true);

-- 3. ADD phone_number column to profiles if missing
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- 4. BOOKINGS UPDATE: Ensure owners can update bookings
DROP POLICY IF EXISTS "Owners can manage bookings on their cars" ON public.bookings;
CREATE POLICY "Owners can manage bookings on their cars"
ON public.bookings FOR UPDATE
USING (auth.uid() = owner_id);

-- 5. AUTO-SET owner_id on new bookings from car data
CREATE OR REPLACE FUNCTION public.set_booking_owner_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.owner_id IS NULL THEN
    SELECT owner_id INTO NEW.owner_id FROM public.cars WHERE id = NEW.car_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_set_booking_owner_id ON public.bookings;
CREATE TRIGGER tr_set_booking_owner_id
BEFORE INSERT ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.set_booking_owner_id();

-- 6. FIX any existing bookings with missing owner_id
UPDATE public.bookings b
SET owner_id = c.owner_id
FROM public.cars c
WHERE b.car_id = c.id
AND b.owner_id IS NULL;

-- 7. UPDATE_BOOKING_STATUS RPC (3-param version for actions.ts)
CREATE OR REPLACE FUNCTION update_booking_status(
  p_booking_id UUID,
  p_new_status TEXT,
  p_owner_id UUID
)
RETURNS void AS $$
BEGIN
  IF p_new_status NOT IN ('confirmed', 'cancelled', 'completed') THEN
    RAISE EXCEPTION 'Invalid status: %', p_new_status;
  END IF;

  UPDATE public.bookings
  SET status = p_new_status,
      updated_at = NOW()
  WHERE id = p_booking_id
    AND owner_id = p_owner_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Booking not found or you are not the owner';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- DONE! Refresh your dashboard page to see the bookings.
-- ============================================================
