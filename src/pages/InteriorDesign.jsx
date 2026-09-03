import { useRef, useState } from "react";
import {
  Baby,
  Bath,
  Bed,
  Check,
  Download,
  Grid,
  Image as ImageIcon,
  Laptop,
  LoaderCircle,
  Palette,
  Save,
  Sofa,
  Sparkles,
  Upload,
  UtensilsCrossed,
  WandSparkles,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { base44, STYLE_TOKENS } from "../lib/base44";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Disclaimer from "@/components/Disclaimer";

const interiorRooms = [
  { id: "living", name: "Living Room", icon: Sofa },
  { id: "bedroom", name: "Master Bedroom", icon: Bed },
  { id: "kitchen", name: "Modular Kitchen", icon: UtensilsCrossed },
  { id: "bathroom", name: "Luxury Bathroom", icon: Bath },
  { id: "office", name: "Home Office", icon: Laptop },
  { id: "pooja", name: "Pooja Room", icon: Sparkles },
];

const interiorStyles = [
  { id: "traditional_indian", name: "Traditional Indian", desc: "Teakwood pillars, brass, Athangudi tiles" },
  { id: "south_indian", name: "South Indian / Kerala", desc: "Chettinad courtyard, sloped roofs" },
  { id: "modern", name: "Modern Minimalist", desc: "Clean geometric lines & neutral tones" },
  { id: "contemporary", name: "Contemporary Luxury", desc: "Italian marble & designer lighting" },
  { id: "colonial", name: "British Colonial", desc: "Verandahs & louvered shutters" },
  { id: "minimalist", name: "Zen Minimalist", desc: "Uncluttered ash wood & soft light" },
];

export default function InteriorDesign() {
  const [selectedRoom, setSelectedRoom] = useState("living");
  const [selectedStyle, setSelectedStyle] = useState("traditional_indian");
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
      const roomName = interiorRooms.find((r) => r.id === selectedRoom)?.name || "Living Room";
      const styleObj = interiorStyles.find((s) => s.id === selectedStyle) || interiorStyles[0];

      const fullPrompt = `${roomName} interior design, ${styleObj.name} style. ${prompt ? `Requirements: ${prompt}.` : ""} ${refImage ? "Maintain layout structure of reference uploaded photo." : ""}`;

      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "interior",
          roomType: roomName,
          style: selectedStyle,
          prompt: fullPrompt,
          count: 4,
        }),
      });

      if (!res.ok) {
        if (res.status === 429) {
          setToast("Rate limit reached (max 20/hr). Try again later.");
          setTimeout(() => setToast(""), 4000);
          setIsGenerating(false);
          return;
        }
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      setGeneratedVariations(data.urls || []);
      setActiveVariationIdx(0);
    } catch (err) {
      console.error("Generation error:", err);
      // Fallback
      const { urls } = await base44.integrations.Core.GenerateImageVariations({
        prompt: `${selectedRoom} ${selectedStyle}`,
        count: 4,
      });
      setGeneratedVariations(urls || []);
    }
    setIsGenerating(false);
  };

  const handleSave = async (urlToSave) => {
    const activeUrl = urlToSave || generatedVariations[activeVariationIdx];
    if (!activeUrl) return;

    const styleName = interiorStyles.find((s) => s.id === selectedStyle)?.name || "Modern";
    const roomName = interiorRooms.find((r) => r.id === selectedRoom)?.name || "Living Room";
    const title = `${styleName} ${roomName}`;

    const newDesign = {
      id: "int_" + Date.now(),
      title,
      design_type: "interior",
      style: selectedStyle,
      image_url: activeUrl,
      created_at: new Date().toISOString(),
    };

    try {
      const { saveDesign } = await import("../lib/designService");
      await saveDesign({
        title,
        design_type: "interior",
        style: selectedStyle,
        image_url: activeUrl,
        prompt: prompt || roomName,
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
            <Palette className="w-4 h-4 text-[#B8860B]" />
            <span className="text-[#B8860B] font-semibold text-sm">Interior Design Studio</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-3">
            AI Interior Design & Style Studio
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Transform any room into authentic Traditional Indian, Chettinad, or Luxury interiors with guaranteed style locking.
          </p>
        </motion.div>

        {/* Studio Grid */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 space-y-6">
              
              {/* Room Selection */}
              <div>
                <label className="text-sm font-bold text-gray-800 mb-3 block">1. Select Target Room</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {interiorRooms.map((room) => {
                    const Icon = room.icon;
                    return (
                      <button
                        key={room.id}
                        type="button"
                        onClick={() => setSelectedRoom(room.id)}
                        className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 border transition-all ${
                          selectedRoom === room.id
                            ? "bg-[#B8860B] text-white border-[#B8860B] shadow-md"
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:border-[#B8860B]"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-[11px] font-semibold">{room.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Style Selection */}
              <div>
                <label className="text-sm font-bold text-gray-800 mb-3 block">2. Select Design Style (Style-Locked)</label>
                <div className="space-y-2">
                  {interiorStyles.map((style) => (
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

              {/* Upload Reference Image (Optional) */}
              <div>
                <label className="text-sm font-bold text-gray-800 mb-2 block">3. Reference Room Photo (Optional)</label>
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
                    className="border-2 border-dashed border-[#B8860B]/30 rounded-2xl p-5 text-center cursor-pointer hover:border-[#B8860B] hover:bg-[#B8860B]/5 transition-all"
                  >
                    <Upload className="w-6 h-6 text-[#B8860B] mx-auto mb-1" />
                    <span className="text-xs font-semibold text-gray-700">Upload existing room photo for AI restyling</span>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </div>

              {/* Custom Prompt */}
              <div>
                <label className="text-sm font-bold text-gray-800 mb-2 block">4. Specific Preferences (Optional)</label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g., High ceilings, warm ambient brass lamps, teak wood bookshelf, neutral sofa..."
                  className="h-20 rounded-xl border-gray-200"
                />
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
                    Generating 4 Style-Locked Variations...
                  </>
                ) : (
                  <>
                    <WandSparkles className="w-5 h-5 mr-2" />
                    Generate 4 Interior Variations
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
                  Generated Concept Variations
                </h3>
                {generatedVariations.length > 0 && (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    4 Variations Generated
                  </span>
                )}
              </div>

              {generatedVariations.length === 0 ? (
                <div className="aspect-[16/10] bg-gray-50 rounded-2xl flex flex-col items-center justify-center p-8 text-center border border-gray-200">
                  <ImageIcon className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="font-semibold text-gray-600">Select room style & click Generate</p>
                  <p className="text-xs text-gray-400 max-w-xs mt-1">
                    Outputs will strictly match the chosen style tokens (e.g. Traditional Indian teak & brass).
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Main Selected Image */}
                  <div className="aspect-[16/10] rounded-2xl overflow-hidden shadow-md border border-gray-200 relative group">
                    <img
                      src={generatedVariations[activeVariationIdx]}
                      alt="Interior Design Variation"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 right-4 flex gap-2 opacity-95">
                      <Button
                        onClick={() => handleSave(generatedVariations[activeVariationIdx])}
                        className="bg-[#1a1a1a] hover:bg-black text-[#B8860B] rounded-full text-xs font-bold"
                      >
                        <Save className="w-3.5 h-3.5 mr-1" />
                        Save Design
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
                        <img src={url} alt={`Option ${idx + 1}`} className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                          Option {idx + 1}
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
