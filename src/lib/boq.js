/**
 * GRUHAM Real BOQ (Bill of Quantities) Cost Engine
 * Fully offline. O(n) single pass over ~30 line items.
 *
 * City rates reviewed: August 2026
 * All rates in INR. Quantities derived from built-up area.
 */

// ─── Indian digit grouping ────────────────────────────────────────────────────
/**
 * Format a number in Indian style: ₹1,25,000
 * @param {number} n
 * @returns {string}
 */
export function inr(n) {
  if (n == null || isNaN(n)) return "₹0";
  const abs = Math.round(Math.abs(n));
  const str = String(abs);
  // Indian grouping: last 3 digits, then groups of 2
  if (str.length <= 3) return "₹" + str;
  const last3 = str.slice(-3);
  const rest   = str.slice(0, -3);
  const restGrouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return (n < 0 ? "-₹" : "₹") + restGrouped + "," + last3;
}

/** Convert ₹ to short form: ₹12.5L, ₹1.2Cr */
export function inrShort(n) {
  if (n >= 1e7) return "₹" + (n / 1e7).toFixed(2).replace(/\.?0+$/, "") + " Cr";
  if (n >= 1e5) return "₹" + (n / 1e5).toFixed(2).replace(/\.?0+$/, "") + " L";
  return inr(n);
}

// ─── City multipliers (vs national base) ─────────────────────────────────────
// Rates reviewed: August 2026
export const CITY_INDEX = {
  Mumbai:      1.28,
  Delhi:       1.12,
  Bengaluru:   1.10,
  Hyderabad:   1.02,
  Chennai:     0.96,
  Pune:        0.95,
  Ahmedabad:   0.93,
  Kolkata:     0.92,
  Kochi:       0.94,
  Coimbatore:  0.88,
  Jaipur:      0.90,
  Lucknow:     0.87,
  Chandigarh:  0.96,
  Nagpur:      0.89,
  Bhopal:      0.86,
  Indore:      0.88,
  Vizag:       0.91,
  Surat:       0.92,
  Vadodara:    0.90,
  Gurgaon:     1.08,
  Noida:       1.05,
};
export const CITY_NAMES = Object.keys(CITY_INDEX);
export const RATES_REVIEWED_DATE = "August 2026";

// ─── Finish level base rates (₹/sq ft, national average) ─────────────────────
export const FINISH_RATES = {
  budget:   { label: "Budget",   rate: 1350, desc: "Basic finishes, economy materials" },
  standard: { label: "Standard", rate: 1750, desc: "Mid-range finishes, branded materials" },
  premium:  { label: "Premium",  rate: 2300, desc: "Premium finishes, designer elements" },
  luxury:   { label: "Luxury",   rate: 3200, desc: "Luxury finishes, imported materials" },
};

// ─── 30 Line items ────────────────────────────────────────────────────────────
// qty_fn(builtUpArea, carpetArea, finish) -> quantity
// rate_fn(finish, cityMul) -> rate per unit
const LINE_ITEMS = [
  // ── Structural ──────────────────────────────────────────────────────────────
  {
    category: "Structural",
    name: "OPC Cement (53-grade)",
    unit: "bags (50 kg)",
    qty_fn:  (bua) => Math.round(bua * 0.40),
    rate_fn: (fin, mul) => Math.round(380 * mul),
    basis: "0.40 bags per sq ft of built-up area (industry standard)",
  },
  {
    category: "Structural",
    name: "Reinforcement Steel (TMT Fe500)",
    unit: "kg",
    qty_fn:  (bua) => Math.round(bua * 3.5),
    rate_fn: (fin, mul) => Math.round(68 * mul),
    basis: "3.5 kg per sq ft for RCC framed structure",
  },
  {
    category: "Structural",
    name: "River Sand / M-Sand",
    unit: "cum",
    qty_fn:  (bua) => Math.round(bua * 0.081),
    rate_fn: (fin, mul) => Math.round(1400 * mul),
    basis: "0.081 cubic metres per sq ft",
  },
  {
    category: "Structural",
    name: "Aggregates (20 mm & 40 mm)",
    unit: "cum",
    qty_fn:  (bua) => Math.round(bua * 0.060),
    rate_fn: (fin, mul) => Math.round(1100 * mul),
    basis: "0.060 cubic metres per sq ft",
  },
  {
    category: "Structural",
    name: "Bricks / AAC Blocks",
    unit: "nos",
    qty_fn:  (bua) => Math.round(bua * 8),
    rate_fn: (fin, mul) => Math.round(9 * mul),
    basis: "8 bricks per sq ft for 9-inch masonry walls",
  },
  {
    category: "Structural",
    name: "Structural Labour & Formwork",
    unit: "sqft",
    qty_fn:  (bua) => bua,
    rate_fn: (fin, mul) => Math.round({ budget: 220, standard: 280, premium: 350, luxury: 450 }[fin] * mul),
    basis: "Labour + shuttering cost per sq ft of built-up area",
  },
  {
    category: "Structural",
    name: "RCC Foundation & Footing",
    unit: "sqft",
    qty_fn:  (bua) => Math.round(bua * 0.35),
    rate_fn: (fin, mul) => Math.round(480 * mul),
    basis: "Foundation = 35% of built-up area footprint",
  },
  // ── Flooring ────────────────────────────────────────────────────────────────
  {
    category: "Flooring",
    name: "Floor Tiles / Vitrified",
    unit: "sqft",
    qty_fn:  (bua, carpet) => Math.round(carpet * 1.10),
    rate_fn: (fin, mul) => Math.round({ budget: 55, standard: 90, premium: 180, luxury: 350 }[fin] * mul),
    basis: "1.10 × carpet area (10% wastage)",
  },
  {
    category: "Flooring",
    name: "Flooring Adhesive & Grout",
    unit: "sqft",
    qty_fn:  (bua, carpet) => Math.round(carpet * 1.10),
    rate_fn: (fin, mul) => Math.round(18 * mul),
    basis: "Adhesive + grouting per sq ft of floor tile area",
  },
  {
    category: "Flooring",
    name: "Staircase Flooring & Handrail",
    unit: "rft",
    qty_fn:  (bua) => Math.round(bua * 0.04),
    rate_fn: (fin, mul) => Math.round({ budget: 800, standard: 1200, premium: 2000, luxury: 4000 }[fin] * mul),
    basis: "4% of built-up area translates to staircase running feet",
  },
  // ── Plumbing ────────────────────────────────────────────────────────────────
  {
    category: "Plumbing",
    name: "CPVC / UPVC Water Supply Pipes",
    unit: "rft",
    qty_fn:  (bua) => Math.round(bua * 0.5),
    rate_fn: (fin, mul) => Math.round(120 * mul),
    basis: "0.5 running feet of pipe per sq ft of built-up area",
  },
  {
    category: "Plumbing",
    name: "Sanitary Fittings (WC, washbasin, shower)",
    unit: "nos",
    qty_fn:  (bua) => Math.max(1, Math.round(bua / 500)),
    rate_fn: (fin, mul) => Math.round({ budget: 8000, standard: 18000, premium: 40000, luxury: 80000 }[fin] * mul),
    basis: "1 set of fittings per ~500 sq ft (approx. per bathroom)",
  },
  {
    category: "Plumbing",
    name: "Drainage & Sewage Pipes",
    unit: "rft",
    qty_fn:  (bua) => Math.round(bua * 0.3),
    rate_fn: (fin, mul) => Math.round(90 * mul),
    basis: "0.3 running feet of drainage per sq ft of built-up area",
  },
  {
    category: "Plumbing",
    name: "Plumbing Labour",
    unit: "sqft",
    qty_fn:  (bua) => bua,
    rate_fn: (fin, mul) => Math.round(60 * mul),
    basis: "₹60/sq ft labour for all plumbing works",
  },
  // ── Electrical ──────────────────────────────────────────────────────────────
  {
    category: "Electrical",
    name: "Electrical Wiring (FR-LSH cables)",
    unit: "rft",
    qty_fn:  (bua) => Math.round(bua * 1.2),
    rate_fn: (fin, mul) => Math.round(45 * mul),
    basis: "1.2 running feet of cable per sq ft (circuits + sub-circuits)",
  },
  {
    category: "Electrical",
    name: "Switchgear & Distribution Board",
    unit: "nos",
    qty_fn:  (bua) => Math.max(1, Math.round(bua / 700)),
    rate_fn: (fin, mul) => Math.round({ budget: 4000, standard: 8000, premium: 18000, luxury: 35000 }[fin] * mul),
    basis: "1 DB per ~700 sq ft floor area",
  },
  {
    category: "Electrical",
    name: "Switches, Sockets & Conduit (PVC)",
    unit: "sqft",
    qty_fn:  (bua) => bua,
    rate_fn: (fin, mul) => Math.round({ budget: 55, standard: 90, premium: 160, luxury: 300 }[fin] * mul),
    basis: "Conduit + modular switches/sockets per sq ft of built-up area",
  },
  {
    category: "Electrical",
    name: "Electrical Labour",
    unit: "sqft",
    qty_fn:  (bua) => bua,
    rate_fn: (fin, mul) => Math.round(50 * mul),
    basis: "₹50/sq ft electrical labour and testing",
  },
  // ── Painting ─────────────────────────────────────────────────────────────────
  {
    category: "Painting",
    name: "Interior Emulsion Paint",
    unit: "L",
    qty_fn:  (bua, carpet) => Math.round(carpet * 0.12 * 2.5), // 2.5 coats
    rate_fn: (fin, mul) => Math.round({ budget: 180, standard: 320, premium: 500, luxury: 900 }[fin] * mul),
    basis: "0.12 L per sq ft per coat × 2.5 coats",
  },
  {
    category: "Painting",
    name: "Exterior Weather-Shield Paint",
    unit: "L",
    qty_fn:  (bua) => Math.round(bua * 0.08),
    rate_fn: (fin, mul) => Math.round(420 * mul),
    basis: "0.08 L per sq ft of built-up area for exterior surfaces",
  },
  {
    category: "Painting",
    name: "Primer & Putty (interior walls)",
    unit: "sqft",
    qty_fn:  (bua, carpet) => Math.round(carpet * 3), // wall area
    rate_fn: (fin, mul) => Math.round(15 * mul),
    basis: "Wall area ≈ 3× carpet area (ceiling + 4 walls averaged)",
  },
  {
    category: "Painting",
    name: "Painting Labour",
    unit: "sqft",
    qty_fn:  (bua, carpet) => Math.round(carpet * 3),
    rate_fn: (fin, mul) => Math.round(22 * mul),
    basis: "₹22/sq ft painting labour on wall area",
  },
  // ── Doors & Windows ──────────────────────────────────────────────────────────
  {
    category: "Doors & Windows",
    name: "Main Door (teak / engineered wood)",
    unit: "nos",
    qty_fn:  () => 1,
    rate_fn: (fin, mul) => Math.round({ budget: 18000, standard: 35000, premium: 75000, luxury: 1.5e5 }[fin] * mul),
    basis: "1 main door per house",
  },
  {
    category: "Doors & Windows",
    name: "Interior Flush Doors",
    unit: "nos",
    qty_fn:  (bua) => Math.max(3, Math.round(bua / 300)),
    rate_fn: (fin, mul) => Math.round({ budget: 5000, standard: 9000, premium: 18000, luxury: 35000 }[fin] * mul),
    basis: "Approx. 1 interior door per 300 sq ft",
  },
  {
    category: "Doors & Windows",
    name: "UPVC / Aluminium Windows",
    unit: "sqft",
    qty_fn:  (bua) => Math.round(bua * 0.10),
    rate_fn: (fin, mul) => Math.round({ budget: 350, standard: 550, premium: 900, luxury: 1600 }[fin] * mul),
    basis: "Window area = 10% of built-up area (Indian standard)",
  },
  // ── Kitchen ──────────────────────────────────────────────────────────────────
  {
    category: "Kitchen",
    name: "Modular Kitchen (lower + upper cabinets)",
    unit: "rft",
    qty_fn:  (bua) => Math.max(8, Math.round(bua * 0.015)),
    rate_fn: (fin, mul) => Math.round({ budget: 1200, standard: 2200, premium: 4500, luxury: 9000 }[fin] * mul),
    basis: "Kitchen length ≈ 1.5% of built-up area in running feet",
  },
  {
    category: "Kitchen",
    name: "Granite / Quartz Counter Top",
    unit: "sqft",
    qty_fn:  (bua) => Math.max(20, Math.round(bua * 0.015)),
    rate_fn: (fin, mul) => Math.round({ budget: 180, standard: 320, premium: 650, luxury: 1400 }[fin] * mul),
    basis: "Counter area = 1.5% of built-up area",
  },
  // ── Misc Finishing ────────────────────────────────────────────────────────────
  {
    category: "Misc Finishing",
    name: "False Ceiling (POP / Gypsum)",
    unit: "sqft",
    qty_fn:  (bua, carpet) => Math.round(carpet * 0.6),
    rate_fn: (fin, mul) => Math.round({ budget: 65, standard: 110, premium: 200, luxury: 400 }[fin] * mul),
    basis: "False ceiling in 60% of carpet area (living rooms, bedrooms)",
  },
  {
    category: "Misc Finishing",
    name: "Wall Tiles (kitchen + bathrooms)",
    unit: "sqft",
    qty_fn:  (bua) => Math.round(bua * 0.18),
    rate_fn: (fin, mul) => Math.round({ budget: 45, standard: 85, premium: 175, luxury: 350 }[fin] * mul),
    basis: "Wet area tiles = 18% of built-up area",
  },
  {
    category: "Misc Finishing",
    name: "Waterproofing (terrace, bathrooms, basement)",
    unit: "sqft",
    qty_fn:  (bua) => Math.round(bua * 0.25),
    rate_fn: (fin, mul) => Math.round(85 * mul),
    basis: "25% of built-up area requires waterproofing treatment",
  },
  {
    category: "Misc Finishing",
    name: "Site Development & Compound Wall",
    unit: "rft",
    qty_fn:  (bua) => Math.round(Math.sqrt(bua / 2) * 4), // rough perimeter
    rate_fn: (fin, mul) => Math.round(1200 * mul),
    basis: "Compound wall length based on approx. plot perimeter",
  },
];

// ─── Main BOQ function ────────────────────────────────────────────────────────
/**
 * Compute BOQ for given inputs.
 *
 * @param {object} params
 * @param {number} params.builtUpArea  - sq ft
 * @param {number} params.carpetArea   - sq ft (default: builtUpArea * 0.72)
 * @param {string} params.city         - city name (must be in CITY_INDEX)
 * @param {string} params.finish       - "budget"|"standard"|"premium"|"luxury"
 * @param {boolean} params.parking     - add parking (₹2L flat)
 * @param {boolean} params.interiors   - add interior package (% of base)
 * @returns {object} { items[], categories{}, grand_total, per_sqft, band_low, band_high }
 */
export function computeBOQ({ builtUpArea, carpetArea, city = "Chennai", finish = "standard", parking = false, interiors = false }) {
  const bua     = Math.round(parseFloat(builtUpArea) || 1500);
  const carpet  = Math.round(carpetArea ?? bua * 0.72);
  const cityMul = CITY_INDEX[city] ?? 1.0;
  const fin     = FINISH_RATES[finish] ? finish : "standard";

  const items = LINE_ITEMS.map(item => {
    const quantity = item.qty_fn(bua, carpet, fin);
    const rate     = item.rate_fn(fin, cityMul);
    const amount   = Math.round(quantity * rate);
    return {
      category: item.category,
      name:     item.name,
      unit:     item.unit,
      quantity,
      rate,
      amount,
      basis:    item.basis,
    };
  });

  // Optional: parking (slab ₹2L city-adjusted)
  if (parking) {
    items.push({
      category: "Misc Finishing",
      name:     "Parking / Garage Slab & Flooring",
      unit:     "lumpsum",
      quantity: 1,
      rate:     Math.round(200000 * cityMul),
      amount:   Math.round(200000 * cityMul),
      basis:    "Lumpsum for one covered parking space (9' × 17')",
    });
  }

  // Optional: basic interior package
  if (interiors) {
    const interiorRate = { budget: 0.08, standard: 0.12, premium: 0.18, luxury: 0.28 }[fin];
    const baseTotal    = items.reduce((s, i) => s + i.amount, 0);
    const intAmount    = Math.round(baseTotal * interiorRate);
    items.push({
      category: "Interiors",
      name:     "Interior Design & Furnishing Package",
      unit:     "lumpsum",
      quantity: 1,
      rate:     intAmount,
      amount:   intAmount,
      basis:    `${(interiorRate * 100).toFixed(0)}% of construction cost for ${FINISH_RATES[fin].label} interiors`,
    });
  }

  // Group by category
  const categories = {};
  for (const item of items) {
    if (!categories[item.category]) categories[item.category] = { items: [], subtotal: 0 };
    categories[item.category].items.push(item);
    categories[item.category].subtotal += item.amount;
  }

  const grandTotal = items.reduce((s, i) => s + i.amount, 0);
  const perSqft    = Math.round(grandTotal / bua);
  const bandLow    = Math.round(grandTotal * 0.85);
  const bandHigh   = Math.round(grandTotal * 1.15);

  return {
    inputs: { builtUpArea: bua, carpetArea: carpet, city, finish, parking, interiors },
    items,
    categories,
    grand_total:  grandTotal,
    per_sqft:     perSqft,
    band_low:     bandLow,
    band_high:    bandHigh,
    city_vs_national: Math.round((cityMul - 1) * 100), // % above/below national
    item_count:   items.length,
    rates_date:   RATES_REVIEWED_DATE,
  };
}

// ─── CSV export ───────────────────────────────────────────────────────────────
/**
 * Generate a CSV string from BOQ output.
 * @param {object} boq - output of computeBOQ()
 * @returns {string} CSV content
 */
export function boqToCSV(boq) {
  const lines = [
    ["GRUHAM Cost Estimate"],
    [`City: ${boq.inputs.city}`, `Finish: ${FINISH_RATES[boq.inputs.finish]?.label}`, `Built-up Area: ${boq.inputs.builtUpArea.toLocaleString("en-IN")} sq ft`],
    [],
    ["Category", "Item", "Unit", "Quantity", "Rate (₹)", "Amount (₹)", "Basis"],
  ];

  for (const [cat, grp] of Object.entries(boq.categories)) {
    for (const item of grp.items) {
      lines.push([
        cat,
        item.name,
        item.unit,
        item.quantity.toLocaleString("en-IN"),
        item.rate.toLocaleString("en-IN"),
        item.amount.toLocaleString("en-IN"),
        `"${item.basis}"`,
      ]);
    }
    lines.push([cat + " Subtotal", "", "", "", "", grp.subtotal.toLocaleString("en-IN"), ""]);
    lines.push([]);
  }

  lines.push(["GRAND TOTAL (₹)", "", "", "", "", boq.grand_total.toLocaleString("en-IN")]);
  lines.push([`Cost per sq ft (₹)`, boq.per_sqft.toLocaleString("en-IN")]);
  lines.push([`±15% Band: ₹${boq.band_low.toLocaleString("en-IN")} – ₹${boq.band_high.toLocaleString("en-IN")}`]);
  lines.push([]);
  lines.push([`Note: Indicative estimate (±15%). Not a contractor quotation. Rates for ${boq.inputs.city}, reviewed ${boq.rates_date}.`]);

  return lines.map(row => row.join(",")).join("\n");
}

// ─── WhatsApp share text ──────────────────────────────────────────────────────
/**
 * Generate WhatsApp share text for a BOQ summary.
 * @param {object} boq
 * @returns {string} wa.me URL
 */
export function boqWhatsAppLink(boq) {
  const fin = FINISH_RATES[boq.inputs.finish]?.label || "Standard";
  const text = [
    `*GRUHAM Cost Estimate* 🏠`,
    `City: ${boq.inputs.city} | Finish: ${fin}`,
    `Built-up Area: ${boq.inputs.builtUpArea.toLocaleString("en-IN")} sq ft`,
    ``,
    `*Total: ${inrShort(boq.grand_total)}*`,
    `Per sq ft: ${inr(boq.per_sqft)}`,
    `±15% Band: ${inrShort(boq.band_low)} – ${inrShort(boq.band_high)}`,
    ``,
    `_(Indicative estimate — not a contractor quotation)_`,
    `Plan your home at gruhamapp.com`,
  ].join("\n");
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

// ─── Copy summary text ────────────────────────────────────────────────────────
export function boqSummaryText(boq) {
  const fin = FINISH_RATES[boq.inputs.finish]?.label || "Standard";
  return [
    `GRUHAM Cost Estimate`,
    `City: ${boq.inputs.city} | Finish: ${fin}`,
    `Built-up Area: ${boq.inputs.builtUpArea.toLocaleString("en-IN")} sq ft`,
    `Total: ${inrShort(boq.grand_total)} (${inr(boq.per_sqft)}/sq ft)`,
    `±15% Band: ${inrShort(boq.band_low)} – ${inrShort(boq.band_high)}`,
    `Indicative estimate — not a contractor quotation.`,
    `Rates for ${boq.inputs.city}, reviewed ${boq.rates_date}.`,
  ].join("\n");
}

// ─── EMI calculator ───────────────────────────────────────────────────────────
/**
 * Calculate EMI for a home loan.
 * @param {number} principal  - loan amount (₹)
 * @param {number} ratePA     - annual interest rate (%) e.g. 8.5
 * @param {number} tenureYrs  - tenure in years (e.g. 20)
 * @returns {{ emi, totalPayment, totalInterest, principal }}
 */
export function calcEMI(principal, ratePA = 8.5, tenureYrs = 20) {
  const P = parseFloat(principal) || 0;
  const r = (parseFloat(ratePA) / 100) / 12; // monthly rate
  const n = parseInt(tenureYrs) * 12;         // months
  if (r === 0) return { emi: Math.round(P / n), totalPayment: P, totalInterest: 0, principal: P };
  const emi          = Math.round(P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
  const totalPayment = emi * n;
  const totalInterest = totalPayment - P;
  return { emi, totalPayment, totalInterest, principal: P };
}
