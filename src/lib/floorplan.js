/**
 * GRUHAM Deterministic Floor Plan Engine
 * Fully offline, O(n) room placement via rectangle slicing.
 *
 * Inputs:  { plotL, plotW, facing, floors, bhk, city, finish, parking }
 * Outputs: { rooms[], totals{}, vastuNotes{}, error? }
 *
 * All dimensions in feet. Wall thickness = 0.75 ft.
 * Rates reviewed: August 2026
 */

// ─── Indian Room Minimums (ft) ─────────────────────────────────────────────
const MINS = {
  living:    { w: 14, h: 16, label: "Living Room",      zone: "NE" },
  kitchen:   { w:  8, h: 10, label: "Kitchen",          zone: "SE" },
  master:    { w: 12, h: 12, label: "Master Bedroom",   zone: "SW" },
  bedroom:   { w: 10, h: 11, label: "Bedroom",          zone: "NW" },
  bathroom:  { w:  5, h:  7, label: "Bathroom",         zone: "S"  },
  parking:   { w:  9, h: 17, label: "Parking",          zone: "N"  },
  balcony:   { w:  4, h:  8, label: "Balcony",          zone: "E"  },
  staircase: { w:  4, h: 10, label: "Staircase",        zone: "S"  },
  pooja:     { w:  3, h:  4, label: "Pooja Room",       zone: "NE" },
};

const WALL = 0.75; // ft

/** Vastu notes per room based on zone */
const VASTU = {
  living:   "North-East corner is ideal for the living room (good light, positive energy).",
  kitchen:  "South-East is the Agni corner — best for kitchen (fire element).",
  master:   "South-West is the earth element zone — heaviest room, ideal for master bedroom.",
  bedroom:  "North-West is acceptable for additional bedrooms (air element).",
  bathroom: "South or West zones are preferred for bathrooms.",
  parking:  "North or North-West is good for the garage / parking.",
  balcony:  "East or North balconies allow morning sunlight.",
  pooja:    "North-East is sacred — ideal for the pooja room.",
  staircase:"South or South-West for staircase — keeps centre open (Brahmasthan).",
};

// ─── BHK Room Mix ────────────────────────────────────────────────────────────
function roomMixFromBHK(bhk) {
  const n = typeof bhk === "string"
    ? parseInt(bhk.replace(/[^0-9]/g, "")) || 2
    : (bhk || 2);

  const rooms = ["living", "kitchen"];
  if (n >= 1) rooms.push("master");
  for (let i = 1; i < n; i++) rooms.push("bedroom");
  // bathrooms: 1 per bedroom, min 1
  const bathrooms = Math.max(1, Math.ceil(n * 0.8));
  for (let i = 0; i < bathrooms; i++) rooms.push("bathroom");
  rooms.push("pooja");
  rooms.push("balcony");
  return rooms;
}

// ─── Minimum plot check ───────────────────────────────────────────────────────
function minPlotForBHK(bhk) {
  const n = typeof bhk === "string"
    ? parseInt(bhk.replace(/[^0-9]/g, "")) || 2
    : (bhk || 2);
  // rough: each BHK needs ~200 sqft footprint
  return Math.max(600, n * 220 + 200);
}

// ─── Rectangle slicer ─────────────────────────────────────────────────────────
/**
 * Greedily places rooms into a rectangular plot using a top-down, left-right
 * band approach. Returns placed rooms with x, y, w, h in feet.
 */
function sliceRooms(plotL, plotW, roomTypes, hasParking, hasStaircase) {
  const placed = [];
  // Available area starts at (0, 0)
  let cursorX = WALL;
  let cursorY = WALL;
  let rowH = 0;
  const usableW = plotL - WALL * 2;
  const usableH = plotW - WALL * 2;

  function place(type, idx = 0) {
    const spec = MINS[type];
    if (!spec) return false;
    const rw = Math.min(spec.w, usableW);
    const rh = spec.h;

    // If room doesn't fit in current row, wrap
    if (cursorX + rw > usableW + WALL * 2) {
      cursorY += rowH + WALL;
      cursorX = WALL;
      rowH = 0;
    }
    if (cursorY + rh > usableH + WALL * 2) return false; // doesn't fit at all

    const label = idx > 0 ? `${spec.label} ${idx + 1}` : spec.label;
    placed.push({
      type,
      name: label,
      x: Math.round(cursorX * 10) / 10,
      y: Math.round(cursorY * 10) / 10,
      w: Math.round(rw * 10) / 10,
      h: Math.round(rh * 10) / 10,
      area_sqft: Math.round(rw * rh),
      zone: spec.zone,
    });

    cursorX += rw + WALL;
    rowH = Math.max(rowH, rh);
    return true;
  }

  // Priority order: parking, living, kitchen, master, bedrooms, bathrooms, balcony, pooja, staircase
  if (hasParking) place("parking");
  place("living");
  place("kitchen");

  const bedTypes = roomTypes.filter(t => t === "master" || t === "bedroom");
  const bathTypes = roomTypes.filter(t => t === "bathroom");
  const otherTypes = roomTypes.filter(t => !["living","kitchen","bathroom","master","bedroom"].includes(t));

  let bedIdx = { master: 0, bedroom: 0 };
  for (const t of bedTypes) {
    place(t, bedIdx[t]);
    bedIdx[t]++;
  }
  let bathIdx = 0;
  for (const t of bathTypes) {
    place(t, bathIdx);
    bathIdx++;
  }
  for (const t of otherTypes) place(t);
  if (hasStaircase) place("staircase");

  return placed;
}

// ─── Main engine ──────────────────────────────────────────────────────────────
/**
 * Generate a floor plan.
 *
 * @param {object} params
 * @param {number} params.plotL      - Plot length (ft)
 * @param {number} params.plotW      - Plot width (ft)
 * @param {string} params.facing     - "N" | "E" | "S" | "W"
 * @param {number|string} params.floors  - number of floors (1-4)
 * @param {number|string} params.bhk     - BHK count (1-6)
 * @param {boolean} params.parking   - include parking?
 * @param {string} params.finish     - "budget"|"standard"|"premium"|"luxury"
 * @returns {object} { rooms, totals, vastuNotes, error? }
 */
export function generateFloorPlan({ plotL, plotW, facing = "N", floors = 2, bhk = 3, parking = true, finish = "standard" }) {
  const pL = parseFloat(plotL) || 40;
  const pW = parseFloat(plotW) || 60;
  const fl = parseInt(String(floors).replace(/[^0-9]/g, "")) || 2;
  const bk = parseInt(String(bhk).replace(/[^0-9]/g, "")) || 3;

  const plotArea = pL * pW;
  const minArea  = minPlotForBHK(bk);

  if (plotArea < minArea) {
    return {
      rooms: [],
      totals: null,
      error: `Plot too small for ${bk} BHK. Minimum plot area needed: ${minArea.toLocaleString("en-IN")} sq ft (≈ ${Math.ceil(Math.sqrt(minArea))} × ${Math.ceil(Math.sqrt(minArea))} ft). Your plot: ${plotArea.toLocaleString("en-IN")} sq ft.`,
    };
  }

  const hasStaircase = fl > 1;
  const roomTypes = roomMixFromBHK(bk);

  // Ground floor rooms (parking eats from ground plan)
  const groundRooms = sliceRooms(pL, pW, roomTypes, parking, hasStaircase);

  // Built-up area = footprint × floors (minus staircase overlap)
  const footprint    = groundRooms.reduce((s, r) => s + r.area_sqft, 0);
  const builtUpArea  = Math.round(footprint * fl * 0.9); // 10% structural loss on upper floors
  const plotAreaNet  = Math.round((pL - WALL * 2) * (pW - WALL * 2));
  const carpetArea   = Math.round(builtUpArea * 0.72); // 28% walls + common
  const circulationL = Math.round((builtUpArea - carpetArea) / builtUpArea * 100);

  // Vastu notes
  const vastuNotes = {};
  const facingNotes = {
    N: "North-facing plot: excellent for Vastu — main entrance on North, living room on North-East.",
    E: "East-facing plot: auspicious — morning sun enters the home. Entrance on East.",
    S: "South-facing plot: ensure main door is in the South-East third to comply with Vastu.",
    W: "West-facing plot: evening sun; place kitchen on South-East, master bedroom on South-West.",
  };
  vastuNotes.facing = facingNotes[facing] || facingNotes.N;
  groundRooms.forEach(r => {
    if (VASTU[r.type]) vastuNotes[r.name] = VASTU[r.type];
  });

  return {
    rooms: groundRooms,
    totals: {
      plot_area:          Math.round(pL * pW),
      plot_dimensions:    `${pL}' × ${pW}'`,
      floors:             fl,
      bhk:                bk,
      footprint_area:     footprint,
      built_up_area:      builtUpArea,
      carpet_area:        carpetArea,
      circulation_loss:   circulationL,
      facing,
    },
    vastuNotes,
    error: null,
  };
}

// ─── SVG renderer ─────────────────────────────────────────────────────────────
const ZONE_COLORS = {
  NE: "#FFF9E6",
  SE: "#FFF3E0",
  SW: "#F3E5F5",
  NW: "#E8F5E9",
  S:  "#FCEEE8",
  N:  "#E3F2FD",
  E:  "#FFFDE7",
  W:  "#FCE4EC",
};

const NORTH_ARROW_ROTATIONS = { N: 0, E: 90, S: 180, W: 270 };

/**
 * Render floor plan as an SVG string.
 * @param {object} plan  - output of generateFloorPlan()
 * @param {number} svgW  - SVG viewport width in px (default 600)
 * @param {number} svgH  - SVG viewport height in px (default 480)
 * @returns {string} SVG markup
 */
export function renderFloorPlanSVG(plan, svgW = 600, svgH = 480) {
  if (!plan || plan.error || !plan.rooms?.length) return "";

  const { rooms, totals } = plan;

  // Scale factor: map plot ft to SVG px
  const margin = 48;
  const plotPxW = svgW - margin * 2;
  const plotPxH = svgH - margin * 2 - 60; // bottom bar
  const scaleX = plotPxW / parseFloat(totals.plot_dimensions);
  // Parse dimensions
  const [pL, pW] = totals.plot_dimensions.split("×").map(s => parseFloat(s.trim()));
  const sx = plotPxW / pL;
  const sy = plotPxH / pW;
  const scale = Math.min(sx, sy);

  function ftToX(x) { return margin + x * scale; }
  function ftToY(y) { return margin + y * scale; }
  function ftToPx(v) { return v * scale; }

  const plotPxActualW = pL * scale;
  const plotPxActualH = pW * scale;

  // North arrow rotation
  const arrowRot = NORTH_ARROW_ROTATIONS[totals.facing] || 0;

  const roomSVG = rooms.map(r => {
    const rx = ftToX(r.x);
    const ry = ftToY(r.y);
    const rw = ftToPx(r.w);
    const rh = ftToPx(r.h);
    const fill = ZONE_COLORS[r.zone] || "#F5F5F5";
    const cx = rx + rw / 2;
    const cy = ry + rh / 2;
    const fontSize = Math.max(7, Math.min(11, rw / 8));
    const dimW = `${r.w.toFixed(0)}'`;
    const dimH = `${r.h.toFixed(0)}'`;

    return `
      <g class="room">
        <rect x="${rx}" y="${ry}" width="${rw}" height="${rh}"
              fill="${fill}" stroke="#B8860B" stroke-width="1.5" rx="2"/>
        <text x="${cx}" y="${cy - fontSize * 0.6}" text-anchor="middle"
              font-size="${fontSize}" font-family="Inter, sans-serif"
              font-weight="600" fill="#1a1a1a">${r.name}</text>
        <text x="${cx}" y="${cy + fontSize * 0.9}" text-anchor="middle"
              font-size="${Math.max(6, fontSize - 1)}" font-family="Inter, sans-serif"
              fill="#666">${dimW} × ${dimH}</text>
        <text x="${cx}" y="${cy + fontSize * 2.1}" text-anchor="middle"
              font-size="${Math.max(6, fontSize - 1.5)}" font-family="Inter, sans-serif"
              fill="#B8860B">${r.area_sqft} sq ft</text>
      </g>`;
  }).join("\n");

  // Totals bar
  const barY = margin + plotPxActualH + 12;
  const totalsText = `Built-up: ${totals.built_up_area.toLocaleString("en-IN")} sq ft  |  Carpet: ${totals.carpet_area.toLocaleString("en-IN")} sq ft  |  Circulation: ${totals.circulation_loss}%`;

  // North arrow SVG at top-right
  const arrowX = margin + plotPxActualW - 30;
  const arrowY = margin + 20;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${svgW}" height="${svgH}"
     viewBox="0 0 ${svgW} ${svgH}" font-family="Inter, sans-serif">
  <!-- Plot boundary -->
  <rect x="${margin}" y="${margin}" width="${plotPxActualW}" height="${plotPxActualH}"
        fill="#FAFAFA" stroke="#1a1a1a" stroke-width="2.5"/>

  <!-- Rooms -->
  ${roomSVG}

  <!-- Plot dimension labels -->
  <text x="${margin + plotPxActualW / 2}" y="${margin - 8}"
        text-anchor="middle" font-size="10" fill="#555">${pL}' (length)</text>
  <text x="${margin - 6}" y="${margin + plotPxActualH / 2}"
        text-anchor="middle" font-size="10" fill="#555" transform="rotate(-90,${margin - 6},${margin + plotPxActualH / 2})">${pW}' (width)</text>

  <!-- North arrow -->
  <g transform="translate(${arrowX},${arrowY}) rotate(${arrowRot})">
    <polygon points="0,-14 -5,7 0,3 5,7" fill="#B8860B"/>
    <polygon points="0,-14 5,7 0,3 -5,7" fill="#D4A84B" opacity="0.5"/>
    <text x="0" y="20" text-anchor="middle" font-size="9" font-weight="bold" fill="#B8860B">N</text>
  </g>

  <!-- Totals bar -->
  <text x="${margin}" y="${barY + 12}" font-size="9" fill="#888">${totalsText}</text>

  <!-- Disclaimer label -->
  <text x="${svgW / 2}" y="${svgH - 8}" text-anchor="middle"
        font-size="8" fill="#aaa">
    Indicative concept layout — not a construction drawing.
  </text>
</svg>`;
}

/**
 * Format SVG for download as a file.
 * @param {string} svgStr - SVG markup
 * @returns {Blob}
 */
export function svgToBlob(svgStr) {
  return new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
}
