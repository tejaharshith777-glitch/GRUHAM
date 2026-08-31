import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "../lib/utils";
import {
  ArrowRight,
  Heart,
  IndianRupee,
  Lightbulb,
  MapPin,
  Shield,
  Sparkles,
  Target,
} from "lucide-react";

const principles = [
  {
    icon: Shield,
    title: "No fake data, ever",
    description:
      "If a number isn't real, we don't show it. Every rate, estimate, and contractor profile on GRUHAM is sourced from real inputs or clearly marked as a sample.",
  },
  {
    icon: Lightbulb,
    title: "Auditability over magic",
    description:
      "We show how every cost estimate was computed — which city index, which finish multiplier, which rates. Users trust what they can audit.",
  },
  {
    icon: Heart,
    title: "AI assists, professionals decide",
    description:
      "All AI-generated plans and images are concept illustrations. We always say so clearly. Before construction, consult a licensed architect and structural engineer.",
  },
  {
    icon: MapPin,
    title: "India-first",
    description:
      "City-wise rates, Vastu guidelines, local bylaw awareness, INR pricing, UPI payments (coming), WhatsApp notifications (coming), and support in Indian languages (coming).",
  },
  {
    icon: Target,
    title: "Every screen answers: what do I do next?",
    description:
      "Every page has a clear next step. We don't build dead ends — we build a path from plot to handover.",
  },
  {
    icon: IndianRupee,
    title: "Cost transparency as a right",
    description:
      "70%+ of Indian home builds run 20–40% over budget because the numbers were never clear. GRUHAM's cost engine exists to change that.",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: "easeOut" },
};

export default function About() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Hero */}
        <motion.div {...fadeUp} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-[#B8860B]/10 rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4 text-[#B8860B]" />
            <span className="text-[#B8860B] font-medium text-sm">About GRUHAM</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6 leading-tight">
            Built for Indian homeowners <br />
            <span className="text-[#B8860B]">who deserve better tools</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            India builds over 10 million homes a year. Most families go through the process with no clear
            plan, no reliable cost number, and no way to know if the contractor they hired is any good.
            GRUHAM exists to fix that.
          </p>
        </motion.div>

        {/* Problem statement */}
        <motion.div
          {...fadeUp}
          className="bg-white rounded-3xl p-10 md:p-14 shadow-sm border border-gray-100 mb-16"
        >
          <h2 className="font-serif text-3xl font-bold text-[#1a1a1a] mb-6">The problem we're solving</h2>
          <div className="grid md:grid-cols-2 gap-8 text-gray-600 leading-relaxed">
            <div>
              <h3 className="font-semibold text-[#1a1a1a] mb-2">For homeowners</h3>
              <ul className="space-y-3 text-sm">
                <li>🏠 An architect charges ₹50k–₹5L and takes weeks for drawings most families can't read</li>
                <li>💸 Construction quotes vary 2–3× between contractors for the same house</li>
                <li>🔨 70%+ of builds run 20–40% over budget because no one trusted the initial number</li>
                <li>📱 Everything is on WhatsApp — drawings, payments, disputes — with no audit trail</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[#1a1a1a] mb-2">For contractors</h3>
              <ul className="space-y-3 text-sm">
                <li>📣 No steady pipeline of leads — everything is word of mouth</li>
                <li>⚖️ Genuine contractors can't prove quality against fly-by-night operators</li>
                <li>🕒 Hours spent making estimates and drawings that clients take to cheaper competitors</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 p-6 bg-[#B8860B]/5 rounded-2xl border border-[#B8860B]/20">
            <p className="text-[#1a1a1a] font-serif text-xl font-semibold leading-snug">
              "GRUHAM — see your home before you build it, know what it really costs,
              and hire people you can trust."
            </p>
          </div>
        </motion.div>

        {/* Principles */}
        <motion.div {...fadeUp} className="text-center mb-10">
          <h2 className="font-serif text-3xl font-bold text-[#1a1a1a] mb-2">Our product principles</h2>
          <p className="text-gray-500">These rules govern every feature we build.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {principles.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="w-10 h-10 bg-[#B8860B]/10 rounded-xl flex items-center justify-center mb-4">
                <p.icon className="w-5 h-5 text-[#B8860B]" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1a1a1a] mb-2">{p.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{p.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Honest status */}
        <motion.div
          {...fadeUp}
          className="bg-[#1a1a1a] rounded-3xl p-10 md:p-14 text-white mb-16"
        >
          <h2 className="font-serif text-3xl font-bold mb-6">Where we are today — honestly</h2>
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-[#B8860B] font-semibold mb-3">✅ Working right now</h3>
              <ul className="space-y-2 text-gray-300 text-sm leading-relaxed">
                <li>• AI concept renders for interiors, exteriors, compounds, and blueprints</li>
                <li>• Indicative cost estimator (city-wise ₹/sq ft + breakdown)</li>
                <li>• Contractor directory (sample profiles — real directory in progress)</li>
                <li>• Save designs to your browser (cross-device sync coming soon)</li>
                <li>• 6 design styles for room restyle</li>
              </ul>
            </div>
            <div>
              <h3 className="text-[#B8860B] font-semibold mb-3">🔨 Building next</h3>
              <ul className="space-y-2 text-gray-300 text-sm leading-relaxed">
                <li>• Real account system (login, cross-device, family sharing)</li>
                <li>• Itemised 30-line BOQ with city rates and PDF export</li>
                <li>• Real AI renders (ControlNet room-preserving redesign)</li>
                <li>• Verified contractor marketplace with KYC and reviews</li>
                <li>• Razorpay payments and credit packs</li>
                <li>• Project Tracker (milestones, expenses, photo timeline)</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Contact / CTA */}
        <motion.div {...fadeUp} className="text-center">
          <h2 className="font-serif text-3xl font-bold text-[#1a1a1a] mb-4">Get in touch</h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Questions, partnerships, or contractor onboarding interest — we read every message.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to={createPageUrl("Contact")}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#B8860B] text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2 hover:bg-[#D4A84B] transition-colors"
              >
                Contact Us
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
            <Link to={createPageUrl("HowItWorks")}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-[#B8860B] text-[#B8860B] px-8 py-4 rounded-full font-semibold hover:bg-[#B8860B] hover:text-white transition-colors"
              >
                How It Works
              </motion.button>
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
