import { useRef, useState } from "react";
import {
  Car,
  Download,
  Fence,
  Footprints,
  LoaderCircle,
  Rotate3d,
  Save,
  Sparkles,
  TreePine,
  Upload,
  WandSparkles,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { base44 } from "../lib/base44";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Disclaimer from "@/components/Disclaimer";

const compoundAreas = [
  {
    id: "garden",
    name: "Garden/Lawn",
    icon: TreePine,
  },
  {
    id: "parking",
    name: "Parking Area",
    icon: Car,
  },
  {
    id: "boundary",
    name: "Boundary Wall & Gate",
    icon: Fence,
  },
  {
    id: "pathway",
    name: "Pathways & Paving",
    icon: Footprints,
  },
  {
    id: "sitout",
    name: "Sit-out Area",
    icon: TreePine,
  },
  {
    id: "complete",
    name: "Complete Compound",
    icon: TreePine,
  },
];
const compoundStyles = [
  {
    id: "modern",
    name: "Modern Minimalist",
  },
  {
    id: "traditional",
    name: "Traditional Indian",
  },
  {
    id: "tropical",
    name: "Tropical",
  },
  {
    id: "zen",
    name: "Zen/Japanese",
  },
  {
    id: "cottage",
    name: "Cottage Garden",
  },
  {
    id: "mediterranean",
    name: "Mediterranean",
  },
  {
    id: "contemporary",
    name: "Contemporary",
  },
];
export default function CompoundDesign() {
  const [e, t] = useState("complete"),
    [n, r] = useState(""),
    [o, l] = useState(""),
    [c, d] = useState(""),
    [h, p] = useState(null),
    [m, y] = useState(false),
    [x, j] = useState(null),
    [_, S] = useState(false),
    [N, w] = useState("2d"),
    [C, E] = useState(0),
    [toast, setToast] = useState(""),
    T = useRef(null),
    [P, B] = useState(null),
    U = async (F) => {
      const Q = F.target.files[0];
      if (Q) {
        (y(true), p(URL.createObjectURL(Q)));
        try {
          const { file_url: ee } = await base44.integrations.Core.UploadFile({
            file: Q,
          });
          B(ee);
        } catch (ee) {
          console.error("Upload error:", ee);
        }
        y(false);
      }
    },
    A = async () => {
      if (n) {
        S(true);
        try {
          const ee = compoundAreas.find((oe) => oe.id === e)?.name || "landscape",
            re = compoundStyles.find((oe) => oe.id === n)?.name || n,
            ae = `Professional compound design visualization for Indian home: ${ee}`;
          const be = await base44.integrations.Core.GenerateImage({ prompt: ae });
          j(be.url);
        } catch (ee) {
          console.error("Generation error:", ee);
        }
        S(false);
      }
    },
    G = async () => {
      try {
        await base44.entities.SavedDesign.create({
          title: `${compoundAreas.find((ee) => ee.id === e)?.name || "Compound"} - ${compoundStyles.find((ee) => ee.id === n)?.name || "Design"}`,
          design_type: "compound",
          style: n,
          plot_size: o,
          visualization_url: x,
          prompt: c,
        });
        setToast("Design saved to library!");
        setTimeout(() => setToast(""), 3000);
      } catch (ee) {
        console.error("Save error:", ee);
      }
    };
  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 pb-16">
      {toast && (
        <div className="fixed bottom-6 right-6 z-[999] bg-[#1a1a1a] text-[#B8860B] px-6 py-3 rounded-full shadow-2xl text-sm font-semibold border border-[#B8860B]">
          {toast}
        </div>
      )}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Disclaimer variant="generator" />
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-[#B8860B]/10 rounded-full px-4 py-2 mb-4">
            <TreePine className="w-4 h-4 text-[#B8860B]" />
            <span className="text-[#B8860B] font-medium text-sm">Compound & Landscape Design</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-4">
            Design Your Outdoor Space
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            AI concept renders for gardens, parking, pathways, and compound walls.
            For planning and inspiration — not construction drawings.
          </p>
        </motion.div>

        {/* Disclaimer */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-6">
          <span className="text-amber-600 text-lg flex-shrink-0">⚠️</span>
          <p className="text-amber-800 text-sm leading-relaxed">
            <strong>Concept renders only.</strong> AI-generated compound and landscape images are for visualization — not professional landscape architecture drawings.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {compoundAreas.map((F) => (
            <button
              key={F.id}
              onClick={() => t(F.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full transition-all ${e === F.id ? "bg-[#B8860B] text-white shadow-lg" : "bg-white text-gray-700 hover:bg-[#B8860B]/10"}`}
            >
              <F.icon className="w-4 h-4" />
              {F.name}
            </button>
          ))}
        </div>
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
            className="space-y-6"
          >
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <h3 className="font-serif text-lg font-bold text-[#1a1a1a] mb-4">
                Upload Plot Photo (Optional)
              </h3>
              {h ? (
                <div className="relative">
                  <img src={h} alt="Uploaded" className="w-full h-48 object-cover rounded-2xl" />
                  <button
                    onClick={() => p(null)}
                    className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => {
                    return T.current?.click();
                  }}
                  className="border-2 border-dashed border-[#B8860B]/30 rounded-2xl p-8 text-center cursor-pointer hover:border-[#B8860B]"
                >
                  <Upload className="w-10 h-10 text-[#B8860B] mx-auto mb-3" />
                  <p className="text-gray-600">Upload plot or existing compound photo</p>
                </div>
              )}
              <input ref={T} type="file" accept="image/*" onChange={U} className="hidden" />
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-lg space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Style</label>
                  <Select value={n} onValueChange={r}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Choose style" />
                    </SelectTrigger>
                    <SelectContent>
                      {compoundStyles.map((F) => (
                        <SelectItem key={F.id} value={F.id}>
                          {F.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Plot Size (sq ft)
                  </label>
                  <input
                    type="text"
                    value={o}
                    onChange={(F) => l(F.target.value)}
                    placeholder="E.g., 2400"
                    className="w-full h-10 px-3 rounded-xl border border-gray-200"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Additional Details
                </label>
                <Textarea
                  value={c}
                  onChange={(F) => d(F.target.value)}
                  placeholder="E.g., water feature, pergola, outdoor kitchen, kids play area, vertical garden..."
                  className="h-24"
                />
              </div>
            </div>
            <Button
              onClick={A}
              disabled={!n || _}
              className="w-full h-14 bg-gradient-to-r from-[#B8860B] to-[#D4A84B] text-white rounded-full font-semibold text-lg"
            >
              {_ ? (
                <>
                  <LoaderCircle className="w-5 h-5 mr-2 animate-spin" />
                  Designing...
                </>
              ) : (
                <>
                  <WandSparkles className="w-5 h-5 mr-2" />
                  Generate Compound Design
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
          >
            <div className="bg-white rounded-3xl p-6 shadow-lg h-full min-h-[500px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-bold text-[#1a1a1a]">Your Design</h3>
                {x && (
                  <div className="flex gap-1 bg-gray-100 rounded-full p-1">
                    <button
                      onClick={() => w("2d")}
                      className={`px-3 py-1 rounded-full text-xs ${N === "2d" ? "bg-[#B8860B] text-white" : ""}`}
                    >
                      2D
                    </button>
                    <button
                      onClick={() => w("3d")}
                      className={`px-3 py-1 rounded-full text-xs ${N === "3d" ? "bg-[#B8860B] text-white" : ""}`}
                    >
                      3D
                    </button>
                  </div>
                )}
              </div>
              <div className="aspect-[4/3] bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden relative">
                {_ ? (
                  <div className="text-center">
                    <LoaderCircle className="w-12 h-12 text-[#B8860B] animate-spin mx-auto mb-3" />
                    <p className="text-gray-500">Creating design...</p>
                  </div>
                ) : x ? (
                  N === "2d" ? (
                    <img src={x} alt="Design" className="w-full h-full object-cover" />
                  ) : (
                    <motion.img
                      src={x}
                      alt="3D"
                      className="w-full h-full object-cover"
                      style={{
                        transform: `rotateY(${C}deg)`,
                      }}
                      animate={{
                        rotateY: C,
                      }}
                    />
                  )
                ) : (
                  <div className="text-center text-gray-400">
                    <TreePine className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Design will appear here</p>
                  </div>
                )}
                {x && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-center text-white text-xs backdrop-blur-sm">
                    Sample concept — not an actual design for your plot
                  </div>
                )}
              </div>
              {x && N === "3d" && (
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={() => E((F) => F - 30)}
                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#B8860B] hover:text-white"
                  >
                    <Rotate3d className="w-5 h-5 -scale-x-100" />
                  </button>
                  <button
                    onClick={() => E((F) => F + 30)}
                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#B8860B] hover:text-white"
                  >
                    <Rotate3d className="w-5 h-5" />
                  </button>
                </div>
              )}
              {x && (
                <div className="flex gap-3 mt-4">
                  <Button
                    onClick={G}
                    variant="outline"
                    className="flex-1 rounded-full border-[#B8860B] text-[#B8860B]"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button className="flex-1 rounded-full bg-gray-300 text-gray-600 cursor-not-allowed" title="Concept images cannot be downloaded directly. Save to library instead.">
                    <Download className="w-4 h-4 mr-2" />
                    Download (Disabled)
                  </Button>
                  <Button 
                    onClick={() => window.open(`https://wa.me/?text=Check out my compound wall concept from Gruham!`, "_blank")}
                    className="flex-1 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white"
                  >
                    Share on WhatsApp
                  </Button>
                </div>
              )}
              {x && (
                <div className="mt-6 bg-[#FAF8F5] p-4 rounded-xl border border-[#B8860B]/20 text-sm">
                  <h4 className="font-semibold text-[#1a1a1a] mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#B8860B]" />
                    Design Details & Cost Estimate
                  </h4>
                  <p className="text-gray-600 mb-4">
                    <strong>Requested:</strong> {n} style compound wall {o ? `with ${o}` : ""}.
                  </p>
                  
                  <h5 className="font-medium text-[#1a1a1a] mb-2">Indicative Finish Costs (₹/sq ft of wall area):</h5>
                  <ul className="space-y-1 text-gray-600 mb-4">
                    <li>• Standard (Brick & Plaster): ₹180 – ₹250</li>
                    <li>• Premium (Stone cladding, grills): ₹300 – ₹450</li>
                    <li>• Luxury (CNC cut panels, imported stone): ₹600+</li>
                  </ul>
                  
                  <h5 className="font-medium text-[#1a1a1a] mb-2">What a Real Quote Must Include:</h5>
                  <ul className="space-y-1 text-gray-600">
                    <li>✓ Foundation depth & RCC specifications</li>
                    <li>✓ Gate structural support (pillars)</li>
                    <li>✓ Security systems conduit (cameras, lights)</li>
                    <li>✓ Coping stone / weather shielding details</li>
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
