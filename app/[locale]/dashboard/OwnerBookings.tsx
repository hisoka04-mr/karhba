"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateBookingStatus } from "./actions"
import { CheckCircle, XCircle, Clock, Calendar, Check, X } from "lucide-react"
import toast from "react-hot-toast"
import { useTranslations, useLocale } from "next-intl"

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

export default function OwnerBookings({ bookings }: { bookings: any[] }) {
  const t = useTranslations("Dashboard");
  const locale = useLocale();
  const router = useRouter();
  // Local statuses for optimistic UI — key: bookingId, value: status string
  const [localStatuses, setLocalStatuses] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<string | null>(null);

  const handleStatusUpdate = async (bookingId: string, status: "confirmed" | "cancelled" | "completed") => {
    setLoading(bookingId);
    // Optimistic update — immediately reflect change in UI
    setLocalStatuses((prev) => ({ ...prev, [bookingId]: status }));
    try {
      await updateBookingStatus(bookingId, status);
      const label = status === "confirmed" ? t("accept") : status === "cancelled" ? t("reject") : t("markCompleted");
      toast.success(`${label} — booking updated!`);
      // Refresh server data in the background without unmounting this component
      router.refresh();
    } catch (error: any) {
      // Roll back optimistic update on error
      setLocalStatuses((prev) => { const next = { ...prev }; delete next[bookingId]; return next; });
      toast.error(error.message || "Failed to update booking status");
    } finally {
      setLoading(null);
    }
  };

  // Only show confirmed, cancelled, and completed bookings in history
  const historyBookings = (bookings || []).filter(b => {
    const currentStatus = localStatuses[b.id] ?? b.status;
    return currentStatus !== "pending";
  });

  if (historyBookings.length === 0) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-white mb-6">Booking History</h2>
        <div className="glass-card rounded-2xl p-12 text-center shadow-xl shadow-black/20 border border-white/5">
          <Clock className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-muted-foreground">No booking history found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-white mb-6">Booking History</h2>
      <div className="space-y-4">
        {historyBookings.map((booking: any) => {
          // Use optimistic local status if available, otherwise fall back to server status
          const currentStatus = localStatuses[booking.id] ?? booking.status;
          const status = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.pending;
          const StatusIcon = status.icon;
          const renterName = booking.renter?.full_name || "Unknown User";
          const carData = Array.isArray(booking.cars) ? booking.cars[0] : booking.cars;
          const carName = `${carData?.brand || ""} ${carData?.model || ""}`.trim() || "Car";
          
          const startDate = booking.start_date ? new Date(booking.start_date).toLocaleDateString(locale) : "—";
          const endDate = booking.end_date ? new Date(booking.end_date).toLocaleDateString(locale) : "—";

          return (
            <div key={booking.id} className="glass-card rounded-2xl p-6 shadow-xl shadow-black/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-white">{t("bookingFor")} {carName}</h3>
                    <p className="text-sm text-muted-foreground">{t("renter")} <span className="text-white">{renterName}</span></p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${status.className}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {t("status" + status.label)}
                    </span>
                    {loading === booking.id && (
                      <span className="text-xs text-muted-foreground animate-pulse flex items-center gap-1.5">
                        <Clock className="w-3 h-3 animate-spin" />
                        Updating...
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span suppressHydrationWarning>{startDate} → {endDate}</span>
                  </div>
                  {booking.total_price && (
                    <div className="font-bold text-primary">
                      {booking.total_price} TND {t("total")}
                    </div>
                  )}
                </div>
              </div>

              {currentStatus === "confirmed" && (
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button
                    onClick={() => handleStatusUpdate(booking.id, "completed")}
                    disabled={loading === booking.id}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white hover:bg-orange-600 rounded-xl transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {t("markCompleted")}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
