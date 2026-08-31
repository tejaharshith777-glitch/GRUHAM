import { useRef, useState } from "react";
import {
  Box,
  Download,
  Eye,
  Image,
  LoaderCircle,
  RefreshCw,
  Rotate3d,
  Sparkles,
  Upload,
  WandSparkles,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "../lib/base44";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
                {h && (
                  <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
                    <button
                      onClick={() => S("2d")}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${_ === "2d" ? "bg-[#B8860B] text-white" : "text-gray-600 hover:text-[#B8860B]"}`}
                    >
                      <Eye className="w-4 h-4" />
                      2D
                    </button>
                    <button
                      onClick={() => S("3d")}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${_ === "3d" ? "bg-[#B8860B] text-white" : "text-gray-600 hover:text-[#B8860B]"}`}
                    >
                      <Box className="w-4 h-4" />
                      3D
                    </button>
                  </div>
                )}
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
                      {_ === "2d" ? (
                        <img
                          src={h}
                          alt="Generated design"
                          className="w-full h-auto rounded-2xl shadow-lg"
                        />
                      ) : (
                        <div className="relative">
                          <div
                            className="w-full aspect-[4/3] rounded-2xl shadow-lg overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 relative"
                            style={{
                              perspective: "1000px",
                            }}
                          >
                            <motion.div
                              className="w-full h-full relative"
                              style={{
                                transformStyle: "preserve-3d",
                                transform: `rotateY(${N}deg) rotateX(10deg)`,
                              }}
                              animate={{
                                rotateY: N,
                              }}
                              transition={{
                                duration: 0.5,
                              }}
                            >
                              <img
                                src={h}
                                alt="3D View"
                                className="w-full h-full object-cover"
                                style={{
                                  transform: "translateZ(50px)",
                                  boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
                                }}
                              />
                            </motion.div>
                            <div className="absolute inset-0 pointer-events-none opacity-20">
                              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#B8860B]/30 to-transparent" />
                            </div>
                            <div className="absolute top-4 left-4 bg-[#B8860B] text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                              <Box className="w-4 h-4" />
                              3D View
                            </div>
                          </div>
                          <div className="flex items-center justify-center gap-4 mt-4">
                            <button
                              onClick={() => w((B) => B - 30)}
                              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#B8860B] hover:text-white transition-colors"
                            >
                              <Rotate3d className="w-5 h-5 transform -scale-x-100" />
                            </button>
                            <span className="text-sm text-gray-500">Rotate View</span>
                            <button
                              onClick={() => w((B) => B + 30)}
                              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#B8860B] hover:text-white transition-colors"
                            >
                              <Rotate3d className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="flex justify-center gap-2 mt-3">
                            {[0, 45, 90, -45, -90].map((B) => (
                              <button
                                key={B}
                                onClick={() => w(B)}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${N === B ? "bg-[#B8860B] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                              >
                                {B === 0
                                  ? "Front"
                                  : B === 45
                                    ? "Right 45°"
                                    : B === 90
                                      ? "Right"
                                      : B === -45
                                        ? "Left 45°"
                                        : "Left"}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
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
      </div>
    </div>
  );
}
