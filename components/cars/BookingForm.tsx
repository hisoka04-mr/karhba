"use client";

import { useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface BookingFormProps {
  carId: string;
  ownerId: string;
  pricePerDay: number;
}

export default function BookingForm({ carId, ownerId, pricePerDay }: BookingFormProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Calculate total price based on dates
  const totalPrice = useMemo(() => {
    if (!startDate || !endDate) return pricePerDay;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // At least 1 day minimum
    return Math.max(1, diffDays) * pricePerDay;
  }, [startDate, endDate, pricePerDay]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      toast.error("Please select start and end dates");
      return;
    }
    
    if (new Date(startDate) > new Date(endDate)) {
      toast.error("End date must be after start date");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      
      // Get current logged-in user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to request a rental");
        return;
      }
      
      if (user.id === ownerId) {
        toast.error("You cannot rent your own car");
        return;
      }

      // Insert booking request
      const { data: booking, error } = await supabase.from("bookings").insert([{
        car_id: carId,
        owner_id: ownerId,
        renter_id: user.id,
        start_date: startDate,
        end_date: endDate,
        total_price: totalPrice,
        status: "pending"
      }]).select().single();

      if (error) {
        console.error("Booking Error:", error);
        throw new Error(error.message);
      }

      // Insert notification for the owner
      await supabase.from("notifications").insert([{
        user_id: ownerId,
        type: "booking_request",
        message: `You have a new rental request for ${startDate} to ${endDate}.`
      }]);

      toast.success("Rental request sent successfully!");
      // Reset form
      setStartDate("");
      setEndDate("");
      
      // Redirect to bookings page to see the pending request
      // We will assume the locale is in the pathname or we can just refresh
      router.push("/en/bookings"); // Simplified redirect, ideal way is to use next-intl navigation
      router.refresh();
      
    } catch (err: any) {
      toast.error(err.message || "Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  // Get tomorrow's date for the min attribute
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="glass-card p-6 rounded-3xl mt-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-white/80">Start Date</label>
            <input 
              type="date" 
              required
              min={minDate}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-white [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-white/80">End Date</label>
            <input 
              type="date" 
              required
              min={startDate || minDate}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-white [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
            />
          </div>
        </div>

        <div className="flex justify-between items-center py-2 border-t border-white/10">
          <span className="text-white/80">Total Price</span>
          <span className="text-xl font-bold text-primary">{totalPrice} TND</span>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 text-lg font-bold text-white bg-primary rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 flex items-center justify-center gap-2 mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Sending Request..." : "Request to Rent"}
        </button>
      </form>
      <p className="text-center text-sm text-muted-foreground mt-3">
        You won&apos;t be charged yet. The owner has 24h to accept.
      </p>
    </div>
  );
}
