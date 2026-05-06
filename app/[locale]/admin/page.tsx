import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Users, Car, CalendarCheck, TrendingUp, ShieldAlert } from "lucide-react";
import Image from "next/image";

export default async function AdminDashboardPage({ params: { locale } }: { params: { locale: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  // Verify Admin Status
  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) {
    redirect(`/${locale}`);
  }

  // Fetch Stats
  const { count: usersCount } = await supabase.from("profiles").select("*", { count: "exact", head: true });
  const { count: carsCount } = await supabase.from("cars").select("*", { count: "exact", head: true });
  const { count: bookingsCount } = await supabase.from("bookings").select("*", { count: "exact", head: true });

  const { data: recentUsers } = await supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(5);
  const { data: recentCars } = await supabase.from("cars").select("*, profiles!owner_id(full_name)").order("created_at", { ascending: false }).limit(5);

  const stats = [
    { name: "Total Users", value: usersCount || 0, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { name: "Total Cars", value: carsCount || 0, icon: Car, color: "text-primary", bg: "bg-primary/10" },
    { name: "Total Bookings", value: bookingsCount || 0, icon: CalendarCheck, color: "text-green-500", bg: "bg-green-500/10" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <ShieldAlert className="w-8 h-8 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase">
            Admin <span className="text-indigo-400">Dashboard</span>
          </h1>
          <p className="text-white/40 mt-2 font-medium tracking-widest uppercase text-[10px]">Platform Overview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {stats.map((stat) => (
          <div key={stat.name} className="glass-card rounded-[2rem] p-8 shadow-2xl shadow-black/40 border border-white/5 relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <stat.icon className={`w-20 h-20 ${stat.color}`} />
            </div>
            <div className="flex items-center gap-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border border-white/5 shadow-lg ${stat.bg} ${stat.color}`}>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <div className="glass-card rounded-[2rem] p-8 shadow-xl shadow-black/20 border border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white">Recent Users</h2>
            <Users className="w-5 h-5 text-white/40" />
          </div>
          <div className="space-y-4">
            {recentUsers?.map((u: any) => (
              <div key={u.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  {u.avatar_url ? (
                    <div className="w-10 h-10 rounded-full relative overflow-hidden">
                      <Image src={u.avatar_url} alt={u.full_name || "User"} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60">
                      <Users className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-white text-sm">{u.full_name || "Unknown"}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${u.is_admin ? "bg-indigo-500/20 text-indigo-400" : "bg-white/10 text-white/60"}`}>
                        {u.is_admin ? "Admin" : "User"}
                      </span>
                      {u.is_owner && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest bg-primary/20 text-primary">Owner</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/40 font-medium">
                    {new Date(u.created_at || Date.now()).toLocaleDateString(locale)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Cars */}
        <div className="glass-card rounded-[2rem] p-8 shadow-xl shadow-black/20 border border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white">Recent Cars</h2>
            <Car className="w-5 h-5 text-white/40" />
          </div>
          <div className="space-y-4">
            {recentCars?.map((c: any) => (
              <div key={c.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  {c.photos?.[0] ? (
                    <div className="w-12 h-10 rounded-lg relative overflow-hidden">
                      <Image src={c.photos[0]} alt={c.brand} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white/60">
                      <Car className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-white text-sm">{c.brand} {c.model}</p>
                    <p className="text-xs text-white/40 mt-0.5">By {c.profiles?.full_name || "Unknown"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-primary">{c.price_per_day} TND<span className="text-[10px] text-white/40 font-medium">/day</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
