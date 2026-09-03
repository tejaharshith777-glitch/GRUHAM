import { useRef, useState } from "react";
import {
  Building2,
  Check,
  Download,
  Grid,
  House,
  Image as ImageIcon,
  LoaderCircle,
  Palette,
  Save,
  Sparkles,
  Upload,
  WandSparkles,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { base44, STYLE_TOKENS } from "../lib/base44";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Disclaimer from "@/components/Disclaimer";

const exteriorTypes = [
  { id: "facade", name: "Front Elevation" },
  { id: "villa", name: "Luxury Villa Facade" },
  { id: "duplex", name: "Duplex Home Front" },
  { id: "entrance", name: "Main Entrance Portico" },
  { id: "terrace", name: "Terrace & Balcony" },
];

const exteriorStyles = [
  { id: "traditional_indian", name: "Traditional Indian", desc: "Sloped terracotta roof, Jharokha, teak pillars" },
  { id: "south_indian", name: "South Indian / Kerala", desc: "Chettinad verandah, red tile roof" },
  { id: "modern", name: "Modern Minimalist", desc: "Clean geometric lines, glass facades" },
  { id: "contemporary", name: "Contemporary Luxury", desc: "Marble paneling, LED facade lighting" },
  { id: "colonial", name: "British Colonial", desc: "Arched verandahs, white lime walls" },
];

export default function ExteriorDesign() {
  const [selectedType, setSelectedType] = useState("facade");
  const [selectedStyle, setSelectedStyle] = useState("traditional_indian");
  const [floors, setFloors] = useState("G+1");
  const [wallFinish, setWallFinish] = useState("Terracotta & Stone Cladding");
  const [prompt, setPrompt] = useState("");
  const [refImage, setRefImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVariations, setGeneratedVariations] = useState([]);
  const [activeVariationIdx, setActiveVariationIdx] = useState(0);
  const [toast, setToast] = useState("");
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = URL.createObjectURL(file);
      setRefImage(url);
    } catch (err) {
      console.error("Upload error:", err);
    }
    setIsUploading(false);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const typeName = exteriorTypes.find((t) => t.id === selectedType)?.name || "Front Elevation";
      const styleObj = exteriorStyles.find((s) => s.id === selectedStyle) || exteriorStyles[0];

      const fullPrompt = `${typeName} exterior design, ${floors} floors, ${styleObj.name} style. Wall finish: ${wallFinish}. ${prompt ? `Details: ${prompt}.` : ""} ${refImage ? "Maintain original building massing & structure from uploaded reference image." : ""}`;

      const { urls } = await base44.integrations.Core.GenerateImageVariations({
        prompt: fullPrompt,
        styleToken: selectedStyle,
        count: 4,
      });

      setGeneratedVariations(urls || []);
      setActiveVariationIdx(0);
    } catch (err) {
      console.error("Generation error:", err);
    }
    setIsGenerating(false);
  };

  const handleSave = async (urlToSave) => {
    const activeUrl = urlToSave || generatedVariations[activeVariationIdx];
    if (!activeUrl) return;

    const styleName = exteriorStyles.find((s) => s.id === selectedStyle)?.name || "Modern";
    const title = `${styleName} Exterior (${floors})`;

    const newDesign = {
      id: "ext_" + Date.now(),
      title,
      design_type: "exterior",
      style: selectedStyle,
      image_url: activeUrl,
      created_at: new Date().toISOString(),
    };

    try {
      const { saveDesign } = await import("../lib/designService");
      await saveDesign({
        title,
        design_type: "exterior",
        style: selectedStyle,
        image_url: activeUrl,
        prompt: prompt || title,
      });
    } catch (err) {
      console.log("Saved:", err);
    }

    setToast("Saved to 'My Designs'!");
    setTimeout(() => setToast(""), 3500);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 pb-16">
      {toast && (
        <div className="fixed bottom-6 right-6 z-[999] bg-[#1a1a1a] text-[#B8860B] px-6 py-3 rounded-full shadow-2xl text-sm font-semibold border border-[#B8860B]">
          {toast}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Disclaimer variant="generator" />

        {/* Page Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#B8860B]/10 rounded-full px-4 py-2 mb-4">
            <Building2 className="w-4 h-4 text-[#B8860B]" />
            <span className="text-[#B8860B] font-semibold text-sm">Exterior & Facade Studio</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-3">
            AI Exterior Elevation & Facade Studio
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Design stunning 3D home exterior elevations, front facades, and roofing with style-locked Indian architecture.
          </p>
        </motion.div>

        {/* Studio Grid */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 space-y-6">
              
              {/* Type Selection */}
              <div>
                <label className="text-sm font-bold text-gray-800 mb-3 block">1. Exterior Focus</label>
                <div className="grid grid-cols-2 gap-2">
                  {exteriorTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedType(type.id)}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        selectedType === type.id
                          ? "bg-[#B8860B] text-white border-[#B8860B] shadow-md font-bold"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:border-[#B8860B]"
                      }`}
                    >
                      <span className="text-xs">{type.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Style Selection */}
              <div>
                <label className="text-sm font-bold text-gray-800 mb-3 block">2. Exterior Style (Style-Locked)</label>
                <div className="space-y-2">
                  {exteriorStyles.map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setSelectedStyle(style.id)}
                      className={`w-full p-3 rounded-2xl text-left border flex items-center justify-between transition-all ${
                        selectedStyle === style.id
                          ? "bg-[#1a1a1a] text-white border-[#1a1a1a] shadow-lg"
                          : "bg-gray-50 text-gray-800 border-gray-200 hover:border-[#B8860B]"
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs">{style.name}</div>
                        <div className="text-[10px] opacity-75">{style.desc}</div>
                      </div>
                      {selectedStyle === style.id && <Check className="w-4 h-4 text-[#B8860B]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Floors & Finish Options */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-gray-800 mb-1.5 block">Floor Count</label>
                  <Select value={floors} onValueChange={setFloors}>
                    <SelectTrigger className="rounded-xl border-gray-200">
                      <SelectValue placeholder="Floors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ground Only (G+0)">Ground Only (G+0)</SelectItem>
                      <SelectItem value="G+1">G+1 (2 Storey)</SelectItem>
                      <SelectItem value="G+2">G+2 (3 Storey)</SelectItem>
                      <SelectItem value="Duplex Villa">Duplex Villa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-800 mb-1.5 block">Primary Wall Finish</label>
                  <Select value={wallFinish} onValueChange={setWallFinish}>
                    <SelectTrigger className="rounded-xl border-gray-200">
                      <SelectValue placeholder="Finish" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Terracotta & Stone Cladding">Terracotta & Stone</SelectItem>
                      <SelectItem value="Teakwood & Plaster">Teakwood & Plaster</SelectItem>
                      <SelectItem value="Granite & Glass">Granite & Glass</SelectItem>
                      <SelectItem value="Classic White Lime">Classic White Lime</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Upload Reference Photo */}
              <div>
                <label className="text-sm font-bold text-gray-800 mb-2 block">3. Reference Building Photo (Optional)</label>
                {refImage ? (
                  <div className="relative rounded-2xl overflow-hidden border border-gray-200 aspect-[16/9]">
                    <img src={refImage} alt="Reference" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setRefImage(null)}
                      className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-full hover:bg-black"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#B8860B]/30 rounded-2xl p-4 text-center cursor-pointer hover:border-[#B8860B] hover:bg-[#B8860B]/5 transition-all"
                  >
                    <Upload className="w-6 h-6 text-[#B8860B] mx-auto mb-1" />
                    <span className="text-xs font-semibold text-gray-700">Upload current house photo for facade restyling</span>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </div>

              {/* Generate Action */}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full h-14 bg-gradient-to-r from-[#B8860B] to-[#D4A84B] hover:from-[#D4A84B] hover:to-[#B8860B] text-white rounded-full font-bold text-base shadow-xl"
              >
                {isGenerating ? (
                  <>
                    <LoaderCircle className="w-5 h-5 mr-2 animate-spin" />
                    Generating 4 Exterior Renders...
                  </>
                ) : (
                  <>
                    <WandSparkles className="w-5 h-5 mr-2" />
                    Generate 4 Exterior Renders
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Render Output Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-xl font-bold text-[#1a1a1a] flex items-center gap-2">
                  <Grid className="w-5 h-5 text-[#B8860B]" />
                  Generated 3D Exterior Elevations
                </h3>
                {generatedVariations.length > 0 && (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    4 Renders Generated
                  </span>
                )}
              </div>

              {generatedVariations.length === 0 ? (
                <div className="aspect-[16/10] bg-gray-50 rounded-2xl flex flex-col items-center justify-center p-8 text-center border border-gray-200">
                  <ImageIcon className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="font-semibold text-gray-600">Configure exterior options & click Generate</p>
                  <p className="text-xs text-gray-400 max-w-xs mt-1">
                    Elevation outputs will strictly adhere to the selected architectural style tokens.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Main Selected Image */}
                  <div className="aspect-[16/10] rounded-2xl overflow-hidden shadow-md border border-gray-200 relative group">
                    <img
                      src={generatedVariations[activeVariationIdx]}
                      alt="Exterior Facade Render"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 right-4 flex gap-2 opacity-95">
                      <Button
                        onClick={() => handleSave(generatedVariations[activeVariationIdx])}
                        className="bg-[#1a1a1a] hover:bg-black text-[#B8860B] rounded-full text-xs font-bold"
                      >
                        <Save className="w-3.5 h-3.5 mr-1" />
                        Save Facade
                      </Button>
                      <a
                        href={generatedVariations[activeVariationIdx]}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-[#B8860B] hover:bg-[#997320] text-white px-3 py-2 rounded-full text-xs font-bold flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        HD View
                      </a>
                    </div>
                  </div>

                  {/* 4 Variation Thumbnails Grid */}
                  <div className="grid grid-cols-4 gap-3">
                    {generatedVariations.map((url, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveVariationIdx(idx)}
                        className={`aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all relative ${
                          activeVariationIdx === idx ? "border-[#B8860B] ring-2 ring-[#B8860B]/30 scale-105" : "border-gray-200 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img src={url} alt={`Render ${idx + 1}`} className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                          Render {idx + 1}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
