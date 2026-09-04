import { useState, useMemo } from "react";
import {
  ChevronDown,
  HelpCircle,
  Search,
  Sparkles,
  MessageSquareText,
  Building,
  IndianRupee,
  Compass,
  HardHat,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "../lib/utils";

const FAQ_DATA = [
  {
    id: "faq-1",
    category: "Costs & BOQ",
    question: "How accurate are GRUHAM's city-wise cost estimates & BOQ?",
    answer:
      "Our cost engine computes itemised Bills of Quantities (BOQ) using real market rates across 30+ major Indian cities (such as Bengaluru, Hyderabad, Chennai, Mumbai, Pune, and Delhi NCR). Estimates cover structural materials, flooring, plumbing, electrical, and labor with an indicative accuracy band of ±15%.",
  },
  {
    id: "faq-2",
    category: "AI & Blueprints",
    question: "Can I generate Vastu-compliant floor plans for any plot size?",
    answer:
      "Yes! The Blueprint Generator takes your plot dimensions (e.g. 30x40, 40x60, 50x80 ft), facing direction (North, East, South, West), floor count, and BHK requirements to automatically draft Vastu Shastra compliant layout concepts featuring SE Kitchen and SW Master Bedroom placement.",
  },
  {
    id: "faq-3",
    category: "AI & Blueprints",
    question: "Are the AI-generated 3D renders suitable for construction?",
    answer:
      "GRUHAM's AI renders and floor plans are photorealistic concept visualizations designed to help homeowners explore design options, materials, and room styles. They are concept illustrations for planning purposes — you should always engage a licensed structural engineer or registered architect before breaking ground.",
  },
  {
    id: "faq-4",
    category: "Vastu & Design",
    question: "How does AI image restyling work for interiors & exteriors?",
    answer:
      "You can select any of our style tokens (Traditional Indian, South Indian Chettinad, Modern Minimalist, Contemporary Luxury, Zen Minimalist, or Colonial) or upload a photo of your existing room. You can also type text edit instructions (e.g. 'make the walls sage green', 'add a teakwood portico') to restyle renders in seconds.",
  },
  {
    id: "faq-5",
    category: "Costs & BOQ",
    question: "How do I save, export, or share my designs and cost reports?",
    answer:
      "Every generated blueprint, interior render, exterior elevation, and compound design is automatically saved to your 'My Designs' library. You can download high-resolution renders, export 2D floor plans as SVG, download BOQ cost breakdowns as CSV, or share summary estimates directly over WhatsApp.",
  },
  {
    id: "faq-6",
    category: "Contractors & Safety",
    question: "How are contractors listed on GRUHAM verified?",
    answer:
      "Contractor profiles display verified project portfolios, years of experience, city specializations, customer ratings, and contact details. We are rolling out mandatory GST and KYC verification badges for verified builder badges across India.",
  },
  {
    id: "faq-7",
    category: "Vastu & Design",
    question: "What architectural styles are supported for Indian homes?",
    answer:
      "We specialize in authentic Indian architectural aesthetics including Traditional Chettinad Courtyard, Kerala Nalukettu, Rajasthani Haveli, Modern Minimalist, Contemporary Luxury, British Colonial, and Zen Fusion designs.",
  },
  {
    id: "faq-8",
    category: "Contractors & Safety",
    question: "Is GRUHAM free to use for homeowners?",
    answer:
      "Yes! Homeowners can generate concept blueprints, estimate city-wise construction costs, explore house catalogs, and restyle room photos completely free of charge. No credit card required.",
  },
];

const CATEGORIES = ["All", "AI & Blueprints", "Costs & BOQ", "Vastu & Design", "Contractors & Safety"];

export default function FAQSection({ title = "Frequently Asked Questions", subtitle = "Got questions about building or renovating your home? Find instant answers below." }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openId, setOpenId] = useState("faq-1");

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((faq) => {
      if (activeCategory !== "All" && faq.category !== activeCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          faq.question.toLowerCase().includes(q) ||
          faq.answer.toLowerCase().includes(q) ||
          faq.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activeCategory, searchQuery]);

  const toggleFaq = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="py-20 bg-[#FAF8F5] relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#B8860B]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-[#B8860B]/10 border border-[#B8860B]/20 rounded-full px-4 py-2 mb-4 shadow-sm">
            <HelpCircle className="w-4 h-4 text-[#B8860B]" />
            <span className="text-[#B8860B] font-bold text-xs uppercase tracking-wider">Help & Clarity</span>
          </div>
          
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#1a1a1a] mb-4">
            {title}
          </h2>
          
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </motion.div>

        {/* Search Bar & Category Filter Bar */}
        <div className="max-w-3xl mx-auto mb-10 space-y-5">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any question (e.g. Vastu, BOQ cost, 3D renders, contractors)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-gray-200 shadow-sm text-sm focus:outline-none focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-700 bg-gray-100 rounded-full px-2 py-0.5"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center justify-center flex-wrap gap-2 pt-1">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                    isActive
                      ? "bg-[#1a1a1a] text-[#B8860B] shadow-md border border-[#B8860B]/50 scale-105"
                      : "bg-white text-gray-700 border border-gray-200 hover:border-[#B8860B] hover:text-[#B8860B]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQs Accordion Grid */}
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-gray-200 shadow-sm">
              <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-700 font-bold">No matching questions found</p>
              <p className="text-xs text-gray-500 mt-1">Try searching for keywords like "Vastu", "BOQ", "Interior", or "Cost".</p>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isOpen = openId === faq.id;
              return (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? "bg-white border-[#B8860B]/50 shadow-xl ring-1 ring-[#B8860B]/20"
                      : "bg-white/80 hover:bg-white border-gray-200 hover:border-[#B8860B]/40 shadow-sm hover:shadow-md"
                  }`}
                >
                  {/* Accordion Header */}
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-5 md:p-6 text-left flex items-start justify-between gap-4 select-none"
                  >
                    <div className="space-y-1 pr-2">
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#B8860B] bg-[#B8860B]/10 px-2.5 py-0.5 rounded-full border border-[#B8860B]/20">
                        {faq.category}
                      </span>
                      <h3 className="font-serif text-lg md:text-xl font-bold text-[#1a1a1a] leading-snug">
                        {faq.question}
                      </h3>
                    </div>

                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 mt-1 ${
                        isOpen
                          ? "bg-[#B8860B] text-white rotate-180 shadow-md"
                          : "bg-gray-100 text-gray-600 group-hover:bg-[#B8860B]/10"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Accordion Content Body */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                      >
                        <div className="px-5 md:px-6 pb-6 pt-1 text-gray-600 text-sm md:text-base leading-relaxed border-t border-gray-100">
                          <p>{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Bottom CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14 max-w-4xl mx-auto bg-gradient-to-r from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] rounded-3xl p-8 text-white text-center shadow-2xl relative overflow-hidden border border-[#B8860B]/30"
        >
          <div className="relative z-10 space-y-4">
            <div className="w-12 h-12 bg-[#B8860B]/20 border border-[#B8860B]/40 rounded-full flex items-center justify-center mx-auto">
              <MessageSquareText className="w-6 h-6 text-[#B8860B]" />
            </div>
            <h3 className="font-serif text-2xl md:text-3xl font-bold">Have More Specific Questions?</h3>
            <p className="text-gray-300 text-sm md:text-base max-w-xl mx-auto">
              Ask our 24/7 AI Architect assistant floating at the bottom right, or generate a customized estimate for your plot today.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link
                to={createPageUrl("BlueprintGenerator")}
                className="bg-[#B8860B] hover:bg-[#997320] text-white px-6 py-3 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg transition-all transform hover:scale-105"
              >
                <span>Generate Blueprint Plan</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to={createPageUrl("Contact")}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-full text-xs font-bold transition-all"
              >
                Contact Support Team
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
