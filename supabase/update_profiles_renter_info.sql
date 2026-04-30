-- ============================================================
-- KARHBA UPDATE: Add renter info to profiles table
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Add new columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS driving_experience TEXT,
ADD COLUMN IF NOT EXISTS renting_purpose TEXT;

-- 2. Update the handle_new_user trigger to include these fields
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    full_name, 
    is_owner, 
    avatar_url, 
    driving_experience, 
    renting_purpose
  )
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE((NEW.raw_user_meta_data->>'is_owner')::boolean, false),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'driving_experience',
    NEW.raw_user_meta_data->>'renting_purpose'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    is_owner = EXCLUDED.is_owner,
    avatar_url = EXCLUDED.avatar_url,
    driving_experience = EXCLUDED.driving_experience,
    renting_purpose = EXCLUDED.renting_purpose;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Sync existing data from auth.users to public.profiles
UPDATE public.profiles p
SET 
  avatar_url = u.raw_user_meta_data->>'avatar_url',
  driving_experience = u.raw_user_meta_data->>'driving_experience',
  renting_purpose = u.raw_user_meta_data->>'renting_purpose'
FROM auth.users u
WHERE p.id = u.id;

-- 4. Ensure RLS allows users to update their own profiles (if not already set)
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.profiles;
CREATE POLICY "Enable update for users based on id" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

-- ============================================================
-- DONE!
-- ============================================================
