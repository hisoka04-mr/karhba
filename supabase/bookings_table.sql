-- ============================================================
-- KARHBA BOOKINGS TABLE
-- Run this in Supabase SQL Editor
-- ============================================================

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  car_id        UUID NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
  renter_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  owner_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  start_date    DATE NOT NULL,
  end_date      DATE NOT NULL,
  total_price   NUMERIC(10, 3) NOT NULL,
  status        TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  message       TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Renter can view their own bookings
CREATE POLICY "Renters can view own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = renter_id);

-- Owner can view bookings for their cars
CREATE POLICY "Owners can view bookings on their cars"
  ON public.bookings FOR SELECT
  USING (auth.uid() = owner_id);

-- Authenticated users can create bookings
CREATE POLICY "Authenticated users can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = renter_id);

-- Renter can cancel their own pending bookings
CREATE POLICY "Renters can cancel own pending bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = renter_id AND status = 'pending')
  WITH CHECK (status = 'cancelled');

-- Owner can confirm or cancel bookings on their cars
CREATE POLICY "Owners can manage bookings on their cars"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = owner_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
