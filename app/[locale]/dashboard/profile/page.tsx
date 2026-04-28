import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PlusCircle, Car, Settings, User } from "lucide-react";
import OwnerCars from "../OwnerCars";

export default async function ProfileSettingsPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations("Dashboard");
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.user_metadata?.is_owner) {
    redirect(`/${locale}`);
  }

  // Fetch owner's cars
  const { data: cars } = await supabase
    .from("cars")
    .select("id, brand, model, price_per_day, is_hidden, photos")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-lg shadow-primary/10">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">Profile <span className="text-primary">Settings</span></h1>
            <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest mt-1">Manage your fleet and account info</p>
          </div>
        </div>
        <Link
          href={`/${locale}/dashboard/cars/new`}
          className="px-8 py-4 text-sm font-black text-white bg-primary rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 flex items-center gap-3 uppercase tracking-widest"
        >
          <PlusCircle className="w-5 h-5" />
          {t("uploadCarBtn")}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar / Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card rounded-[2rem] p-8 border border-white/5 space-y-6">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Full Name</p>
              <p className="font-bold text-white">{user.user_metadata?.full_name || "Owner Name"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Email Address</p>
              <p className="font-bold text-white truncate">{user.email}</p>
            </div>
            <div className="pt-6 border-t border-white/5">
              <div className="flex items-center gap-2 text-primary">
                <Settings className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-widest">Account Type</span>
              </div>
              <p className="text-sm font-bold text-white mt-1">Car Owner / Rental Business</p>
            </div>
          </div>
        </div>

        {/* Main Content: Car Management */}
        <div className="lg:col-span-3">
          <OwnerCars cars={cars || []} />
          
          {(!cars || cars.length === 0) && (
            <div className="glass-card rounded-[2.5rem] p-16 text-center border-2 border-dashed border-white/5">
              <Car className="w-16 h-16 text-white/10 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-white mb-3">No cars listed yet</h3>
              <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                Ready to start earning? Upload your first car to kرهبa and reach thousands of renters.
              </p>
              <Link
                href={`/${locale}/dashboard/cars/new`}
                className="inline-flex items-center gap-3 px-8 py-4 text-sm font-black text-white bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all uppercase tracking-widest"
              >
                <PlusCircle className="w-5 h-5 text-primary" />
                Add Your First Car
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
