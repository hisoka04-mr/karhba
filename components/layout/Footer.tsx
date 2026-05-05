"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Car, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const t = useTranslations("Footer");
  const locale = useLocale();

  return (
    <footer className="bg-[#1a232e] border-t border-white/5 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo & About */}
          <div className="space-y-6">
            <Link href={`/${locale}`} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-primary flex items-center justify-center rounded-xl shadow-lg shadow-primary/30">
                <Car className="text-white w-5 h-5" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-xl font-extrabold tracking-tight text-white leading-none">
                  karhba tn
                </span>
                <span className="text-[10px] tracking-widest text-primary font-semibold mt-0.5 uppercase">
                  Rental App
                </span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              {t("about_us")}
            </p>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-primary font-bold mb-6 text-lg">{t("customer_service")}</h3>
            <ul className="space-y-4">
              <li>
                <Link href={`/${locale}/contact`} className="text-muted-foreground hover:text-white transition-colors text-sm">
                  {t("contact_us")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/faq`} className="text-muted-foreground hover:text-white transition-colors text-sm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-primary font-bold mb-6 text-lg">{t("legal")}</h3>
            <ul className="space-y-4">
              <li>
                <Link href={`/${locale}/terms`} className="text-muted-foreground hover:text-white transition-colors text-sm">
                  {t("terms")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/privacy`} className="text-muted-foreground hover:text-white transition-colors text-sm">
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/cookies`} className="text-muted-foreground hover:text-white transition-colors text-sm">
                  {t("cookies")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-primary font-bold mb-6 text-lg">{t("follow_us")}</h3>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-all text-muted-foreground hover:text-white">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-all text-muted-foreground hover:text-white">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-all text-muted-foreground hover:text-white">
                <Twitter className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 text-center">
          <p className="text-muted-foreground text-xs font-medium">
            {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
