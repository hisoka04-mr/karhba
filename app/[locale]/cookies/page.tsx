"use client";

import { motion } from "framer-motion";

export default function CookiePage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto glass-card rounded-[32px] p-8 md:p-12 border border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
              Cookie Policy
            </h1>
            <p className="text-muted-foreground">Last updated: May 2026</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
            <h2 className="text-xl font-bold text-white">What are cookies?</h2>
            <p>
              Cookies are small text files that are stored on your computer or mobile device when you visit a website. They allow the website to recognize your device and remember if you have been to the website before.
            </p>

            <h2 className="text-xl font-bold text-white">How we use cookies</h2>
            <p>
              We use cookies for several reasons:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Essential Cookies:</strong> Required for the operation of our platform (e.g., to keep you logged in).</li>
                <li><strong>Analytical/Performance Cookies:</strong> Allow us to recognize and count the number of visitors and see how visitors move around our website.</li>
                <li><strong>Functionality Cookies:</strong> Used to recognize you when you return to our website and personalize content for you (e.g., your language preferences).</li>
              </ul>
            </p>

            <h2 className="text-xl font-bold text-white">Managing Cookies</h2>
            <p>
              Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience, since it will no longer be personalized to you.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
