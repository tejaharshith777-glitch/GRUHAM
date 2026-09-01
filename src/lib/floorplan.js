/**
 * GRUHAM Deterministic Floor Plan Engine
 * Fully offline, proportional grid layout engine.
 *
 * Inputs:  { plotL, plotW, facing, floors, bhk, city, finish, parking }
 * Outputs: { rooms[], totals{}, vastuNotes{}, error? }
 *
 * All dimensions in feet. Wall thickness = 0.75 ft.
 * Rates reviewed: August 2026
 */

// ─── Indian Room Specs & Vastu Zones ─────────────────────────────────────────
const MINS = {
  living:    { label: "Living Room",      zone: "NE" },
  kitchen:   { label: "Kitchen",          zone: "SE" },
  master:    { label: "Master Bedroom",   zone: "SW" },
  bedroom:   { label: "Bedroom",          zone: "NW" },
  bathroom:  { label: "Bathroom",         zone: "S"  },
  parking:   { label: "Parking",          zone: "N"  },
  balcony:   { label: "Balcony",          zone: "E"  },
  staircase: { label: "Staircase",        zone: "S"  },
  pooja:     { label: "Pooja Room",       zone: "NE" },
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
  return Math.max(600, n * 220 + 200);
}

// ─── Zoned Proportional Layout Engine ───────────────────────────────────────
/**
 * Organizes rooms into a 3-row zoned grid covering 100% of usable plot area.
 * Prevents horizontal overflow, text collision, and empty plot spaces.
 */
function sliceRooms(plotL, plotW, roomTypes, hasParking, hasStaircase) {
  const placed = [];
  const usableW = plotL - WALL * 2;
  const usableH = plotW - WALL * 2;

  // Row 1 (Front/North): Parking (if any), Living Room, Pooja Room
  const row1 = [];
  if (hasParking) row1.push({ type: "parking", weight: 1.4 });
  row1.push({ type: "living", weight: 2.2 });
  row1.push({ type: "pooja", weight: 0.7 });

  // Row 2 (Middle): Kitchen, Staircase (if multi-floor), Common Bath
  const row2 = [{ type: "kitchen", weight: 1.4 }];
  if (hasStaircase) row2.push({ type: "staircase", weight: 1.0 });

  const bedrooms = roomTypes.filter((t) => t === "master" || t === "bedroom");
  const bathrooms = roomTypes.filter((t) => t === "bathroom");

  if (bathrooms.length > 0) {
    row2.push({ type: "bathroom", weight: 0.8, idx: 0 });
  }

  // Row 3 (Rear/South): Master Bedroom, Bedrooms, Attached Baths, Balcony
  const row3 = [];
  const bedCount = { master: 0, bedroom: 0 };
  bedrooms.forEach((t) => {
    row3.push({ type: t, weight: t === "master" ? 1.8 : 1.5, idx: bedCount[t]++ });
  });

  for (let i = 1; i < bathrooms.length; i++) {
    row3.push({ type: "bathroom", weight: 0.8, idx: i });
  }

  if (roomTypes.includes("balcony")) {
    row3.push({ type: "balcony", weight: 0.8 });
  }

  const rows = [row1, row2, row3];
  const rowHeights = [usableH * 0.30, usableH * 0.32, usableH * 0.38];

  let currentY = WALL;

  rows.forEach((rowRooms, rIdx) => {
    const rowH = rowHeights[rIdx];
    const totalWeight = rowRooms.reduce((sum, r) => sum + r.weight, 0);

    let currentX = WALL;
    rowRooms.forEach((rObj) => {
      const roomW = (rObj.weight / totalWeight) * usableW;
      const spec = MINS[rObj.type] || { label: rObj.type, zone: "NE" };
      const label = rObj.idx !== undefined && rObj.idx > 0
        ? `${spec.label} ${rObj.idx + 1}`
        : spec.label;

      placed.push({
        type: rObj.type,
        name: label,
        x: Math.round(currentX * 10) / 10,
        y: Math.round(currentY * 10) / 10,
        w: Math.round(roomW * 10) / 10,
        h: Math.round(rowH * 10) / 10,
        area_sqft: Math.round(roomW * rowH),
        zone: spec.zone,
      });

      currentX += roomW;
    });

    currentY += rowH;
  });

  return placed;
}

// ─── Main engine ──────────────────────────────────────────────────────────────
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

  const groundRooms = sliceRooms(pL, pW, roomTypes, parking, hasStaircase);

  const footprint    = groundRooms.reduce((s, r) => s + r.area_sqft, 0);
  const builtUpArea  = Math.round(footprint * fl * 0.9);
  const carpetArea   = Math.round(builtUpArea * 0.72);
  const circulationL = Math.round((builtUpArea - carpetArea) / builtUpArea * 100);

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

export function renderFloorPlanSVG(plan, svgW = 600, svgH = 480) {
  if (!plan || plan.error || !plan.rooms?.length) return "";

  const { rooms, totals } = plan;
  const [pL, pW] = totals.plot_dimensions.split("×").map(s => parseFloat(s.trim()));

  const margin = 44;
  const availableW = svgW - margin * 2;
  const availableH = svgH - margin * 2 - 40; // bottom text space

  const scaleX = availableW / pL;
  const scaleY = availableH / pW;
  const scale  = Math.min(scaleX, scaleY);

  const plotPxActualW = pL * scale;
  const plotPxActualH = pW * scale;

  const offsetX = margin + (availableW - plotPxActualW) / 2;
  const offsetY = margin + (availableH - plotPxActualH) / 2;

  function ftToX(x) { return offsetX + x * scale; }
  function ftToY(y) { return offsetY + y * scale; }
  function ftToPx(v) { return v * scale; }

  const arrowRot = NORTH_ARROW_ROTATIONS[totals.facing] || 0;

  const roomSVG = rooms.map(r => {
    const rx = ftToX(r.x);
    const ry = ftToY(r.y);
    const rw = ftToPx(r.w);
    const rh = ftToPx(r.h);
    const fill = ZONE_COLORS[r.zone] || "#F5F5F5";
    const cx = rx + rw / 2;
    const cy = ry + rh / 2;

    const fontSize = Math.max(7.5, Math.min(12, rw / 6, rh / 3.5));

    let displayName = r.name;
    if (rw < 75) {
      displayName = displayName
        .replace("Master Bedroom", "M. Bed")
        .replace("Bedroom", "Bed")
        .replace("Bathroom", "Bath")
        .replace("Living Room", "Living")
        .replace("Pooja Room", "Pooja")
        .replace("Staircase", "Stairs");
    }

    const dimText = `${r.w.toFixed(0)}' × ${r.h.toFixed(0)}'`;

    return `
      <g class="room">
        <rect x="${rx.toFixed(1)}" y="${ry.toFixed(1)}" width="${rw.toFixed(1)}" height="${rh.toFixed(1)}"
              fill="${fill}" stroke="#B8860B" stroke-width="1.5" rx="2"/>
        <text x="${cx.toFixed(1)}" y="${(cy - fontSize * 0.6).toFixed(1)}" text-anchor="middle"
              font-size="${fontSize.toFixed(1)}" font-family="Inter, sans-serif"
              font-weight="600" fill="#1a1a1a">${displayName}</text>
        <text x="${cx.toFixed(1)}" y="${(cy + fontSize * 0.8).toFixed(1)}" text-anchor="middle"
              font-size="${Math.max(6.5, fontSize - 1.5).toFixed(1)}" font-family="Inter, sans-serif"
              fill="#666">${dimText}</text>
        <text x="${cx.toFixed(1)}" y="${(cy + fontSize * 2.0).toFixed(1)}" text-anchor="middle"
              font-size="${Math.max(6, fontSize - 2).toFixed(1)}" font-family="Inter, sans-serif"
              fill="#B8860B">${r.area_sqft} sq ft</text>
      </g>`;
  }).join("\n");

  const barY = offsetY + plotPxActualH + 16;
  const totalsText = `Built-up: ${totals.built_up_area.toLocaleString("en-IN")} sq ft  |  Carpet: ${totals.carpet_area.toLocaleString("en-IN")} sq ft  |  Circulation: ${totals.circulation_loss}%`;

  const arrowX = offsetX + plotPxActualW - 24;
  const arrowY = offsetY + 18;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${svgW}" height="${svgH}"
     viewBox="0 0 ${svgW} ${svgH}" font-family="Inter, sans-serif">
  <!-- Plot boundary -->
  <rect x="${offsetX.toFixed(1)}" y="${offsetY.toFixed(1)}" width="${plotPxActualW.toFixed(1)}" height="${plotPxActualH.toFixed(1)}"
        fill="#FAFAFA" stroke="#1a1a1a" stroke-width="2.5"/>

  <!-- Rooms -->
  ${roomSVG}

  <!-- Plot dimension labels -->
  <text x="${(offsetX + plotPxActualW / 2).toFixed(1)}" y="${(offsetY - 10).toFixed(1)}"
        text-anchor="middle" font-size="10" font-weight="500" fill="#444">${pL}' (length)</text>
  <text x="${(offsetX - 10).toFixed(1)}" y="${(offsetY + plotPxActualH / 2).toFixed(1)}"
        text-anchor="middle" font-size="10" font-weight="500" fill="#444" transform="rotate(-90,${(offsetX - 10).toFixed(1)},${(offsetY + plotPxActualH / 2).toFixed(1)})">${pW}' (width)</text>

  <!-- North arrow -->
  <g transform="translate(${arrowX.toFixed(1)},${arrowY.toFixed(1)}) rotate(${arrowRot})">
    <polygon points="0,-12 -4,6 0,2 4,6" fill="#B8860B"/>
    <polygon points="0,-12 4,6 0,2 -4,6" fill="#D4A84B" opacity="0.5"/>
    <text x="0" y="16" text-anchor="middle" font-size="8" font-weight="bold" fill="#B8860B">N</text>
  </g>

  <!-- Totals bar -->
  <text x="${offsetX.toFixed(1)}" y="${barY.toFixed(1)}" font-size="9.5" font-weight="500" fill="#666">${totalsText}</text>

  <!-- Disclaimer label -->
  <text x="${(svgW / 2).toFixed(1)}" y="${(svgH - 8).toFixed(1)}" text-anchor="middle"
        font-size="8" fill="#aaa">
    Indicative concept layout — not a construction drawing.
  </text>
</svg>`;
}

export function svgToBlob(svgStr) {
  return new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
}
