"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle, XCircle, Calendar, Car as CarIcon, User } from "lucide-react";
import toast from "react-hot-toast";

export default function BookingRequests({ initialBookings }: { initialBookings: any[] }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleUpdateStatus = async (id: string, status: "confirmed" | "cancelled") => {
    setLoadingId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("bookings")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      toast.success(`Booking ${status} successfully`);
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err: any) {
      toast.error(err.message || "Failed to update booking status");
    } finally {
      setLoadingId(null);
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center mt-8 shadow-xl shadow-black/20">
        <h3 className="text-xl font-bold text-white mb-2">No pending requests</h3>
        <p className="text-muted-foreground">You have no new rental requests at the moment.</p>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-white mb-6">Pending Requests</h2>
      <div className="space-y-4">
        {bookings.map((booking) => {
          const carName = booking.cars ? `${booking.cars.brand} ${booking.cars.model}` : "Unknown Car";
          // We try to grab the renter name. The nested alias depends on the exact postgrest query
          // If we can't find it, we just show "A user"
          const renterName = booking.profiles?.full_name || booking.renter?.full_name || "A user";
          
          return (
            <div key={booking.id} className="glass-card p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-black/20">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2 text-white/80">
                  <User className="w-5 h-5 text-primary" />
                  <span className="font-semibold">{renterName}</span>
                  <span className="text-muted-foreground">wants to rent your car</span>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-white/90">
                    <CarIcon className="w-4 h-4 text-muted-foreground" />
                    {carName}
                  </div>
                  <div className="flex items-center gap-2 text-white/90">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    {booking.start_date} → {booking.end_date}
                  </div>
                </div>

                <div className="text-primary font-bold">
                  {booking.total_price} TND <span className="text-sm font-normal text-muted-foreground">total</span>
                </div>
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <button
                  onClick={() => handleUpdateStatus(booking.id, "cancelled")}
                  disabled={loadingId === booking.id}
                  className="flex-1 md:flex-none px-6 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
                <button
                  onClick={() => handleUpdateStatus(booking.id, "confirmed")}
                  disabled={loadingId === booking.id}
                  className="flex-1 md:flex-none px-6 py-2.5 rounded-xl bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  Accept
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
