"use client"

import { useTranslations } from "next-intl"
import { Clock } from "lucide-react"
import BookingRequestCard from "./BookingRequestCard"

export default function PendingRequests({ bookings }: { bookings: any[] }) {
  const t = useTranslations("Dashboard");
  const pendingBookings = bookings.filter(b => b.status === "pending");

  if (pendingBookings.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold text-white">{t("recentRequests")}</h2>
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-[10px] font-black">
          {pendingBookings.length}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingBookings.map((booking) => (
          <BookingRequestCard key={booking.id} booking={booking} />
        ))}
      </div>
    </div>
  );
}
