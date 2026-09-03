import { useState, useMemo } from "react";
import {
  Calculator,
  CheckCircle2,
  Download,
  FileText,
  IndianRupee,
  Info,
  MapPin,
  Package,
  Share2,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  computeBOQ,
  calcEMI,
  CITY_NAMES,
  FINISH_RATES,
  inr,
  inrShort,
  RATES_REVIEWED_DATE,
} from "../lib/boq";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Disclaimer from "@/components/Disclaimer";
import { createPageUrl } from "../lib/utils";

export default function Pricing() {
  const navigate = useNavigate();
  const [builtUpArea, setBuiltUpArea] = useState("1800");
  const [city, setCity] = useState("Bengaluru");
  const [finish, setFinish] = useState("standard");

  // EMI Calculator States
  const [emiTenure, setEmiTenure] = useState(20); // years
  const [emiRate, setEmiRate] = useState(8.5); // %

  const boqData = useMemo(() => {
    return computeBOQ({ builtUpArea, city, finish });
  }, [builtUpArea, city, finish]);

  const estimatedEmi = useMemo(() => {
    return calcEMI(boqData.totalCost * 0.8, emiRate, emiTenure);
  }, [boqData.totalCost, emiRate, emiTenure]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Disclaimer variant="calculator" />

        {/* Page Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#B8860B]/10 rounded-full px-4 py-2 mb-4">
            <Calculator className="w-4 h-4 text-[#B8860B]" />
            <span className="text-[#B8860B] font-semibold text-sm">Real BOQ & Pricing Calculator</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-3">
            Construction Cost & BOQ Calculator
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            City-adjusted cost breakdown, itemized quantities, and home loan EMI estimates for Indian residential projects.
          </p>
        </motion.div>

        {/* Main Grid: Controls on Left, BOQ Breakdown on Right */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 space-y-6">
              <h2 className="font-serif text-xl font-bold text-[#1a1a1a] flex items-center gap-2 pb-2 border-b border-gray-100">
                <MapPin className="w-5 h-5 text-[#B8860B]" />
                Project Parameters
              </h2>

              {/* Built Up Area Input */}
              <div>
                <label className="text-sm font-bold text-gray-800 mb-1.5 block">Total Built-Up Area (sq ft)</label>
                <Input
                  type="number"
                  value={builtUpArea}
                  onChange={(e) => setBuiltUpArea(e.target.value)}
                  className="rounded-xl border-gray-200 focus:ring-[#B8860B] h-12 text-base font-bold"
                />
                <span className="text-[11px] text-gray-500 mt-1 block">
                  Tip: A typical 3 BHK G+1 home is approx. 1,800 to 2,400 sq ft.
                </span>
              </div>

              {/* City Selection */}
              <div>
                <label className="text-sm font-bold text-gray-800 mb-1.5 block">Project City / Region</label>
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger className="rounded-xl border-gray-200 h-12 font-semibold">
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                    {CITY_NAMES.map((cityName) => (
                      <SelectItem key={cityName} value={cityName}>{cityName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Finish Tier Selection */}
              <div>
                <label className="text-sm font-bold text-gray-800 mb-3 block">Construction Finish Tier</label>
                <div className="space-y-2.5">
                  {Object.entries(FINISH_RATES).map(([key, info]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFinish(key)}
                      className={`w-full p-4 rounded-2xl text-left border flex items-center justify-between transition-all ${
                        finish === key
                          ? "bg-[#1a1a1a] text-white border-[#1a1a1a] shadow-lg"
                          : "bg-gray-50 text-gray-800 border-gray-200 hover:border-[#B8860B]"
                      }`}
                    >
                      <div>
                        <div className="font-bold text-sm">{info.label}</div>
                        <div className="text-xs opacity-75">{info.desc}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm text-[#B8860B]">₹{info.rate}/sqft</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Link to Materials Catalog */}
              <Button
                onClick={() => navigate(createPageUrl("Materials"))}
                variant="outline"
                className="w-full rounded-full border-[#B8860B] text-[#B8860B] hover:bg-[#B8860B] hover:text-white font-bold text-xs h-12"
              >
                <Package className="w-4 h-4 mr-2" />
                Browse Materials Catalog & Products →
              </Button>
            </div>
          </div>

          {/* Results Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Total Cost Highlight Card */}
            <div className="bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] text-white rounded-3xl p-8 shadow-2xl border border-gray-800 relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between text-xs text-[#B8860B] font-mono tracking-widest uppercase">
                <span>ESTIMATED TOTAL COST ({boqData.city})</span>
                <span>{RATES_REVIEWED_DATE}</span>
              </div>

              <div>
                <div className="font-serif text-4xl sm:text-5xl font-bold text-white mb-1">
                  {boqData.totalCostFormatted}
                </div>
                <div className="text-sm text-gray-300">
                  Approx. <span className="font-bold text-[#B8860B]">{inr(boqData.perSqftRate)}</span> per sq ft built-up area
                </div>
              </div>

              {/* EMI Callout */}
              <div className="pt-4 border-t border-gray-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-400 block">Est. Home Loan EMI (80% Loan)</span>
                  <span className="font-bold text-lg text-emerald-400">{inr(estimatedEmi)} / month</span>
                </div>
                <span className="text-[11px] text-gray-400">{emiTenure} Yrs @ {emiRate}% p.a.</span>
              </div>
            </div>

            {/* BOQ Breakdown Table Card */}
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-serif text-lg font-bold text-[#1a1a1a]">Itemized BOQ Cost Breakdown</h3>
                <span className="text-xs font-bold text-[#B8860B] bg-[#B8860B]/10 px-3 py-1 rounded-full">
                  7 Core Categories
                </span>
              </div>

              <div className="space-y-3">
                {boqData.breakdown.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => navigate(createPageUrl("Materials") + `?category=${encodeURIComponent(item.category)}`)}
                    title={`Click to see materials pricing for ${item.category}`}
                    className="w-full p-3.5 rounded-2xl bg-gray-50 flex items-center justify-between text-xs border border-gray-100 hover:border-[#B8860B] hover:bg-[#B8860B]/5 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#B8860B]/10 text-[#B8860B] font-bold flex items-center justify-center text-xs group-hover:bg-[#B8860B] group-hover:text-white transition-colors">
                        {item.pct}%
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900 group-hover:text-[#B8860B] block">{item.category}</span>
                        <span className="text-[10px] text-gray-400">View materials & rates →</span>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900 text-sm">{inr(item.cost)}</span>
                  </button>
                ))}
              </div>

              {/* Share & Download Actions */}
              <div className="flex gap-3 pt-3 border-t border-gray-100">
                <Button
                  onClick={() => window.open(`https://wa.me/?text=Check out my house construction cost estimate from Gruham: ${boqData.totalCostFormatted} for ${builtUpArea} sq ft in ${city}!`, "_blank")}
                  className="flex-1 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-xs h-11"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share BOQ on WhatsApp
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
