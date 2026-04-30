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
    <div className="sticky top-24 bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <SlidersHorizontal className="w-5 h-5 text-primary" />
          </div>
          <h2 className="font-bold text-xl text-white">
            Filters
          </h2>
        </div>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-red-400 transition-colors font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        )}
      </div>

      <div className="space-y-8">
        {/* Price Range */}
        <div>
          <label className="block text-sm font-semibold text-white mb-3">
            Price per day <span className="text-muted-foreground font-normal ml-1">(TND)</span>
          </label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="number"
                placeholder="Min"
                value={filters.priceMin}
                onChange={(e) => updateFilter("priceMin", e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>
            <span className="text-muted-foreground font-bold">—</span>
            <div className="relative flex-1">
              <input
                type="number"
                placeholder="Max"
                value={filters.priceMax}
                onChange={(e) => updateFilter("priceMax", e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-white/5" />

        {/* Transmission */}
        <div>
          <label className="block text-sm font-semibold text-white mb-3">Transmission</label>
          <div className="grid grid-cols-2 gap-3">
            {TRANSMISSIONS.map((t) => {
              const active = filters.transmission.includes(t);
              return (
                <button
                  key={t}
                  onClick={() => toggleArrayFilter("transmission", t)}
                  className={`py-3 rounded-xl text-sm font-medium border transition-all duration-200 capitalize ${
                    active
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                      : "bg-black/20 border-white/10 text-muted-foreground hover:border-white/20 hover:text-white"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-px w-full bg-white/5" />

        {/* Fuel Type */}
        <div>
          <label className="block text-sm font-semibold text-white mb-3">Fuel Type</label>
          <div className="flex flex-wrap gap-2">
            {FUEL_TYPES.map((f) => {
              const active = filters.fuelType.includes(f);
              return (
                <button
                  key={f}
                  onClick={() => toggleArrayFilter("fuelType", f)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 capitalize ${
                    active
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                      : "bg-black/20 border-white/10 text-muted-foreground hover:border-white/20 hover:text-white"
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-px w-full bg-white/5" />

        {/* Seats */}
        <div>
          <label className="block text-sm font-semibold text-white mb-3">Seats</label>
          <div className="flex gap-2">
            {SEAT_OPTIONS.map((s) => {
              const active = filters.seats === s;
              return (
                <button
                  key={s}
                  onClick={() => updateFilter("seats", active ? null : s)}
                  className={`flex-1 aspect-square max-w-[56px] rounded-xl text-base font-bold border transition-all duration-200 ${
                    active
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-[1.02]"
                      : "bg-black/20 border-white/10 text-muted-foreground hover:border-white/20 hover:text-white"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
