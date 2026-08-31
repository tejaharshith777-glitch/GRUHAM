import {
  Check,
  Crown,
  Sparkles,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "../lib/utils";

const pricingPlans = [
  {
    name: "Free",
    price: "0",
    period: "forever",
    description: "Perfect for trying out our AI designer",
    icon: Sparkles,
    features: [
      "5 AI design generations",
      "3 design styles",
      "Standard quality renders",
      "Basic room types",
      "Email support",
    ],
    cta: "Get Started Free",
    popular: false,
    color: "gray",
  },
  {
    name: "Pro",
    price: "199",
    period: "month",
    description: "For homeowners and design enthusiasts",
    icon: Zap,
    features: [
      "100 AI design generations/month",
      "All 6 design styles",
      "High quality renders",
      "All room types",
      "Before/after comparisons",
      "Download in multiple formats",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    popular: true,
    color: "gold",
  },
  {
    name: "Business",
    price: "499",
    period: "month",
    description: "For professionals and agencies",
    icon: Crown,
    features: [
      "Unlimited AI generations",
      "All 6 design styles",
      "High quality renders",
      "All room types",
      "Download & share",
      "Priority support",
      "Team collaboration (coming soon)",
    ],
    cta: "Contact Sales",
    popular: false,
    color: "dark",
  },
];
export default function Pricing() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
          }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-[#B8860B]/10 rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4 text-[#B8860B]" />
            <span className="text-[#B8860B] font-medium text-sm">Pricing Plans</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-4">
            Choose Your Plan
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-4">
            Start free and upgrade as you grow. All plans include our core AI design features.
          </p>
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-2 text-sm text-amber-800">
            💳 Payments integration coming soon — sign up free now and credits will be awarded on launch
          </div>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((e, t) => (
            <motion.div
              key={e.name}
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                delay: t * 0.1,
              }}
              className={`relative rounded-3xl p-8 ${e.popular ? "bg-gradient-to-b from-[#B8860B] to-[#8B6508] text-white shadow-2xl scale-105" : "bg-white shadow-lg"}`}
            >
              {e.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-[#1a1a1a] text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="text-center mb-8">
                <e.icon
                  className={`w-12 h-12 mx-auto mb-4 ${e.popular ? "text-white" : "text-[#B8860B]"}`}
                />
                <h3
                  className={`font-serif text-2xl font-bold mb-2 ${e.popular ? "text-white" : "text-[#1a1a1a]"}`}
                >
                  {e.name}
                </h3>
                <p className={`text-sm mb-6 ${e.popular ? "text-white/80" : "text-gray-500"}`}>
                  {e.description}
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">₹{e.price}</span>
                  <span className={e.popular ? "text-white/80" : "text-gray-500"}>/{e.period}</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {e.features.map((n, r) => (
                  <li key={r} className="flex items-start gap-3">
                    <Check
                      className={`w-5 h-5 mt-0.5 flex-shrink-0 ${e.popular ? "text-white" : "text-[#B8860B]"}`}
                    />
                    <span className={e.popular ? "text-white/90" : "text-gray-600"}>{n}</span>
                  </li>
                ))}
              </ul>
              <Link to={createPageUrl("Designer")}>
                <motion.button
                  whileHover={{
                    scale: 1.02,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  className={`w-full py-4 rounded-full font-semibold transition-all duration-300 ${e.popular ? "bg-white text-[#B8860B] hover:bg-gray-100" : "bg-[#B8860B] text-white hover:bg-[#1a1a1a]"}`}
                >
                  {e.cta}
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
            delay: 0.4,
          }}
          className="mt-20 max-w-3xl mx-auto"
        >
          <h2 className="font-serif text-3xl font-bold text-center text-[#1a1a1a] mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "What counts as a design generation?",
                a: "Each time you upload a photo and generate a new design visualization, that counts as one generation. Regenerating with the same photo but different style also counts as one generation.",
              },
              {
                q: "Can I cancel my subscription anytime?",
                a: "Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.",
              },
              {
                q: "What image formats do you support?",
                a: "We support JPEG, PNG, and WebP formats. For best results, use high-resolution photos with good lighting.",
              },
              {
                q: "Do you offer refunds?",
                a: "We offer a 7-day money-back guarantee for all paid plans. If you're not satisfied, contact our support team.",
              },
            ].map((e, t) => (
              <div key={t} className="bg-white rounded-2xl p-6 shadow-md">
                <h4 className="font-serif text-lg font-bold text-[#1a1a1a] mb-2">{e.q}</h4>
                <p className="text-gray-600">{e.a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
