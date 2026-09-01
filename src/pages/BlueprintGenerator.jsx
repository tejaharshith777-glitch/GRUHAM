import { useRef, useState } from "react";
import {
  Box,
  Building,
  Download,
  Eye,
  FileText,
  House,
  LoaderCircle,
  RefreshCw,
  Save,
  Upload,
  WandSparkles,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { motion } from "framer-motion";
import { base44 } from "../lib/base44";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Disclaimer from "@/components/Disclaimer";

const houseStyles = [
  {
    id: "modern",
    name: "Modern",
    desc: "Clean lines, minimal",
  },
  {
    id: "traditional",
    name: "Traditional Indian",
    desc: "Vastu compliant, classic",
  },
  {
    id: "contemporary",
    name: "Contemporary",
    desc: "Current trends",
  },
  {
    id: "minimalist",
    name: "Minimalist",
    desc: "Simple, functional",
  },
  {
    id: "luxury",
    name: "Luxury Villa",
    desc: "Premium finishes",
  },
  {
    id: "colonial",
    name: "Colonial",
    desc: "British-era inspired",
  },
  {
    id: "south_indian",
    name: "South Indian",
    desc: "Traditional Kerala/Tamil style",
  },
  {
    id: "north_indian",
    name: "North Indian",
    desc: "Rajasthani/Punjab style",
  },
  {
    id: "eco_friendly",
    name: "Eco-Friendly",
    desc: "Sustainable materials",
  },
  {
    id: "smart_home",
    name: "Smart Home",
    desc: "Tech-integrated",
  },
];
const bhkOptions = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5 BHK", "6+ BHK", "Duplex", "Penthouse"];
const floorOptions = ["Ground Only", "G+1", "G+2", "G+3", "G+4"];
const budgetOptions = [
  "Under ₹20 Lakhs",
  "₹20-40 Lakhs",
  "₹40-60 Lakhs",
  "₹60-80 Lakhs",
  "₹80L-1 Crore",
  "₹1-2 Crore",
  "₹2-5 Crore",
  "₹5+ Crore",
];
export default function BlueprintGenerator() {
  const [e, t] = useState("prompt"),
    [n, r] = useState(null),
    [o, l] = useState(null),
    [c, d] = useState(false),
    [h, p] = useState(""),
    [m, y] = useState("modern"),
    [x, j] = useState("3 BHK"),
    [_, S] = useState("G+1"),
    [N, w] = useState("1500"),
    [C, E] = useState("₹40-60 Lakhs"),
    [T, P] = useState(true),
    [B, U] = useState(null),
    [A, G] = useState(null),
    [F, Q] = useState(false),
    [ee, re] = useState(""),
    [ae, be] = useState("2d"),
    [oe, ie] = useState(0),
    [V, se] = useState(1),
    [toast, setToast] = useState(""),
    te = useRef(null),
    M = async (Y) => {
      const ve = Y.target.files[0];
      if (ve) {
        (d(true), r(URL.createObjectURL(ve)));
        try {
          const { file_url: Ne } = await base44.integrations.Core.UploadFile({
            file: ve,
          });
          l(Ne);
        } catch (Ne) {
          console.error("Upload error:", Ne);
        }
        d(false);
      }
    },
    W = async () => {
      Q(true);
      try {
        re("Creating floor plan blueprint...");
        const Ne = `Architectural 2D floor plan blueprint for an Indian house:
${x || "3 BHK"} ${_ || "G+1"} house
Style: ${houseStyles.find((Ae) => Ae.id === m)?.name || "Modern"}
Plot size: ${N || "1500"} sq ft
${T ? "Vastu compliant layout with proper directions" : ""}
${h ? `Special requirements: ${h}` : ""}
Budget: ${C || "₹50-70 Lakhs"}
${o ? "CRITICAL: Apply all modifications DIRECTLY on the uploaded image. Do NOT create a new image. Edit and enhance this SAME uploaded image - refine lines, add professional annotations, improve layout clarity, and add dimensions. Maintain the original structure while professionalizing it on the same base image." : ""}

Create a detailed architectural blueprint showing:
- Room layouts with dimensions in feet
- Door and window placements
- Kitchen, bathrooms, bedrooms clearly marked
- Staircase if multi-floor
- Clean professional blueprint style with measurements`,
          K = await base44.integrations.Core.GenerateImage({
            prompt: Ne,
          });
        (U(K.url), re("Generating elevation concept..."));
        const ue = houseStyles.find((Ae) => Ae.id === m)?.name || "Modern",
          je = `Photorealistic exterior elevation render of an Indian house:
${x || "3 BHK"} ${_ || "G+1"} ${ue} style house
Plot size: ${N || "1500"} sq ft
${h ? `Features: ${h}` : ""}
${o ? `CRITICAL: Apply ALL changes DIRECTLY on the uploaded image. Do NOT generate a new image. Transform THIS SAME image - add ${ue} style elements, enhance textures, add landscaping, improve lighting - all edits must be cumulative on the SAME base image to maintain visual coherence and consistency.` : ""}

Show:
- Beautiful front elevation with entrance
- Balconies and windows
- Landscaping with Indian plants
- Parking area
- Boundary wall with gate
- Realistic textures and lighting
- Indian residential neighborhood context
High quality architectural rendering, professional photography style`,
          Ee = await base44.integrations.Core.GenerateImage({
            prompt: je,
          });
        A(Ee.url);
      } catch (Ne) {
        console.error("Generation error:", Ne);
      }
      (F(false), ee(""));
    },
    he = async () => {
      try {
        await base44.entities.SavedDesign.create({
          title: `${x} ${houseStyles.find((ve) => ve.id === m)?.name || "Modern"} House`,
          design_type: "full_house",
          style: m,
          bhk: x,
          floors: _ === "Ground Only" ? 1 : parseInt(_?.replace("G+", "")) + 1 || 2,
          plot_size: N,
          budget: C,
          blueprint_url: B,
          visualization_url: A,
          prompt: h,
        });
        setToast("Design saved to your library!");
        setTimeout(() => setToast(""), 3000);
      } catch (ve) {
        console.error("Save error:", ve);
      }
    },
    handleDownload = async () => {
      const targetUrl = B || A;
      if (!targetUrl) return;
      try {
        const res = await fetch(targetUrl);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `gruham-blueprint-${x || "3BHK"}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch {
        window.open(targetUrl, "_blank");
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
            <House className="w-4 h-4 text-[#B8860B]" />
            <span className="text-[#B8860B] font-medium text-sm">AI Blueprint Generator</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-4">
            AI Blueprint Generator
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Generate concept floor plans and elevation renders for Indian homes.
            For planning and visualization — not construction drawings.
          </p>
        </motion.div>

        {/* Disclaimer banner */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-8">
          <span className="text-amber-600 text-lg flex-shrink-0">⚠️</span>
          <p className="text-amber-800 text-sm leading-relaxed">
            <strong>Concept designs only.</strong> AI-generated images are for visualization and planning discussion — they are not architectural or structural drawings. Before any construction, engage a licensed architect and structural engineer for stamped drawings.
          </p>
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
              <Tabs value={e} onValueChange={t}>
                <TabsList className="w-full mb-6">
                  <TabsTrigger value="prompt" className="flex-1">
                    Text Prompt
                  </TabsTrigger>
                  <TabsTrigger value="upload" className="flex-1">
                    Upload Image
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="prompt" className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Describe your dream home
                    </label>
                    <Textarea
                      value={h}
                      onChange={(Y) => p(Y.target.value)}
                      placeholder="E.g., 3BHK modern house with large balcony, open kitchen, home office, garden facing living room, parking for 2 cars..."
                      className="h-24"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="upload">
                  {n ? (
                    <div className="relative">
                      <img
                        src={n}
                        alt="Uploaded"
                        className="w-full h-48 object-cover rounded-2xl"
                      />
                      {c && (
                        <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                          <LoaderCircle className="w-8 h-8 text-white animate-spin" />
                        </div>
                      )}
                      <button
                        onClick={() => {
                          (r(null), l(null));
                        }}
                        className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        return te.current?.click();
                      }}
                      className="border-2 border-dashed border-[#B8860B]/30 rounded-2xl p-8 text-center cursor-pointer hover:border-[#B8860B] hover:bg-[#B8860B]/5 transition-all"
                    >
                      <Upload className="w-10 h-10 text-[#B8860B] mx-auto mb-3" />
                      <p className="text-gray-600 mb-1">Upload plot photo or sketch</p>
                      <p className="text-sm text-gray-400">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                  <input ref={te} type="file" accept="image/*" onChange={M} className="hidden" />
                </TabsContent>
              </Tabs>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-lg space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#1a1a1a] flex items-center gap-2">
                <Building className="w-5 h-5 text-[#B8860B]" />
                House Configuration
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">BHK Type</label>
                  <Select value={x} onValueChange={j}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select BHK" />
                    </SelectTrigger>
                    <SelectContent>
                      {bhkOptions.map((Y) => (
                        <SelectItem key={Y} value={Y}>
                          {Y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Floors</label>
                  <Select value={_} onValueChange={S}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select floors" />
                    </SelectTrigger>
                    <SelectContent>
                      {floorOptions.map((Y) => (
                        <SelectItem key={Y} value={Y}>
                          {Y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Plot Size (sq ft)
                  </label>
                  <Input
                    value={N}
                    onChange={(Y) => w(Y.target.value)}
                    placeholder="E.g., 1500"
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Budget</label>
                  <Select value={C} onValueChange={E}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select budget" />
                    </SelectTrigger>
                    <SelectContent>
                      {budgetOptions.map((Y) => (
                        <SelectItem key={Y} value={Y}>
                          {Y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Design Style</label>
                <Select value={m} onValueChange={y}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Choose style" />
                  </SelectTrigger>
                  <SelectContent>
                    {houseStyles.map((Y) => (
                      <SelectItem key={Y.id} value={Y.id}>
                        <span className="font-medium">{Y.name}</span>
                        <span className="text-gray-400 text-sm ml-2">-{Y.desc}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={T}
                  onChange={(Y) => P(Y.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-[#B8860B] focus:ring-[#B8860B]"
                />
                <span className="text-sm text-gray-700">Vastu Compliant Design</span>
              </label>
            </div>
            <Button
              onClick={W}
              disabled={F}
              className="w-full h-14 bg-gradient-to-r from-[#B8860B] to-[#D4A84B] hover:from-[#D4A84B] hover:to-[#B8860B] text-white rounded-full font-semibold text-lg shadow-lg"
            >
              {F ? (
                <>
                  <LoaderCircle className="w-5 h-5 mr-2 animate-spin" />
                  {ee}
                </>
              ) : (
                <>
                  <WandSparkles className="w-5 h-5 mr-2" />
                  Generate Blueprint & Render
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
            className="space-y-6"
          >
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-bold text-[#1a1a1a] flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#B8860B]" />
                  2D Blueprint
                </h3>
              </div>
              <div className="aspect-[4/3] bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden">
                {B ? (
                  <img src={B} alt="Blueprint" className="w-full h-full object-contain" />
                ) : (
                  <div className="text-center text-gray-400">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Blueprint will appear here</p>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-bold text-[#1a1a1a] flex items-center gap-2">
                  <Box className="w-5 h-5 text-[#B8860B]" />
                  Elevation Concept
                </h3>
              </div>
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl flex items-center justify-center overflow-hidden relative">
                {A ? (
                  <img src={A} alt="Elevation Concept" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-gray-400">
                    <Box className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Elevation concept will appear here</p>
                  </div>
                )}
                {A && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-center text-white text-xs backdrop-blur-sm">
                    Sample concept — not an actual design for your plot
                  </div>
                )}
              </div>
              {(B || A) && (
                <div className="flex gap-3 mt-4">
                  <Button
                    onClick={he}
                    variant="outline"
                    className="flex-1 rounded-full border-[#B8860B] text-[#B8860B]"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="flex-1 rounded-full border-[#B8860B] text-[#B8860B] hover:bg-[#B8860B] hover:text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button 
                    onClick={() => window.open(`https://wa.me/?text=Check out my AI-generated blueprint concept from Gruham!`, "_blank")}
                    className="flex-1 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white"
                  >
                    Share on WhatsApp
                  </Button>
                  <Button onClick={W} variant="outline" className="rounded-full">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
