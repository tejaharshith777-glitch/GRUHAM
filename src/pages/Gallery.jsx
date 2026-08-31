import { useState } from "react";
import {
  ArrowRight,
  Sparkles,
  X,
  ZoomIn,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "../lib/utils";

const galleryItems = [
  {
    id: 1,
    before: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=70&auto=format&fit=crop",
    after: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=70&auto=format&fit=crop",
    style: "Modern Indian Minimalist",
    cost: "₹1,800 - ₹2,200",
    bestFor: "Urban apartments & compact plots",
    materials: "Vitrified tiles, MDF wardrobes, neutral paints, sleek lighting",
  },
  {
    id: 2,
    before: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=70&auto=format&fit=crop",
    after: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=70&auto=format&fit=crop",
    style: "Contemporary Luxury",
    cost: "₹2,500 - ₹3,500",
    bestFor: "Large independent houses & duplexes",
    materials: "Italian marble, veneer paneling, brass accents, false ceilings",
  },
  {
    id: 3,
    before: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=70&auto=format&fit=crop",
    after: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=70&auto=format&fit=crop",
    style: "Traditional Ethnic",
    cost: "₹2,200 - ₹2,800",
    bestFor: "Ancestral homes & heritage renovations",
    materials: "Teak wood furniture, terracotta tiles, brass artifacts, woven fabrics",
  },
  {
    id: 4,
    before: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=70&auto=format&fit=crop",
    after: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=70&auto=format&fit=crop",
    style: "Tropical/Coastal",
    cost: "₹1,900 - ₹2,400",
    bestFor: "Coastal cities & vacation homes",
    materials: "Rattan, bamboo, cool cottons, large open windows, indoor plants",
  },
  {
    id: 5,
    before: "https://images.unsplash.com/photo-1571508601891-ca5e7a713859?w=800&q=70&auto=format&fit=crop",
    after: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=70&auto=format&fit=crop",
    style: "Neo-Classical",
    cost: "₹2,800 - ₹4,000+",
    bestFor: "Luxury villas & farmhouses",
    materials: "Mouldings, chandeliers, plush velvet, intricate woodwork",
  },
];
const galleryFilters = [
  "All",
  "Modern Indian Minimalist",
  "Contemporary Luxury",
  "Traditional Ethnic",
  "Tropical/Coastal",
  "Neo-Classical",
];
export default function Gallery() {
  const [e, t] = useState("All"),
    [n, r] = useState("All"),
    [o, l] = useState(null),
    c = galleryItems.filter((d) => {
      const h = e === "All" || d.style === e;
      return h;
    });
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
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-[#B8860B]/10 rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4 text-[#B8860B]" />
            <span className="text-[#B8860B] font-medium text-sm">Transformation Gallery</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-4">
            Indian Home Style Guide
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore popular design aesthetics in India. Understand indicative costs, best use-cases, and typical materials before planning your home.
          </p>
        </motion.div>
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
            delay: 0.2,
          }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          <div className="flex flex-wrap gap-2">
            {galleryFilters.map((d) => (
              <button
                key={d}
                onClick={() => t(d)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${e === d ? "bg-[#B8860B] text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}
              >
                {d}
              </button>
            ))}
          </div>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {c.map((d, h) => (
            <motion.div
              key={d.id}
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
                delay: h * 0.1,
              }}
              whileHover={{
                y: -10,
              }}
              className="bg-white rounded-3xl overflow-hidden shadow-lg cursor-pointer group"
              onClick={() => l(d)}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={d.after}
                  alt={`${d.style} ${d.room}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm font-medium">View Transformation</span>
                    <ZoomIn className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#B8860B] text-sm font-medium uppercase tracking-wider">{d.style}</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-[#1a1a1a] mb-2">
                  {d.cost} / sq ft
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  <span className="font-medium">Best for:</span> {d.bestFor}
                </p>
                <div className="text-sm text-gray-500 line-clamp-2">
                  <span className="font-medium text-gray-700">Materials:</span> {d.materials}
                </div>
              </div>
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
            delay: 0.6,
          }}
          className="text-center mt-16"
        >
          <h2 className="font-serif text-3xl font-bold text-[#1a1a1a] mb-4">
            Ready to Transform Your Space?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Upload your room photo and see it transformed in any style you choose.
          </p>
          <Link to={createPageUrl("Designer")}>
            <motion.button
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              className="bg-gradient-to-r from-[#B8860B] to-[#D4A84B] text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg inline-flex items-center gap-2"
            >
              Start Designing Now
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
      <AnimatePresence>
        {o && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => l(null)}
          >
            <motion.div
              initial={{
                scale: 0.9,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.9,
                opacity: 0,
              }}
              className="max-w-6xl w-full bg-white rounded-3xl overflow-hidden"
              onClick={(d) => d.stopPropagation()}
            >
              <div className="grid md:grid-cols-2">
                <div className="relative">
                  <img
                    src={o.before}
                    alt="Before"
                    className="w-full h-64 md:h-[400px] object-cover"
                  />
                  <span className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    Before
                  </span>
                </div>
                <div className="relative">
                  <img
                    src={o.after}
                    alt="After"
                    className="w-full h-64 md:h-[400px] object-cover"
                  />
                  <span className="absolute top-4 left-4 bg-[#B8860B] text-white px-3 py-1 rounded-full text-sm">
                    After
                  </span>
                </div>
              </div>
              <div className="p-6 flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-serif text-2xl font-bold text-[#1a1a1a] mb-2">{o.style}</h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div><span className="font-medium text-gray-700">Cost:</span> {o.cost} / sq ft</div>
                    <div><span className="font-medium text-gray-700">Best for:</span> {o.bestFor}</div>
                    <div><span className="font-medium text-gray-700">Materials:</span> {o.materials}</div>
                  </div>
                </div>
                <button
                  onClick={() => l(null)}
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
