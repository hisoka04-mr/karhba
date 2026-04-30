import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PlusCircle, Car, Calendar, TrendingUp } from "lucide-react";
import OwnerBookings from "./OwnerBookings";
import OwnerCars from "./OwnerCars";
import PendingRequests from "./PendingRequests";

export default async function DashboardPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations("Dashboard");
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.user_metadata?.is_owner) {
    redirect(`/${locale}`);
  }

  // Fetch owner's cars
  const { data: cars } = await supabase.from("cars").select("id, brand, model, price_per_day, is_hidden, photos").eq("owner_id", user.id).order("created_at", { ascending: false });
  const carIds = cars?.map(car => car.id) || [];
  
  // Fetch bookings for these cars
  let bookings: any[] = [];
  if (carIds.length > 0) {
    const { data, error: bookingsError } = await supabase
      .from("bookings")
      .select(`
        *,
        cars (brand, model, photos),
        renter:profiles!renter_id (full_name, avatar_url, driving_experience, renting_purpose)
      `)
      .in("car_id", carIds)
      .order("created_at", { ascending: false });
    if (bookingsError) {
      console.error("Error fetching bookings:", bookingsError);
    }
    if (data) bookings = data;
  }

  const activeBookings = bookings.filter(b => b.status === "pending" || b.status === "confirmed").length;
  const revenue = bookings.filter(b => b.status === "completed" || b.status === "confirmed").reduce((acc, curr) => acc + (curr.total_price || 0), 0);

  const stats = [
    { name: t("totalCars"), value: cars?.length.toString() || "0", icon: Car },
    { name: t("activeBookings"), value: activeBookings.toString(), icon: Calendar },
    { name: t("revenue"), value: `${revenue} TND`, icon: TrendingUp },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase">
            {user.user_metadata?.full_name?.split(' ')[0] || 'Owner'}&apos;s <span className="text-primary">Dashboard</span>
          </h1>
          <p className="text-white/40 mt-2 font-medium tracking-widest uppercase text-[10px]">{t("manageCarsBookings")}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/dashboard/stats`}
            className="px-6 py-3 text-sm font-black text-white bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all flex items-center gap-2 uppercase tracking-widest"
          >
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="hidden sm:inline">Analytics</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {stats.map((stat) => (
          <div key={stat.name} className="glass-card rounded-[2rem] p-8 shadow-2xl shadow-black/40 border border-white/5 relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <stat.icon className="w-20 h-20 text-white" />
            </div>
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-lg shadow-primary/10">
                <stat.icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{stat.name}</p>
                <p className="text-3xl font-black text-white mt-1 tracking-tight">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-24">
        {/* Pending Requests Section - THE FOCUS */}
        <div className="relative">
          <PendingRequests bookings={bookings} />
        </div>

        {/* History Section */}
        <OwnerBookings bookings={bookings} />
      </div>
    </div>
  );
}
