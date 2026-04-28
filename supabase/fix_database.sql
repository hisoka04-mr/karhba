-- ============================================================
-- KARHBA DATABASE FIXES
-- Run this in your Supabase SQL Editor to fix publishing and viewing cars
-- ============================================================

-- 1. Ensure the cars table exists with all necessary columns
CREATE TABLE IF NOT EXISTS public.cars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  category TEXT NOT NULL,
  city TEXT NOT NULL,
  price_per_day NUMERIC(10,3) NOT NULL,
  fuel_type TEXT NOT NULL,
  transmission TEXT NOT NULL,
  seats INTEGER NOT NULL,
  description TEXT,
  photos TEXT[],
  features TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS) on the cars table
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable read access for all users" ON public.cars;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.cars;
DROP POLICY IF EXISTS "Enable update for users based on owner_id" ON public.cars;
DROP POLICY IF EXISTS "Enable delete for users based on owner_id" ON public.cars;

-- 4. Create proper RLS Policies for CARS

-- Allow anyone (even unauthenticated users) to view cars
CREATE POLICY "Enable read access for all users" 
ON public.cars 
FOR SELECT 
USING (true);

-- Allow authenticated users to publish a car, but only if they set themselves as the owner
CREATE POLICY "Enable insert for authenticated users only" 
ON public.cars 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = owner_id);

-- Allow owners to update their own cars
CREATE POLICY "Enable update for users based on owner_id" 
ON public.cars 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = owner_id);

-- Allow owners to delete their own cars
CREATE POLICY "Enable delete for users based on owner_id" 
ON public.cars 
FOR DELETE 
TO authenticated 
USING (auth.uid() = owner_id);


-- ============================================================
-- 5. Fix for Profiles/Companies (Registration RLS issues)
-- ============================================================
-- If you also had issues registering users because of RLS on profiles:

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  city TEXT,
  is_owner BOOLEAN DEFAULT false,
  rating NUMERIC(2,1) DEFAULT 0.0
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.profiles;

-- Allow anyone to view profiles
CREATE POLICY "Enable read access for all users" 
ON public.profiles 
FOR SELECT 
USING (true);

-- Allow authenticated users to insert their own profile
CREATE POLICY "Enable insert for authenticated users only" 
ON public.profiles 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Enable update for users based on id" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);
