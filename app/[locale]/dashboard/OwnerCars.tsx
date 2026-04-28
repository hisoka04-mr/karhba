"use client"

import { useState } from "react"
import { Eye, EyeOff, Car as CarIcon, Trash2, Check, X, Clock } from "lucide-react"
import { toggleCarVisibility, deleteCar, updateBookingStatus } from "./actions"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { useTranslations } from "next-intl"

export default function OwnerCars({ cars }: { cars: any[] }) {
  const t = useTranslations("Dashboard");
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleToggle = async (carId: string, currentHidden: boolean) => {
    setLoading(carId);
    try {
      await toggleCarVisibility(carId, !currentHidden);
      toast.success(currentHidden ? "Car is now visible!" : "Car is now hidden!");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to update visibility");
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (carId: string) => {
    if (!window.confirm("Delete this car listing?")) return;
    
    setLoading(carId);
    try {
      await deleteCar(carId);
      toast.success("Car deleted!");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete car");
    } finally {
      setLoading(null);
    }
  };

  if (!cars || cars.length === 0) return null;

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-white mb-6">{t("myCars")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car: any) => {
          const isHidden = car.is_hidden;
          const photo = car.photos?.[0] || "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800";
          
          return (
            <div 
              key={car.id} 
              className={`glass-card rounded-3xl overflow-hidden shadow-xl shadow-black/20 border border-white/5 transition-all duration-300 ${isHidden ? 'opacity-80 grayscale-[20%]' : ''}`}
            >
              {/* Card Header with Image */}
              <div className="relative h-40">
                <img 
                  src={photo} 
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
                
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight backdrop-blur-md border ${
                    isHidden 
                      ? 'bg-zinc-900/60 text-zinc-400 border-zinc-700/50' 
                      : 'bg-green-500/20 text-green-400 border-green-500/30'
                  }`}>
                    <div className={`w-1 h-1 rounded-full ${isHidden ? 'bg-zinc-500' : 'bg-green-400 animate-pulse'}`} />
                    {isHidden ? t("hidden") : t("active")}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-white truncate">{car.brand} {car.model}</h3>
                  <p className="text-primary font-bold text-sm">
                    {car.price_per_day} TND <span className="text-white/40 font-normal text-xs">{t("perDay")}</span>
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggle(car.id, isHidden)}
                    disabled={loading === car.id}
                    className="flex-[4] py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold bg-white/5 text-white hover:bg-white/10 border border-white/10 transition-all disabled:opacity-50"
                  >
                    {isHidden ? <><Eye className="w-4 h-4" /> {t("showCar")}</> : <><EyeOff className="w-4 h-4" /> {t("hideCar")}</>}
                  </button>
                  <button
                    onClick={() => handleDelete(car.id)}
                    disabled={loading === car.id}
                    className="flex-1 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-500/20 flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
