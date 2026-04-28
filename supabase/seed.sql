-- ============================================================
-- KARHBA SEED DATA
-- Run this in Supabase SQL Editor AFTER running the schema
-- ============================================================

-- Note: In a real scenario, you'd create users in Auth first.
-- For this seed, we'll assume some profiles exist or we'll create them.

-- 1. Create a few test profiles (assuming dummy UUIDs for now)
-- Replace '00000000-0000-0000-0000-000000000001' etc. with real IDs if you have them.
-- Or better yet, we just omit profiles and let the user create them via signup.
-- HOWEVER, to see cars, we need owners.

-- Let's create a few dummy profiles. Note: These won't be in auth.users
-- so they might cause issues if RLS relies on auth.uid(), but for 'SELECT' they are fine.

INSERT INTO public.profiles (id, full_name, city, is_owner, rating)
VALUES 
  ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Ahmed Ben Ali', 'Tunis', TRUE, 4.8),
  ('b2c3d4e5-f6a7-4b6c-9d0e-1f2a3b4c5d6e', 'Sami Mansour', 'Sousse', TRUE, 4.5),
  ('c3d4e5f6-a7b8-4c7d-0e1f-2a3b4c5d6e7f', 'Ines Trabelsi', 'Djerba', TRUE, 4.9)
ON CONFLICT (id) DO NOTHING;

-- 2. Seed Cars
INSERT INTO public.cars (owner_id, brand, model, year, category, city, price_per_day, fuel_type, transmission, seats, description, photos, features)
VALUES
  (
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 
    'Renault', 'Clio 4', 2021, 'economy', 'Tunis', 90.000, 
    'essence', 'manual', 5, 
    'Very clean and fuel efficient. Perfect for city driving.', 
    ARRAY['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800'],
    ARRAY['Air Conditioning', 'Bluetooth', 'USB Port']
  ),
  (
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 
    'Volkswagen', 'Golf 7', 2019, 'economy', 'Tunis', 120.000, 
    'diesel', 'automatic', 5, 
    'Comfortable ride with great performance.', 
    ARRAY['https://images.unsplash.com/photo-1567818735868-e71b99932e29?auto=format&fit=crop&q=80&w=800'],
    ARRAY['Air Conditioning', 'Cruise Control', 'Parking Sensors']
  ),
  (
    'b2c3d4e5-f6a7-4b6c-9d0e-1f2a3b4c5d6e', 
    'Hyundai', 'Tucson', 2022, 'suv', 'Sousse', 250.000, 
    'diesel', 'automatic', 5, 
    'Modern SUV with high-end features. Spacious and safe.', 
    ARRAY['https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800'],
    ARRAY['Leather Seats', 'Panoramic Roof', 'GPS', 'Reverse Camera']
  ),
  (
    'c3d4e5f6-a7b8-4c7d-0e1f-2a3b4c5d6e7f', 
    'Peugeot', '3008', 2023, 'suv', 'Djerba', 300.000, 
    'hybrid', 'automatic', 5, 
    'Top of the line Peugeot SUV. Experience luxury in Djerba.', 
    ARRAY['https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800'],
    ARRAY['Autonomous Driving', 'Apple CarPlay', 'Heated Seats']
  ),
  (
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 
    'Kia', 'Picanto', 2020, 'economy', 'Tunis', 75.000, 
    'essence', 'manual', 4, 
    'Small car, easy to park. Ideal for solo travelers or couples.', 
    ARRAY['https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=800'],
    ARRAY['Compact Size', 'Low Consumption']
  );
