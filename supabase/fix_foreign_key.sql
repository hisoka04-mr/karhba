-- ============================================================
-- FIX FOREIGN KEY CONSTRAINT ("cars_owner_id_fkey")
-- Run this in your Supabase SQL Editor
-- ============================================================

-- The error happens because you have an account in 'auth.users' but no matching record in 'public.profiles'.
-- When you try to add a car, the database checks if your user ID exists in 'profiles' and fails.

-- 1. Create a function that automatically creates a profile when someone signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, is_owner)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE((NEW.raw_user_meta_data->>'is_owner')::boolean, false)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Attach the trigger to auth.users so it runs automatically
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. FIX EXISTING USERS: 
-- This will copy all your existing users from auth.users into profiles
-- so that the foreign key constraint stops failing for your current account!
INSERT INTO public.profiles (id, full_name, is_owner)
SELECT 
  id, 
  raw_user_meta_data->>'full_name', 
  COALESCE((raw_user_meta_data->>'is_owner')::boolean, false)
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;
