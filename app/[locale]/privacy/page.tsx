"use client";

import { motion } from "framer-motion";

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">Last updated: May 2026</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
            <h2 className="text-xl font-bold text-white">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you create or modify your account, request services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, driving license details, and payment information.
            </p>

            <h2 className="text-xl font-bold text-white">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Provide, maintain, and improve our Services.</li>
                <li>Facilitate transactions and payments.</li>
                <li>Verify your identity and eligibility (e.g., driver's license verification).</li>
                <li>Send you support and administrative messages.</li>
              </ul>
            </p>

            <h2 className="text-xl font-bold text-white">3. Information Sharing</h2>
            <p>
              We may share the information we collect about you with other users to facilitate the rental process. For example, we share your name, profile photo, and ratings with the owner of a car you wish to rent. We do not sell your personal information to third parties.
            </p>

            <h2 className="text-xl font-bold text-white">4. Data Security</h2>
            <p>
              We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
