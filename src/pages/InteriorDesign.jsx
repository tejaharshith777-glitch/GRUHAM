import { useRef, useState } from "react";
import {
  Baby,
  Bath,
  Bed,
  Box,
  Download,
  Laptop,
  LoaderCircle,
  Rotate3d,
  Save,
  Sofa,
  Sparkles,
  Upload,
  UtensilsCrossed,
  WandSparkles,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { base44 } from "../lib/base44";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Disclaimer from "@/components/Disclaimer";

const interiorRooms = [
  {
    id: "living",
    name: "Living Room",
    icon: Sofa,
  },
  {
    id: "bedroom",
    name: "Bedroom",
    icon: Bed,
  },
  {
    id: "kitchen",
    name: "Kitchen",
    icon: UtensilsCrossed,
  },
  {
    id: "bathroom",
    name: "Bathroom",
    icon: Bath,
  },
  {
    id: "office",
    name: "Home Office",
    icon: Laptop,
  },
  {
    id: "kids",
    name: "Kids Room",
    icon: Baby,
  },
  {
    id: "dining",
    name: "Dining Room",
    icon: UtensilsCrossed,
  },
  {
    id: "pooja",
    name: "Pooja Room",
    icon: Sparkles,
  },
];
const interiorStyles = [
  {
    id: "modern",
    name: "Modern Minimalist",
  },
  {
    id: "contemporary",
    name: "Contemporary",
  },
  {
    id: "traditional",
    name: "Traditional Indian",
  },
  {
    id: "luxury",
    name: "Luxury",
  },
  {
    id: "scandinavian",
    name: "Scandinavian",
  },
  {
    id: "bohemian",
    name: "Bohemian",
  },
  {
    id: "industrial",
    name: "Industrial",
  },
  {
    id: "rustic",
    name: "Rustic",
  },
  {
    id: "art_deco",
    name: "Art Deco",
  },
  {
    id: "mid_century",
    name: "Mid-Century Modern",
  },
];
const interiorShowcase = [
  {
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=80",
    room: "Living Room",
    style: "Modern",
  },
  {
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&q=80",
    room: "Bedroom",
    style: "Scandinavian",
  },
  {
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",
    room: "Kitchen",
    style: "Contemporary",
  },
  {
    image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&q=80",
    room: "Bathroom",
    style: "Luxury",
  },
  {
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&q=80",
    room: "Living Room",
    style: "Traditional",
  },
  {
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&q=80",
    room: "Bedroom",
    style: "Bohemian",
  },
];
export default function InteriorDesign() {
  const [e, t] = useState(""),
    [n, r] = useState(""),
    [o, l] = useState(""),
    [c, d] = useState(null),
    [h, p] = useState(null),
    [m, y] = useState(false),
    [x, j] = useState(null),
    [_, S] = useState(false),
    [N, w] = useState("2d"),
    [C, E] = useState(0),
    T = useRef(null),
    P = async (A) => {
      const G = A.target.files[0];
      if (G) {
        (y(true), d(URL.createObjectURL(G)));
        try {
          const { file_url: F } = await base44.integrations.Core.UploadFile({
            file: G,
          });
          p(F);
        } catch (F) {
          console.error("Upload error:", F);
        }
        y(false);
      }
    },
    B = async () => {
      if (!(!e || !n)) {
        S(true);
        try {
          const F = interiorRooms.find((ae) => ae.id === e)?.name || e,
            Q = interiorStyles.find((ae) => ae.id === n)?.name || n,
            ee = `Professional interior design 3D visualization of an Indian ${F}:
Style: ${Q}
${o ? `Special requirements: ${o}` : ""}
${h ? `CRITICAL: Apply ALL interior modifications DIRECTLY on this uploaded image. Do NOT create or switch to a new image. Edit THIS SAME image cumulatively - add ${Q} furniture, change wall colors, add decor, modify lighting - all changes must be applied on the SAME base image to maintain consistency and visual coherence. Keep the room's exact dimensions, perspective, and architectural structure intact.` : ""}

Create a photorealistic interior render showing:
- Beautiful ${Q} style furniture and decor
- Proper lighting (natural and artificial)
- Indian context materials and finishes
- Realistic textures and shadows
- Wide angle architectural photography style
- High quality 4K render
${e === "pooja" ? "- Traditional Indian pooja room elements, brass lamps, marble or wooden shelving" : ""}
${e === "kitchen" ? "- Modular kitchen with Indian style stove setup, chimney, storage" : ""}`,
            re = await base44.integrations.Core.GenerateImage({
              prompt: ee,
            });
          j(re.url);
        } catch (F) {
          console.error("Generation error:", F);
        }
        S(false);
      }
    },
    U = async () => {
      try {
        (await base44.entities.SavedDesign.create({
          title: `${interiorRooms.find((F) => F.id === e)?.name} - ${interiorStyles.find((F) => F.id === n)?.name}`,
          design_type: "interior",
          room_type: e,
          style: n,
          visualization_url: x,
          prompt: o,
        }),
          alert("Design saved!"));
      } catch (F) {
        console.error("Save error:", F);
      }
    };
  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 pb-16">
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
            <Sofa className="w-4 h-4 text-[#B8860B]" />
            <span className="text-[#B8860B] font-medium text-sm">Interior Design Studio</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-4">
            Interior Design Studio
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Upload a room photo and see AI concept renders in 6 styles.
            For visualization and planning — not a professional interior design service.
          </p>
        </motion.div>

        {/* Disclaimer */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-8">
          <span className="text-amber-600 text-lg flex-shrink-0">⚠️</span>
          <p className="text-amber-800 text-sm leading-relaxed">
            <strong>Sample concept renders.</strong> AI-generated interior images are for inspiration and planning discussions. They are not professional interior design specifications.
          </p>
        </div>
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
          }}
          className="mb-8"
        >
          <h3 className="font-serif text-lg font-bold text-[#1a1a1a] mb-4 text-center">
            Select Room Type
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {interiorRooms.map((A) => (
              <button
                key={A.id}
                onClick={() => t(A.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full transition-all ${e === A.id ? "bg-[#B8860B] text-white shadow-lg" : "bg-white text-gray-700 hover:bg-[#B8860B]/10"}`}
              >
                <A.icon className="w-4 h-4" />
                {A.name}
              </button>
            ))}
          </div>
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
            className="space-y-6"
          >
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <h3 className="font-serif text-lg font-bold text-[#1a1a1a] mb-4">
                Upload Existing Room (Optional)
              </h3>
              {c ? (
                <div className="relative">
                  <img src={c} alt="Uploaded" className="w-full h-48 object-cover rounded-2xl" />
                  {m && (
                    <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                      <LoaderCircle className="w-8 h-8 text-white animate-spin" />
                    </div>
                  )}
                  <button
                    onClick={() => {
                      (d(null), p(null));
                    }}
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
                  className="border-2 border-dashed border-[#B8860B]/30 rounded-2xl p-8 text-center cursor-pointer hover:border-[#B8860B] transition-all"
                >
                  <Upload className="w-10 h-10 text-[#B8860B] mx-auto mb-3" />
                  <p className="text-gray-600">Upload a photo to redesign</p>
                </div>
              )}
              <input ref={T} type="file" accept="image/*" onChange={P} className="hidden" />
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-lg space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Design Style</label>
                <Select value={n} onValueChange={r}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Choose style" />
                  </SelectTrigger>
                  <SelectContent>
                    {interiorStyles.map((A) => (
                      <SelectItem key={A.id} value={A.id}>
                        {A.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Additional Requirements
                </label>
                <Textarea
                  value={o}
                  onChange={(A) => l(A.target.value)}
                  placeholder="E.g., L-shaped sofa, wooden flooring, warm lighting, TV unit with storage, indoor plants..."
                  className="h-24"
                />
              </div>
            </div>
            <Button
              onClick={B}
              disabled={!e || !n || _}
              className="w-full h-14 bg-gradient-to-r from-[#B8860B] to-[#D4A84B] text-white rounded-full font-semibold text-lg shadow-lg"
            >
              {_ ? (
                <>
                  <LoaderCircle className="w-5 h-5 mr-2 animate-spin" />
                  Designing...
                </>
              ) : (
                <>
                  <WandSparkles className="w-5 h-5 mr-2" />
                  Generate Interior Design
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
                    <p className="text-gray-500">Creating your design...</p>
                  </div>
                ) : x ? (
                  N === "2d" ? (
                    <img src={x} alt="Design" className="w-full h-full object-cover" />
                  ) : (
                    <div
                      className="w-full h-full relative"
                      style={{
                        perspective: "1000px",
                      }}
                    >
                      <motion.img
                        src={x}
                        alt="3D View"
                        className="w-full h-full object-cover"
                        style={{
                          transform: `rotateY(${C}deg)`,
                          transformStyle: "preserve-3d",
                        }}
                        animate={{
                          rotateY: C,
                        }}
                      />
                      <div className="absolute top-3 left-3 bg-[#B8860B] text-white px-3 py-1 rounded-full text-xs">
                        <Box className="w-3 h-3 inline mr-1" />
                        3D View
                      </div>
                    </div>
                  )
                ) : (
                  <div className="text-center text-gray-400">
                    <Sofa className="w-12 h-12 mx-auto mb-2 opacity-50" />
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
                    onClick={() => E((A) => A - 30)}
                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#B8860B] hover:text-white"
                  >
                    <Rotate3d className="w-5 h-5 -scale-x-100" />
                  </button>
                  <button
                    onClick={() => E((A) => A + 30)}
                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#B8860B] hover:text-white"
                  >
                    <Rotate3d className="w-5 h-5" />
                  </button>
                </div>
              )}
              {x && (
                <div className="flex gap-3 mt-4">
                  <Button
                    onClick={U}
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
                    onClick={() => window.open(`https://wa.me/?text=Check out my interior design concept from Gruham!`, "_blank")}
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
                    <strong>Requested:</strong> {n} style interior for {e} {o ? `with ${o}` : ""}.
                  </p>
                  
                  <h5 className="font-medium text-[#1a1a1a] mb-2">Indicative Finish Costs (₹/sq ft):</h5>
                  <ul className="space-y-1 text-gray-600 mb-4">
                    <li>• Standard: ₹1,500 – ₹1,800</li>
                    <li>• Premium: ₹2,000 – ₹2,500</li>
                    <li>• Luxury: ₹3,000+</li>
                  </ul>
                  
                  <h5 className="font-medium text-[#1a1a1a] mb-2">What a Real Quote Must Include:</h5>
                  <ul className="space-y-1 text-gray-600">
                    <li>✓ 2D layout with furniture placement</li>
                    <li>✓ False ceiling & electrical drawing</li>
                    <li>✓ Itemised woodwork & hardware brands</li>
                    <li>✓ Material specifications (plywood grade, laminate thickness)</li>
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
            Get Inspired - Sample Designs
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {interiorShowcase.map((A, G) => (
              <motion.div
                key={G}
                whileHover={{
                  scale: 1.05,
                }}
                className="relative rounded-2xl overflow-hidden group cursor-pointer"
              >
                <img src={A.image} alt={A.room} className="w-full h-40 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                  <p className="text-white text-sm font-medium">{A.room}</p>
                  <p className="text-white/70 text-xs">{A.style}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
