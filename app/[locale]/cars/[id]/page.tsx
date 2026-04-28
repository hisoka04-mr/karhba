import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { MapPin, Users, Fuel, Star, Calendar, Zap, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BookingForm from "@/components/cars/BookingForm";

export default async function CarDetailsPage({ params }: { params: { id: string, locale: string } }) {
  const supabase = createClient();
  const t = await getTranslations("Common");

  const { data: car, error } = await supabase
    .from("cars")
    .select(`
      *,
      profiles:owner_id (
        full_name,
        rating
      )
    `)
    .eq("id", params.id)
    .single();

  if (error || !car) {
    notFound();
  }

  const { data: { user } } = await supabase.auth.getUser();

  const isElectric = car.fuel_type?.toLowerCase() === "electric";
  const FuelIcon = isElectric ? Zap : Fuel;
  const photo = car.photos?.[0] || "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800";
  const ownerName = car.profiles?.full_name || "Owner";

  // Check if we should show the address
  let showAddress = !car.hide_address;
  if (car.hide_address && user) {
    if (user.id === car.owner_id) {
      showAddress = true;
    } else {
      // Check if user has a confirmed booking for this car
      const { data: bookings } = await supabase
        .from("bookings")
        .select("id")
        .eq("car_id", car.id)
        .eq("renter_id", user.id)
        .eq("status", "confirmed")
        .limit(1);
      
      if (bookings && bookings.length > 0) {
        showAddress = true;
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Images */}
        <div className="space-y-4">
          <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden glass-card shadow-2xl shadow-black/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo}
              alt={`${car.brand} ${car.model}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-2">
              <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
              {car.profiles?.rating ? car.profiles.rating.toFixed(1) : "New"}
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex flex-col gap-2 text-muted-foreground mb-4">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {car.city}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {car.year}</span>
              </div>
              {showAddress && car.address && (
                <div className="flex items-center gap-1 text-sm text-white/80 bg-white/5 p-2 rounded-lg border border-white/10 w-fit">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>Exact Address: {car.address}</span>
                </div>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2">
              {car.brand} {car.model}
            </h1>
            <p className="text-xl text-primary font-bold mb-8">
              {car.price_per_day} <span className="text-sm text-muted-foreground font-normal">TND / day</span>
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                <Users className="w-6 h-6 text-muted-foreground mb-2" />
                <span className="text-sm font-medium text-white">{car.seats} Seats</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                <FuelIcon className="w-6 h-6 text-muted-foreground mb-2" />
                <span className="text-sm font-medium text-white capitalize">{car.fuel_type}</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                <div className="w-6 h-6 flex items-center justify-center text-muted-foreground mb-2 text-lg font-bold">M/A</div>
                <span className="text-sm font-medium text-white capitalize">{car.transmission}</span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-3">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {car.description || "No description provided."}
              </p>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-3">Owner</h3>
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-lg font-bold">
                  {ownerName[0]?.toUpperCase() || "O"}
                </div>
                <div>
                  <p className="font-semibold text-white">{ownerName}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> Verified Owner
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Area */}
          <BookingForm carId={car.id} ownerId={car.owner_id} pricePerDay={car.price_per_day} />
        </div>
      </div>
    </div>
  );
}
