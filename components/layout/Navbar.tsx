"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";
import { Car, User, Menu, X, LogOut, ChevronDown, Bell, Settings, TrendingUp } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Navbar({ user }: { user: any }) {
  const t = useTranslations("Common");
  const locale = useLocale();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
        const supabase = createClient();
        const { data } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_read", false)
          .order("created_at", { ascending: false });
        if (data) setNotifications(data);
      };
      fetchNotifications();
    }
  }, [user]);

  const markNotificationsRead = async () => {
    if (notifications.length === 0) return;
    const supabase = createClient();
    await supabase.rpc("mark_notifications_read", { p_user_id: user.id });
    setNotifications([]);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setShowDropdown(false);
    router.refresh();
  };

  const isOwner = user?.user_metadata?.is_owner === true;

  const navLinks = isOwner ? [
    { href: `/${locale}/cars`, label: t("browse") },
    { href: `/${locale}/dashboard`, label: t("dashboard") },
  ] : [
    { href: `/${locale}/cars`, label: t("browse") },
    { href: `/${locale}/bookings`, label: t("bookings") },
  ];

  const avatarLetter = user?.email?.[0]?.toUpperCase() ?? "U";

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass-morphism shadow-lg shadow-black/20"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className="w-9 h-9 bg-primary flex items-center justify-center rounded-xl shadow-lg shadow-primary/30"
            >
              <Car className="text-white w-5 h-5" />
            </motion.div>
            <div className="flex flex-col justify-center">
              <span className="text-xl font-extrabold tracking-tight text-white leading-none">
                karhba tn
              </span>
              <span className="text-[10px] tracking-widest text-primary font-semibold mt-0.5 uppercase">
                Rental App
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-medium transition-colors group ${
                    isActive ? "text-white" : "text-muted-foreground hover:text-white"
                  }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary rounded-full transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`} />
                </Link>
              );
            })}

            <div className="h-4 w-px bg-white/10" />
            <LanguageSwitcher />

            {user ? (
              <div className="flex items-center gap-4">
                {isOwner && (
                  <Link
                    href={`/${locale}/dashboard/profile`}
                    className="px-4 py-2 text-sm font-semibold text-white bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all shadow-md hidden sm:flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4 text-primary" />
                    Manage Fleet
                  </Link>
                )}
                
                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowDropdown(false);
                      if (!showNotifications) markNotificationsRead();
                    }}
                    className="relative p-2 text-muted-foreground hover:text-white transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {notifications.length > 0 && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-zinc-900" />
                    )}
                  </button>
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute right-0 mt-2 w-80 glass-card rounded-2xl shadow-2xl shadow-black/40 overflow-hidden py-2"
                      >
                        <div className="px-4 py-2 border-b border-white/5 flex justify-between items-center">
                          <h3 className="font-bold text-white">Notifications</h3>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length > 0 ? (
                            notifications.map((notif) => (
                              <div key={notif.id} className="px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors">
                                <p className="text-sm text-white/90">{notif.message}</p>
                                <span className="text-xs text-muted-foreground mt-1 block">Just now</span>
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-6 text-center">
                              <p className="text-sm text-muted-foreground">No new notifications</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => {
                      setShowDropdown(!showDropdown);
                      setShowNotifications(false);
                    }}
                    className="flex items-center gap-2 group"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-primary/30 group-hover:shadow-primary/50 transition-shadow">
                      {avatarLetter}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`} />
                  </button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 mt-2 w-52 glass-card rounded-2xl shadow-2xl shadow-black/40 overflow-hidden py-1"
                    >
                      <div className="px-4 py-3 border-b border-white/5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-bold mb-2">
                          {avatarLetter}
                        </div>
                        <p className="text-xs text-muted-foreground">Signed in as</p>
                        <p className="text-sm font-medium text-white truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        {!isOwner && (
                          <Link
                            href={`/${locale}/bookings`}
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <User className="w-4 h-4" />
                            My Bookings
                          </Link>
                        )}
                        {isOwner && (
                          <>
                            <Link
                              href={`/${locale}/dashboard`}
                              onClick={() => setShowDropdown(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
                            >
                              <TrendingUp className="w-4 h-4 text-primary" />
                              Dashboard
                            </Link>
                            <Link
                              href={`/${locale}/dashboard/profile`}
                              onClick={() => setShowDropdown(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
                            >
                              <Settings className="w-4 h-4 text-primary" />
                              Profile Settings
                            </Link>
                          </>
                        )}
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            ) : (
              <Link
                href={`/${locale}/auth/login`}
                className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-full hover:bg-orange-600 transition-all shadow-md shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-px"
              >
                {t("login")}
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            <LanguageSwitcher />
            {user && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold">
                {avatarLetter}
              </div>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-muted-foreground hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden glass-morphism border-t border-white/5 overflow-hidden"
          >
            <div className="px-4 pt-3 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-3 py-3 text-base font-medium rounded-xl transition-colors ${
                    pathname.startsWith(link.href)
                      ? "text-white bg-white/5"
                      : "text-muted-foreground hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-white/5 mt-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2 mb-2">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {avatarLetter}
                      </div>
                      <p className="text-sm text-white font-medium truncate">{user.email}</p>
                    </div>
                    {isOwner && (
                      <div className="flex flex-col gap-2 mb-2">
                        <Link
                          href={`/${locale}/dashboard`}
                          className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-white/5 border border-white/10 rounded-xl"
                        >
                          <TrendingUp className="w-4 h-4 text-primary" />
                          Dashboard
                        </Link>
                        <Link
                          href={`/${locale}/dashboard/profile`}
                          className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-white/5 border border-white/10 rounded-xl"
                        >
                          <Settings className="w-4 h-4 text-primary" />
                          Profile Settings
                        </Link>
                      </div>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-red-400 bg-red-400/10 rounded-xl hover:bg-red-400/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    href={`/${locale}/auth/login`}
                    className="block w-full text-center py-3 text-base font-semibold text-white bg-primary rounded-xl hover:bg-orange-600 transition-colors"
                  >
                    {t("login")}
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
