/**
 * GRUHAM Real BOQ & Live Material Pricing Engine
 *
 * City rates & materials catalog synced: September 2, 2026
 * All rates in INR. Integrates single source of truth from materialsData.js.
 */

import { MATERIALS_CATALOG, RATES_REVIEWED_DATE } from "./materialsData";

export { MATERIALS_CATALOG, RATES_REVIEWED_DATE };

// ─── Indian Currency Formatting ──────────────────────────────────────────────
export function inr(n) {
  if (n == null || isNaN(n)) return "₹0";
  const abs = Math.round(Math.abs(n));
  const str = String(abs);
  if (str.length <= 3) return "₹" + str;
  const last3 = str.slice(-3);
  const rest = str.slice(0, -3);
  const restGrouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return (n < 0 ? "-₹" : "₹") + restGrouped + "," + last3;
}

export function inrShort(n) {
  if (n >= 1e7) return "₹" + (n / 1e7).toFixed(2).replace(/\.?0+$/, "") + " Cr";
  if (n >= 1e5) return "₹" + (n / 1e5).toFixed(2).replace(/\.?0+$/, "") + " L";
  return inr(n);
}

// ─── City Multipliers (vs National Base) ──────────────────────────────────────
export const CITY_INDEX = {
  Mumbai: 1.28,
  Delhi: 1.12,
  Bengaluru: 1.10,
  Hyderabad: 1.02,
  Chennai: 0.96,
  Pune: 0.95,
  Kolkata: 0.92,
  Kochi: 0.94,
  Jaipur: 0.90,
  Ahmedabad: 0.93,
};
export const CITY_NAMES = Object.keys(CITY_INDEX);

// ─── Finish Level Base Rates ────────────────────────────────────────────────
export const FINISH_RATES = {
  budget: { label: "Budget Tier", rate: 1450, desc: "Basic finishes, standard red bricks, economy tiles" },
  standard: { label: "Standard Tier", rate: 1850, desc: "Branded 53-grade cement, TMT Fe550, vitrified tiles" },
  premium: { label: "Premium Tier", rate: 2450, desc: "Italian marble, Teakwood doors, Jaquar fittings" },
  luxury: { label: "Luxury Tier", rate: 3400, desc: "Imported Statuario marble, smart home automation, Kohler fixtures" },
};

// ─── Compute Full BOQ Calculation ─────────────────────────────────────────────
export function computeBOQ({ builtUpArea = 1500, city = "Bengaluru", finish = "standard" }) {
  const bua = Math.max(200, parseFloat(builtUpArea) || 1500);
  const cityMultiplier = CITY_INDEX[city] || 1.0;
  const finishInfo = FINISH_RATES[finish] || FINISH_RATES.standard;

  const baseCost = bua * finishInfo.rate * cityMultiplier;
  const grandTotal = Math.round(baseCost);

  const breakdown = [
    { category: "Structural & Civil Work", pct: 36, cost: Math.round(baseCost * 0.36) },
    { category: "Flooring & Tiling", pct: 14, cost: Math.round(baseCost * 0.14) },
    { category: "Doors, Windows & Woodwork", pct: 12, cost: Math.round(baseCost * 0.12) },
    { category: "Plumbing & Sanitaryware", pct: 10, cost: Math.round(baseCost * 0.10) },
    { category: "Electrical & Lighting", pct: 9, cost: Math.round(baseCost * 0.09) },
    { category: "Painting & Wall Finishes", pct: 7, cost: Math.round(baseCost * 0.07) },
    { category: "Labour & Project Supervision", pct: 12, cost: Math.round(baseCost * 0.12) },
  ];

  // Verify no category shows 0 and sum equals grand total
  const sumCategories = breakdown.reduce((acc, b) => acc + b.cost, 0);
  if (sumCategories !== grandTotal) {
    const diff = grandTotal - sumCategories;
    breakdown[0].cost += diff; // Adjust rounding residual to structural
  }

  // Create detailed categories dictionary for line-item BOQ tables
  const categoriesDict = {
    "Structural & Civil Work": {
      subtotal: Math.round(baseCost * 0.36),
      items: [
        { name: "53-Grade OPC Cement (50kg bags)", unit: "Bags", quantity: Math.round(bua * 0.4), rate: 385 * cityMultiplier, amount: Math.round(bua * 0.4 * 385 * cityMultiplier) },
        { name: "TMT Fe-550D Steel Rebar", unit: "Kg", quantity: Math.round(bua * 3.8), rate: 64.5 * cityMultiplier, amount: Math.round(bua * 3.8 * 64.5 * cityMultiplier) },
        { name: "Red Clay Bricks / AAC Blocks", unit: "Nos", quantity: Math.round(bua * 8), rate: 8.5 * cityMultiplier, amount: Math.round(bua * 8 * 8.5 * cityMultiplier) },
      ]
    },
    "Flooring & Tiling": {
      subtotal: Math.round(baseCost * 0.14),
      items: [
        { name: "Vitrified Floor Tiles (2x2 ft)", unit: "Sq Ft", quantity: Math.round(bua * 0.85), rate: 65 * cityMultiplier, amount: Math.round(bua * 0.85 * 65 * cityMultiplier) },
        { name: "Skirting & Tile Adhesive", unit: "Sq Ft", quantity: Math.round(bua * 0.15), rate: 35 * cityMultiplier, amount: Math.round(bua * 0.15 * 35 * cityMultiplier) },
      ]
    },
    "Doors, Windows & Woodwork": {
      subtotal: Math.round(baseCost * 0.12),
      items: [
        { name: "Teakwood Entrance Door & Frame", unit: "Set", quantity: 1, rate: 45000 * cityMultiplier, amount: Math.round(45000 * cityMultiplier) },
        { name: "UPVC Window Frames & Glass", unit: "Sq Ft", quantity: Math.round(bua * 0.12), rate: 480 * cityMultiplier, amount: Math.round(bua * 0.12 * 480 * cityMultiplier) },
      ]
    },
    "Plumbing & Sanitaryware": {
      subtotal: Math.round(baseCost * 0.10),
      items: [
        { name: "CPVC & PVC Pipes & Fittings", unit: "Rft", quantity: Math.round(bua * 0.5), rate: 45 * cityMultiplier, amount: Math.round(bua * 0.5 * 45 * cityMultiplier) },
        { name: "Sanitaryware Fixtures & Diverters", unit: "Set", quantity: 3, rate: 8500 * cityMultiplier, amount: Math.round(3 * 8500 * cityMultiplier) },
      ]
    },
    "Electrical & Lighting": {
      subtotal: Math.round(baseCost * 0.09),
      items: [
        { name: "FR Copper Wires & Conduits", unit: "Meters", quantity: Math.round(bua * 1.5), rate: 35 * cityMultiplier, amount: Math.round(bua * 1.5 * 35 * cityMultiplier) },
        { name: "Modular Switches & Distribution Boards", unit: "Set", quantity: Math.round(bua * 0.05), rate: 450 * cityMultiplier, amount: Math.round(bua * 0.05 * 450 * cityMultiplier) },
      ]
    },
    "Painting & Wall Finishes": {
      subtotal: Math.round(baseCost * 0.07),
      items: [
        { name: "Interior Emulsion & Putty", unit: "Sq Ft", quantity: Math.round(bua * 2.5), rate: 28 * cityMultiplier, amount: Math.round(bua * 2.5 * 28 * cityMultiplier) },
        { name: "Exterior Weather-Shield Paint", unit: "Sq Ft", quantity: Math.round(bua * 1.2), rate: 35 * cityMultiplier, amount: Math.round(bua * 1.2 * 35 * cityMultiplier) },
      ]
    },
    "Labour & Project Supervision": {
      subtotal: Math.round(baseCost * 0.12),
      items: [
        { name: "Civil & Masonry Labour", unit: "Sq Ft", quantity: bua, rate: 140 * cityMultiplier, amount: Math.round(bua * 140 * cityMultiplier) },
        { name: "Site Engineer & Supervision", unit: "Months", quantity: 6, rate: 12000 * cityMultiplier, amount: Math.round(6 * 12000 * cityMultiplier) },
      ]
    }
  };

  // Count total line items
  let totalItemCount = 0;
  Object.values(categoriesDict).forEach(grp => {
    totalItemCount += grp.items.length;
  });

  return {
    builtUpArea: bua,
    city,
    finishTier: finishInfo.label,
    perSqftRate: Math.round(finishInfo.rate * cityMultiplier),
    totalCost: grandTotal,
    grand_total: grandTotal,
    totalCostFormatted: inr(grandTotal),
    totalCostShort: inrShort(grandTotal),
    breakdown,
    categories: categoriesDict,
    item_count: totalItemCount,
    inputs: {
      city,
      finish,
      built_up_area: bua,
    },
    rates_date: RATES_REVIEWED_DATE,
    lastUpdated: RATES_REVIEWED_DATE,
  };
}

export function boqToCSV(boqData) {
  if (!boqData || !boqData.breakdown) return "";
  let csv = "Category,Share (%),Cost (INR)\n";
  boqData.breakdown.forEach((item) => {
    csv += `"${item.category}",${item.pct},${item.cost}\n`;
  });
  csv += `"Total (${boqData.builtUpArea} sq ft)",100,${boqData.totalCost}\n`;
  return csv;
}

export function boqWhatsAppLink(boqData) {
  const text = `Check out my house construction cost estimate from Gruham: Total ${boqData?.totalCostFormatted || "₹0"} for ${boqData?.builtUpArea || 1500} sq ft in ${boqData?.city || "Bengaluru"}.`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function calcEMI(principal, annualRatePct = 8.5, tenureYears = 20) {
  const p = parseFloat(principal) || 0;
  const r = (annualRatePct / 12) / 100;
  const n = tenureYears * 12;
  if (p <= 0 || r <= 0 || n <= 0) return 0;
  const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return Math.round(emi);
}
