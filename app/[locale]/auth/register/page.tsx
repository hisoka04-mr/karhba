"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import { Car, Mail, Lock, User, ArrowRight } from "lucide-react";
import { register as signup, signInWithGoogle } from "../action";
import { useState } from "react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const t = useTranslations("Auth");
  const common = useTranslations("Common");
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await signup(formData, locale);
    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    try {
      const result = await signInWithGoogle(locale);
      if (result?.error) {
        toast.error(result.error);
        setGoogleLoading(false);
      }
    } catch {
      // redirect throws, this is expected
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
            <p className="text-muted-foreground">{t("registerSubtitle")}</p>
          </div>

          {/* Google Sign Up Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold py-4 rounded-2xl transition-all duration-300 mb-6 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {googleLoading ? common("loading") : t("googleSignUp")}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t("orContinueWith")}</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form action={handleSubmit} className="space-y-5">
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
              disabled={loading || googleLoading}
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
