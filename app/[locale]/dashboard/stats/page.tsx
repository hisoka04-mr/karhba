import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, TrendingUp, Calendar, CheckCircle, XCircle } from "lucide-react";

export default async function StatsPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations("Common");
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.user_metadata?.is_owner) {
    redirect(`/${locale}`);
  }

  // Fetch owner's cars
  const { data: cars } = await supabase.from("cars").select("id").eq("owner_id", user.id);
  const carIds = cars?.map(car => car.id) || [];
  
  // Fetch bookings for these cars
  let bookings: any[] = [];
  if (carIds.length > 0) {
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .in("car_id", carIds);
    if (data) bookings = data;
  }

  // Calculate stats
  const completedBookings = bookings.filter(b => b.status === "completed" || b.status === "confirmed");
  const cancelledBookings = bookings.filter(b => b.status === "cancelled");
  const pendingBookings = bookings.filter(b => b.status === "pending");

  const totalRevenue = completedBookings.reduce((acc, curr) => acc + (curr.total_price || 0), 0);
  
  const totalDaysRented = completedBookings.reduce((acc, curr) => {
    if (curr.start_date && curr.end_date) {
      const start = new Date(curr.start_date);
      const end = new Date(curr.end_date);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return acc + Math.max(1, diffDays);
    }
    return acc;
  }, 0);

  const averagePricePerDay = totalDaysRented > 0 ? (totalRevenue / totalDaysRented).toFixed(2) : "0.00";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link href={`/${locale}/dashboard`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-primary" />
          Business Statistics
        </h1>
        <p className="text-muted-foreground mt-2">Detailed overview of your rental business performance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="glass-card rounded-2xl p-6 shadow-xl shadow-black/20 border-t-4 border-t-primary">
          <p className="text-sm font-medium text-muted-foreground mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-white">{totalRevenue} <span className="text-base text-muted-foreground">TND</span></p>
        </div>
        
        <div className="glass-card rounded-2xl p-6 shadow-xl shadow-black/20 border-t-4 border-t-blue-500">
          <p className="text-sm font-medium text-muted-foreground mb-1">Total Days Rented</p>
          <p className="text-3xl font-bold text-white">{totalDaysRented} <span className="text-base text-muted-foreground">days</span></p>
        </div>

        <div className="glass-card rounded-2xl p-6 shadow-xl shadow-black/20 border-t-4 border-t-purple-500">
          <p className="text-sm font-medium text-muted-foreground mb-1">Avg. Price / Day</p>
          <p className="text-3xl font-bold text-white">{averagePricePerDay} <span className="text-base text-muted-foreground">TND</span></p>
        </div>

        <div className="glass-card rounded-2xl p-6 shadow-xl shadow-black/20 border-t-4 border-t-green-500">
          <p className="text-sm font-medium text-muted-foreground mb-1">Completed Trips</p>
          <p className="text-3xl font-bold text-white">{completedBookings.length}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-6">Booking Status Breakdown</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Accepted / Completed</p>
            <p className="text-2xl font-bold text-white">{completedBookings.length}</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pending Requests</p>
            <p className="text-2xl font-bold text-white">{pendingBookings.length}</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Cancelled / Rejected</p>
            <p className="text-2xl font-bold text-white">{cancelledBookings.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
