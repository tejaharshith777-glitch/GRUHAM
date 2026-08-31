import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "../lib/utils";
import {
  AlertTriangle,
  ArrowRight,
  Calculator,
  ClipboardList,
  FileText,
  HardHat,
  IndianRupee,
  Sparkles,
  Users,
} from "lucide-react";

const steps = [
  {
    step: "01",
    icon: FileText,
    title: "Describe your plot & requirements",
    description:
      "Enter your plot size, BHK, floors, city, budget, and preferred style. Optionally upload a rough sketch or reference image. Our tool captures your priorities — including Vastu zone preferences.",
    detail: "Takes about 2 minutes",
    link: createPageUrl("BlueprintGenerator"),
    linkText: "Try Blueprint Generator",
  },
  {
    step: "02",
    icon: IndianRupee,
    title: "Get a concept plan + itemised cost estimate",
    description:
      "See a concept layout and an itemised Bill of Quantities (BOQ) broken down by stage — foundation, structure, flooring, plumbing, electrical, paint, and more. Rates are calibrated to your city and finish level.",
    detail: "Typically ₹1,350–₹3,000/sq ft depending on city & finish",
    link: createPageUrl("Materials"),
    linkText: "Try Cost Estimator",
    disclaimer:
      "Cost estimates are indicative (±15%) based on current market inputs — not a contractor quotation.",
  },
  {
    step: "03",
    icon: ClipboardList,
    title: "Save, review & share with your family",
    description:
      "Save your designs to My Designs. Share a link with family members or your contractor. Compare options side by side. Download a summary PDF to take to your next meeting.",
    detail: "Designs saved to your account across devices",
    link: createPageUrl("DesignLibrary"),
    linkText: "Go to My Designs",
  },
  {
    step: "04",
    icon: HardHat,
    title: "Connect with registered contractors & track the build",
    description:
      "Browse our contractor directory, shortlist profiles by city, specialisation, and rating, and send a request for quote. Once work begins, track milestones and spending in the Project Tracker.",
    detail: "Contractor marketplace launching soon",
    link: createPageUrl("Contractors"),
    linkText: "Browse Contractors",
  },
];

const tools = [
  {
    icon: FileText,
    name: "Blueprint Generator",
    desc: "2D concept floor plans for full houses — 1 BHK to Penthouse",
    link: createPageUrl("BlueprintGenerator"),
  },
  {
    icon: Sparkles,
    name: "Interior Design",
    desc: "Upload a room photo and see it reimagined in 6 styles",
    link: createPageUrl("InteriorDesign"),
  },
  {
    icon: Sparkles,
    name: "Exterior Design",
    desc: "Façade, balcony, and terrace concept renders",
    link: createPageUrl("ExteriorDesign"),
  },
  {
    icon: Sparkles,
    name: "Compound Design",
    desc: "Garden, parking, boundary wall, and entrance concepts",
    link: createPageUrl("CompoundDesign"),
  },
  {
    icon: IndianRupee,
    name: "Cost Estimator",
    desc: "Itemised BOQ with city-wise rates and stage-wise breakdown",
    link: createPageUrl("Materials"),
  },
  {
    icon: Users,
    name: "Contractors",
    desc: "Browse registered contractors by city and specialisation",
    link: createPageUrl("Contractors"),
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: "easeOut" },
};

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 pb-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div {...fadeUp} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#B8860B]/10 rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4 text-[#B8860B]" />
            <span className="text-[#B8860B] font-medium text-sm">How GRUHAM Works</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-4">
            From Plot to Plan in Minutes
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            GRUHAM is a planning tool for Indian homeowners. It helps you see what your home could look like,
            understand what it will realistically cost, and connect with the right people to build it.
          </p>
          <p className="text-gray-500 text-sm mt-4 max-w-2xl mx-auto">
            GRUHAM does <strong>not</strong> replace a licensed architect or structural engineer.
            All AI-generated plans are concept illustrations for discussion and planning purposes only.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-12 mb-20">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-start"
            >
              <div className="flex-shrink-0 flex flex-col items-center">
                <span className="font-serif text-5xl font-bold text-[#B8860B]/20 leading-none">
                  {step.step}
                </span>
                <div className="w-14 h-14 bg-[#B8860B]/10 rounded-2xl flex items-center justify-center mt-2">
                  <step.icon className="w-7 h-7 text-[#B8860B]" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="font-serif text-2xl font-bold text-[#1a1a1a] mb-3">{step.title}</h2>
                <p className="text-gray-600 text-base leading-relaxed mb-3">{step.description}</p>
                {step.detail && (
                  <p className="text-sm text-[#B8860B] font-medium mb-3">ℹ️ {step.detail}</p>
                )}
                {step.disclaimer && (
                  <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-amber-800 text-sm">{step.disclaimer}</p>
                  </div>
                )}
                <Link
                  to={step.link}
                  className="inline-flex items-center gap-2 text-[#B8860B] font-medium text-sm hover:text-[#1a1a1a] transition-colors group"
                >
                  {step.linkText}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Disclaimer box */}
        <motion.div
          {...fadeUp}
          className="bg-amber-50 border border-amber-200 rounded-3xl p-8 mb-20"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-amber-900 mb-2">
                Important: What AI output means
              </h3>
              <ul className="space-y-2 text-amber-800 text-sm leading-relaxed">
                <li>
                  <strong>Concept plans are not construction drawings.</strong> They are AI-generated
                  illustrations to help you communicate your vision. Before any construction, you must
                  engage a licensed architect and structural engineer for stamped drawings.
                </li>
                <li>
                  <strong>Cost estimates are indicative (±15%).</strong> They are based on current
                  market rate inputs for your city and finish level, not a contractor quotation. Actual
                  costs depend on soil conditions, local bylaws, material price fluctuations, and scope
                  changes.
                </li>
                <li>
                  <strong>Vastu guidance is informational.</strong> GRUHAM's layout inputs follow common
                  Vastu zone guidelines. For a full Vastu compliance review, consult a certified Vastu
                  expert.
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Tools grid */}
        <motion.div {...fadeUp} className="text-center mb-10">
          <h2 className="font-serif text-3xl font-bold text-[#1a1a1a] mb-2">All Design Tools</h2>
          <p className="text-gray-500">Everything in one place — free to start, no card required.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                to={tool.link}
                className="block bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-10 h-10 bg-[#B8860B]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#B8860B] transition-colors">
                  <tool.icon className="w-5 h-5 text-[#B8860B] group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#1a1a1a] mb-1 group-hover:text-[#B8860B] transition-colors">
                  {tool.name}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{tool.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          {...fadeUp}
          className="text-center bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] rounded-3xl p-12"
        >
          <h2 className="font-serif text-3xl font-bold text-white mb-3">
            Start planning your home today
          </h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            5 free design credits on signup. Full itemised BOQ estimate included. No credit card needed.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to={createPageUrl("Materials")}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#B8860B] text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2 hover:bg-[#D4A84B] transition-colors"
              >
                <Calculator className="w-5 h-5" />
                Estimate My Cost
              </motion.button>
            </Link>
            <Link to={createPageUrl("BlueprintGenerator")}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold border border-white/20 hover:bg-white/20 transition-colors"
              >
                Generate a Concept Plan
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
