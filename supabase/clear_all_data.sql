-- ============================================================
-- CLEAR ALL DATA (removes all accounts, photos, and records)
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Delete messages and chats
DELETE FROM public.messages;
DELETE FROM public.chats;

-- 2. Delete notifications
DELETE FROM public.notifications;

-- 3. Delete bookings
DELETE FROM public.bookings;

-- 4. Delete cars (this removes car listings)
DELETE FROM public.cars;

-- 5. Delete profiles
DELETE FROM public.profiles;

-- 6. Delete all auth users (this removes the accounts)
DELETE FROM auth.users;

-- 7. To delete storage files (photos):
-- Supabase blocks direct SQL deletes on storage.objects for safety.
-- Please go to Supabase Dashboard -> Storage and:
-- 1. Open 'avatars' bucket -> Delete all files
-- 2. Open 'cars' bucket -> Delete all files

-- Done! All database records and accounts are cleared.


