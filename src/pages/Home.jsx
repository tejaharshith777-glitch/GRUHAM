import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  ArrowRight,
  Bath,
  BedDouble,
  Box,
  ChevronLeft,
  ChevronRight,
  CircleCheckBig,
  FileText,
  House,
  IndianRupee,
  Lamp,
  Quote,
  Sofa,
  Sparkles,
  Star,
  TreePine,
  Users,
  Utensils,
  WandSparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "../lib/utils";
import { computeBOQ, CITY_NAMES, inrShort } from "@/lib/boq";
import ErrorBoundary from "@/components/ErrorBoundary";

const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1280&q=70&auto=format&fit=crop",
    headline: "Know the real cost of your home",
    subhead: "before you break ground",
    description:
      "Itemised, city-wise cost estimates + AI concept plans for Indian homes. Free to start — no card required.",
    cta: "Estimate My Cost",
    ctaLink: "Materials",
    isH1: true,
  },
  {
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1280&q=70&auto=format&fit=crop",
    headline: "See your rooms before you renovate",
    subhead: "AI concept renders, 6 design styles",
    description:
      "Upload a room photo and see it reimagined by AI. Concept images for visualization — not a substitute for professional design.",
    cta: "Restyle a Room",
    ctaLink: "Designer",
    isH1: false,
  },
  {
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1280&q=70&auto=format&fit=crop",
    headline: "Connect with registered contractors",
    subhead: "Browse profiles by city & specialisation",
    description:
      "Find contractors in your city. Contractor marketplace with KYC verification launching soon.",
    cta: "Browse Contractors",
    ctaLink: "Contractors",
    isH1: false,
  },
  {
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1280&q=70&auto=format&fit=crop",
    headline: "Plan your full house, room by room",
    subhead: "Blueprint + Interior + Exterior + Compound",
    description:
      "Generate concept plans for every part of your home. All AI output is for planning — always engage a licensed architect before construction.",
    cta: "Generate a Concept Plan",
    ctaLink: "BlueprintGenerator",
    isH1: false,
  },
];
const heroHighlights = [
  {
    icon: IndianRupee,
    text: "City-wise ₹/sq ft",
    color: "text-amber-400",
  },
  {
    icon: House,
    text: "Concept Blueprints",
    color: "text-green-400",
  },
  {
    icon: Users,
    text: "Contractor Directory",
    color: "text-purple-400",
  },
  {
    icon: FileText,
    text: "Itemised BOQ",
    color: "text-blue-400",
  },
];
function HeroCarousel() {
  const [e, t] = useState(0);
  useEffect(() => {
    const r = setInterval(() => {
      t((o) => (o + 1) % heroSlides.length);
    }, 6e3);
    return () => clearInterval(r);
  }, []);
  const n = heroSlides[e];
  const [plot, setPlot] = useState("");
  const [unit, setUnit] = useState("sq ft");
  const [city, setCity] = useState("Chennai");
  const navigate = useNavigate();

  const est = useMemo(() => {
    let sqft = parseFloat(plot) || 0;
    if (unit === "sq m") {
      sqft = sqft * 10.7639;
    }
    if (sqft < 600) return null;
    const res = computeBOQ({ builtUpArea: sqft, city, finish: "standard" });
    return res;
  }, [plot, city, unit]);

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={e}
          initial={{
            opacity: 0,
            scale: 1.1,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 1,
          }}
          className="absolute inset-0"
        >
          <img src={n.image} alt={n.headline} className="w-full h-full object-cover"
                 loading={e === 0 ? "eager" : "lazy"}
                 fetchPriority={e === 0 ? "high" : "auto"}
                 decoding="async" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </motion.div>
      </AnimatePresence>
      <div className="relative h-full max-w-7xl mx-auto px-6 lg:px-8 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={e}
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -30,
              }}
              transition={{
                duration: 0.8,
              }}
            >
              <motion.div
                initial={{
                  opacity: 0,
                  x: -20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: 0.3,
                }}
                className="inline-flex items-center gap-2 bg-[#B8860B]/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
              >
                <Sparkles className="w-4 h-4 text-[#B8860B]" />
                <span className="text-[#B8860B] font-medium text-sm">
                  AI-Powered Design for India
                </span>
              </motion.div>
              {n.isH1 ? (
                <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-2">
                  {n.headline}
                </h1>
              ) : (
                <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-2">
                  {n.headline}
                </h2>
              )}
              <p className="text-2xl md:text-3xl text-[#B8860B] font-serif mb-6">{n.subhead}</p>
              <p className="text-lg text-gray-300 mb-8 max-w-lg">{n.description}</p>
              <div className="flex flex-wrap gap-4 mb-10">
                <Link to={createPageUrl(n.ctaLink)}>
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                    }}
                    whileTap={{
                      scale: 0.95,
                    }}
                    className="bg-[#B8860B] text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-2 shadow-lg hover:bg-[#D4A84B] transition-colors"
                  >
                    {n.cta}
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                <Link to={createPageUrl("DesignLibrary")}>
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                    }}
                    whileTap={{
                      scale: 0.95,
                    }}
                    className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg border border-white/30 hover:bg-white/20 transition-colors"
                  >
                    View My Designs
                  </motion.button>
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {heroHighlights.map((r, o) => (
                  <motion.div
                    key={o}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.5 + o * 0.1,
                    }}
                    className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2"
                  >
                    <r.icon className={`w-4 h-4 ${r.color}`} />
                    <span className="text-white text-sm">{r.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="lg:col-span-5 hidden lg:block">
          <ErrorBoundary
            fallback={
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl text-center">
                <h3 className="font-serif text-xl font-bold text-white mb-2">Quick Cost Estimate</h3>
                <p className="text-white/70 text-sm">Estimator is currently unavailable. Please try refreshing.</p>
              </div>
            }
          >
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl"
            >
              <h3 className="font-serif text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <IndianRupee className="w-6 h-6 text-[#B8860B]" /> Quick Cost Estimate
              </h3>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-white/80 text-sm font-medium">Built-up Area</label>
                    <div className="flex bg-white/20 rounded-md overflow-hidden text-xs">
                      <button 
                        onClick={() => setUnit("sq ft")}
                        className={`px-2 py-1 ${unit === "sq ft" ? "bg-[#B8860B] text-white" : "text-white/70 hover:text-white"}`}
                      >
                        sq ft
                      </button>
                      <button 
                        onClick={() => setUnit("sq m")}
                        className={`px-2 py-1 ${unit === "sq m" ? "bg-[#B8860B] text-white" : "text-white/70 hover:text-white"}`}
                      >
                        sq m
                      </button>
                    </div>
                  </div>
                  <input
                    type="number"
                    placeholder={unit === "sq ft" ? "e.g. 1500" : "e.g. 140"}
                    value={plot}
                    onChange={(e) => setPlot(e.target.value)}
                    className="w-full h-12 bg-white/20 border border-white/30 rounded-xl px-4 text-white placeholder-white/50 focus:outline-none focus:border-[#B8860B]"
                  />
                </div>
                <div>
                  <label className="text-white/80 text-sm font-medium mb-1 block">City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-12 bg-white/20 border border-white/30 rounded-xl px-4 text-white focus:outline-none focus:border-[#B8860B] [&>option]:text-black"
                  >
                    {CITY_NAMES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                
                <div className="h-24 flex flex-col justify-center">
                  {est ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <p className="text-[#B8860B] font-serif text-3xl font-bold">
                        {inrShort(est.band_low)} – {inrShort(est.band_high)}
                      </p>
                      <p className="text-white/70 text-sm mt-1">For standard finishes in {city}</p>
                    </motion.div>
                  ) : (
                    <p className="text-white/50 text-sm">Enter at least {unit === "sq ft" ? "600" : "55"} {unit} to see an estimate.</p>
                  )}
                </div>

                <button
                  onClick={() => navigate(createPageUrl("Designer"))}
                  className="w-full h-12 bg-[#B8860B] hover:bg-[#D4A84B] text-white rounded-xl font-semibold transition-colors"
                >
                  Plan Full Details
                </button>
              </div>
            </motion.div>
          </ErrorBoundary>
        </div>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
        {heroSlides.map((r, o) => (
          <button
            key={o}
            onClick={() => t(o)}
            className={`h-2 rounded-full transition-all duration-300 ${o === e ? "w-8 bg-[#B8860B]" : "w-2 bg-white/50 hover:bg-white/80"}`}
          />
        ))}
      </div>
    </section>
  );
}
function HeroBottomCurve() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden pointer-events-none z-20">
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute bottom-0 w-full"
        preserveAspectRatio="none"
      >
        <ellipse cx="720" cy="120" rx="900" ry="100" fill="#FAF8F5" />
      </svg>
    </div>
  );
}
const features = [
  {
    icon: FileText,
    title: "AI Concept Plans",
    subtitle: "FOR VISUALIZATION & PLANNING",
    description:
      "Generate 2D concept floor plans and elevation renders to communicate your vision. Concept output — not construction drawings. Always engage a licensed architect before building.",
  },
  {
    icon: IndianRupee,
    title: "Itemised Cost Estimates",
    subtitle: "CITY-WISE ₹/SQ FT BREAKDOWN",
    description:
      "Get an indicative Bill of Quantities broken down by stage — foundation, structure, flooring, plumbing, electrical, paint, and more. Estimates are ±15% and not a contractor quotation.",
  },
  {
    icon: CircleCheckBig,
    title: "Vastu-Aware Layouts",
    subtitle: "COMMON ZONE GUIDELINES",
    description:
      "Our layout tool follows common Vastu Shastra zone guidelines (kitchen SE, master bedroom SW, entrance N/E). For full Vastu compliance, consult a certified Vastu expert.",
  },
  {
    icon: Users,
    title: "Contractor Directory",
    subtitle: "BROWSE BY CITY & SPECIALISATION",
    description:
      "Browse registered contractors by city, specialisation, and experience. Verified contractor marketplace with KYC, reviews, and lead management is launching soon.",
  },
];
function WhyChooseUs() {
  return (
    <section
      id="why-us"
      className="pt-20 md:pt-24 lg:pt-28 pb-16 md:pb-20 lg:pb-24 bg-gradient-to-b from-[#FAF8F5] to-white relative overflow-hidden"
    >
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.3,
          rotate: 45,
        }}
        whileInView={{
          opacity: 0.08,
          scale: 1,
          rotate: 0,
        }}
        transition={{
          duration: 2.5,
          ease: "easeOut",
          delay: 0.3,
        }}
        viewport={{
          once: true,
        }}
        className="absolute bottom-10 left-10"
      >
        <div className="w-96 h-96 bg-[#B8860B] rounded-full blur-3xl" />
      </motion.div>
      <div className="mx-auto my-1 px-6 max-w-7xl lg:px-8">
        <div className="grid grid-cols-1 items-center">
          <motion.div
            initial={{
              opacity: 0,
              y: 100,
              scale: 0.9,
              rotateX: 15,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
              scale: 1,
              rotateX: 0,
            }}
            transition={{
              duration: 1.2,
              ease: "easeOut",
              type: "spring",
              stiffness: 100,
            }}
            viewport={{
              once: true,
            }}
            className="space-y-8 text-center"
          >
            <div>
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0,
                  rotate: -180,
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                  rotate: 0,
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.2,
                  type: "spring",
                  stiffness: 200,
                }}
                viewport={{
                  once: true,
                }}
                className="inline-flex items-center gap-2 bg-[#B8860B]/10 rounded-full px-4 py-2 mb-6"
              >
                <Sparkles className="w-4 h-4 text-[#B8860B]" />
                <span className="font-sans text-sm text-[#B8860B] font-medium uppercase tracking-wider">
                  AI-POWERED HOME DESIGN FOR INDIA
                </span>
              </motion.div>
              <motion.h2
                initial={{
                  opacity: 0,
                  y: 50,
                  skewY: 5,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  skewY: 0,
                }}
                transition={{
                  duration: 1,
                  delay: 0.4,
                  ease: "easeOut",
                }}
                viewport={{
                  once: true,
                }}
                className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              >
                <span className="text-[#1a1a1a]">Why Build With</span>
                <br />
                <span className="text-[#B8860B]">GRUHAM</span>
              </motion.h2>
              <motion.p
                initial={{
                  opacity: 0,
                  y: 30,
                  filter: "blur(5px)",
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                }}
                transition={{
                  duration: 1,
                  delay: 0.6,
                  ease: "easeOut",
                }}
                viewport={{
                  once: true,
                }}
                className="font-sans text-lg text-gray-600 leading-relaxed mb-8 max-w-3xl mx-auto"
              >
                Design your dream home with AI. Generate professional blueprints, itemised cost
                estimates, and material breakdowns—all tailored for Indian homes. Build
                with confidence, not guesswork.
              </motion.p>
            </div>
            <div className="space-y-8 max-w-2xl mx-auto text-left">
              {features.map((e, t) => (
                <motion.div
                  key={e.title}
                  initial={{
                    opacity: 0,
                    x: t % 2 === 0 ? -100 : 100,
                    rotateY: t % 2 === 0 ? -30 : 30,
                    scale: 0.8,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                    rotateY: 0,
                    scale: 1,
                  }}
                  transition={{
                    duration: 1.2,
                    delay: t * 0.3,
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                  }}
                  viewport={{
                    once: true,
                  }}
                  whileHover={{
                    scale: 1.05,
                    x: 10,
                  }}
                  className="flex items-start gap-4 group cursor-pointer"
                >
                  <motion.div
                    initial={{
                      scale: 0,
                      rotate: -180,
                    }}
                    whileInView={{
                      scale: 1,
                      rotate: 0,
                    }}
                    transition={{
                      duration: 0.8,
                      delay: t * 0.3 + 0.2,
                      type: "spring",
                      stiffness: 200,
                    }}
                    viewport={{
                      once: true,
                    }}
                    whileHover={{
                      rotate: 360,
                      scale: 1.2,
                    }}
                    className="w-14 h-14 bg-[#B8860B]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#B8860B] transition-all duration-500 flex-shrink-0"
                  >
                    <e.icon className="w-7 h-7 text-[#B8860B] group-hover:text-white transition-colors duration-300" />
                  </motion.div>
                  <div className="flex-1">
                    <motion.h3
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.8,
                        delay: t * 0.3 + 0.4,
                      }}
                      viewport={{
                        once: true,
                      }}
                      className="font-serif text-xl font-bold text-[#1a1a1a] mb-1 group-hover:text-[#B8860B] transition-colors duration-300"
                    >
                      {e.title}
                    </motion.h3>
                    <motion.p
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.6,
                        delay: t * 0.3 + 0.5,
                      }}
                      viewport={{
                        once: true,
                      }}
                      className="font-sans text-sm font-medium text-[#B8860B] uppercase tracking-wider mb-2"
                    >
                      {e.subtitle}
                    </motion.p>
                    <motion.p
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.6,
                        delay: t * 0.3 + 0.6,
                      }}
                      viewport={{
                        once: true,
                      }}
                      className="font-sans text-gray-600 leading-relaxed"
                    >
                      {e.description}
                    </motion.p>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{
                opacity: 0,
                y: 50,
                scale: 0.5,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              transition={{
                duration: 1,
                delay: 1.2,
                type: "spring",
                stiffness: 150,
              }}
              viewport={{
                once: true,
              }}
              className="pt-4"
            >
              <Link to={createPageUrl("BlueprintGenerator")}>
                <motion.button
                  whileHover={{
                    scale: 1.1,
                    boxShadow: "0 20px 40px rgba(184, 134, 11, 0.3)",
                  }}
                  whileTap={{
                    scale: 0.95,
                  }}
                  className="bg-[#B8860B] text-white px-8 py-4 rounded-full font-sans font-medium hover:bg-[#1a1a1a] transition-all duration-300 shadow-lg"
                >
                  Start Designing Your Space
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
function LimitedOfferCTA() {
  return (
    <section className="py-16 md:py-20 px-6 lg:px-8">
      <motion.div
        initial={{
          opacity: 0,
          y: 50,
          scale: 0.95,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 1,
          ease: "easeOut",
        }}
        viewport={{
          once: true,
        }}
        className="max-w-6xl mx-auto relative overflow-hidden rounded-3xl"
      >
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=1280&q=70&auto=format&fit=crop"
            alt="Beautiful interior design showcase"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a]/90 via-[#1a1a1a]/70 to-transparent" />
        </div>
        <div className="relative z-10 py-16 md:py-24 px-8 md:px-16">
          <div className="max-w-xl">
            <motion.div
              initial={{
                opacity: 0,
                x: -30,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.2,
              }}
              viewport={{
                once: true,
              }}
              className="inline-flex items-center gap-2 bg-[#B8860B]/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-[#B8860B]/30"
            >
              <Sparkles className="w-4 h-4 text-[#B8860B]" />
              <span className="text-[#B8860B] font-medium text-sm">Limited Time Offer</span>
            </motion.div>
            <motion.h2
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.4,
              }}
              viewport={{
                once: true,
              }}
              className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"
            >
              Start free — no card needed
              <br />
              <span className="text-[#B8860B]">5 credits on signup</span>
            </motion.h2>
            <motion.p
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.6,
              }}
              viewport={{
                once: true,
              }}
              className="text-gray-300 text-lg mb-8 leading-relaxed"
            >
              Sign up and get 5 free design credits + a full itemised cost estimate. No credit card required.
              Concept renders for planning — not architectural drawings for construction.
            </motion.p>
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.8,
              }}
              viewport={{
                once: true,
              }}
            >
              <Link to={createPageUrl("Designer")}>
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(184, 134, 11, 0.4)",
                  }}
                  whileTap={{
                    scale: 0.95,
                  }}
                  className="group bg-[#B8860B] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-[#1a1a1a] transition-all duration-300 flex items-center gap-3"
                >
                  Start Free — No Card Required
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
        <motion.div
          initial={{
            opacity: 0,
            scale: 0,
          }}
          whileInView={{
            opacity: 0.1,
            scale: 1,
          }}
          transition={{
            duration: 1.5,
            delay: 0.5,
          }}
          viewport={{
            once: true,
          }}
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#B8860B] rounded-full blur-3xl"
        />
      </motion.div>
    </section>
  );
}
const roomTypes = [
  {
    icon: Sofa,
    text: "Living Room",
  },
  {
    icon: BedDouble,
    text: "Bedroom",
  },
  {
    icon: Utensils,
    text: "Kitchen",
  },
  {
    icon: Bath,
    text: "Bathroom",
  },
  {
    icon: Lamp,
    text: "Office",
  },
  {
    icon: TreePine,
    text: "Outdoor",
  },
  {
    icon: House,
    text: "Entryway",
  },
];
function RoomsMarquee() {
  const e = [...roomTypes, ...roomTypes, ...roomTypes, ...roomTypes];
  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 100,
        scale: 0.9,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 1.2,
        ease: "easeOut",
        type: "spring",
        stiffness: 100,
      }}
      viewport={{
        once: true,
      }}
      className="py-16 md:py-20 overflow-hidden relative bg-[#FAF8F5]"
    >
      <style>
        {`
        .marquee-container {
          display: flex;
          width: fit-content;
          animation: marquee 60s linear infinite;
        }

        .marquee-item {
          flex-shrink: 0;
        }
        
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .group:hover .marquee-container {
          animation-play-state: paused;
        }
      `}
      </style>
      <div className="text-center mb-16 relative px-6">
        <motion.h2
          initial={{
            opacity: 0,
            y: 60,
            filter: "blur(10px)",
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          transition={{
            duration: 1.2,
            ease: "easeOut",
          }}
          viewport={{
            once: true,
          }}
          className="font-serif text-4xl md:text-5xl font-bold leading-tight"
        >
          <span className="text-[#1a1a1a]">Design Every Room</span>
          <br />
          <span className="text-[#B8860B]">In Your Home</span>
        </motion.h2>
        <motion.p
          initial={{
            opacity: 0,
            y: 30,
            scale: 0.8,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 1,
            delay: 0.4,
            ease: "easeOut",
          }}
          viewport={{
            once: true,
          }}
          className="font-sans text-lg text-gray-600 mt-6 max-w-3xl mx-auto leading-relaxed"
        >
          From cozy bedrooms to stunning kitchens, our AI understands the unique requirements of
          every space. Upload any room and watch it transform into something extraordinary.
        </motion.p>
      </div>
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.8,
        }}
        whileInView={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 1,
          delay: 0.6,
          ease: "easeOut",
        }}
        viewport={{
          once: true,
        }}
        className="relative group"
      >
        <div className="flex overflow-hidden">
          <div className="marquee-container">
            {e.map((t, n) => (
              <motion.div
                key={n}
                initial={{
                  opacity: 0,
                  y: 50,
                  rotateY: 90,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  rotateY: 0,
                }}
                transition={{
                  duration: 0.8,
                  delay: (n % roomTypes.length) * 0.1,
                  ease: "easeOut",
                }}
                viewport={{
                  once: true,
                }}
                whileHover={{
                  scale: 1.1,
                  y: -10,
                  rotateZ: 5,
                  transition: {
                    duration: 0.3,
                  },
                }}
                className="marquee-item flex flex-col items-center justify-center mx-8 text-center w-32"
              >
                <motion.div
                  whileHover={{
                    rotate: 360,
                    scale: 1.2,
                    boxShadow: "0 15px 30px rgba(184, 134, 11, 0.3)",
                  }}
                  transition={{
                    duration: 0.5,
                  }}
                  className="w-24 h-24 rounded-full flex items-center justify-center mb-4 transition-all duration-300 border-2 border-[#B8860B]/20 bg-white hover:border-[#B8860B]/50"
                >
                  <t.icon className="w-8 h-8 text-[#B8860B] transition-colors duration-300" />
                </motion.div>
                <motion.p
                  initial={{
                    opacity: 0,
                  }}
                  whileInView={{
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: (n % roomTypes.length) * 0.1 + 0.3,
                  }}
                  viewport={{
                    once: true,
                  }}
                  className="font-sans text-sm text-gray-700 font-medium transition-colors duration-300"
                >
                  {t.text}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
const howItWorksSteps = [
  {
    icon: FileText,
    step: "01",
    title: "Describe your plot & requirements",
    description:
      "Enter BHK, plot size, city, budget, and style preferences. Upload a sketch or reference photo. Takes about 2 minutes.",
  },
  {
    icon: IndianRupee,
    step: "02",
    title: "Get a city-wise cost estimate",
    description:
      "See an itemised ₹/sq ft breakdown by stage — foundation, structure, flooring, plumbing, electrical, paint, and more. Indicative (±15%) — not a contractor quote.",
  },
  {
    icon: WandSparkles,
    step: "03",
    title: "Visualise with AI concept renders",
    description:
      "See AI-generated concept images for your floor plan, interior, exterior, and compound. For planning discussions — always review with a licensed architect before construction.",
  },
  {
    icon: Users,
    step: "04",
    title: "Hire verified contractors & track the build",
    description:
      "Browse registered contractors, send a quote request, and track milestones and spending in the Project Tracker. Contractor marketplace launching soon.",
  },
];
function HowItWorks() {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-white relative overflow-hidden">
      <motion.div
        initial={{
          opacity: 0,
          x: -200,
        }}
        whileInView={{
          opacity: 0.05,
          x: 0,
        }}
        transition={{
          duration: 2,
          ease: "easeOut",
        }}
        viewport={{
          once: true,
        }}
        className="absolute top-20 -left-20 w-96 h-96 bg-[#B8860B] rounded-full blur-3xl"
      />
      <motion.div
        initial={{
          opacity: 0,
          x: 200,
        }}
        whileInView={{
          opacity: 0.05,
          x: 0,
        }}
        transition={{
          duration: 2,
          ease: "easeOut",
          delay: 0.5,
        }}
        viewport={{
          once: true,
        }}
        className="absolute bottom-20 -right-20 w-96 h-96 bg-[#B8860B] rounded-full blur-3xl"
      />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <motion.div
          initial={{
            opacity: 0,
            y: 80,
            scale: 0.8,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 1.2,
            ease: "easeOut",
            type: "spring",
            stiffness: 100,
          }}
          viewport={{
            once: true,
          }}
          className="text-center mb-16"
        >
          <motion.p
            initial={{
              opacity: 0,
              letterSpacing: "0.1em",
            }}
            whileInView={{
              opacity: 1,
              letterSpacing: "0.3em",
            }}
            transition={{
              duration: 1,
              delay: 0.3,
            }}
            viewport={{
              once: true,
            }}
            className="font-sans text-sm text-gray-500 mb-4 tracking-wider uppercase"
          >
            Simple 4-Step Process
          </motion.p>
          <motion.h2
            initial={{
              opacity: 0,
              y: 50,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 1,
              delay: 0.5,
              ease: "easeOut",
            }}
            viewport={{
              once: true,
            }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a1a1a] leading-tight mb-6"
          >
            How It Works
            <br />
            <motion.span
              initial={{
                opacity: 0,
                scale: 0.5,
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 1.2,
                delay: 0.8,
                ease: "easeOut",
              }}
              viewport={{
                once: true,
              }}
              className="text-[#B8860B]"
            >
              Design Made Easy
            </motion.span>
          </motion.h2>
          <motion.p
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 1,
              delay: 1,
              ease: "easeOut",
            }}
            viewport={{
              once: true,
            }}
            className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Transform your space in minutes with our intuitive AI-powered design tool. No design
            experience required—just upload, select, and visualize your dream interior.
          </motion.p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {howItWorksSteps.map((e, t) => (
            <motion.div
              key={e.title}
              initial={{
                opacity: 0,
                y: 100,
                scale: 0.7,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              transition={{
                duration: 1.5,
                delay: t * 0.2,
                type: "spring",
                stiffness: 100,
                damping: 15,
              }}
              viewport={{
                once: true,
              }}
              whileHover={{
                scale: 1.05,
                y: -10,
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              }}
              className="relative bg-[#FAF8F5] rounded-3xl p-8 group cursor-pointer"
            >
              <motion.span
                initial={{
                  opacity: 0,
                }}
                whileInView={{
                  opacity: 0.1,
                }}
                transition={{
                  duration: 0.5,
                  delay: t * 0.2 + 0.5,
                }}
                viewport={{
                  once: true,
                }}
                className="absolute top-4 right-4 text-6xl font-bold text-[#B8860B]"
              >
                {e.step}
              </motion.span>
              <motion.div
                initial={{
                  scale: 0,
                  rotate: -360,
                }}
                whileInView={{
                  scale: 1,
                  rotate: 0,
                }}
                transition={{
                  duration: 1,
                  delay: t * 0.2 + 0.3,
                  type: "spring",
                  stiffness: 300,
                }}
                viewport={{
                  once: true,
                }}
                whileHover={{
                  rotate: 15,
                  scale: 1.2,
                  backgroundColor: "#B8860B",
                }}
                className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:bg-[#B8860B] transition-all duration-500"
              >
                <e.icon className="w-8 h-8 text-[#B8860B] group-hover:text-white transition-colors duration-300" />
              </motion.div>
              <motion.h3
                initial={{
                  opacity: 0,
                  x: -30,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 0.8,
                  delay: t * 0.2 + 0.5,
                }}
                viewport={{
                  once: true,
                }}
                className="font-serif text-xl font-bold text-[#1a1a1a] mb-3 group-hover:text-[#B8860B] transition-colors duration-300"
              >
                {e.title}
              </motion.h3>
              <motion.p
                initial={{
                  opacity: 0,
                  x: -20,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 0.6,
                  delay: t * 0.2 + 0.7,
                }}
                viewport={{
                  once: true,
                }}
                className="font-sans text-gray-600 leading-relaxed"
              >
                {e.description}
              </motion.p>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{
            opacity: 0,
            y: 50,
            scale: 0.9,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 1,
            delay: 1,
            ease: "easeOut",
          }}
          viewport={{
            once: true,
          }}
          className="text-center"
        >
          <Link to={createPageUrl("BlueprintGenerator")}>
            <motion.button
              whileHover={{
                scale: 1.1,
                boxShadow: "0 20px 40px rgba(184, 134, 11, 0.3)",
              }}
              whileTap={{
                scale: 0.95,
              }}
              className="bg-gradient-to-r from-[#B8860B] to-[#D4A84B] text-white px-10 py-5 rounded-full font-sans font-semibold hover:from-[#D4A84B] hover:to-[#B8860B] transition-all duration-300 shadow-lg text-lg"
            >
              Start Your Free Design Now
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
const designStyles = [
  {
    id: 1,
    key: "modern",
    title: "Modern Minimalist",
    description: "Clean lines, neutral colors, and functional elegance for contemporary living.",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&q=80",
    bgColor: "bg-slate-50",
  },
  {
    id: 2,
    key: "scandinavian",
    title: "Scandinavian",
    description: "Light woods, cozy textiles, and hygge-inspired warmth for serene spaces.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
    bgColor: "bg-amber-50",
  },
  {
    id: 3,
    key: "industrial",
    title: "Industrial Loft",
    description: "Exposed brick, metal accents, and urban character for bold statements.",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80",
    bgColor: "bg-stone-100",
  },
  {
    id: 4,
    key: "bohemian",
    title: "Bohemian Chic",
    description: "Eclectic patterns, rich textures, and free-spirited artistry.",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&q=80",
    bgColor: "bg-rose-50",
  },
  {
    id: 5,
    key: "coastal",
    title: "Coastal Living",
    description: "Ocean-inspired blues, natural materials, and relaxed beach vibes.",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80",
    bgColor: "bg-sky-50",
  },
];
function DesignStylesCarousel() {
  const e = useRef(null);

  useEffect(() => {
    const t = e.current;
    if (!t) return;
    let n = 0;
    const r = 1,
      o = 50,
      l = () => {
        t.scrollLeft >= t.scrollWidth - t.clientWidth
          ? ((n = 0), (t.scrollLeft = 0))
          : ((n += r), (t.scrollLeft = n));
      },
      c = setInterval(l, o),
      d = () => clearInterval(c);
    
    t.addEventListener("mouseenter", d);
    t.addEventListener("mouseleave", () => {
      clearInterval(c);
      setInterval(l, o);
    });

    return () => {
      clearInterval(c);
    };
  }, []);

  return (
    <section className="py-16 md:py-20 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{
              opacity: 0,
              y: 40,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
            }}
            viewport={{
              once: true,
            }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-[#B8860B]/10 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-[#B8860B]" />
              <span className="font-sans text-sm text-[#B8860B] font-medium">Design Styles</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-[#1a1a1a]">Explore Interior</span>
              <br />
              <span className="text-[#B8860B]">Design Styles</span>
            </h2>
            <p className="font-sans text-lg text-gray-600 max-w-2xl mx-auto">
              Discover your perfect aesthetic from our curated collection of design styles. Each one
              can be applied to your space instantly with AI.
            </p>
          </motion.div>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white via-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white via-white to-transparent z-10 pointer-events-none" />
            <div
              ref={e}
              className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 cursor-pointer"
              style={{
                scrollBehavior: "smooth",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {[...designStyles, ...designStyles].map((t, n) => (
                <Link
                  key={`${t.id}-${n}`}
                  to={createPageUrl(`Designer?style=${t.key}`)}
                  className="flex-shrink-0 w-80 group cursor-pointer"
                >
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 60,
                      scale: 0.9,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    transition={{
                      duration: 0.8,
                      delay: (n % designStyles.length) * 0.1,
                      ease: "easeOut",
                    }}
                    viewport={{
                      once: true,
                    }}
                    className="h-full"
                  >
                    <div
                      className={`${t.bgColor} rounded-3xl overflow-hidden h-full flex flex-col hover:shadow-xl transition-all duration-500 group-hover:-translate-y-2 min-h-[380px]`}
                    >
                      <div className="h-48 overflow-hidden">
                        <img
                          src={t.image}
                          alt={t.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="font-serif text-2xl font-bold text-[#1a1a1a] mb-3 group-hover:text-[#B8860B] transition-colors duration-300 leading-tight">
                          {t.title}
                        </h3>
                        <p className="font-sans text-gray-500 leading-relaxed mb-6 flex-grow">
                          {t.description}
                        </p>
                        <div className="flex items-center gap-2 font-sans text-sm font-medium text-[#B8860B] group-hover:text-[#1a1a1a] transition-colors duration-300">
                          TRY THIS STYLE
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
          <motion.div
            initial={{
              opacity: 0,
            }}
            whileInView={{
              opacity: 1,
            }}
            transition={{
              duration: 0.8,
              delay: 0.5,
            }}
            viewport={{
              once: true,
            }}
            className="text-center mt-8"
          >
            <p className="font-sans text-sm text-gray-400">
              Hover to pause • Auto-scrolling styles
            </p>
          </motion.div>
        </div>
        <style>
          {`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}
        </style>
      </section>
  );
}
// Testimonials: no invented reviews. Honest empty state until real users submit reviews.
function Testimonials() {
  return (
    <section className="py-16 md:py-20 relative overflow-hidden bg-[#FAF8F5]">
      <div className="relative max-w-4xl mx-auto px-6">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Quote className="w-12 h-12 text-[#B8860B]/20 mx-auto mb-4" />
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-[#1a1a1a] mb-4">
              What Our Users Say
            </h2>
            <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 max-w-2xl mx-auto mt-6">
              <div className="w-16 h-16 bg-[#B8860B]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-7 h-7 text-[#B8860B]" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#1a1a1a] mb-3">
                Be the first to review GRUHAM
              </h3>
              <p className="text-gray-500 text-base leading-relaxed mb-6">
                We don't invent testimonials. Try any GRUHAM tool — generate a concept plan, get a
                cost estimate, or browse contractors — then share your honest experience.
              </p>
              <Link to={createPageUrl("Contact")}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#B8860B] text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-[#1a1a1a] transition-colors"
                >
                  Share your feedback →
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
const trustStats = [
  {
    text: "AI-Powered",
    subtext: "Design Engine",
  },
  {
    text: "6 Styles",
    subtext: "Interior & Exterior",
  },
  {
    text: "₹/sq ft",
    subtext: "City-Wise Estimates",
  },
  {
    text: "Instant",
    subtext: "Concept Renders",
  },
  {
    text: "BOQ",
    subtext: "Itemised Breakdown",
  },
  {
    text: "24/7",
    subtext: "Available",
  },
];
function TrustStats() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
          }}
          viewport={{
            once: true,
          }}
          className="text-center mb-10"
        >
          <p className="font-sans text-sm text-gray-500 uppercase tracking-widest">
            Why Users Trust Us
          </p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {trustStats.map((e, t) => (
            <motion.div
              key={t}
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                delay: t * 0.1,
              }}
              viewport={{
                once: true,
              }}
              whileHover={{
                scale: 1.1,
                y: -5,
              }}
              className="flex flex-col items-center text-center group cursor-pointer"
            >
              <motion.span
                whileHover={{
                  scale: 1.2,
                }}
                className="font-serif text-3xl md:text-4xl font-bold text-[#B8860B] mb-1 group-hover:text-[#1a1a1a] transition-colors duration-300"
              >
                {e.text}
              </motion.span>
              <span className="font-sans text-sm text-gray-500 group-hover:text-[#B8860B] transition-colors duration-300">
                {e.subtext}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default function Home() {
  return (
    <div>
      <div className="relative">
        <HeroCarousel />
        <HeroBottomCurve />
      </div>
      <div className="bg-[#FAF8F5] relative">
        <WhyChooseUs />
      </div>
      <DesignStylesCarousel />
      <RoomsMarquee />
      <div className="bg-[#FAF8F5] relative">
        <HowItWorks />
        <LimitedOfferCTA />
        <TrustStats />
        <Testimonials />
      </div>
    </div>
  );
}
