-- ============================================================
-- KARHBA DATABASE UPDATE
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Add new columns to the cars table
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS hide_address BOOLEAN DEFAULT false;
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT false;

-- 2. Update the existing RLS policy for reading cars to only show non-hidden cars
DROP POLICY IF EXISTS "Enable read access for all users" ON public.cars;

-- Allow anyone to view non-hidden cars, and owners to view all their cars
CREATE POLICY "Enable read access for all users" 
ON public.cars 
FOR SELECT 
USING (is_hidden = false OR auth.uid() = owner_id);

