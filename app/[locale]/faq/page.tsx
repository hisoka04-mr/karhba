"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "How do I book a car on Karhba?",
    answer: "Simply browse our available cars, select the dates you need, and send a booking request. Once the owner approves, you're all set! You can chat with the owner to arrange the key handover."
  },
  {
    question: "What are the requirements to rent a car?",
    answer: "You must be at least 18 years old, have a valid driver's license, and have a complete profile on Karhba."
  },
  {
    question: "How does insurance work?",
    answer: "Currently, Karhba acts as a connection platform. Owners are responsible for ensuring their vehicle has the appropriate insurance coverage for peer-to-peer rental, and renters must ensure they are covered to drive the vehicle under Tunisian law."
  },
  {
    question: "How do I list my car?",
    answer: "Create an account, select 'Owner' during profile setup, and navigate to your dashboard. Click 'Add Car', fill in the details and upload photos. Once published, your car will be visible to potential renters."
  },
  {
    question: "Is there a cancellation policy?",
    answer: "Yes, you can cancel a booking request before it's confirmed without penalty. Once confirmed, cancellation policies depend on the owner's specific terms."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            Everything you need to know about Karhba.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="glass-card rounded-2xl border border-white/10 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="font-bold text-white text-lg">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-primary shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-5 text-muted-foreground">
                  <div className="pt-2 border-t border-white/5">
                    {faq.answer}
                  </div>
                </div>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
