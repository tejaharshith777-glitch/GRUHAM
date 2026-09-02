import { useState, useMemo } from "react";
import {
  ArrowRight,
  Building,
  Check,
  ChevronRight,
  Compass,
  Fence,
  Filter,
  Grid,
  Heart,
  House,
  IndianRupee,
  Info,
  Layers,
  Maximize2,
  Phone,
  Ruler,
  Search,
  Share2,
  SlidersHorizontal,
  Sparkles,
  TreePine,
  WandSparkles,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { base44 } from "../lib/base44";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Disclaimer from "@/components/Disclaimer";
import { createPageUrl } from "../lib/utils";

// ─── Unique Property & House Design Catalog Database ──────────────────────────
const HOUSE_CATALOG = [
  {
    id: "h_101",
    title: "Chettinad Heritage Courtyard Villa",
    category: "Traditional Courtyard",
    bhk: 4,
    floors: "G+1",
    sqft: 2800,
    priceEst: "₹85 - 95 Lakhs",
    facing: "East",
    style: "traditional_indian",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1280&q=75&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1280&q=75&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1280&q=75&auto=format&fit=crop"
    ],
    description: "Classic South Indian Chettinad architecture featuring a central thotti courtyard, Athangudi tiled corridors, hand-carved teakwood pillars, and terracotta sloped rooflines.",
    specs: { livingSqft: 450, masterBedSqft: 220, kitchenType: "Traditional + Utility", parking: "2 Cars" }
  },
  {
    id: "h_102",
    title: "Ultra-Modern Glass & Concrete Villa",
    category: "Luxury Villa",
    bhk: 4,
    floors: "G+2",
    sqft: 3600,
    priceEst: "₹1.4 - 1.6 Crore",
    facing: "North",
    style: "modern",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1280&q=75&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1280&q=75&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1280&q=75&auto=format&fit=crop"
    ],
    description: "Minimalist luxury home with cantilevered balconies, double-height living room glass walls, Italian marble flooring, and smart automation integration.",
    specs: { livingSqft: 520, masterBedSqft: 280, kitchenType: "Island Modular", parking: "3 Cars" }
  },
  {
    id: "h_103",
    title: "Kerala Nalukettu Vernacular Residence",
    category: "Traditional Courtyard",
    bhk: 3,
    floors: "G+1",
    sqft: 2200,
    priceEst: "₹65 - 75 Lakhs",
    facing: "East",
    style: "south_indian",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1280&q=75&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1280&q=75&auto=format&fit=crop"
    ],
    description: "Authentic Kerala Nalukettu home with four wings around a central open-to-sky quadrangle, gabled roof timbering, and extensive brass lamp accents.",
    specs: { livingSqft: 380, masterBedSqft: 200, kitchenType: "Open Modular", parking: "2 Cars" }
  },
  {
    id: "h_104",
    title: "Contemporary Urban Duplex",
    category: "Duplex",
    bhk: 3,
    floors: "G+1",
    sqft: 1950,
    priceEst: "₹55 - 65 Lakhs",
    facing: "North",
    style: "contemporary",
    images: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1280&q=75&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1280&q=75&auto=format&fit=crop"
    ],
    description: "Compact duplex designed for 30x40 urban plots. Maximizes vertical volume with floating staircase, terrace garden, and private office.",
    specs: { livingSqft: 340, masterBedSqft: 180, kitchenType: "Parallel Modular", parking: "1 Car" }
  },
  {
    id: "h_105",
    title: "Rajasthani Haveli Style Bungalow",
    category: "Traditional Courtyard",
    bhk: 5,
    floors: "G+2",
    sqft: 4200,
    priceEst: "₹1.8 - 2.2 Crore",
    facing: "East",
    style: "traditional_indian",
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1280&q=75&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1280&q=75&auto=format&fit=crop"
    ],
    description: "Grand North Indian Haveli with sandstone Jharokha stone carving, arched porticos, marble courtyards, and grand master suite.",
    specs: { livingSqft: 650, masterBedSqft: 320, kitchenType: "Chef's Kitchen", parking: "3 Cars" }
  },
  {
    id: "h_106",
    title: "Compact 2BHK Modern Budget Home",
    category: "Modern Home",
    bhk: 2,
    floors: "G+0",
    sqft: 1250,
    priceEst: "₹32 - 38 Lakhs",
    facing: "West",
    style: "minimalist",
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1280&q=75&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1280&q=75&auto=format&fit=crop"
    ],
    description: "Highly efficient single-storey home design for small families. Open living-dining flow with minimal corridor wastage.",
    specs: { livingSqft: 280, masterBedSqft: 150, kitchenType: "Straight Modular", parking: "1 Car" }
  },
];

export default function CompoundDesign() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBhk, setSelectedBhk] = useState("All");
  const [selectedStyle, setSelectedStyle] = useState("All");
  const [maxBudget, setMaxBudget] = useState(250); // Lakhs
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [toast, setToast] = useState("");

  // AI Compound / Boundary Wall Generator State
  const [wallStyle, setWallStyle] = useState("traditional_indian");
  const [wallPrompt, setWallPrompt] = useState("");
  const [isGeneratingWall, setIsGeneratingWall] = useState(false);
  const [generatedWallImages, setGeneratedWallImages] = useState([]);

  // Filter Catalog
  const filteredCatalog = useMemo(() => {
    return HOUSE_CATALOG.filter((house) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = house.title.toLowerCase().includes(q);
        const matchesDesc = house.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc) return false;
      }
      if (selectedCategory !== "All" && house.category !== selectedCategory) return false;
      if (selectedBhk !== "All" && house.bhk !== parseInt(selectedBhk)) return false;
      if (selectedStyle !== "All" && house.style !== selectedStyle) return false;
      return true;
    });
  }, [searchQuery, selectedCategory, selectedBhk, selectedStyle]);

  // Generate Unique Boundary Wall & Compound Concept
  const handleGenerateCompoundWall = async () => {
    setIsGeneratingWall(true);
    try {
      const fullPrompt = `Architectural boundary wall, compound gate, and landscaping design for an Indian house, ${wallStyle} style. ${wallPrompt}. High quality photorealistic rendering.`;
      
      const { urls } = await base44.integrations.Core.GenerateImageVariations({
        prompt: fullPrompt,
        styleToken: wallStyle,
        count: 3,
      });

      setGeneratedWallImages(urls || []);
    } catch (err) {
      console.error("Wall generation error:", err);
    }
    setIsGeneratingWall(false);
  };

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    setInquiryModalOpen(false);
    setToast("Inquiry sent to verified builder team!");
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
            <Building className="w-4 h-4 text-[#B8860B]" />
            <span className="text-[#B8860B] font-semibold text-sm">House & Villa Design Catalog</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-3">
            Indian House Catalog & Compound Designs
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Browse verified Indian house designs with complete specifications, image galleries, and customized estimates.
          </p>
        </motion.div>

        {/* SEARCH & FILTERS BAR */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 mb-10 space-y-4">
          <div className="grid md:grid-cols-12 gap-4 items-center">
            {/* Search Input (5 cols) */}
            <div className="md:col-span-5 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search house style, BHK, Chettinad, Kerala, Villa..."
                className="pl-11 rounded-2xl h-12 border-gray-200"
              />
            </div>

            {/* Category Dropdown */}
            <div className="md:col-span-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="rounded-2xl h-12 border-gray-200">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  <SelectItem value="Traditional Courtyard">Traditional Courtyard</SelectItem>
                  <SelectItem value="Luxury Villa">Luxury Villa</SelectItem>
                  <SelectItem value="Duplex">Duplex Homes</SelectItem>
                  <SelectItem value="Modern Home">Modern Homes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* BHK Dropdown */}
            <div className="md:col-span-2">
              <Select value={selectedBhk} onValueChange={setSelectedBhk}>
                <SelectTrigger className="rounded-2xl h-12 border-gray-200">
                  <SelectValue placeholder="BHK" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All BHK</SelectItem>
                  <SelectItem value="2">2 BHK</SelectItem>
                  <SelectItem value="3">3 BHK</SelectItem>
                  <SelectItem value="4">4 BHK</SelectItem>
                  <SelectItem value="5">5 BHK</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Style Dropdown */}
            <div className="md:col-span-2">
              <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                <SelectTrigger className="rounded-2xl h-12 border-gray-200">
                  <SelectValue placeholder="Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Styles</SelectItem>
                  <SelectItem value="traditional_indian">Traditional Indian</SelectItem>
                  <SelectItem value="south_indian">South Indian / Kerala</SelectItem>
                  <SelectItem value="modern">Modern Minimalist</SelectItem>
                  <SelectItem value="contemporary">Contemporary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* HOUSE CATALOG GRID */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-bold text-[#1a1a1a]">
              Available Designs ({filteredCatalog.length})
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCatalog.map((house) => (
              <motion.div
                key={house.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 flex flex-col group"
              >
                {/* Image Preview Container */}
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img
                    src={house.images[0]}
                    alt={house.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#1a1a1a]/80 text-[#B8860B] backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-[#B8860B]/30">
                    {house.category}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono font-bold">
                    {house.sqft} sq ft
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#1a1a1a] mb-2 group-hover:text-[#B8860B] transition-colors">
                      {house.title}
                    </h3>
                    <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">
                      {house.description}
                    </p>
                  </div>

                  {/* Badges */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-100 text-center text-xs">
                    <div>
                      <span className="text-gray-400 block text-[10px]">BHK</span>
                      <span className="font-bold text-gray-900">{house.bhk} BHK</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">FLOORS</span>
                      <span className="font-bold text-gray-900">{house.floors}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">EST. COST</span>
                      <span className="font-bold text-[#B8860B]">{house.priceEst}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setSelectedHouse(house)}
                      className="flex-1 rounded-full bg-[#1a1a1a] hover:bg-black text-white text-xs font-bold py-2.5"
                    >
                      View Details & Gallery
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI COMPOUND & BOUNDARY WALL STUDIO SECTION */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 space-y-6">
          <div className="flex items-center gap-3">
            <Fence className="w-7 h-7 text-[#B8860B]" />
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#1a1a1a]">AI Compound & Boundary Wall Generator</h2>
              <p className="text-gray-600 text-sm">Generate distinct compound gates, boundary walls, and front garden landscapes.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-4">
              <label className="text-xs font-bold text-gray-700 mb-1 block">Compound Style</label>
              <Select value={wallStyle} onValueChange={setWallStyle}>
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue placeholder="Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="traditional_indian">Traditional Indian Teak & Stone</SelectItem>
                  <SelectItem value="south_indian">South Indian Chettinad Pillars</SelectItem>
                  <SelectItem value="modern">Modern Minimalist Concrete & Steel</SelectItem>
                  <SelectItem value="luxury">Luxury Villa Landscaping & Gate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-5">
              <label className="text-xs font-bold text-gray-700 mb-1 block">Custom Notes</label>
              <Input
                value={wallPrompt}
                onChange={(e) => setWallPrompt(e.target.value)}
                placeholder="E.g., Automated sliding gate, warm pillar lanterns, flower beds..."
                className="rounded-xl border-gray-200"
              />
            </div>

            <div className="md:col-span-3">
              <Button
                onClick={handleGenerateCompoundWall}
                disabled={isGeneratingWall}
                className="w-full h-10 bg-[#B8860B] hover:bg-[#997320] text-white rounded-full font-bold text-xs shadow-md"
              >
                {isGeneratingWall ? "Generating..." : "Generate Compound Concept"}
              </Button>
            </div>
          </div>

          {/* Wall Renders Grid */}
          {generatedWallImages.length > 0 && (
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              {generatedWallImages.map((url, i) => (
                <div key={i} className="aspect-[16/10] rounded-2xl overflow-hidden shadow border border-gray-200">
                  <img src={url} alt={`Compound ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* HOUSE DETAIL MODAL */}
      <AnimatePresence>
        {selectedHouse && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 relative shadow-2xl"
            >
              <button
                onClick={() => setSelectedHouse(null)}
                className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>

              <div>
                <span className="text-xs font-bold text-[#B8860B] uppercase tracking-wider">{selectedHouse.category}</span>
                <h2 className="font-serif text-3xl font-bold text-[#1a1a1a] mt-1">{selectedHouse.title}</h2>
              </div>

              {/* Image Gallery */}
              <div className="grid grid-cols-2 gap-3">
                {selectedHouse.images.map((img, idx) => (
                  <div key={idx} className="aspect-[16/10] rounded-2xl overflow-hidden border border-gray-200">
                    <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>

              {/* Specs & Description */}
              <div className="space-y-3">
                <p className="text-gray-700 text-sm leading-relaxed">{selectedHouse.description}</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-amber-50/60 p-4 rounded-2xl border border-amber-200/50 text-xs">
                  <div>
                    <span className="text-gray-500 block">Living Room</span>
                    <span className="font-bold text-gray-900">{selectedHouse.specs.livingSqft} sq ft</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Master Suite</span>
                    <span className="font-bold text-gray-900">{selectedHouse.specs.masterBedSqft} sq ft</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Kitchen</span>
                    <span className="font-bold text-gray-900">{selectedHouse.specs.kitchenType}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Garage</span>
                    <span className="font-bold text-gray-900">{selectedHouse.specs.parking}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                <Button
                  onClick={() => {
                    setSelectedHouse(null);
                    navigate(createPageUrl("BlueprintGenerator"));
                  }}
                  className="flex-1 rounded-full bg-[#B8860B] hover:bg-[#997320] text-white font-bold text-xs h-12"
                >
                  <Ruler className="w-4 h-4 mr-2" />
                  Customize in Blueprint Generator
                </Button>
                <Button
                  onClick={() => setInquiryModalOpen(true)}
                  className="flex-1 rounded-full bg-[#1a1a1a] hover:bg-black text-white font-bold text-xs h-12"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Get a Quote / Contact Builder
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* INQUIRY MODAL */}
      <AnimatePresence>
        {inquiryModalOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 relative shadow-2xl"
            >
              <button
                onClick={() => setInquiryModalOpen(false)}
                className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
              >
                <X className="w-4 h-4 text-gray-700" />
              </button>

              <h3 className="font-serif text-xl font-bold text-[#1a1a1a]">Request Quote & Floor Plan</h3>
              <p className="text-xs text-gray-600">Connect with local verified builders for {selectedHouse?.title}.</p>

              <form onSubmit={handleInquirySubmit} className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">Your Name</label>
                  <Input required placeholder="E.g., Ananya Rao" className="rounded-xl border-gray-200" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">Phone Number</label>
                  <Input required placeholder="+91 98765 43210" className="rounded-xl border-gray-200" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">City / Location</label>
                  <Input required placeholder="E.g., Bengaluru" className="rounded-xl border-gray-200" />
                </div>
                <Button type="submit" className="w-full h-12 bg-[#B8860B] hover:bg-[#997320] text-white rounded-full font-bold text-xs mt-2">
                  Submit Inquiry
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
