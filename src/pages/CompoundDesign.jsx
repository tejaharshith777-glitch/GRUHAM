import { useRef, useState } from "react";
import {
  Car,
  Download,
  Fence,
  Footprints,
  LoaderCircle,
  Rotate3d,
  Save,
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
          const ee = compoundAreas.find((oe) => oe.id === e)?.name || "compound",
            re = compoundStyles.find((oe) => oe.id === n)?.name || n,
            ae = `Professional 3D landscape design visualization for Indian home ${ee}:
Style: ${re}
Plot size: ${o || "2000"} sq ft
${c ? `Requirements: ${c}` : ""}
${P ? `CRITICAL: Apply ALL landscape modifications DIRECTLY on this uploaded plot/compound image. Do NOT create a new image. Edit THIS SAME image - add ${re} landscaping, garden elements, pathways, boundary walls - all changes must be cumulative on the SAME base image to maintain visual coherence and the original plot dimensions.` : ""}

Create a photorealistic render showing:
${e === "garden" ? "- Beautiful lawn, flower beds, Indian plants (hibiscus, jasmine, tulsi), trees, decorative elements" : ""}
${e === "parking" ? "- Covered/open parking for 2 cars, paver blocks, shade structure, drainage" : ""}
${e === "boundary" ? "- Elegant boundary wall design, main gate, secondary gate, intercom, lighting" : ""}
${e === "pathway" ? "- Stone/paver pathways, stepping stones, decorative lighting, planters" : ""}
${e === "sitout" ? "- Outdoor seating, pergola/gazebo, outdoor furniture, plants, evening lighting" : ""}
${e === "complete" ? "- Complete compound with parking, garden, pathways, boundary, sit-out area" : ""}
- Indian residential context
- Natural lighting
- High quality architectural photography, 4K`,
            be = await base44.integrations.Core.GenerateImage({
              prompt: ae,
            });
          j(be.url);
        } catch (ee) {
          console.error("Generation error:", ee);
        }
        S(false);
      }
    },
    G = async () => {
      try {
        (await base44.entities.SavedDesign.create({
          title: `${compoundAreas.find((ee) => ee.id === e)?.name} - ${compoundStyles.find((ee) => ee.id === n)?.name}`,
          design_type: "compound",
          style: n,
          plot_size: o,
          visualization_url: x,
          prompt: c,
        }),
          alert("Design saved!"));
      } catch (ee) {
        console.error("Save error:", ee);
      }
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
            Create beautiful gardens, parking areas, pathways, and compound designs with AI
          </p>
        </motion.div>
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
              <div className="grid grid-cols-2 gap-4">
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
                  <a href={x} download={true} className="flex-1">
                    <Button className="w-full rounded-full bg-[#1a1a1a]">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
