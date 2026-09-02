import { useRef, useState, useMemo } from "react";
import {
  Box,
  Building,
  CheckCircle2,
  Compass,
  Download,
  FileText,
  House,
  Info,
  Maximize2,
  Minus,
  Plus,
  RefreshCw,
  Ruler,
  Save,
  Share2,
  Sparkles,
  WandSparkles,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { base44 } from "../lib/base44";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Disclaimer from "@/components/Disclaimer";
import { generateFloorPlan, renderFloorPlanSVG, svgToBlob } from "../lib/floorplan";

const plotShapes = ["Rectangular", "L-Shaped", "Corner Plot"];
const bhkOptions = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5 BHK"];
const bathOptions = ["1", "2", "3", "4", "5"];
const floorOptions = ["Ground Only (G+0)", "G+1", "G+2", "Duplex", "Triplex"];
const facingOptions = [
  { id: "N", label: "North (Auspicious)" },
  { id: "E", label: "East (Sunrise)" },
  { id: "S", label: "South (Balancing)" },
  { id: "W", label: "West (Sunset)" },
];
const layoutStyles = [
  { id: "traditional", name: "Traditional Vastu", desc: "Zoned by Vastu purusha mandala" },
  { id: "open_plan", name: "Open-Plan Modern", desc: "Spacious connected living & dining" },
  { id: "courtyard", name: "Courtyard (Angan)", desc: "Central open garden space" },
  { id: "luxury", name: "Luxury Villa", desc: "Generous rooms & attached baths" },
];

export default function BlueprintGenerator() {
  // Input States
  const [plotLength, setPlotLength] = useState("40");
  const [plotWidth, setPlotWidth] = useState("50");
  const [plotShape, setPlotShape] = useState("Rectangular");
  const [bhk, setBhk] = useState("3 BHK");
  const [baths, setBaths] = useState("2");
  const [floors, setFloors] = useState("G+1");
  const [facing, setFacing] = useState("N");
  const [layoutStyle, setLayoutStyle] = useState("traditional");
  const [vastuEnabled, setVastuEnabled] = useState(true);
  const [hasParking, setHasParking] = useState(true);

  // Zoom & Pan States for 2D Blueprint Viewer
  const [zoomScale, setZoomScale] = useState(1);
  const [toast, setToast] = useState("");

  // AI Render States
  const [aiElevationUrl, setAiElevationUrl] = useState(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiStatus, setAiStatus] = useState("");

  // Compute 2D Floor Plan Data dynamically
  const planData = useMemo(() => {
    return generateFloorPlan({
      plotL: parseFloat(plotLength) || 40,
      plotW: parseFloat(plotWidth) || 50,
      plotShape,
      facing,
      floors: floors === "Ground Only (G+0)" ? 1 : parseInt(floors.replace(/[^0-9]/g, "")) || 2,
      bhk: parseInt(bhk) || 3,
      baths: parseInt(baths) || 2,
      layoutStyle,
      parking: hasParking,
    });
  }, [plotLength, plotWidth, plotShape, facing, floors, bhk, baths, layoutStyle, hasParking]);

  // Generate SVG string
  const svgContent = useMemo(() => {
    if (planData?.error) return "";
    return renderFloorPlanSVG(planData, 650, 500);
  }, [planData]);

  // Save Design Action
  const handleSave = async () => {
    try {
      const designTitle = `${bhk} ${layoutStyles.find(s => s.id === layoutStyle)?.name || "Modern"} (${plotLength}' × ${plotWidth}' ${plotShape})`;
      
      const newDesign = {
        id: "blueprint_" + Date.now(),
        title: designTitle,
        design_type: "blueprint",
        style: layoutStyle,
        bhk,
        floors,
        plot_size: `${plotLength}x${plotWidth} ft`,
        blueprint_svg: svgContent,
        visualization_url: aiElevationUrl,
        created_at: new Date().toISOString(),
      };

      // Persist in localStorage & base44 entity
      const existing = JSON.parse(localStorage.getItem("gruham_saved_designs") || "[]");
      localStorage.setItem("gruham_saved_designs", JSON.stringify([newDesign, ...existing]));

      try {
        await base44.entities.SavedDesign.create({
          title: designTitle,
          design_type: "blueprint",
          style: layoutStyle,
          bhk,
          floors: floors === "Ground Only (G+0)" ? 1 : 2,
          plot_size: `${plotLength}x${plotWidth}`,
          prompt: `${plotShape} plot, ${facing} facing`,
        });
      } catch (err) {
        console.log("Local saved, remote sync notice:", err);
      }

      setToast("Blueprint saved to 'My Designs'!");
      setTimeout(() => setToast(""), 3500);
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  // Download SVG
  const handleDownloadSVG = () => {
    if (!svgContent) return;
    const blob = svgToBlob(svgContent);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gruham-blueprint-${bhk.replace(/\s+/g, "")}-${plotLength}x${plotWidth}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Download PNG via Canvas
  const handleDownloadPNG = () => {
    if (!svgContent) return;
    const blob = svgToBlob(svgContent);
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1300;
      canvas.height = 1000;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const pngUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = `gruham-blueprint-${bhk.replace(/\s+/g, "")}-${plotLength}x${plotWidth}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  // Generate 3D/AI Elevation Render
  const handleGenerateAiElevation = async () => {
    setIsGeneratingAi(true);
    setAiStatus("Generating architectural 3D exterior elevation...");
    try {
      const promptText = `Photorealistic Indian exterior home elevation render, ${bhk} ${floors} ${layoutStyle} style, plot ${plotLength}x${plotWidth} ft ${plotShape}, ${facing} facing, beautiful front entrance, balconies, landscaped yard, warm lighting.`;
      const res = await base44.integrations.Core.GenerateImage({ prompt: promptText });
      if (res?.url) {
        setAiElevationUrl(res.url);
      }
    } catch (err) {
      console.error("AI Elevation generation error:", err);
    }
    setIsGeneratingAi(false);
    setAiStatus("");
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-[#B8860B]/10 rounded-full px-4 py-2 mb-4">
            <Ruler className="w-4 h-4 text-[#B8860B]" />
            <span className="text-[#B8860B] font-semibold text-sm">Architectural Blueprint Studio</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-3">
            Interactive 2D Blueprint Engine
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Design fully dimensioned, to-scale architectural floor plans tailored to Indian plots & Vastu principles.
          </p>
        </motion.div>

        {/* Main Grid: Controls on Left, Blueprint & Norms on Right */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Input Configuration Form (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 space-y-5">
              <h2 className="font-serif text-xl font-bold text-[#1a1a1a] flex items-center gap-2 pb-2 border-b border-gray-100">
                <Building className="w-5 h-5 text-[#B8860B]" />
                Plot & House Parameters
              </h2>

              {/* Plot Shape & Dimensions */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Plot Shape</label>
                <div className="grid grid-cols-3 gap-2">
                  {plotShapes.map((shape) => (
                    <button
                      key={shape}
                      type="button"
                      onClick={() => setPlotShape(shape)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        plotShape === shape
                          ? "bg-[#B8860B] text-white border-[#B8860B] shadow-md"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:border-[#B8860B]"
                      }`}
                    >
                      {shape}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dimensions Input */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Length (ft)</label>
                  <Input
                    type="number"
                    value={plotLength}
                    onChange={(e) => setPlotLength(e.target.value)}
                    className="rounded-xl border-gray-200 focus:ring-[#B8860B]"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Width (ft)</label>
                  <Input
                    type="number"
                    value={plotWidth}
                    onChange={(e) => setPlotWidth(e.target.value)}
                    className="rounded-xl border-gray-200 focus:ring-[#B8860B]"
                  />
                </div>
              </div>

              {/* BHK & Baths */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">BHK Configuration</label>
                  <Select value={bhk} onValueChange={setBhk}>
                    <SelectTrigger className="rounded-xl border-gray-200">
                      <SelectValue placeholder="Select BHK" />
                    </SelectTrigger>
                    <SelectContent>
                      {bhkOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Bathrooms</label>
                  <Select value={baths} onValueChange={setBaths}>
                    <SelectTrigger className="rounded-xl border-gray-200">
                      <SelectValue placeholder="Select Baths" />
                    </SelectTrigger>
                    <SelectContent>
                      {bathOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt} Baths</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Floors & Facing */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Number of Floors</label>
                  <Select value={floors} onValueChange={setFloors}>
                    <SelectTrigger className="rounded-xl border-gray-200">
                      <SelectValue placeholder="Select Floors" />
                    </SelectTrigger>
                    <SelectContent>
                      {floorOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Facing Direction</label>
                  <Select value={facing} onValueChange={setFacing}>
                    <SelectTrigger className="rounded-xl border-gray-200">
                      <SelectValue placeholder="Select Facing" />
                    </SelectTrigger>
                    <SelectContent>
                      {facingOptions.map((opt) => (
                        <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Layout Style */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Architectural Layout Style</label>
                <div className="grid grid-cols-2 gap-2">
                  {layoutStyles.map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setLayoutStyle(style.id)}
                      className={`p-3 rounded-2xl text-left border transition-all ${
                        layoutStyle === style.id
                          ? "bg-[#1a1a1a] text-white border-[#1a1a1a] shadow-lg"
                          : "bg-gray-50 text-gray-800 border-gray-200 hover:border-[#B8860B]"
                      }`}
                    >
                      <div className="font-semibold text-xs mb-0.5">{style.name}</div>
                      <div className="text-[10px] opacity-75">{style.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-2 space-y-2 border-t border-gray-100">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={vastuEnabled}
                    onChange={(e) => setVastuEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-[#B8860B] focus:ring-[#B8860B]"
                  />
                  <span className="text-xs font-semibold text-gray-700">Enforce Vastu Purusha Mandala Placement</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasParking}
                    onChange={(e) => setHasParking(e.target.checked)}
                    className="w-4 h-4 rounded text-[#B8860B] focus:ring-[#B8860B]"
                  />
                  <span className="text-xs font-semibold text-gray-700">Include Car Parking / Garage Slot</span>
                </label>
              </div>

              {/* Generate 3D Concept Action */}
              <Button
                onClick={handleGenerateAiElevation}
                disabled={isGeneratingAi}
                className="w-full h-12 bg-gradient-to-r from-[#B8860B] to-[#D4A84B] hover:from-[#D4A84B] hover:to-[#B8860B] text-white rounded-full font-bold text-sm shadow-md"
              >
                {isGeneratingAi ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating 3D Elevation Render...
                  </>
                ) : (
                  <>
                    <WandSparkles className="w-4 h-4 mr-2" />
                    Generate AI 3D Elevation Render
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Interactive SVG Blueprint Viewer + Norms Checklist (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 space-y-6"
          >
            {/* SVG Viewer Container */}
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#B8860B]" />
                  <h3 className="font-serif text-lg font-bold text-[#1a1a1a]">To-Scale 2D Floor Plan</h3>
                </div>

                {/* Zoom & Action Controls */}
                <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
                  <button
                    onClick={() => setZoomScale((z) => Math.max(0.7, z - 0.15))}
                    className="p-1.5 rounded-full hover:bg-white text-gray-700 transition-colors"
                    title="Zoom Out"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono font-bold px-2 text-gray-700">{Math.round(zoomScale * 100)}%</span>
                  <button
                    onClick={() => setZoomScale((z) => Math.min(1.8, z + 0.15))}
                    className="p-1.5 rounded-full hover:bg-white text-gray-700 transition-colors"
                    title="Zoom In"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setZoomScale(1)}
                    className="p-1 rounded-full hover:bg-white text-gray-700 text-xs px-2"
                    title="Reset Zoom"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Blueprint Display Viewport */}
              <div className="w-full bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden relative flex items-center justify-center p-4 min-h-[420px]">
                {planData?.error ? (
                  <div className="p-8 text-center text-amber-800 bg-amber-50 rounded-xl border border-amber-200 max-w-md">
                    <Info className="w-10 h-10 mx-auto mb-2 text-amber-600" />
                    <p className="font-semibold text-sm mb-1">{planData.error}</p>
                    <p className="text-xs text-amber-700">Please increase plot dimensions or select a smaller BHK count.</p>
                  </div>
                ) : (
                  <div
                    className="transition-transform duration-200 ease-out origin-center w-full flex items-center justify-center"
                    style={{ transform: `scale(${zoomScale})` }}
                    dangerouslySetInnerHTML={{ __html: svgContent }}
                  />
                )}
              </div>

              {/* Download & Save Action Bar */}
              {!planData?.error && (
                <div className="flex flex-wrap gap-3 mt-5 pt-4 border-t border-gray-100">
                  <Button
                    onClick={handleSave}
                    variant="outline"
                    className="flex-1 rounded-full border-[#B8860B] text-[#B8860B] hover:bg-[#B8860B] hover:text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Blueprint
                  </Button>

                  <Button
                    onClick={handleDownloadPNG}
                    variant="outline"
                    className="flex-1 rounded-full border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PNG
                  </Button>

                  <Button
                    onClick={handleDownloadSVG}
                    variant="outline"
                    className="flex-1 rounded-full border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Download SVG
                  </Button>
                </div>
              )}
            </div>

            {/* AI 3D Elevation Render Preview (if generated) */}
            {aiElevationUrl && (
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
                <h3 className="font-serif text-lg font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#B8860B]" />
                  AI 3D Elevation Concept
                </h3>
                <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-inner border border-gray-200">
                  <img src={aiElevationUrl} alt="3D Elevation Concept" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            {/* Architectural Norms Compliance Card */}
            {planData?.compliance?.length > 0 && (
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 space-y-3">
                <h3 className="font-serif text-lg font-bold text-[#1a1a1a] flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Architectural Code & Norm Compliance
                </h3>
                <div className="space-y-2">
                  {planData.compliance.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 text-xs">
                      <span className={`px-2 py-0.5 rounded font-bold ${item.pass ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                        {item.pass ? "PASS" : "WARN"}
                      </span>
                      <div>
                        <div className="font-semibold text-gray-900">{item.rule}</div>
                        <div className="text-gray-600 mt-0.5">{item.note}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vastu Guidance Accordion */}
            {planData?.vastuNotes && (
              <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 text-xs text-amber-900 space-y-2">
                <div className="font-bold text-sm text-amber-950 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#B8860B]" />
                  Vastu Shastra Alignment Summary
                </div>
                <p className="leading-relaxed">{planData.vastuNotes.facing}</p>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}
