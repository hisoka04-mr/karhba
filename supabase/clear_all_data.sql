-- ============================================================
-- CLEAR ALL DATA (keeps tables, policies, and structure intact)
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Delete notifications first (depends on profiles)
DELETE FROM public.notifications;

-- 2. Delete bookings (depends on cars & profiles)
DELETE FROM public.bookings;

-- 3. Delete cars (depends on profiles)
DELETE FROM public.cars;

-- 4. Delete profiles (depends on auth.users)
DELETE FROM public.profiles;

-- 5. Delete all auth users (this removes accounts)
-- Must use the auth schema admin function
DELETE FROM auth.users;

-- 6. For storage photos: go to Supabase Dashboard → Storage → "cars" bucket
--    and delete the files manually (Supabase blocks direct SQL deletes on storage).

-- Done! All data is cleared. Tables & policies remain.
