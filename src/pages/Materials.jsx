import { useState } from "react";
import {
  Calculator,
  IndianRupee,
  LoaderCircle,
  MapPin,
  Package,
  Search,
} from "lucide-react";
import { motion } from "framer-motion";
import { base44 } from "../lib/base44";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const materials = [
  {
    id: 1,
    name: "OPC Cement (53 Grade)",
    category: "Structural",
    unit: "per bag (50kg)",
    image: "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=400&q=80",
    cityPrices: {
      Mumbai: 380,
      Delhi: 360,
      Bangalore: 370,
      Chennai: 365,
      Kolkata: 340,
      Hyderabad: 355,
      Pune: 375,
      Ahmedabad: 350,
    },
    description: "Ordinary Portland Cement for general construction",
    uses: "Foundation, columns, beams, slabs",
  },
  {
    id: 2,
    name: "TMT Steel Bars",
    category: "Structural",
    unit: "per kg",
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80",
    cityPrices: {
      Mumbai: 68,
      Delhi: 65,
      Bangalore: 66,
      Chennai: 64,
      Kolkata: 60,
      Hyderabad: 63,
      Pune: 67,
      Ahmedabad: 62,
    },
    description: "Thermo-Mechanically Treated bars for reinforcement",
    uses: "RCC work, columns, beams, slabs",
  },
  {
    id: 3,
    name: "Red Bricks",
    category: "Structural",
    unit: "per piece",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    cityPrices: {
      Mumbai: 11,
      Delhi: 9,
      Bangalore: 10,
      Chennai: 8,
      Kolkata: 7,
      Hyderabad: 9,
      Pune: 10,
      Ahmedabad: 8,
    },
    description: "Clay bricks for wall construction",
    uses: "Wall construction, partitions",
  },
  {
    id: 4,
    name: "AAC Blocks",
    category: "Structural",
    unit: "per piece",
    image: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=400&q=80",
    cityPrices: {
      Mumbai: 58,
      Delhi: 52,
      Bangalore: 55,
      Chennai: 50,
      Kolkata: 48,
      Hyderabad: 53,
      Pune: 56,
      Ahmedabad: 50,
    },
    description: "Autoclaved Aerated Concrete blocks",
    uses: "Load-bearing walls, lightweight construction",
  },
  {
    id: 5,
    name: "River Sand",
    category: "Structural",
    unit: "per cubic ft",
    image: "https://images.unsplash.com/photo-1589820296156-2092d95ef7b0?w=400&q=80",
    cityPrices: {
      Mumbai: 65,
      Delhi: 55,
      Bangalore: 60,
      Chennai: 50,
      Kolkata: 45,
      Hyderabad: 52,
      Pune: 62,
      Ahmedabad: 48,
    },
    description: "Fine aggregate for concrete and plastering",
    uses: "Concrete mixing, plastering",
  },
  {
    id: 6,
    name: "Vitrified Tiles (2x2 ft)",
    category: "Flooring",
    unit: "per sq ft",
    image: "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400&q=80",
    cityPrices: {
      Mumbai: 85,
      Delhi: 75,
      Bangalore: 80,
      Chennai: 70,
      Kolkata: 65,
      Hyderabad: 72,
      Pune: 82,
      Ahmedabad: 68,
    },
    description: "Polished ceramic tiles",
    uses: "Living room, bedroom flooring",
  },
  {
    id: 7,
    name: "Marble Flooring",
    category: "Flooring",
    unit: "per sq ft",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80",
    cityPrices: {
      Mumbai: 180,
      Delhi: 160,
      Bangalore: 170,
      Chennai: 150,
      Kolkata: 140,
      Hyderabad: 155,
      Pune: 175,
      Ahmedabad: 145,
    },
    description: "Natural marble stone",
    uses: "Living room, pooja room",
  },
  {
    id: 8,
    name: "Granite Flooring",
    category: "Flooring",
    unit: "per sq ft",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    cityPrices: {
      Mumbai: 140,
      Delhi: 120,
      Bangalore: 130,
      Chennai: 115,
      Kolkata: 100,
      Hyderabad: 118,
      Pune: 135,
      Ahmedabad: 110,
    },
    description: "Natural granite stone",
    uses: "Kitchen platform, stairs",
  },
  {
    id: 9,
    name: "Wooden Flooring",
    category: "Flooring",
    unit: "per sq ft",
    image: "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=400&q=80",
    cityPrices: {
      Mumbai: 120,
      Delhi: 100,
      Bangalore: 110,
      Chennai: 95,
      Kolkata: 85,
      Hyderabad: 98,
      Pune: 115,
      Ahmedabad: 90,
    },
    description: "Laminated wooden flooring",
    uses: "Bedroom, living room",
  },
  {
    id: 10,
    name: "CPVC Pipes (1 inch)",
    category: "Plumbing",
    unit: "per ft",
    image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&q=80",
    cityPrices: {
      Mumbai: 48,
      Delhi: 42,
      Bangalore: 45,
      Chennai: 40,
      Kolkata: 38,
      Hyderabad: 43,
      Pune: 46,
      Ahmedabad: 40,
    },
    description: "Hot & cold water supply pipes",
    uses: "Water supply lines",
  },
  {
    id: 11,
    name: "Water Tank (1000L)",
    category: "Plumbing",
    unit: "per piece",
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80",
    cityPrices: {
      Mumbai: 7500,
      Delhi: 6800,
      Bangalore: 7200,
      Chennai: 6500,
      Kolkata: 6e3,
      Hyderabad: 6700,
      Pune: 7300,
      Ahmedabad: 6400,
    },
    description: "Plastic overhead water tank",
    uses: "Water storage",
  },
  {
    id: 12,
    name: "Bathroom Fittings Set",
    category: "Plumbing",
    unit: "per set",
    image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&q=80",
    cityPrices: {
      Mumbai: 18e3,
      Delhi: 15e3,
      Bangalore: 16500,
      Chennai: 14e3,
      Kolkata: 12e3,
      Hyderabad: 14500,
      Pune: 17e3,
      Ahmedabad: 13500,
    },
    description: "Complete CP fittings set",
    uses: "Bathroom fixtures",
  },
  {
    id: 13,
    name: "Copper Wire (2.5 sq mm)",
    category: "Electrical",
    unit: "per meter",
    image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=400&q=80",
    cityPrices: {
      Mumbai: 38,
      Delhi: 34,
      Bangalore: 36,
      Chennai: 32,
      Kolkata: 30,
      Hyderabad: 33,
      Pune: 37,
      Ahmedabad: 31,
    },
    description: "Power socket wiring",
    uses: "Power circuits",
  },
  {
    id: 14,
    name: "MCB Distribution Box",
    category: "Electrical",
    unit: "per piece",
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&q=80",
    cityPrices: {
      Mumbai: 3200,
      Delhi: 2800,
      Bangalore: 3e3,
      Chennai: 2600,
      Kolkata: 2400,
      Hyderabad: 2700,
      Pune: 3100,
      Ahmedabad: 2500,
    },
    description: "Main circuit breaker box",
    uses: "Electrical panel",
  },
  {
    id: 15,
    name: "Modular Switches",
    category: "Electrical",
    unit: "per module",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=400&q=80",
    cityPrices: {
      Mumbai: 180,
      Delhi: 150,
      Bangalore: 165,
      Chennai: 140,
      Kolkata: 120,
      Hyderabad: 145,
      Pune: 170,
      Ahmedabad: 135,
    },
    description: "Premium quality switches",
    uses: "Room switches",
  },
  {
    id: 16,
    name: "Interior Emulsion Paint",
    category: "Paint",
    unit: "per litre",
    image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&q=80",
    cityPrices: {
      Mumbai: 320,
      Delhi: 280,
      Bangalore: 300,
      Chennai: 260,
      Kolkata: 240,
      Hyderabad: 270,
      Pune: 310,
      Ahmedabad: 250,
    },
    description: "Interior wall paint",
    uses: "Interior walls",
  },
  {
    id: 17,
    name: "Exterior Emulsion Paint",
    category: "Paint",
    unit: "per litre",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&q=80",
    cityPrices: {
      Mumbai: 420,
      Delhi: 380,
      Bangalore: 400,
      Chennai: 360,
      Kolkata: 340,
      Hyderabad: 370,
      Pune: 410,
      Ahmedabad: 350,
    },
    description: "Weather-resistant exterior paint",
    uses: "Exterior walls",
  },
  {
    id: 18,
    name: "Wall Putty",
    category: "Paint",
    unit: "per kg",
    image: "https://images.unsplash.com/photo-1604357209793-fca5dca89f97?w=400&q=80",
    cityPrices: {
      Mumbai: 38,
      Delhi: 32,
      Bangalore: 35,
      Chennai: 30,
      Kolkata: 28,
      Hyderabad: 31,
      Pune: 36,
      Ahmedabad: 29,
    },
    description: "Wall finishing putty",
    uses: "Wall preparation",
  },
  {
    id: 19,
    name: "Teak Wood Door Frame",
    category: "Doors",
    unit: "per sq ft",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    cityPrices: {
      Mumbai: 1200,
      Delhi: 1e3,
      Bangalore: 1100,
      Chennai: 950,
      Kolkata: 850,
      Hyderabad: 980,
      Pune: 1150,
      Ahmedabad: 900,
    },
    description: "Solid teak wood frame",
    uses: "Main door, room doors",
  },
  {
    id: 20,
    name: "Flush Door",
    category: "Doors",
    unit: "per piece",
    image: "https://images.unsplash.com/photo-1506377295352-e3154d43ea9e?w=400&q=80",
    cityPrices: {
      Mumbai: 6500,
      Delhi: 5500,
      Bangalore: 6e3,
      Chennai: 5200,
      Kolkata: 4800,
      Hyderabad: 5400,
      Pune: 6200,
      Ahmedabad: 5e3,
    },
    description: "Interior flush doors",
    uses: "Bedroom, bathroom doors",
  },
  {
    id: 21,
    name: "UPVC Windows",
    category: "Doors",
    unit: "per sq ft",
    image: "https://images.unsplash.com/photo-1604357209793-fca5dca89f97?w=400&q=80",
    cityPrices: {
      Mumbai: 520,
      Delhi: 450,
      Bangalore: 480,
      Chennai: 420,
      Kolkata: 380,
      Hyderabad: 440,
      Pune: 500,
      Ahmedabad: 400,
    },
    description: "UPVC window frames with glass",
    uses: "Windows",
  },
  {
    id: 22,
    name: "Modular Kitchen",
    category: "Kitchen",
    unit: "per sq ft",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",
    cityPrices: {
      Mumbai: 2800,
      Delhi: 2400,
      Bangalore: 2600,
      Chennai: 2200,
      Kolkata: 2e3,
      Hyderabad: 2300,
      Pune: 2700,
      Ahmedabad: 2100,
    },
    description: "Complete modular kitchen",
    uses: "Kitchen cabinets",
  },
  {
    id: 23,
    name: "Kitchen Sink (SS)",
    category: "Kitchen",
    unit: "per piece",
    image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&q=80",
    cityPrices: {
      Mumbai: 8500,
      Delhi: 7200,
      Bangalore: 7800,
      Chennai: 6800,
      Kolkata: 6200,
      Hyderabad: 7e3,
      Pune: 8200,
      Ahmedabad: 6500,
    },
    description: "Stainless steel sink",
    uses: "Kitchen",
  },
  {
    id: 24,
    name: "Kitchen Chimney",
    category: "Kitchen",
    unit: "per piece",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",
    cityPrices: {
      Mumbai: 22e3,
      Delhi: 18e3,
      Bangalore: 2e4,
      Chennai: 16500,
      Kolkata: 15e3,
      Hyderabad: 17e3,
      Pune: 21e3,
      Ahmedabad: 16e3,
    },
    description: "Auto-clean chimney",
    uses: "Kitchen ventilation",
  },
];
const materialCategories = [
  "All",
  "Structural",
  "Flooring",
  "Plumbing",
  "Electrical",
  "Paint",
  "Doors",
  "Kitchen",
];
const materialCities = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
];
export default function Materials() {
  const [e, t] = useState(""),
    [n, r] = useState("All"),
    [o, l] = useState("Mumbai"),
    [c, d] = useState(false),
    [h, p] = useState(""),
    [m, y] = useState("standard"),
    [x, j] = useState(null),
    [_, S] = useState(false),
    N = materials.filter((T) => {
      const P =
          T.name.toLowerCase().includes(e.toLowerCase()) ||
          T.description.toLowerCase().includes(e.toLowerCase()),
        B = n === "All" || T.category === n;
      return P && B;
    }),
    w = async () => {
      if (h) {
        S(true);
        try {
          const T = await base44.integrations.Core.InvokeLLM({
            prompt: `Generate a construction cost estimate for an Indian residential house:
Built-up area: ${h} sq ft
Construction type: ${m} (budget/standard/premium/luxury)

Provide a detailed breakdown in JSON format with:
1. Structural work (foundation, RCC, walls)
2. Flooring cost
3. Plumbing cost
4. Electrical cost
5. Painting cost
6. Doors & windows
7. Kitchen
8. Misc & finishing
9. Labour charges
10. Total estimated cost

Use current Indian market rates (2024). All amounts in INR.`,
            response_json_schema: {
              type: "object",
              properties: {
                structural: {
                  type: "number",
                },
                flooring: {
                  type: "number",
                },
                plumbing: {
                  type: "number",
                },
                electrical: {
                  type: "number",
                },
                painting: {
                  type: "number",
                },
                doors_windows: {
                  type: "number",
                },
                kitchen: {
                  type: "number",
                },
                misc_finishing: {
                  type: "number",
                },
                labour: {
                  type: "number",
                },
                total: {
                  type: "number",
                },
                per_sqft_cost: {
                  type: "number",
                },
                notes: {
                  type: "string",
                },
              },
            },
          });
          j(T);
        } catch (T) {
          console.error("Estimate error:", T);
        }
        S(false);
      }
    },
    C = (T) =>
      T >= 1e7
        ? `₹${(T / 1e7).toFixed(2)} Cr`
        : T >= 1e5
          ? `₹${(T / 1e5).toFixed(2)} L`
          : `₹${T.toLocaleString("en-IN")}`;
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
            <Package className="w-4 h-4 text-[#B8860B]" />
            <span className="text-[#B8860B] font-medium text-sm">Materials & Pricing</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-4">
            Construction Materials
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Browse building materials with current Indian market prices and estimate your
            construction cost
          </p>
        </motion.div>
        <div className="flex justify-center mb-8">
          <Button
            onClick={() => d(!c)}
            className={`rounded-full ${c ? "bg-[#B8860B]" : "bg-[#1a1a1a]"}`}
          >
            <Calculator className="w-4 h-4 mr-2" />
            {c ? "Hide Estimator" : "Open Cost Estimator"}
          </Button>
        </div>
        {c && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            className="mb-10"
          >
            <div className="bg-white rounded-3xl p-6 shadow-lg max-w-2xl mx-auto">
              <h3 className="font-serif text-xl font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#B8860B]" />
                Quick Cost Estimator
              </h3>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Built-up Area (sq ft)
                  </label>
                  <Input
                    value={h}
                    onChange={(T) => p(T.target.value)}
                    placeholder="E.g., 1500"
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Construction Type
                  </label>
                  <Select value={m} onValueChange={y}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="budget">Budget (₹1200-1600/sqft)</SelectItem>
                      <SelectItem value="standard">Standard (₹1600-2200/sqft)</SelectItem>
                      <SelectItem value="premium">Premium (₹2200-3000/sqft)</SelectItem>
                      <SelectItem value="luxury">Luxury (₹3000+/sqft)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={w} disabled={_ || !h} className="w-full rounded-xl bg-[#B8860B]">
                    {_ ? <LoaderCircle className="w-4 h-4 animate-spin" /> : "Calculate"}
                  </Button>
                </div>
              </div>
              {x && (
                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  className="mt-6 bg-[#FAF8F5] rounded-2xl p-4"
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    {[
                      {
                        label: "Structural",
                        value: x.structural,
                      },
                      {
                        label: "Flooring",
                        value: x.flooring,
                      },
                      {
                        label: "Plumbing",
                        value: x.plumbing,
                      },
                      {
                        label: "Electrical",
                        value: x.electrical,
                      },
                      {
                        label: "Painting",
                        value: x.painting,
                      },
                      {
                        label: "Doors & Windows",
                        value: x.doors_windows,
                      },
                      {
                        label: "Kitchen",
                        value: x.kitchen,
                      },
                      {
                        label: "Misc & Finishing",
                        value: x.misc_finishing,
                      },
                      {
                        label: "Labour",
                        value: x.labour,
                      },
                    ].map((T, P) => (
                      <div key={P} className="bg-white rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-500">{T.label}</p>
                        <p className="font-bold text-[#1a1a1a]">{C(T.value)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-[#B8860B] rounded-xl p-4 text-white text-center">
                    <p className="text-sm opacity-80">Estimated Total Cost</p>
                    <p className="text-3xl font-bold">{C(x.total)}</p>
                    <p className="text-sm opacity-80 mt-1">
                      ≈ ₹{x.per_sqft_cost?.toLocaleString("en-IN")}
                      /sq ft
                    </p>
                  </div>
                  {x.notes && <p className="text-xs text-gray-500 mt-3 text-center">{x.notes}</p>}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
        <div className="bg-white rounded-3xl p-4 shadow-lg mb-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  value={e}
                  onChange={(T) => t(T.target.value)}
                  placeholder="Search materials..."
                  className="pl-12 h-12 rounded-xl"
                />
              </div>
              <div>
                <Select value={o} onValueChange={l}>
                  <SelectTrigger className="w-48 h-12 rounded-xl">
                    <MapPin className="w-4 h-4 mr-2 text-[#B8860B]" />
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                    {materialCities.map((T) => (
                      <SelectItem key={T} value={T}>
                        {T}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {materialCategories.map((T) => (
                <button
                  key={T}
                  onClick={() => r(T)}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${n === T ? "bg-[#B8860B] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                  {T}
                </button>
              ))}
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Showing prices for
          <span className="font-bold text-[#B8860B]">{o}</span>
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {N.map((T, P) => (
            <motion.div
              key={T.id}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: P * 0.05,
              }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="h-32 overflow-hidden">
                <img src={T.image} alt={T.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-xs bg-[#B8860B]/10 text-[#B8860B] px-2 py-1 rounded-full">
                      {T.category}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#1a1a1a] mt-2">{T.name}</h3>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-3">{T.description}</p>
                <div className="bg-[#B8860B]/10 rounded-xl p-3 mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#B8860B]" />
                      <span className="text-xs text-[#B8860B]">{o}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <IndianRupee className="w-4 h-4 text-[#B8860B]" />
                      <span className="font-bold text-lg text-[#1a1a1a]">₹{T.cityPrices[o]}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{T.unit}</span>
                </div>
                <p className="text-xs text-gray-400">
                  <span className="font-medium">Uses:</span> {T.uses}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
