import { useRef, useState, useMemo } from "react";
import {
  Box,
  Building,
  Calculator,
  Copy,
  Download,
  Eye,
  Image,
  IndianRupee,
  LoaderCircle,
  RefreshCw,
  Share2,
  Sparkles,
  Upload,
  WandSparkles,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "../lib/base44";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Disclaimer from "@/components/Disclaimer";
import { generateFloorPlan, renderFloorPlanSVG, svgToBlob } from "@/lib/floorplan";
import { computeBOQ, inr, inrShort, boqToCSV, boqWhatsAppLink, CITY_NAMES, FINISH_RATES, calcEMI } from "@/lib/boq";

const interiorStylesList = [
  {
    id: "modern",
    name: "Modern Minimalist",
    description: "Clean lines, neutral colors",
  },
  {
    id: "scandinavian",
    name: "Scandinavian",
    description: "Light woods, cozy textiles",
  },
  {
    id: "industrial",
    name: "Industrial Loft",
    description: "Exposed brick, metal accents",
  },
  {
    id: "bohemian",
    name: "Bohemian Chic",
    description: "Eclectic patterns, rich textures",
  },
  {
    id: "coastal",
    name: "Coastal Living",
    description: "Ocean blues, natural materials",
  },
  {
    id: "midcentury",
    name: "Mid-Century Modern",
    description: "Retro furniture, warm tones",
  },
  {
    id: "farmhouse",
    name: "Modern Farmhouse",
    description: "Rustic charm, shiplap walls",
  },
  {
    id: "contemporary",
    name: "Contemporary",
    description: "Current trends, bold colors",
  },
  {
    id: "traditional",
    name: "Traditional",
    description: "Classic elegance, rich fabrics",
  },
  {
    id: "art_deco",
    name: "Art Deco",
    description: "Geometric patterns, luxe materials",
  },
  {
    id: "japanese",
    name: "Japanese Zen",
    description: "Minimalist, natural elements",
  },
  {
    id: "mediterranean",
    name: "Mediterranean",
    description: "Warm colors, terracotta",
  },
];
const designerRoomTypes = [
  {
    id: "living",
    name: "Living Room",
  },
  {
    id: "bedroom",
    name: "Bedroom",
  },
  {
    id: "kitchen",
    name: "Kitchen",
  },
  {
    id: "bathroom",
    name: "Bathroom",
  },
  {
    id: "office",
    name: "Home Office",
  },
  {
    id: "dining",
    name: "Dining Room",
  },
  {
    id: "outdoor",
    name: "Outdoor/Patio",
  },
  {
    id: "entryway",
    name: "Entryway",
  },
];
export default function Designer() {
  // ── Plan My Plot state ────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("plot");
  const [plotL, setPlotL] = useState("");
  const [plotW, setPlotW] = useState("");
  const [facing, setFacing] = useState("N");
  const [floors, setFloors] = useState("G+1");
  const [bhk, setBhk] = useState("3 BHK");
  const [city, setCity] = useState("Chennai");
  const [finish, setFinish] = useState("standard");
  const [parking, setParking] = useState(true);
  const [interiors, setInteriors] = useState(false);
  const [plan, setPlan] = useState(null);
  const [emiRate, setEmiRate] = useState("8.5");
  const [emiTenure, setEmiTenure] = useState("20");
  const [copied, setCopied] = useState(false);

  const floorNum = { "G (Ground only)": 1, "G+1": 2, "G+2": 3, "G+3": 4 };
  const bhkNum   = { "1 BHK": 1, "2 BHK": 2, "3 BHK": 3, "4 BHK": 4, "5 BHK": 5, "6 BHK": 6 };

  const boq = useMemo(() => {
    if (!plan || plan.error || !plan.totals) return null;
    return computeBOQ({
      builtUpArea: plan.totals.built_up_area,
      carpetArea:  plan.totals.carpet_area,
      city, finish, parking, interiors,
    });
  }, [plan, city, finish, parking, interiors]);

  const emi = useMemo(() => {
    if (!boq) return null;
    const loan = boq.grand_total * 0.75; // 75% LTV
    return calcEMI(loan, parseFloat(emiRate) || 8.5, parseInt(emiTenure) || 20);
  }, [boq, emiRate, emiTenure]);

  function generatePlan() {
    const result = generateFloorPlan({
      plotL: parseFloat(plotL) || 40,
      plotW: parseFloat(plotW) || 60,
      facing,
      floors: floorNum[floors] || 2,
      bhk: bhkNum[bhk] || 3,
      parking,
      finish,
    });
    setPlan(result);
  }

  function downloadSVG() {
    if (!plan) return;
    const svg = renderFloorPlanSVG(plan, 800, 600);
    const blob = svgToBlob(svg);
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "gruham-floorplan.svg"; a.click();
    URL.revokeObjectURL(url);
  }

  function downloadCSV() {
    if (!boq) return;
    const csv = boqToCSV(boq);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "gruham-boq.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  function copyBoqSummary() {
    if (!boq) return;
    const { boqSummaryText } = { boqSummaryText: (b) => [
      `GRUHAM Cost Estimate`,
      `City: ${b.inputs.city} | Finish: ${FINISH_RATES[b.inputs.finish]?.label}`,
      `Built-up: ${b.inputs.builtUpArea.toLocaleString("en-IN")} sq ft`,
      `Total: ${inrShort(b.grand_total)} (${inr(b.per_sqft)}/sq ft)`,
      `±15% Band: ${inrShort(b.band_low)} – ${inrShort(b.band_high)}`,
      `Indicative — not a contractor quote.`,
    ].join("\n") };
    navigator.clipboard.writeText(boqSummaryText(boq)).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const svgMarkup = useMemo(() => plan && !plan.error ? renderFloorPlanSVG(plan, 560, 420) : "", [plan]);

  // ── Interior designer state (existing, preserved verbatim) ───────────────
  const [e, t] = useState(null),
    [n, r] = useState(null),
    [o, l] = useState(""),
    [c, d] = useState(""),
    [h, p] = useState(null),
    [m, y] = useState(false),
    [x, j] = useState(false),
    [_, S] = useState("2d"),
    [N, w] = useState(0),
    C = useRef(null),
    E = async (B) => {
      const U = B.target.files[0];
      if (U) {
        (j(true), t(URL.createObjectURL(U)));
        try {
          const { file_url: A } = await base44.integrations.Core.UploadFile({
            file: U,
          });
          r(A);
        } catch (A) {
          console.error("Upload error:", A);
        }
        j(false);
      }
    },
    T = async () => {
      if (!(!n || !o || !c)) {
        y(true);
        try {
          const A = interiorStylesList.find((Q) => Q.id === o)?.name || o,
            G = designerRoomTypes.find((Q) => Q.id === c)?.name || c,
            F = await base44.integrations.Core.GenerateImage({
              prompt: `Interior design visualization: Transform this ${G} into a beautiful ${A} style space. Create a photorealistic render showing the room redesigned with ${A} furniture, decor, colors, and lighting. Maintain the room's basic structure and layout but completely transform the style. High quality, professional interior photography style, 4K resolution, natural lighting.`,
            });
          p(F.url);
        } catch (A) {
          console.error("Generation error:", A);
        }
        y(false);
      }
    },
    P = () => {
      (t(null), r(null), l(""), d(""), p(null), S("2d"), w(0));
    };
  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Disclaimer variant="generator" />

        {/* ── Tab selector ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 bg-white rounded-2xl p-1.5 shadow-sm w-fit mx-auto mb-10">
          {[
            { id: "plot",     label: "Plan My Plot",   Icon: Building },
            { id: "interior", label: "Restyle a Room", Icon: Sparkles },
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200
                ${ activeTab === id
                  ? "bg-[#B8860B] text-white shadow-md"
                  : "text-gray-600 hover:text-[#B8860B]"}`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {/* ════════════════════════════════════════════════════════════════
            TAB 1: PLAN MY PLOT
        ════════════════════════════════════════════════════════════════ */}
        {activeTab === "plot" && (
          <motion.div
            key="plot"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Input form */}
            <div className="bg-white rounded-3xl p-6 shadow-lg mb-8">
              <h2 className="font-serif text-2xl font-bold text-[#1a1a1a] mb-6 flex items-center gap-2">
                <Building className="w-6 h-6 text-[#B8860B]" /> Plot Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Plot Length (ft)</label>
                  <Input
                    type="number" placeholder="e.g. 40"
                    value={plotL} onChange={e2 => setPlotL(e2.target.value)}
                    className="rounded-xl h-11"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Plot Width (ft)</label>
                  <Input
                    type="number" placeholder="e.g. 60"
                    value={plotW} onChange={e2 => setPlotW(e2.target.value)}
                    className="rounded-xl h-11"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Facing</label>
                  <Select value={facing} onValueChange={setFacing}>
                    <SelectTrigger className="rounded-xl h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["N","E","S","W"].map(f => <SelectItem key={f} value={f}>{f === "N" ? "North" : f === "E" ? "East" : f === "S" ? "South" : "West"}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Floors</label>
                  <Select value={floors} onValueChange={setFloors}>
                    <SelectTrigger className="rounded-xl h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.keys(floorNum).map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">BHK</label>
                  <Select value={bhk} onValueChange={setBhk}>
                    <SelectTrigger className="rounded-xl h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.keys(bhkNum).map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">City</label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger className="rounded-xl h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CITY_NAMES.map(ct => <SelectItem key={ct} value={ct}>{ct}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Finish Level</label>
                  <Select value={finish} onValueChange={setFinish}>
                    <SelectTrigger className="rounded-xl h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(FINISH_RATES).map(([k, v]) => <SelectItem key={k} value={k}>{v.label} — {v.desc}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end gap-4 pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={parking} onChange={e2 => setParking(e2.target.checked)}
                      className="w-4 h-4 accent-[#B8860B]" />
                    <span className="text-sm font-medium text-gray-700">Parking</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={interiors} onChange={e2 => setInteriors(e2.target.checked)}
                      className="w-4 h-4 accent-[#B8860B]" />
                    <span className="text-sm font-medium text-gray-700">Add Interiors</span>
                  </label>
                </div>
              </div>
              <Button
                onClick={generatePlan}
                className="w-full sm:w-auto h-12 px-10 bg-gradient-to-r from-[#B8860B] to-[#D4A84B] hover:from-[#D4A84B] hover:to-[#B8860B] text-white rounded-full font-semibold shadow-lg"
              >
                <Calculator className="w-5 h-5 mr-2" /> Generate Floor Plan + Cost
              </Button>
            </div>

            {/* Error */}
            {plan?.error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-8 text-red-700 text-sm">
                {plan.error}
              </div>
            )}

            {/* Results: floor plan SVG + BOQ side by side */}
            {plan && !plan.error && boq && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Floor Plan SVG */}
                <div className="bg-white rounded-3xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-serif text-xl font-bold text-[#1a1a1a] flex items-center gap-2">
                      <Building className="w-5 h-5 text-[#B8860B]" /> Floor Plan
                    </h3>
                    <button
                      onClick={downloadSVG}
                      className="flex items-center gap-1.5 text-sm text-[#B8860B] hover:text-[#1a1a1a] transition-colors"
                    >
                      <Download className="w-4 h-4" /> SVG
                    </button>
                  </div>
                  <div
                    className="w-full rounded-2xl overflow-hidden border border-[#B8860B]/20"
                    dangerouslySetInnerHTML={{ __html: svgMarkup }}
                  />
                  <p className="text-xs text-gray-400 mt-3 text-center">
                    Indicative concept layout — not a construction drawing.
                  </p>
                  {/* Vastu notes */}
                  <details className="mt-4">
                    <summary className="text-sm font-medium text-[#B8860B] cursor-pointer select-none">Vastu Notes ▾</summary>
                    <ul className="mt-2 space-y-1">
                      {Object.entries(plan.vastuNotes).map(([k, v]) => (
                        <li key={k} className="text-xs text-gray-600 flex gap-1.5">
                          <span className="text-[#B8860B] font-bold mt-0.5">•</span>{v}
                        </li>
                      ))}
                    </ul>
                  </details>
                </div>

                {/* BOQ Summary */}
                <div className="bg-white rounded-3xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-serif text-xl font-bold text-[#1a1a1a] flex items-center gap-2">
                      <IndianRupee className="w-5 h-5 text-[#B8860B]" /> Cost Estimate
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={copyBoqSummary}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#B8860B] transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" /> {copied ? "Copied!" : "Copy"}
                      </button>
                      <a
                        href={boqWhatsAppLink(boq)} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 transition-colors"
                      >
                        <Share2 className="w-3.5 h-3.5" /> WhatsApp
                      </a>
                      <button
                        onClick={downloadCSV}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#B8860B] transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" /> CSV
                      </button>
                    </div>
                  </div>

                  {/* Grand total hero */}
                  <div className="bg-gradient-to-r from-[#B8860B] to-[#D4A84B] rounded-2xl p-5 text-white mb-5">
                    <p className="text-sm opacity-80 mb-1">Total Estimated Cost</p>
                    <p className="font-serif text-4xl font-bold">{inrShort(boq.grand_total)}</p>
                    <p className="text-sm opacity-80 mt-1">{inr(boq.per_sqft)} / sq ft · {boq.inputs.built_up_area?.toLocaleString("en-IN")} sq ft built-up</p>
                    <p className="text-xs opacity-60 mt-2">
                      ±15% band: {inrShort(boq.band_low)} – {inrShort(boq.band_high)}
                    </p>
                  </div>

                  {/* Category breakdown */}
                  <div className="space-y-2 mb-5 max-h-60 overflow-y-auto pr-1">
                    {Object.entries(boq.categories).map(([cat, grp]) => (
                      <div key={cat} className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0">
                        <span className="text-sm text-gray-700">{cat}</span>
                        <span className="text-sm font-semibold text-[#1a1a1a]">{inr(grp.subtotal)}</span>
                      </div>
                    ))}
                  </div>

                  {/* EMI estimator */}
                  <div className="bg-[#FAF8F5] rounded-2xl p-4">
                    <p className="text-sm font-semibold text-[#1a1a1a] mb-3">EMI Estimate (75% loan)</p>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Interest rate (%)</label>
                        <Input type="number" step="0.1" value={emiRate} onChange={e2 => setEmiRate(e2.target.value)}
                          className="h-9 rounded-xl text-sm" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Tenure (years)</label>
                        <Input type="number" value={emiTenure} onChange={e2 => setEmiTenure(e2.target.value)}
                          className="h-9 rounded-xl text-sm" />
                      </div>
                    </div>
                    {emi && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Monthly EMI</span>
                        <span className="font-bold text-[#B8860B] text-base">{inr(emi.emi)} / mo</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-gray-400 mt-4">
                    Rates for {boq.inputs.city} · Reviewed {boq.rates_date} · ±15–30% accuracy.
                    Always get written quotes before committing.
                  </p>
                </div>
              </div>
            )}

            {/* Full line-item table */}
            {boq && (
              <div className="bg-white rounded-3xl p-6 shadow-lg mt-8 overflow-x-auto">
                <h3 className="font-serif text-xl font-bold text-[#1a1a1a] mb-4">Full Bill of Quantities ({boq.item_count} items)</h3>
                <table className="w-full text-sm min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gray-200">
                      {["Category","Item","Unit","Qty","Rate (₹)","Amount (₹)"].map(h2 => (
                        <th key={h2} className="text-left pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide pr-4">{h2}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(boq.categories).flatMap(([cat, grp]) =>
                      grp.items.map((item, idx) => (
                        <tr key={cat+item.name} className="border-b border-gray-50 hover:bg-[#FAF8F5] transition-colors">
                          {idx === 0 ? <td className="py-2 pr-4 font-medium text-[#B8860B]" rowSpan={grp.items.length}>{cat}</td> : null}
                          <td className="py-2 pr-4 text-gray-800">{item.name}</td>
                          <td className="py-2 pr-4 text-gray-500 whitespace-nowrap">{item.unit}</td>
                          <td className="py-2 pr-4 text-gray-700">{item.quantity.toLocaleString("en-IN")}</td>
                          <td className="py-2 pr-4 text-gray-700">{inr(item.rate)}</td>
                          <td className="py-2 font-semibold text-[#1a1a1a] whitespace-nowrap">{inr(item.amount)}</td>
                        </tr>
                      ))
                    )}
                    <tr className="border-t-2 border-[#B8860B]">
                      <td colSpan={5} className="pt-3 font-bold text-[#1a1a1a] text-base">Grand Total</td>
                      <td className="pt-3 font-bold text-[#B8860B] text-base whitespace-nowrap">{inr(boq.grand_total)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            TAB 2: INTERIOR DESIGN STUDIO (existing, unchanged)
        ════════════════════════════════════════════════════════════════ */}
        {activeTab === "interior" && (
          <motion.div
            key="interior"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
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
            <span className="text-[#B8860B] font-medium text-sm">AI Design Studio</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-4">
            Transform Your Space
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Upload a photo of your room, choose a style, and let our AI create stunning design
            visualizations
          </p>
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{
              opacity: 0,
              x: -30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.2,
            }}
            className="space-y-6"
          >
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <h3 className="font-serif text-xl font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-[#B8860B] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </span>
                Upload Your Room Photo
              </h3>
              {e ? (
                <div className="relative">
                  <img
                    src={e}
                    alt="Uploaded room"
                    className="w-full h-64 object-cover rounded-2xl"
                  />
                  {x && (
                    <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                      <LoaderCircle className="w-8 h-8 text-white animate-spin" />
                    </div>
                  )}
                  <button
                    onClick={P}
                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => {
                    return C.current?.click();
                  }}
                  className="border-2 border-dashed border-[#B8860B]/30 rounded-2xl p-12 text-center cursor-pointer hover:border-[#B8860B] hover:bg-[#B8860B]/5 transition-all duration-300"
                >
                  <Upload className="w-12 h-12 text-[#B8860B] mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-400">PNG, JPG up to 10MB</p>
                </div>
              )}
              <input ref={C} type="file" accept="image/*" onChange={E} className="hidden" />
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <h3 className="font-serif text-xl font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-[#B8860B] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </span>
                Choose Your Style
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Room Type</label>
                  <Select value={c} onValueChange={d}>
                    <SelectTrigger className="w-full h-12 rounded-xl">
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      {designerRoomTypes.map((B) => (
                        <SelectItem key={B.id} value={B.id}>
                          {B.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Design Style
                  </label>
                  <Select value={o} onValueChange={l}>
                    <SelectTrigger className="w-full h-12 rounded-xl">
                      <SelectValue placeholder="Select design style" />
                    </SelectTrigger>
                    <SelectContent>
                      {interiorStylesList.map((B) => (
                        <SelectItem key={B.id} value={B.id}>
                          <div>
                            <span className="font-medium">{B.name}</span>
                            <span className="text-gray-400 text-sm ml-2">-{B.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <Button
              onClick={T}
              disabled={!n || !o || !c || m}
              className="w-full h-14 bg-gradient-to-r from-[#B8860B] to-[#D4A84B] hover:from-[#D4A84B] hover:to-[#B8860B] text-white rounded-full font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {m ? (
                <>
                  <LoaderCircle className="w-5 h-5 mr-2 animate-spin" />
                  Generating Design...
                </>
              ) : (
                <>
                  <WandSparkles className="w-5 h-5 mr-2" />
                  Generate Design
                </>
              )}
            </Button>
          </motion.div>
          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.4,
            }}
          >
            <div className="bg-white rounded-3xl p-6 shadow-lg h-full min-h-[500px] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-xl font-bold text-[#1a1a1a] flex items-center gap-2">
                  <span className="w-8 h-8 bg-[#B8860B] text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  Your Design Result
                </h3>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {m ? (
                    <motion.div
                      key={"loading"}
                      initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: 1,
                      }}
                      exit={{
                        opacity: 0,
                      }}
                      className="text-center"
                    >
                      <div className="w-20 h-20 border-4 border-[#B8860B]/20 border-t-[#B8860B] rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-gray-600">Creating your dream design...</p>
                      <p className="text-sm text-gray-400 mt-2">This may take 10-15 seconds</p>
                    </motion.div>
                  ) : h ? (
                    <motion.div
                      key={"result"}
                      initial={{
                        opacity: 0,
                        scale: 0.9,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                      }}
                      className="w-full"
                    >
                      <img
                        src={h}
                        alt="Generated concept design"
                        className="w-full h-auto rounded-2xl shadow-lg"
                      />
                      <div className="flex gap-4 mt-6">
                        <a
                          href={h}
                          download="dream-home-design.png"
                          className="flex-1 flex items-center justify-center gap-2 bg-[#1a1a1a] text-white py-3 rounded-full hover:bg-gray-800 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </a>
                        <Button
                          onClick={T}
                          variant="outline"
                          className="flex-1 rounded-full border-[#B8860B] text-[#B8860B] hover:bg-[#B8860B] hover:text-white"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Regenerate
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={"empty"}
                      initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: 1,
                      }}
                      exit={{
                        opacity: 0,
                      }}
                      className="text-center"
                    >
                      <div className="w-24 h-24 bg-[#B8860B]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Image className="w-12 h-12 text-[#B8860B]" />
                      </div>
                      <p className="text-gray-600 mb-2">Your design will appear here</p>
                      <p className="text-sm text-gray-400">
                        Upload a photo and select your preferences to get started
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
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
          className="mt-16"
        >
          <h2 className="font-serif text-3xl font-bold text-center text-[#1a1a1a] mb-8">
            Available Design Styles
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {interiorStylesList.map((B) => (
              <motion.button
                key={B.id}
                whileHover={{
                  scale: 1.02,
                  y: -5,
                }}
                onClick={() => l(B.id)}
                className={`p-4 rounded-2xl text-left transition-all duration-300 ${o === B.id ? "bg-[#B8860B] text-white shadow-lg" : "bg-white hover:shadow-md"}`}
              >
                <h4 className={`font-medium mb-1 ${o === B.id ? "text-white" : "text-[#1a1a1a]"}`}>
                  {B.name}
                </h4>
                <p className={`text-sm ${o === B.id ? "text-white/80" : "text-gray-500"}`}>
                  {B.description}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>
        </motion.div>
        )}

      </div>
    </div>
  );
}
