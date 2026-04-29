"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Car, MapPin, Shield, Zap, ArrowRight, Star, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <CtaSection />
    </div>
  );
}

function HeroSection() {
  const locale = useLocale();
  const t = useTranslations("Home");

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-grid">
      {/* Animated background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-orange-500/8 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[100px] animate-blob-delay" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-400/3 rounded-full blur-[160px] animate-pulse-slow" />
      </div>

      {/* Decorative ring */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[700px] rounded-full border border-orange-500/5 animate-spin-slow" />
        <div className="absolute w-[500px] h-[500px] rounded-full border border-orange-500/8" style={{ animation: 'spin 30s linear infinite reverse' }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center"
        >
          {/* Badge */}
          <motion.div variants={item}>
            <span className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-5 py-1.5 text-sm text-orange-400 font-medium mb-8 backdrop-blur-sm">
              <Zap className="w-3.5 h-3.5 fill-orange-400" />
              {t("heroBadge")}
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={item}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-6 leading-[0.9]"
          >
            {t("heroTitle1")}
            <span className="text-gradient text-glow"> {t("heroTitle2")}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={item}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {t("heroSubtitle")}
          </motion.p>

          {/* CTAs */}
          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/cars`}
              className="group inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-4 rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-primary/25 hover:shadow-primary/50 hover:-translate-y-0.5 text-base glow-primary-sm"
            >
              <Car className="w-5 h-5" />
              {t("browseBtn")}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href={`/${locale}/auth/register`}
              className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-bold px-8 py-4 rounded-2xl transition-all border border-white/10 hover:border-white/20 text-base backdrop-blur-sm"
            >
              {t("listBtn")}
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div variants={item} className="mt-14 flex flex-wrap items-center justify-center gap-6 text-muted-foreground text-sm">
            {[
              { icon: Shield, label: t("trustVerified") },
              { icon: Star, label: t("trustRating") },
              { icon: Users, label: t("trustRenters") },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-orange-400" />
                <span>{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}

function StatsSection() {
  const t = useTranslations("Home");
  const [stats, setStats] = useState([
    { value: "-", label: t("statCars") },
    { value: "-", label: t("statRenters") },
    { value: "-", label: t("statCities") },
    { value: "4.9★", label: t("statRating") },
  ]);

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient();
      
      try {
        // Fetch total cars
        const { count: carsCount } = await supabase
          .from("cars")
          .select("*", { count: "exact", head: true })
          .eq("is_hidden", false);
          
        // Fetch unique renters
        const { data: renters } = await supabase.from("bookings").select("renter_id");
        const uniqueRenters = new Set(renters?.map(r => r.renter_id)).size;
        
        // Fetch unique cities
        const { data: cities } = await supabase.from("cars").select("city").eq("is_hidden", false);
        const uniqueCities = new Set(cities?.map(c => c.city?.toLowerCase())).size;

        setStats([
          { value: carsCount ? `${carsCount}+` : "0", label: t("statCars") },
          { value: uniqueRenters ? `${uniqueRenters}+` : "0", label: t("statRenters") },
          { value: uniqueCities ? `${uniqueCities}+` : "0", label: t("statCities") },
          { value: "4.9★", label: t("statRating") },
        ]);
      } catch (e) {
        console.error("Failed to fetch stats", e);
      }
    }
    
    fetchStats();
  }, []);

  return (
    <section className="py-16 px-4 relative">
      <div className="max-w-5xl mx-auto">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeInScale}
              className="glass-card rounded-2xl p-6 text-center hover:border-orange-500/20 transition-colors"
            >
              <div className="text-3xl md:text-4xl font-extrabold text-gradient mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const t = useTranslations("Home");
  const features = [
    {
      icon: Car,
      title: t("feat1Title"),
      description: t("feat1Desc"),
      color: "from-orange-500/20 to-orange-600/5",
    },
    {
      icon: Shield,
      title: t("feat2Title"),
      description: t("feat2Desc"),
      color: "from-blue-500/20 to-blue-600/5",
    },
    {
      icon: MapPin,
      title: t("feat3Title"),
      description: t("feat3Desc"),
      color: "from-green-500/20 to-green-600/5",
    },
    {
      icon: Zap,
      title: t("feat4Title"),
      description: t("feat4Desc"),
      color: "from-purple-500/20 to-purple-600/5",
    },
  ];

  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-4 block">{t("whyLabel")}</span>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tighter">
            {t("featuresTitle1")} <span className="text-gradient">{t("featuresTitle2")}</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            {t("featuresSubtitle")}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="glass-card rounded-2xl p-6 hover:border-white/15 transition-all duration-300 group cursor-default"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CtaSection() {
  const locale = useLocale();
  const t = useTranslations("Home");

  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-orange-600/10 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-3xl rounded-full pointer-events-none" />

          <div className="relative z-50 glass-card border-orange-500/20 rounded-3xl p-12 text-center pointer-events-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tighter">
              {t("ctaTitle")}
            </h2>
            <p className="text-muted-foreground mb-8 text-lg max-w-lg mx-auto">
              {t("ctaSubtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-50">
              <Link
                href={`/${locale}/auth/register`}
                className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold px-8 py-4 rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-primary/30 hover:-translate-y-0.5 cursor-pointer relative z-50"
              >
                {t("ctaStart")}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={`/${locale}/cars`}
                className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-bold px-8 py-4 rounded-2xl transition-all border border-white/10 cursor-pointer relative z-50"
              >
                {t("ctaBrowse")}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
