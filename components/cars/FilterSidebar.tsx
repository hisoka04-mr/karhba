"use client";

import { SlidersHorizontal, RotateCcw } from "lucide-react";
import type { Filters } from "@/app/[locale]/cars/CarsContent";

type FilterSidebarProps = {
  filters: Filters;
  updateFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  clearFilters: () => void;
};

const TRANSMISSIONS = ["automatic", "manual"];
const FUEL_TYPES = ["petrol", "diesel", "electric", "hybrid", "essence"];
const SEAT_OPTIONS = [2, 4, 5, 7, 8];

export default function FilterSidebar({ filters, updateFilter, clearFilters }: FilterSidebarProps) {
  const toggleArrayFilter = (key: "transmission" | "fuelType", value: string) => {
    const current = filters[key];
    if (current.includes(value)) {
      updateFilter(key, current.filter((v) => v !== value));
    } else {
      updateFilter(key, [...current, value]);
    }
  };

  const hasFilters =
    filters.priceMin ||
    filters.priceMax ||
    filters.transmission.length > 0 ||
    filters.fuelType.length > 0 ||
    filters.seats !== null;

  return (
    <div className="sticky top-20 space-y-1">
      {/* Header */}
      <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/[0.07] p-5">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4 text-primary" />
            </div>
            <h2 className="font-bold text-sm uppercase tracking-widest text-white">
              Filters
            </h2>
          </div>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-red-400 transition-colors font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Price Range */}
      <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/[0.07] p-5">
        <label className="block text-sm font-semibold text-white mb-3">
          Price per day
          <span className="text-muted-foreground font-normal ml-1">(TND)</span>
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="number"
              placeholder="Min"
              value={filters.priceMin}
              onChange={(e) => updateFilter("priceMin", e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="flex items-center text-muted-foreground/40 text-xs font-bold">—</div>
          <div className="relative flex-1">
            <input
              type="number"
              placeholder="Max"
              value={filters.priceMax}
              onChange={(e) => updateFilter("priceMax", e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Transmission */}
      <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/[0.07] p-5">
        <label className="block text-sm font-semibold text-white mb-3">Transmission</label>
        <div className="flex gap-2">
          {TRANSMISSIONS.map((t) => {
            const active = filters.transmission.includes(t);
            return (
              <button
                key={t}
                onClick={() => toggleArrayFilter("transmission", t)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 capitalize ${
                  active
                    ? "bg-primary/15 border-primary/40 text-primary shadow-sm shadow-primary/10"
                    : "bg-white/[0.03] border-white/10 text-muted-foreground hover:border-white/20 hover:text-white"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fuel Type */}
      <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/[0.07] p-5">
        <label className="block text-sm font-semibold text-white mb-3">Fuel Type</label>
        <div className="flex flex-wrap gap-2">
          {FUEL_TYPES.map((f) => {
            const active = filters.fuelType.includes(f);
            return (
              <button
                key={f}
                onClick={() => toggleArrayFilter("fuelType", f)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 capitalize ${
                  active
                    ? "bg-primary/15 border-primary/40 text-primary shadow-sm shadow-primary/10"
                    : "bg-white/[0.03] border-white/10 text-muted-foreground hover:border-white/20 hover:text-white"
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* Seats */}
      <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/[0.07] p-5">
        <label className="block text-sm font-semibold text-white mb-3">Seats</label>
        <div className="flex gap-2">
          {SEAT_OPTIONS.map((s) => {
            const active = filters.seats === s;
            return (
              <button
                key={s}
                onClick={() => updateFilter("seats", active ? null : s)}
                className={`flex-1 aspect-square max-w-[48px] rounded-xl text-sm font-bold border transition-all duration-200 ${
                  active
                    ? "bg-primary/15 border-primary/40 text-primary shadow-sm shadow-primary/10 scale-105"
                    : "bg-white/[0.03] border-white/10 text-muted-foreground hover:border-white/20 hover:text-white"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
