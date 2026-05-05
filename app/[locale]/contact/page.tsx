"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare, User } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { submitContactForm } from "./action";

export default function ContactPage() {
  const t = useTranslations("Contact");
  const common = useTranslations("Common");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await submitContactForm(formData);
    
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success(t("success"));
      (e.target as HTMLFormElement).reset();
    }
    
    setLoading(false);
  }

  return (
    <div className="relative min-h-[calc(100vh-64px)] py-20 px-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight"
          >
            {t("title")}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            {t("subtitle")}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div className="glass-card rounded-[32px] p-8 md:p-10 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <MessageSquare className="text-primary w-6 h-6" />
                {t("info")}
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center gap-5 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-primary/30 transition-colors">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all text-primary">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t("email")}</p>
                    <p className="text-white font-medium">support@karhba.tn</p>
                  </div>
                </div>

                <div className="flex items-center gap-5 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-primary/30 transition-colors">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all text-primary">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t("phone")}</p>
                    <p className="text-white font-medium">+216 71 000 000</p>
                  </div>
                </div>

                <div className="flex items-center gap-5 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-primary/30 transition-colors">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all text-primary">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t("address")}</p>
                    <p className="text-white font-medium">Les Berges du Lac, Tunis</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <form onSubmit={handleSubmit} className="glass-card rounded-[32px] p-8 md:p-10 border border-white/10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">{t("name")}</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input 
                      required 
                      name="name"
                      type="text" 
                      placeholder="Ahmed Ben Ali" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-primary/50 focus:ring-0 transition-all outline-none text-white placeholder-white/20" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">{t("email")}</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input 
                      required 
                      name="email"
                      type="email" 
                      placeholder="ahmed@example.tn" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-primary/50 focus:ring-0 transition-all outline-none text-white placeholder-white/20" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">{t("subject")}</label>
                <input 
                  required 
                  name="subject"
                  type="text" 
                  placeholder={t("subject")} 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-sm focus:border-primary/50 focus:ring-0 transition-all outline-none text-white placeholder-white/20" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">{t("message")}</label>
                <textarea 
                  required 
                  name="message"
                  rows={5} 
                  placeholder={t("message")} 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-sm focus:border-primary/50 focus:ring-0 transition-all outline-none text-white placeholder-white/20 resize-none" 
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-orange-600 text-white font-extrabold py-5 rounded-2xl shadow-xl shadow-primary/30 transition-all text-lg flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t("sending") : t("send")}
                {!loading && <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
