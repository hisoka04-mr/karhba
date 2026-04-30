"use client"

import { useState } from "react"
import { Check, X, Clock, Calendar, User, Car, Target } from "lucide-react"
import { updateBookingStatus } from "./actions"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { useTranslations, useLocale } from "next-intl"
import Image from "next/image"

interface BookingRequestCardProps {
  booking: any
}

export default function BookingRequestCard({ booking }: BookingRequestCardProps) {
  const t = useTranslations("Dashboard");
  const locale = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);

  const handleStatusUpdate = async (status: "confirmed" | "cancelled") => {
    setLoading(true);
    try {
      await updateBookingStatus(booking.id, status);
      toast.success(status === "confirmed" ? t("accept") + " — success!" : t("reject") + " — success!");
      setIsProcessed(true);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to update booking status");
    } finally {
      setLoading(false);
    }
  };

  if (isProcessed) return null;

  const carData = Array.isArray(booking.cars) ? booking.cars[0] : booking.cars;
  const carName = `${carData?.brand || ""} ${carData?.model || ""}`.trim() || "Car";
  const renterName = booking.renter?.full_name || "User";
  const avatarUrl = booking.renter?.avatar_url;
  const experience = booking.renter?.driving_experience;
  const purpose = booking.renter?.renting_purpose;

  const startDate = booking.start_date ? new Date(booking.start_date).toLocaleDateString(locale) : "—";
  const endDate = booking.end_date ? new Date(booking.end_date).toLocaleDateString(locale) : "—";

  return (
    <div className="glass-card rounded-[2rem] p-6 shadow-xl shadow-black/20 border border-primary/10 bg-primary/5 animate-in fade-in zoom-in duration-500 hover:border-primary/30 transition-all group">
      <div className="flex flex-col gap-6">
        {/* Header: Renter Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {avatarUrl ? (
              <div className="w-12 h-12 rounded-2xl relative overflow-hidden group-hover:scale-110 transition-transform">
                <Image src={avatarUrl} alt={renterName} fill className="object-cover" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <User className="w-6 h-6" />
              </div>
            )}
            <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-widest">{t("recentRequests")}</p>
              <h3 className="font-bold text-white text-lg leading-tight">{renterName}</h3>
              <div className="flex items-center gap-2 mt-1">
                {experience && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-white/60 bg-white/5 px-2 py-0.5 rounded-full">
                    Exp: {experience} y
                  </span>
                )}
                {purpose && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full">
                    <Target className="w-2 h-2" />
                    {purpose}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-tight">Earnings</p>
            <p className="text-primary font-black text-xl">{booking.total_price} TND</p>
          </div>
        </div>

        {/* Details: Car & Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-white/40 mb-1">
              <Car className="w-3 h-3" />
              <span className="text-[9px] font-black uppercase tracking-wider">Car</span>
            </div>
            <p className="text-sm font-bold text-white truncate">{carName}</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-white/40 mb-1">
              <Calendar className="w-3 h-3" />
              <span className="text-[9px] font-black uppercase tracking-wider">Dates</span>
            </div>
            <p className="text-[10px] font-bold text-white truncate">{startDate} → {endDate}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => handleStatusUpdate("confirmed")}
            disabled={loading}
            className="flex-[2] py-4 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Clock className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {t("accept")}
          </button>
          <button
            onClick={() => handleStatusUpdate("cancelled")}
            disabled={loading}
            className="flex-1 py-4 bg-white/5 text-white/60 text-xs font-black uppercase tracking-widest border border-white/5 rounded-2xl hover:bg-white/10 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            {t("reject")}
          </button>
        </div>
      </div>
    </div>
  )
}
