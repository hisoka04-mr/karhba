-- ============================================================
-- FIX: Cars not showing — infinite recursion in profiles RLS
-- Run this in your Supabase SQL Editor
-- ============================================================

-- STEP 1: Create a SECURITY DEFINER function to check admin status
-- This bypasses RLS, preventing the infinite recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- STEP 2: Drop ALL conflicting SELECT policies on profiles
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Owners can view renter profiles" ON public.profiles;

-- STEP 3: Recreate profiles SELECT policy (simple, no recursion)
CREATE POLICY "Enable read access for all users"
ON public.profiles FOR SELECT
USING (true);

-- STEP 4: Drop ALL conflicting SELECT policies on cars
DROP POLICY IF EXISTS "Enable read access for all users" ON public.cars;
DROP POLICY IF EXISTS "Admins can view all cars" ON public.cars;

-- STEP 5: Recreate cars SELECT policy using the safe function
CREATE POLICY "Enable read access for all users"
ON public.cars FOR SELECT
USING (
  COALESCE(is_hidden, false) = false 
  OR auth.uid() = owner_id 
  OR public.is_admin()
);

-- STEP 6: Drop and fix admin policy on bookings too
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;

CREATE POLICY "Admins can view all bookings"
ON public.bookings FOR SELECT
USING (public.is_admin());

-- STEP 7: Fix any cars with NULL is_hidden
UPDATE public.cars SET is_hidden = false WHERE is_hidden IS NULL;
ALTER TABLE public.cars ALTER COLUMN is_hidden SET DEFAULT false;

-- STEP 8: Verify — this should now return your cars
SELECT id, brand, model, owner_id, is_hidden, created_at
FROM public.cars
ORDER BY created_at DESC;
