-- Add is_admin column to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Update the handle_new_user trigger to include is_admin
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    full_name, 
    is_owner, 
    is_admin,
    avatar_url, 
    driving_experience, 
    renting_purpose,
    age,
    phone
  )
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE((NEW.raw_user_meta_data->>'is_owner')::boolean, false),
    COALESCE((NEW.raw_user_meta_data->>'is_admin')::boolean, false),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'driving_experience',
    NEW.raw_user_meta_data->>'renting_purpose',
    (NEW.raw_user_meta_data->>'age')::integer,
    NEW.raw_user_meta_data->>'phone'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    is_owner = EXCLUDED.is_owner,
    is_admin = EXCLUDED.is_admin,
    avatar_url = EXCLUDED.avatar_url,
    driving_experience = EXCLUDED.driving_experience,
    renting_purpose = EXCLUDED.renting_purpose,
    age = EXCLUDED.age,
    phone = EXCLUDED.phone;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add RLS policies for admins

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Admins can view all cars
CREATE POLICY "Admins can view all cars"
  ON public.cars FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Admins can view all bookings
CREATE POLICY "Admins can view all bookings"
  ON public.bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true
    )
  );
