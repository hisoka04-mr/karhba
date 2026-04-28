"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateBookingStatus(bookingId: string, status: "confirmed" | "cancelled" | "completed") {
  const supabase = createClient();

  // Verify the current user is the owner of this booking
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Fetch the booking — RLS will only show bookings where user is owner
  const { data: booking, error: fetchErr } = await supabase
    .from("bookings")
    .select("id, owner_id, renter_id, status, cars(brand, model)")
    .eq("id", bookingId)
    .single();

  if (fetchErr || !booking) {
    console.error("Error fetching booking:", fetchErr);
    throw new Error("Booking not found or access denied");
  }

  // Double-check ownership
  if (booking.owner_id !== user.id) {
    throw new Error("You are not the owner of this booking");
  }

  // Use raw SQL via rpc to bypass RLS for the update since the owner
  // has already been verified above. Try both RPC signatures since the DB
  // may have either the 3-param or 2-param version of the function.
  let updateErr: any = null;
  
  // Try 3-param version first (from unified_db_fix.sql)
  const result3 = await supabase.rpc("update_booking_status", {
    p_booking_id: bookingId,
    p_new_status: status,
    p_owner_id: user.id,
  });
  
  if (result3.error) {
    // Try 2-param version (from dashboard_data_fix.sql)
    const result2 = await supabase.rpc("update_booking_status", {
      p_booking_id: bookingId,
      p_new_status: status,
    });
    
    if (result2.error) {
      // Last resort: direct update (may be blocked by RLS)
      const { error: directErr } = await supabase
        .from("bookings")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", bookingId)
        .eq("owner_id", user.id);
      updateErr = directErr;
    }
  }

  if (updateErr) {
    console.error("Error updating booking status RPC:", updateErr);
    throw new Error(`Database error: ${updateErr.message}`);
  }

  // Send notification to renter
  if (status === "confirmed" || status === "cancelled") {
    // Safely extract car info (Supabase joins can return an array or object)
    const carData = Array.isArray(booking.cars) ? booking.cars[0] : booking.cars;
    const carName = carData ? `${(carData as any).brand} ${(carData as any).model}` : "your car";
    
    const message = status === "confirmed"
      ? `Your booking request for ${carName} has been accepted!`
      : `Your booking request for ${carName} was declined by the owner.`;

    const { error: notifyErr } = await supabase.from("notifications").insert([{
      user_id: booking.renter_id,
      type: `booking_${status}`,
      message
    }]);

    if (notifyErr) {
      console.error("Error sending notification:", notifyErr);
      // We don't throw here to avoid failing the whole status update just because notification failed
    }
  }

  // Revalidate the dashboard and the main page to ensure fresh data
  revalidatePath("/", "layout");
}

export async function toggleCarVisibility(carId: string, isHidden: boolean) {
  const supabase = createClient();
  const { error } = await supabase.from("cars").update({ is_hidden: isHidden }).eq("id", carId);

  if (error) {
    console.error("Error updating car visibility:", error);
    throw new Error(error.message);
  }

  revalidatePath("/", "layout");
}

export async function deleteCar(carId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("cars").delete().eq("id", carId);

  if (error) {
    console.error("Error deleting car:", error);
    throw new Error(error.message);
  }

  revalidatePath("/", "layout");
}
