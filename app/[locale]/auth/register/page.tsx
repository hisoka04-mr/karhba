"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import { Car, Mail, Lock, User, Phone, ArrowRight } from "lucide-react";
import { register as signup } from "../action";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { Camera } from "lucide-react";
import Image from "next/image";

export default function RegisterPage() {
  const t = useTranslations("Auth");
  const common = useTranslations("Common");
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await signup(formData, locale);
    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center p-4 overflow-hidden bg-grid">
      {/* Animated background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-orange-500/8 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[100px] animate-blob-delay" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-400/3 rounded-full blur-[160px] animate-pulse-slow" />
      </div>

      {/* Decorative ring */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[700px] rounded-full border border-orange-500/5 animate-spin-slow" />
      </div>
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
            <h1 className="text-3xl font-bold mb-2">{t("registerTitle")}</h1>
            <p className="text-muted-foreground">Join the Karhba community</p>
          </div>

          <form action={handleSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center mb-8">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative w-24 h-24 rounded-full bg-secondary/50 border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer group overflow-hidden transition-all hover:border-primary/50"
              >
                {avatarPreview ? (
                  <Image src={avatarPreview} alt="Preview" fill className="object-cover" />
                ) : (
                  <div className="text-center transition-transform group-hover:scale-110">
                    <Camera className="w-8 h-8 text-muted-foreground mb-1 mx-auto" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Photo</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
              <input
                type="file"
                name="avatar"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                className="hidden"
                accept="image/*"
              />
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-2">Upload Profile Picture</p>
            </div>
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
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">{t("fullName")}</label>
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

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">{t("drivingExperience")}</label>
              <div className="relative">
                <select
                  name="drivingExperience"
                  required
                  defaultValue=""
                  className="w-full bg-secondary/50 border border-white/5 rounded-2xl py-4 px-4 text-sm focus:border-primary/50 focus:ring-0 transition-all outline-none appearance-none"
                >
                  <option value="" disabled>{t("selectExperience")}</option>
                  <option value="<1">{t("expLessThan1")}</option>
                  <option value="1-3">{t("exp1To3")}</option>
                  <option value="3-5">{t("exp3To5")}</option>
                  <option value="5+">{t("expMoreThan5")}</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">{t("purposeOfRenting")}</label>
              <div className="relative">
                <select
                  name="rentingPurpose"
                  required
                  defaultValue=""
                  className="w-full bg-secondary/50 border border-white/5 rounded-2xl py-4 px-4 text-sm focus:border-primary/50 focus:ring-0 transition-all outline-none appearance-none"
                >
                  <option value="" disabled>{t("selectPurpose")}</option>
                  <option value="tourism">{t("purposeTourism")}</option>
                  <option value="business">{t("purposeBusiness")}</option>
                  <option value="commute">{t("purposeCommute")}</option>
                  <option value="occasion">{t("purposeOccasion")}</option>
                </select>
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
              {t("hasAccount")}{" "}
              <Link href={`/${locale}/auth/login`} className="text-primary font-bold hover:underline">
                {t("signInLink")}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
