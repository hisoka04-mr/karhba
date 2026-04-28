"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import { Car, Mail, Lock, User, Phone, ArrowRight } from "lucide-react";
import { register as signup } from "../action";
import { useState } from "react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const t = useTranslations("Auth");
  const common = useTranslations("Common");
  const locale = useLocale();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await signup(formData, locale);
    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
          {/* Shine Effect */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[80px] -mr-16 -mt-16 rounded-full" />
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-primary flex items-center justify-center rounded-2xl shadow-xl shadow-primary/20 mx-auto mb-6">
              <Car className="text-white w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold mb-2">{t("register_title")}</h1>
            <p className="text-muted-foreground">Join the Karhba community</p>
          </div>

          <form action={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">{t("role")}</label>
              <div className="flex gap-4">
                <label className="flex-1 cursor-pointer group">
                  <input type="radio" name="role" value="user" className="peer sr-only" defaultChecked />
                  <div className="text-center p-3 rounded-2xl border border-white/5 bg-secondary/50 peer-checked:bg-primary/20 peer-checked:border-primary/50 transition-all">
                    <User className="w-5 h-5 mx-auto mb-1 text-muted-foreground group-[.peer:checked+&]:text-primary" />
                    <span className="text-sm font-medium">{t("roleUser")}</span>
                  </div>
                </label>
                <label className="flex-1 cursor-pointer group">
                  <input type="radio" name="role" value="owner" className="peer sr-only" />
                  <div className="text-center p-3 rounded-2xl border border-white/5 bg-secondary/50 peer-checked:bg-primary/20 peer-checked:border-primary/50 transition-all">
                    <Car className="w-5 h-5 mx-auto mb-1 text-muted-foreground group-[.peer:checked+&]:text-primary" />
                    <span className="text-sm font-medium">{t("roleOwner")}</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">{t("full_name")}</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  name="fullName"
                  type="text"
                  required
                  placeholder="Ahmed Ben Ali"
                  className="w-full bg-secondary/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-primary/50 focus:ring-0 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">{t("phone")}</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder="216 XX XXX XXX"
                  className="w-full bg-secondary/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-primary/50 focus:ring-0 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">{t("email")}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="ahmed@example.tn"
                  className="w-full bg-secondary/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-primary/50 focus:ring-0 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">{t("password")}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-secondary/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-primary/50 focus:ring-0 transition-all outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-orange-600 text-white font-extrabold py-5 rounded-2xl shadow-xl shadow-primary/30 transition-all text-lg flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? common("loading") : t("submit_register")}
              {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-muted-foreground text-sm">
              {t("has_account")}{" "}
              <Link href={`/${locale}/auth/login`} className="text-primary font-bold hover:underline">
                {t("submit_login")}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
