import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { Calendar, Car, CheckCircle, Clock, XCircle, AlertCircle, MapPin } from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; icon: any; className: string }> = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle,
    className: "text-green-400 bg-green-400/10 border-green-400/20",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "text-red-400 bg-red-400/10 border-red-400/20",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle,
    className: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  },
};

export default async function BookingsPage() {
  const supabase = createClient();
  const locale = await getLocale();
  const t = await getTranslations("Bookings");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select(`
      *,
      cars (
        brand,
        model,
        year,
        photos,
        city,
        price_per_day,
        address,
        hide_address
      )
    `)
    .eq("renter_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching bookings:", error);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-3">
          {t("title")}
        </h1>
        <p className="text-muted-foreground text-lg">
          Track and manage all your car rentals in one place.
        </p>
      </div>

      {/* Content */}
      {!bookings || bookings.length === 0 ? (
        <EmptyState locale={locale} />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking: any, index: number) => (
            <BookingCard key={booking.id} booking={booking} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}

function BookingCard({ booking, index }: { booking: any; index: number }) {
  const car = booking.cars;
  const status = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.pending;
  const StatusIcon = status.icon;
  const photo = car?.photos?.[0] ?? null;

  const carName = car ? `${car.brand || car.make || "Car"} ${car.model} (${car.year})` : "Car details unavailable";
  const carCity = car?.city || car?.location;
  
  const showAddress = booking.status === "confirmed" || booking.status === "completed" || !car?.hide_address;
  const carAddress = car?.address;

  const startDate = booking.start_date
    ? new Date(booking.start_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : "—";
  const endDate = booking.end_date
    ? new Date(booking.end_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : "—";

  return (
    <div
      className="glass-card rounded-2xl overflow-hidden hover:border-white/15 transition-all duration-300 animate-fade-up"
      style={{ animationDelay: `${index * 0.08}s`, animationFillMode: "both" }}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Car image */}
        <div className="sm:w-44 h-36 sm:h-auto bg-secondary/40 relative shrink-0 overflow-hidden">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt={`${car?.make} ${car?.model}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Car className="w-10 h-10 text-muted-foreground/30" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 p-5 flex flex-col gap-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-bold text-lg">
                {carName}
              </h3>
              <div className="mt-1 flex flex-col gap-1">
                {carCity && (
                  <p className="text-muted-foreground text-sm flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {carCity}
                  </p>
                )}
                {showAddress && carAddress && (
                  <p className="text-primary text-sm flex items-center gap-1 font-medium bg-primary/10 px-2 py-0.5 rounded-md w-fit">
                    <MapPin className="w-3.5 h-3.5" />
                    {carAddress}
                  </p>
                )}
              </div>
            </div>

            {/* Status badge */}
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${status.className}`}>
              <StatusIcon className="w-3.5 h-3.5" />
              {status.label}
            </span>
          </div>

          {/* Dates + Price */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{startDate} → {endDate}</span>
            </div>
            {booking.total_price && (
              <div className="font-bold text-primary">
                {booking.total_price} TND total
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ locale }: { locale: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 glass-card rounded-3xl border-dashed">
      <div className="w-20 h-20 rounded-2xl bg-secondary/60 flex items-center justify-center mb-6">
        <Calendar className="w-10 h-10 text-muted-foreground/50" />
      </div>
      <h2 className="text-2xl font-bold mb-2">No bookings yet</h2>
      <p className="text-muted-foreground mb-8 text-center max-w-xs">
        You haven&apos;t made any bookings yet. Browse cars and book your first ride!
      </p>
      <a
        href={`/${locale}/cars`}
        className="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-primary/20"
      >
        <Car className="w-4 h-4" />
        Browse Cars
      </a>
    </div>
  );
}
