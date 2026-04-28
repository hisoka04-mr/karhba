"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLocale } from "next-intl";
import { MapPin, Users, Fuel, Star, Zap, Calendar } from "lucide-react";

type Car = {
  id: string;
  // DB uses 'brand' — aliased as make in selects where possible
  brand?: string;
  make?: string;
  model: string;
  year: number;
  price_per_day: number;
  // DB uses 'city'
  city?: string;
  location?: string;
  photos: string[];
  seats: number;
  fuel_type: string;
  transmission: string;
  rating?: number;
  review_count?: number;
};

export default function CarCard({ car, index = 0 }: { car: Car; index?: number }) {
  const locale = useLocale();
  const photo = car.photos?.[0] ?? null;
  const isElectric = car.fuel_type?.toLowerCase() === "electric";
  // Support both naming conventions (DB: brand/city, API: make/location)
  const displayName = car.make || car.brand || "Unknown";
  const displayCity = car.location || car.city || "Tunisia";
  const FuelIcon = isElectric ? Zap : Fuel;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/${locale}/cars/${car.id}`}
        className="group block glass-card rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/10"
      >
        {/* Image */}
        <div className="relative h-52 bg-secondary/40 overflow-hidden">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt={`${car.make} ${car.model}`}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary/80 to-secondary/40">
              <span className="text-6xl opacity-40">🚗</span>
            </div>
          )}

          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between">
            <span className="bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {car.year}
            </span>
            {car.rating && (
              <span className="bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3 fill-orange-400 text-orange-400" />
                {car.rating.toFixed(1)}
                {car.review_count != null && (
                  <span className="text-white/60 ml-0.5">({car.review_count})</span>
                )}
              </span>
            )}
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="mb-3">
            <h3 className="font-bold text-lg leading-tight group-hover:text-orange-400 transition-colors duration-200">
              {displayName} {car.model}
            </h3>
            <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              {displayCity}
            </p>
          </div>

          {/* Tags */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {car.seats && (
              <span className="flex items-center gap-1 bg-white/5 border border-white/5 text-muted-foreground text-xs px-2.5 py-1 rounded-full">
                <Users className="w-3 h-3" />
                {car.seats} seats
              </span>
            )}
            {car.fuel_type && (
              <span className="flex items-center gap-1 bg-white/5 border border-white/5 text-muted-foreground text-xs px-2.5 py-1 rounded-full capitalize">
                <FuelIcon className="w-3 h-3" />
                {car.fuel_type}
              </span>
            )}
            {car.transmission && (
              <span className="bg-white/5 border border-white/5 text-muted-foreground text-xs px-2.5 py-1 rounded-full capitalize">
                {car.transmission}
              </span>
            )}
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div>
              <span className="text-2xl font-extrabold text-primary">
                {car.price_per_day}
              </span>
              <span className="text-muted-foreground text-sm ml-1">TND/day</span>
            </div>
            <span className="text-sm font-semibold text-white bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-xl group-hover:bg-primary group-hover:border-primary group-hover:shadow-md group-hover:shadow-primary/30 transition-all duration-300">
              Book Now →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
