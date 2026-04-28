"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import CarCard from "@/components/cars/CarCard";
import FilterSidebar from "@/components/cars/FilterSidebar";
import { Search, SlidersHorizontal, ChevronDown, X } from "lucide-react";

export type Filters = {
  priceMin: string;
  priceMax: string;
  transmission: string[];
  fuelType: string[];
  seats: number | null;
  search: string;
};

const INITIAL_FILTERS: Filters = {
  priceMin: "",
  priceMax: "",
  transmission: [],
  fuelType: [],
  seats: null,
  search: "",
};

type SortOption = "newest" | "oldest" | "price_asc" | "price_desc";

export default function CarsContent({ cars }: { cars: any[] }) {
  const t = useTranslations("Cars");
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const [sort, setSort] = useState<SortOption>("newest");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const updateFilter = useCallback(<K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.priceMin) count++;
    if (filters.priceMax) count++;
    if (filters.transmission.length) count++;
    if (filters.fuelType.length) count++;
    if (filters.seats) count++;
    if (filters.search) count++;
    return count;
  }, [filters]);

  // Apply filters & sort
  const filteredCars = useMemo(() => {
    let result = [...cars];

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (car) =>
          (car.brand?.toLowerCase().includes(q)) ||
          (car.model?.toLowerCase().includes(q)) ||
          (car.city?.toLowerCase().includes(q))
      );
    }

    // Price
    if (filters.priceMin) {
      result = result.filter((car) => car.price_per_day >= parseFloat(filters.priceMin));
    }
    if (filters.priceMax) {
      result = result.filter((car) => car.price_per_day <= parseFloat(filters.priceMax));
    }

    // Transmission
    if (filters.transmission.length > 0) {
      result = result.filter((car) =>
        filters.transmission.some(
          (t) => car.transmission?.toLowerCase() === t.toLowerCase()
        )
      );
    }

    // Fuel type
    if (filters.fuelType.length > 0) {
      result = result.filter((car) =>
        filters.fuelType.some(
          (f) => car.fuel_type?.toLowerCase() === f.toLowerCase()
        )
      );
    }

    // Seats
    if (filters.seats) {
      result = result.filter((car) => car.seats === filters.seats);
    }

    // Sort
    switch (sort) {
      case "newest":
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case "price_asc":
        result.sort((a, b) => a.price_per_day - b.price_per_day);
        break;
      case "price_desc":
        result.sort((a, b) => b.price_per_day - a.price_per_day);
        break;
    }

    return result;
  }, [cars, filters, sort]);

  const sortLabels: Record<SortOption, string> = {
    newest: "Newest First",
    oldest: "Oldest First",
    price_asc: "Price: Low → High",
    price_desc: "Price: High → Low",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 animate-fade-up">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-3 block">
            {filteredCars.length} vehicles available
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-3">
            {t("title")}
          </h1>
          <p className="text-muted-foreground text-lg">
            Browse our collection of premium vehicles available for rent across Tunisia.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-white"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="relative flex-1 md:flex-none">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="w-full flex items-center justify-between gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 hover:border-white/20 transition-all"
            >
              <span className="text-muted-foreground">Sort:</span>
              <span>{sortLabels[sort]}</span>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${sortOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-52 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50"
                >
                  {(Object.entries(sortLabels) as [SortOption, string][]).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => { setSort(key); setSortOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        sort === key
                          ? "text-primary bg-primary/10 font-semibold"
                          : "text-white/80 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8 animate-fade-up" style={{ animationDelay: "0.05s" }}>
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search by brand, model, or city..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          />
          {filters.search && (
            <button
              onClick={() => updateFilter("search", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Active filter pills */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Active:</span>
          {filters.priceMin && (
            <FilterPill label={`Min: ${filters.priceMin} TND`} onRemove={() => updateFilter("priceMin", "")} />
          )}
          {filters.priceMax && (
            <FilterPill label={`Max: ${filters.priceMax} TND`} onRemove={() => updateFilter("priceMax", "")} />
          )}
          {filters.transmission.map((t) => (
            <FilterPill
              key={t}
              label={t}
              onRemove={() => updateFilter("transmission", filters.transmission.filter((x) => x !== t))}
            />
          ))}
          {filters.fuelType.map((f) => (
            <FilterPill
              key={f}
              label={f}
              onRemove={() => updateFilter("fuelType", filters.fuelType.filter((x) => x !== f))}
            />
          ))}
          {filters.seats && (
            <FilterPill label={`${filters.seats} seats`} onRemove={() => updateFilter("seats", null)} />
          )}
          <button
            onClick={clearFilters}
            className="text-xs text-red-400 hover:text-red-300 font-semibold ml-2 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <FilterSidebar filters={filters} updateFilter={updateFilter} clearFilters={clearFilters} />
        </div>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {showMobileFilters && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
                onClick={() => setShowMobileFilters(false)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed left-0 top-0 bottom-0 w-[320px] bg-zinc-900 z-50 p-6 overflow-y-auto lg:hidden shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-white">Filters</h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 rounded-xl hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <FilterSidebar filters={filters} updateFilter={updateFilter} clearFilters={clearFilters} />
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full mt-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors text-sm"
                >
                  Show {filteredCars.length} results
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Listings Grid */}
        <div className="lg:col-span-3">
          {filteredCars.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredCars.map((car, index) => (
                  <motion.div
                    key={car.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, delay: index * 0.03 }}
                  >
                    <CarCard car={car} index={0} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-28 glass-card rounded-3xl border-dashed"
            >
              <div className="w-20 h-20 rounded-2xl bg-secondary/60 flex items-center justify-center mb-5">
                <Search className="w-10 h-10 text-muted-foreground/40" />
              </div>
              <h3 className="text-xl font-bold mb-2">No cars found</h3>
              <p className="text-muted-foreground text-center max-w-xs mb-6">
                Try adjusting your filters or check back later for new listings.
              </p>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="px-5 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-xl text-sm font-semibold hover:bg-primary/20 transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-semibold capitalize">
      {label}
      <button onClick={onRemove} className="hover:text-white transition-colors">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}
