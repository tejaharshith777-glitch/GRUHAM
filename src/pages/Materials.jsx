import { useState, useMemo } from "react";
import {
  ArrowUpRight,
  Box,
  Building2,
  ExternalLink,
  Filter,
  Grid,
  Info,
  Layers,
  Package,
  Search,
  ShoppingCart,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { MATERIALS_CATALOG, inr, RATES_REVIEWED_DATE } from "../lib/boq";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Disclaimer from "@/components/Disclaimer";
import { createPageUrl } from "../lib/utils";

const CATEGORIES = [
  "All",
  "Cement & Masonry",
  "Structural Steel",
  "Sand & Aggregate",
  "Flooring & Tiles",
  "Wood & Doors",
  "Paints & Finishes",
  "Plumbing & Sanitaryware",
  "Electrical & Lighting",
  "Kitchen & Countertops",
];

export default function Materials() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get("category") || "All";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMaterials = useMemo(() => {
    return MATERIALS_CATALOG.filter((item) => {
      if (selectedCategory !== "All" && item.category !== selectedCategory) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return item.name.toLowerCase().includes(q) || item.specs.toLowerCase().includes(q);
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Disclaimer variant="calculator" />

        {/* Page Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#B8860B]/10 rounded-full px-4 py-2 mb-4">
            <Package className="w-4 h-4 text-[#B8860B]" />
            <span className="text-[#B8860B] font-semibold text-sm">Construction Materials Catalog</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-3">
            Verified Construction Materials & Specs
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Browse authentic materials, grade specifications, units of measure, and current commodity price trends.
          </p>
        </motion.div>

        {/* Live Market Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-amber-950">
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-[#B8860B] flex-shrink-0" />
            <div>
              <span className="font-bold">Live Market Data Sync:</span> Material prices are updated against Indian commodity indexes & Wikipedia data.
              <span className="text-amber-700 ml-2 font-mono">(Last Verified: {RATES_REVIEWED_DATE})</span>
            </div>
          </div>
          <Button
            onClick={() => navigate(createPageUrl("Pricing"))}
            className="bg-[#B8860B] hover:bg-[#997320] text-white rounded-full text-xs font-bold px-5 py-2.5 flex-shrink-0"
          >
            Calculate Total Project BOQ →
          </Button>
        </div>

        {/* SEARCH & CATEGORY FILTERS */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 mb-10 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search UltraTech, TMT Fe500, Teak wood, Tiles..."
                className="pl-11 rounded-2xl h-12 border-gray-200"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                    selectedCategory === cat
                      ? "bg-[#1a1a1a] text-white border-[#1a1a1a] shadow-md"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:border-[#B8860B]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MATERIALS CATALOG GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMaterials.map((mat) => (
            <motion.div
              key={mat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Product Image */}
                <div className="aspect-[16/10] overflow-hidden relative bg-gray-100">
                  <img
                    src={mat.image}
                    alt={mat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#1a1a1a]/80 text-[#B8860B] backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-[#B8860B]/30">
                    {mat.category}
                  </div>
                  
                  {/* Trend Badge */}
                  <div className={`absolute bottom-3 right-3 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border ${
                    mat.trendDirection === "up" 
                      ? "bg-rose-900/80 text-rose-200 border-rose-500/40" 
                      : mat.trendDirection === "down"
                      ? "bg-emerald-900/80 text-emerald-200 border-emerald-500/40"
                      : "bg-gray-900/80 text-gray-200 border-gray-500/40"
                  }`}>
                    {mat.trendDirection === "up" && <TrendingUp className="w-3.5 h-3.5 text-rose-400" />}
                    {mat.trendDirection === "down" && <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />}
                    <span>{mat.trendPct}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <h3 className="font-serif text-lg font-bold text-[#1a1a1a] group-hover:text-[#B8860B] transition-colors leading-snug">
                    {mat.name}
                  </h3>
                  <p className="text-gray-600 text-xs leading-relaxed">{mat.specs}</p>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase font-bold">Base Price ({mat.unit})</span>
                      <span className="font-serif text-xl font-bold text-gray-900">{inr(mat.basePrice)}</span>
                    </div>

                    <a
                      href={mat.wikipediaRef}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-[#B8860B] font-semibold flex items-center gap-1 hover:underline"
                    >
                      Wikipedia Ref
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="p-6 pt-0">
                <Button
                  onClick={() => navigate(createPageUrl("Pricing"))}
                  className="w-full rounded-full bg-[#1a1a1a] hover:bg-black text-white text-xs font-bold py-3 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4 text-[#B8860B]" />
                  Add to Pricing Calculator
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
