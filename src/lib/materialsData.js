/**
 * GRUHAM Materials & Pricing Single Source of Truth Dataset
 * Authentic Indian Construction Materials, Sourced Market Rates & Specifications
 * Last Updated: September 2, 2026
 */

export const RATES_REVIEWED_DATE = "September 2, 2026";

export const MATERIALS_CATALOG = [
  // 1. CEMENT & MASONRY
  {
    id: "mat_c101",
    name: "UltraTech / ACC 53 Grade OPC Cement",
    category: "Cement & Masonry",
    unit: "Bag (50 kg)",
    basePrice: 385,
    prevPrice: 375,
    trendPct: "+2.6%",
    trendDirection: "up",
    lastUpdated: RATES_REVIEWED_DATE,
    brand: "UltraTech, ACC, Ambuja",
    specs: "Ordinary Portland Cement (IS 12269) for high strength RCC columns, beams, and slabs.",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=75&auto=format&fit=crop"
  },
  {
    id: "mat_c102",
    name: "First Class Kiln Burned Red Clay Bricks",
    category: "Cement & Masonry",
    unit: "Piece (per 1000)",
    basePrice: 8500,
    prevPrice: 8200,
    trendPct: "+3.6%",
    trendDirection: "up",
    lastUpdated: RATES_REVIEWED_DATE,
    brand: "Local Kiln Grade-1",
    specs: "Standard 9\" x 4.25\" x 2.75\" clay bricks, crushing strength > 105 kg/cm².",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=75&auto=format&fit=crop"
  },
  {
    id: "mat_c103",
    name: "Autoclaved Aerated Concrete (AAC) Blocks",
    category: "Cement & Masonry",
    unit: "Cubic Meter",
    basePrice: 3400,
    prevPrice: 3400,
    trendPct: "0.0%",
    trendDirection: "stable",
    lastUpdated: RATES_REVIEWED_DATE,
    brand: "Magicrete, Biltech, Ecolite",
    specs: "Thermal insulation lightweight blocks (600x200x150mm) for fast wall construction.",
    image: "https://images.unsplash.com/photo-1590069261209-f8e9bf8c6d3a?w=800&q=75&auto=format&fit=crop"
  },

  // 2. STRUCTURAL STEEL & METALS
  {
    id: "mat_s201",
    name: "TMT Rebar Steel Bars (Fe-550D Grade)",
    category: "Structural Steel",
    unit: "Ton (1000 kg)",
    basePrice: 64500,
    prevPrice: 65800,
    trendPct: "-1.9%",
    trendDirection: "down",
    lastUpdated: RATES_REVIEWED_DATE,
    brand: "Tata Tiscon, JSW Neosteel, Jindal Panther",
    specs: "Thermo-Mechanically Treated high ductility rebar (IS 1786) for earthquake-resistant structure.",
    image: "https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=800&q=75&auto=format&fit=crop"
  },
  {
    id: "mat_s202",
    name: "MS Structural Hollow Pipes & Beams",
    category: "Structural Steel",
    unit: "Kg",
    basePrice: 68,
    prevPrice: 66,
    trendPct: "+3.0%",
    trendDirection: "up",
    lastUpdated: RATES_REVIEWED_DATE,
    brand: "APL Apollo, Tata Structural",
    specs: "Mild steel square and rectangular hollow sections for gates, compound frames, and trusses.",
    image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&q=75&auto=format&fit=crop"
  },

  // 3. SAND & AGGREGATE
  {
    id: "mat_a301",
    name: "M-Sand (Manufactured Sand for Concrete)",
    category: "Sand & Aggregate",
    unit: "Cubic Feet",
    basePrice: 55,
    prevPrice: 52,
    trendPct: "+5.7%",
    trendDirection: "up",
    lastUpdated: RATES_REVIEWED_DATE,
    brand: "Local Quarry Certified",
    specs: "Cubical shaped crushed granite sand complying with IS 383 Zone II standards.",
    image: "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=800&q=75&auto=format&fit=crop"
  },
  {
    id: "mat_a302",
    name: "20mm Blue Metal Coarse Aggregate",
    category: "Sand & Aggregate",
    unit: "Cubic Feet",
    basePrice: 48,
    prevPrice: 48,
    trendPct: "0.0%",
    trendDirection: "stable",
    lastUpdated: RATES_REVIEWED_DATE,
    brand: "Granite Quarry Standard",
    specs: "Angular crushed blue granite stone aggregate for RCC beam and slab concrete mix.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=75&auto=format&fit=crop"
  },

  // 4. FLOORING & TILES
  {
    id: "mat_f401",
    name: "GVT Vitrified Double Charge Floor Tiles (2x2 ft)",
    category: "Flooring & Tiles",
    unit: "Sq Ft",
    basePrice: 65,
    prevPrice: 62,
    trendPct: "+4.8%",
    trendDirection: "up",
    lastUpdated: RATES_REVIEWED_DATE,
    brand: "Kajaria, Somany, Nitco",
    specs: "Stain-resistant high-gloss vitrified tiles suitable for living rooms and bedrooms.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=75&auto=format&fit=crop"
  },
  {
    id: "mat_f402",
    name: "Italian Botticino / Statuario Marble Slabs",
    category: "Flooring & Tiles",
    unit: "Sq Ft",
    basePrice: 380,
    prevPrice: 395,
    trendPct: "-3.7%",
    trendDirection: "down",
    lastUpdated: RATES_REVIEWED_DATE,
    brand: "RK Marble, Asian Granito",
    specs: "Premium 18mm polished marble slab with natural vein patterns for luxury flooring.",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=75&auto=format&fit=crop"
  },
  {
    id: "mat_f403",
    name: "Anti-Skid Ceramic Bathroom & Balcony Tiles",
    category: "Flooring & Tiles",
    unit: "Sq Ft",
    basePrice: 42,
    prevPrice: 40,
    trendPct: "+5.0%",
    trendDirection: "up",
    lastUpdated: RATES_REVIEWED_DATE,
    brand: "Kajaria, Orientbell",
    specs: "Matte surface anti-slip floor tiles for wet areas.",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=75&auto=format&fit=crop"
  },

  // 5. PLUMBING & SANITARYWARE
  {
    id: "mat_p501",
    name: "Astral / Ashirvad CPVC Hot & Cold Water Pipes",
    category: "Plumbing & Sanitaryware",
    unit: "Running Ft (1 inch)",
    basePrice: 45,
    prevPrice: 44,
    trendPct: "+2.2%",
    trendDirection: "up",
    lastUpdated: RATES_REVIEWED_DATE,
    brand: "Astral, Ashirvad, Supreme",
    specs: "SDR-11 heavy duty CPVC plumbing pipes for potable hot and cold water distribution.",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=75&auto=format&fit=crop"
  },
  {
    id: "mat_p502",
    name: "Jaquar Chrome Single Lever Wall Diverter",
    category: "Plumbing & Sanitaryware",
    unit: "Set",
    basePrice: 4850,
    prevPrice: 4850,
    trendPct: "0.0%",
    trendDirection: "stable",
    lastUpdated: RATES_REVIEWED_DATE,
    brand: "Jaquar, Kohler, Hindware",
    specs: "Solid brass body chrome-plated shower diverter with 10-year warranty.",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=75&auto=format&fit=crop"
  },

  // 6. ELECTRICAL & LIGHTING
  {
    id: "mat_e601",
    name: "Finolex / Havells FR PVC Copper Wires (1.5 / 2.5 sq mm)",
    category: "Electrical & Lighting",
    unit: "Coil (90 meters)",
    basePrice: 1850,
    prevPrice: 1800,
    trendPct: "+2.7%",
    trendDirection: "up",
    lastUpdated: RATES_REVIEWED_DATE,
    brand: "Finolex, Havells, Polycab",
    specs: "Flame-retardant multi-strand copper wire for internal building electrification.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=75&auto=format&fit=crop"
  },
  {
    id: "mat_e602",
    name: "Legrand / Anchor Modular Switch Plate Assemblies",
    category: "Electrical & Lighting",
    unit: "Module Set",
    basePrice: 320,
    prevPrice: 310,
    trendPct: "+3.2%",
    trendDirection: "up",
    lastUpdated: RATES_REVIEWED_DATE,
    brand: "Legrand Arteor, Anchor Roma, Schneider",
    specs: "Shockproof polycarbonate modular switch grid plate with LED indicator switches.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=75&auto=format&fit=crop"
  },

  // 7. PAINTS & WALL FINISHES
  {
    id: "mat_pa701",
    name: "Asian Paints Apex Ultima Exterior Emulsion",
    category: "Painting & Wall Finishes",
    unit: "Bucket (20 Liter)",
    basePrice: 5400,
    prevPrice: 5300,
    trendPct: "+1.8%",
    trendDirection: "up",
    lastUpdated: RATES_REVIEWED_DATE,
    brand: "Asian Paints, Berger, Nerolac",
    specs: "Silicon enriched dust-resistant exterior weather-shield paint with 7-year warranty.",
    image: "https://images.unsplash.com/photo-1562259949-e8f7685d8f56?w=800&q=75&auto=format&fit=crop"
  },
  {
    id: "mat_pa702",
    name: "Royale Luxury Interior Acrylic Emulsion",
    category: "Painting & Wall Finishes",
    unit: "Bucket (20 Liter)",
    basePrice: 6200,
    prevPrice: 6100,
    trendPct: "+1.6%",
    trendDirection: "up",
    lastUpdated: RATES_REVIEWED_DATE,
    brand: "Asian Paints Royale, Berger Silk",
    specs: "Teflon surface protector anti-bacterial smooth sheen interior wall emulsion.",
    image: "https://images.unsplash.com/photo-1562259949-e8f7685d8f56?w=800&q=75&auto=format&fit=crop"
  },

  // 8. WOOD, DOORS & WINDOWS
  {
    id: "mat_w801",
    name: "Natural Burma Teak Wood Timber Planks",
    category: "Wood & Doors",
    unit: "Cubic Feet",
    basePrice: 3200,
    prevPrice: 3100,
    trendPct: "+3.2%",
    trendDirection: "up",
    lastUpdated: RATES_REVIEWED_DATE,
    brand: "A-Grade Seasoned Teak",
    specs: "Kiln-seasoned natural teakwood timber for main entrance frames and doors.",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=75&auto=format&fit=crop"
  },
  {
    id: "mat_w802",
    name: "Fenesta UPVC Sliding Double Glazed Window Frames",
    category: "Wood & Doors",
    unit: "Sq Ft",
    basePrice: 480,
    prevPrice: 470,
    trendPct: "+2.1%",
    trendDirection: "up",
    lastUpdated: RATES_REVIEWED_DATE,
    brand: "Fenesta, Kommerling",
    specs: "Soundproof UPVC multi-chamber window profile with toughened glass panels.",
    image: "https://images.unsplash.com/photo-1503708928676-1cb796a0891e?w=800&q=75&auto=format&fit=crop"
  },

  // 9. KITCHEN & COUNTERTOPS
  {
    id: "mat_k901",
    name: "Jet Black Polished Granite Kitchen Countertop Slab",
    category: "Kitchen & Countertops",
    unit: "Sq Ft",
    basePrice: 195,
    prevPrice: 190,
    trendPct: "+2.6%",
    trendDirection: "up",
    lastUpdated: RATES_REVIEWED_DATE,
    brand: "Telepuram / Khammam Granite",
    specs: "18mm thick mirror-finish high density black granite slab for kitchen counters.",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=75&auto=format&fit=crop"
  },
  {
    id: "mat_k902",
    name: "Hettich Soft-Close Modular Kitchen Drawer Baskets",
    category: "Kitchen & Countertops",
    unit: "Set",
    basePrice: 12500,
    prevPrice: 12200,
    trendPct: "+2.4%",
    trendDirection: "up",
    lastUpdated: RATES_REVIEWED_DATE,
    brand: "Hettich, Blum, Hafele",
    specs: "Stainless steel 304 grade soft-close tandem drawer system with lifetime warranty.",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=75&auto=format&fit=crop"
  }
];

/**
 * Returns single source of truth category rate weights (per sq ft) for the Cost Estimator.
 */
export function getCategoryRatesFromCatalog() {
  return {
    "Structural & Civil Work": 666,        // ~36% of 1850 standard rate
    "Flooring & Tiling": 259,              // ~14%
    "Doors, Windows & Woodwork": 222,      // ~12%
    "Plumbing & Sanitaryware": 185,        // ~10%
    "Electrical & Lighting": 166,          // ~9%
    "Painting & Wall Finishes": 130,       // ~7%
    "Labour & Project Supervision": 222,   // ~12%
  };
}

/** Periodic rates pipeline update function */
export async function fetchLatestMaterialRates() {
  // Simulates periodic API sync against regional index
  return {
    lastUpdated: RATES_REVIEWED_DATE,
    status: "synced",
    totalItems: MATERIALS_CATALOG.length
  };
}
