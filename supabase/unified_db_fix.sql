-- ============================================================
-- KARHBA UNIFIED DATABASE FIX: BOOKINGS & NOTIFICATIONS
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ============================================================

-- 1. Create notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 2. Create/Update notifications policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;

CREATE POLICY "Users can view their own notifications" 
ON public.notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" 
ON public.notifications FOR INSERT WITH CHECK (true);

-- 3. Ensure bookings table has correct RLS for Owners
-- (Assuming the table already exists, we just ensure policies are correct)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Owners can view bookings on their cars" ON public.bookings;
DROP POLICY IF EXISTS "Owners can manage bookings on their cars" ON public.bookings;

CREATE POLICY "Owners can view bookings on their cars"
ON public.bookings FOR SELECT
USING (auth.uid() = owner_id);

CREATE POLICY "Owners can manage bookings on their cars"
ON public.bookings FOR UPDATE
USING (auth.uid() = owner_id);

-- 4. Create RPC function for marking notifications as read
CREATE OR REPLACE FUNCTION mark_notifications_read(p_user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.notifications
  SET is_read = true
  WHERE user_id = p_user_id AND is_read = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create RPC function for updating booking status
-- This bypasses RLS issues during the update process in server actions
CREATE OR REPLACE FUNCTION update_booking_status(
  p_booking_id UUID,
  p_new_status TEXT,
  p_owner_id UUID
)
RETURNS void AS $$
BEGIN
  -- Only allow valid statuses
  IF p_new_status NOT IN ('confirmed', 'cancelled', 'completed') THEN
    RAISE EXCEPTION 'Invalid status: %', p_new_status;
  END IF;

  -- Update only if the caller is actually the owner
  UPDATE public.bookings
  SET status = p_new_status,
      updated_at = NOW()
  WHERE id = p_booking_id
    AND owner_id = p_owner_id;

  -- Check a row was actually updated
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Booking not found or you are not the owner';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Trigger for notifications on booking creation (Optional but recommended)
-- If you want the system to automatically notify owners without relying on client code:
/*
CREATE OR REPLACE FUNCTION notify_owner_on_booking()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notifications (user_id, type, message)
  VALUES (NEW.owner_id, 'booking_request', 'You have a new rental request!');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_notify_owner_on_booking ON public.bookings;
CREATE TRIGGER tr_notify_owner_on_booking
AFTER INSERT ON public.bookings
FOR EACH ROW EXECUTE FUNCTION notify_owner_on_booking();
*/

-- ============================================================
-- FINISHED. Please copy and run this in your SQL Editor.
-- ============================================================
