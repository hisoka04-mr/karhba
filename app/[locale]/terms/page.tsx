"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function TermsPage() {
  const t = useTranslations("Footer");

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
              Terms of Service
            </h1>
            <p className="text-muted-foreground">Last updated: May 2026</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
            <h2 className="text-xl font-bold text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the Karhba platform ("Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service. Karhba connects car owners with individuals seeking to rent vehicles in Tunisia.
            </p>

            <h2 className="text-xl font-bold text-white">2. User Eligibility</h2>
            <p>
              To use Karhba, you must:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Be at least 18 years of age.</li>
                <li>Hold a valid driver's license (for renters).</li>
                <li>Provide accurate, current, and complete registration information.</li>
                <li>Maintain the security of your password and identification.</li>
              </ul>
            </p>

            <h2 className="text-xl font-bold text-white">3. Platform Rules</h2>
            <p>
              <strong>For Owners:</strong> You are responsible for ensuring your vehicle is legally registered, insured, and safe to drive. You must maintain accurate availability and pricing.
              <br/><br/>
              <strong>For Renters:</strong> You agree to return the vehicle in the same condition it was received, on time, and at the agreed location. You are responsible for any traffic violations, tolls, or damage incurred during the rental period.
            </p>

            <h2 className="text-xl font-bold text-white">4. Payments and Fees</h2>
            <p>
              All payments must be processed through the Karhba platform or agreed upon strictly per our guidelines. Karhba reserves the right to charge a service fee for facilitating transactions.
            </p>

            <h2 className="text-xl font-bold text-white">5. Liability and Insurance</h2>
            <p>
              Karhba acts solely as an intermediary platform. We do not own the vehicles and are not responsible for any damage, loss, or injury resulting from the use of rented vehicles. Owners and renters must ensure appropriate insurance coverage is in place.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
