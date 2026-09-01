import { useRef, useState } from "react";
import {
  Building2,
  Download,
  LoaderCircle,
  Save,
  Sparkles,
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

const exteriorZones = [
  {
    id: "facade",
    name: "Full Facade/Elevation",
  },
  {
    id: "balcony",
    name: "Balcony Design",
  },
  {
    id: "terrace",
    name: "Terrace/Roof",
  },
  {
    id: "entrance",
    name: "Main Entrance",
  },
  {
    id: "windows",
    name: "Window Designs",
  },
  {
    id: "parking",
    name: "Parking Area",
  },
];
const exteriorStyles = [
  {
    id: "modern",
    name: "Modern Contemporary",
  },
  {
    id: "traditional",
    name: "Traditional Indian",
  },
  {
    id: "minimalist",
    name: "Minimalist",
  },
  {
    id: "colonial",
    name: "Colonial",
  },
  {
    id: "mediterranean",
    name: "Mediterranean",
  },
  {
    id: "art_deco",
    name: "Art Deco",
  },
  {
    id: "tropical",
    name: "Tropical",
  },
  {
    id: "industrial",
    name: "Industrial Modern",
  },
];
const exteriorShowcase = [
  {
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80",
    style: "Modern Villa",
  },
  {
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80",
    style: "Contemporary",
  },
  {
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80",
    style: "Luxury Home",
  },
  {
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&q=80",
    style: "Minimalist",
  },
  {
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80",
    style: "Traditional",
  },
  {
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80",
    style: "Modern Classic",
  },
];
export default function ExteriorDesign() {
  const [e, t] = useState("facade"),
    [n, r] = useState(""),
    [o, l] = useState(""),
    [c, d] = useState("G+1"),
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
          const F = exteriorZones.find((re) => re.id === e)?.name || "Full Facade/Elevation",
            Q = exteriorStyles.find((re) => re.id === n)?.name || n,
            ee = `Professional exterior architectural elevation render of an Indian house ${F}:
Style: ${Q}
${o ? `Special details: ${o}` : ""}
${P ? `CRITICAL: Apply modifications directly on this uploaded exterior image.` : ""}

Create a high quality exterior render.`;
          const re = await base44.integrations.Core.GenerateImage({
            prompt: ee,
          });
          j(re.url);
        } catch (F) {
          console.error("Generation error:", F);
        }
        S(false);
      }
    },
    G = async () => {
      try {
        await base44.entities.SavedDesign.create({
          title: `${exteriorZones.find((ee) => ee.id === e)?.name || "Exterior"} - ${exteriorStyles.find((ee) => ee.id === n)?.name || "Design"}`,
          design_type: "exterior",
          style: n,
          visualization_url: x,
          prompt: o,
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
            <Building2 className="w-4 h-4 text-[#B8860B]" />
            <span className="text-[#B8860B] font-medium text-sm">Exterior Design Studio</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-4">
            Design Stunning Exteriors
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            AI concept renders for facades, balconies, and terraces.
            For planning and visualization — not professional architectural drawings.
          </p>
        </motion.div>

        {/* Disclaimer */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-8">
          <span className="text-amber-600 text-lg flex-shrink-0">⚠️</span>
          <p className="text-amber-800 text-sm leading-relaxed">
            <strong>Concept renders only.</strong> AI-generated exterior images are for inspiration and planning discussions — not structural or permit-ready drawings.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {exteriorZones.map((F) => (
            <button
              key={F.id}
              onClick={() => t(F.id)}
              className={`px-5 py-3 rounded-full transition-all ${e === F.id ? "bg-[#B8860B] text-white shadow-lg" : "bg-white text-gray-700 hover:bg-[#B8860B]/10"}`}
            >
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
                Upload Reference (Optional)
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
                  <p className="text-gray-600">Upload existing exterior photo</p>
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
                      {exteriorStyles.map((F) => (
                        <SelectItem key={F.id} value={F.id}>
                          {F.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Floors</label>
                  <Select value={c} onValueChange={d}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["Ground Only", "G+1", "G+2", "G+3", "G+4"].map((F) => (
                        <SelectItem key={F} value={F}>
                          {F}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Additional Details
                </label>
                <Textarea
                  value={o}
                  onChange={(F) => l(F.target.value)}
                  placeholder="E.g., glass railings, wooden cladding, stone facade, LED lighting..."
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
                  Generate Exterior Design
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
              </div>
              <div className="aspect-[4/3] bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden relative">
                {_ ? (
                  <div className="text-center">
                    <LoaderCircle className="w-12 h-12 text-[#B8860B] animate-spin mx-auto mb-3" />
                    <p className="text-gray-500">Creating design...</p>
                  </div>
                ) : x ? (
                  <img src={x} alt="Concept Render" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-gray-400">
                    <Building2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Design will appear here</p>
                  </div>
                )}
                {x && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-center text-white text-xs backdrop-blur-sm">
                    Sample concept — not an actual design for your plot
                  </div>
                )}
              </div>
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
                    onClick={() => window.open(`https://wa.me/?text=Check out my exterior design concept from Gruham!`, "_blank")}
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
                    <strong>Requested:</strong> {n} style exterior for {e} floors {o ? `with ${o}` : ""}.
                  </p>
                  
                  <h5 className="font-medium text-[#1a1a1a] mb-2">Indicative Finish Costs (₹/sq ft of elevation):</h5>
                  <ul className="space-y-1 text-gray-600 mb-4">
                    <li>• Standard (Paint & simple plaster): ₹150 – ₹250</li>
                    <li>• Premium (Texture, tiles, mild steel): ₹350 – ₹600</li>
                    <li>• Luxury (Stone cladding, glass, HPL): ₹800+</li>
                  </ul>
                  
                  <h5 className="font-medium text-[#1a1a1a] mb-2">What a Real Quote Must Include:</h5>
                  <ul className="space-y-1 text-gray-600">
                    <li>✓ Elevation structural drawings & loads</li>
                    <li>✓ Scaffolding costs (often hidden)</li>
                    <li>✓ Weather-proofing & sealant specifications</li>
                    <li>✓ Lighting placement & wiring diagrams</li>
                  </ul>
                </div>
              )}
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
            delay: 0.3,
          }}
          className="mt-16"
        >
          <h2 className="font-serif text-2xl font-bold text-[#1a1a1a] text-center mb-8">
            Exterior Inspiration Gallery
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {exteriorShowcase.map((F, Q) => (
              <motion.div
                key={Q}
                whileHover={{
                  scale: 1.05,
                }}
                className="relative rounded-2xl overflow-hidden group cursor-pointer"
              >
                <img src={F.image} alt={F.style} className="w-full h-40 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <p className="text-white text-sm font-medium">{F.style}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
