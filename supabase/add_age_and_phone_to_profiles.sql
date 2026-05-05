-- Add age and phone columns to profiles table if they don't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Update the handle_new_user trigger to include phone and age (optional, but good practice if you want them synced from auth metadata eventually)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    full_name, 
    is_owner, 
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
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'driving_experience',
    NEW.raw_user_meta_data->>'renting_purpose',
    (NEW.raw_user_meta_data->>'age')::integer,
    NEW.raw_user_meta_data->>'phone'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    is_owner = EXCLUDED.is_owner,
    avatar_url = EXCLUDED.avatar_url,
    driving_experience = EXCLUDED.driving_experience,
    renting_purpose = EXCLUDED.renting_purpose,
    age = EXCLUDED.age,
    phone = EXCLUDED.phone;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
