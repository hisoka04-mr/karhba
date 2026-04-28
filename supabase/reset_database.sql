-- ============================================================
-- KARHBA RESET: DELETE ALL ACCOUNTS & CAR DATA
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Delete notifications
DELETE FROM public.notifications;

-- 2. Delete bookings
DELETE FROM public.bookings;

-- 3. Delete car listings
DELETE FROM public.cars;

-- 4. Delete user profiles
DELETE FROM public.profiles;

-- 5. Delete authentication accounts
-- NOTE: This removes everyone from the Auth system.
DELETE FROM auth.users;

-- ============================================================
-- TO DELETE STORAGE FILES:
-- 1. Go to Supabase Dashboard -> Storage
-- 2. Open the 'cars' bucket
-- 3. Select all files and click 'Delete'
-- ============================================================
