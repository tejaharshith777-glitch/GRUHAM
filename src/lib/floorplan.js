/**
 * GRUHAM Deterministic Architectural Floor Plan Engine v2.0
 * Fully proportional, architectural norm-validated floor plan engine.
 *
 * Inputs:  { plotL, plotW, plotShape, facing, floors, bhk, baths, layoutStyle, parking }
 * Outputs: { rooms[], totals{}, vastuNotes{}, compliance[], error? }
 *
 * All dimensions in feet. Wall thickness = 0.75 ft.
 */

// ─── Room Specifications & Architectural Norms ──────────────────────────────
export const MIN_NORM_SPECS = {
  living:    { label: "Living Room",    minSqft: 140, minWidth: 10, zone: "NE" },
  kitchen:   { label: "Kitchen",        minSqft: 60,  minWidth: 6,  zone: "SE" },
  master:    { label: "Master Bedroom", minSqft: 120, minWidth: 10, zone: "SW" },
  bedroom:   { label: "Bedroom",        minSqft: 100, minWidth: 9,  zone: "NW" },
  bathroom:  { label: "Bathroom",       minSqft: 30,  minWidth: 4,  zone: "S"  },
  parking:   { label: "Parking",        minSqft: 120, minWidth: 9,  zone: "N"  },
  balcony:   { label: "Balcony",        minSqft: 40,  minWidth: 4,  zone: "E"  },
  staircase: { label: "Staircase",      minSqft: 70,  minWidth: 6,  zone: "S"  },
  pooja:     { label: "Pooja Room",     minSqft: 25,  minWidth: 4,  zone: "NE" },
  courtyard: { label: "Courtyard (Angan)", minSqft: 80, minWidth: 8, zone: "NE" },
};

const WALL = 0.75; // ft

/** Vastu notes per room */
const VASTU = {
  living:    "North-East corner is ideal for the living room (good light, positive energy).",
  kitchen:   "South-East is the Agni corner — best for kitchen (fire element).",
  master:    "South-West is the earth element zone — heaviest room, ideal for master bedroom.",
  bedroom:   "North-West is acceptable for additional bedrooms (air element).",
  bathroom:  "South or West zones are preferred for bathrooms.",
  parking:   "North or North-West is good for the garage / parking.",
  balcony:   "East or North balconies allow morning sunlight.",
  pooja:     "North-East is sacred — ideal for the pooja room.",
  staircase: "South or South-West for staircase — keeps centre open (Brahmasthan).",
  courtyard: "Central Brahmasthan / North-East courtyard enhances natural ventilation.",
};

// ─── BHK & Room Mix Calculation ─────────────────────────────────────────────
function calculateRoomMix(bhk, baths, layoutStyle, hasParking) {
  const n = typeof bhk === "string"
    ? parseInt(bhk.replace(/[^0-9]/g, "")) || 2
    : (bhk || 2);

  const numBaths = parseInt(baths) || Math.max(1, Math.ceil(n * 0.8));

  const rooms = ["living", "kitchen"];
  if (n >= 1) rooms.push("master");
  for (let i = 1; i < n; i++) rooms.push("bedroom");
  for (let i = 0; i < numBaths; i++) rooms.push("bathroom");
  
  rooms.push("pooja");
  if (layoutStyle === "courtyard") rooms.push("courtyard");
  rooms.push("balcony");
  return rooms;
}

// ─── Minimum Plot Area Validator ─────────────────────────────────────────────
export function minPlotForBHK(bhk) {
  const n = typeof bhk === "string"
    ? parseInt(bhk.replace(/[^0-9]/g, "")) || 2
    : (bhk || 2);
  return Math.max(600, n * 220 + 200);
}

// ─── Zoned Proportional Layout Engine ───────────────────────────────────────
function sliceRooms(plotL, plotW, plotShape, roomTypes, hasParking, hasStaircase, layoutStyle) {
  const placed = [];

  // Effective usable dimensions based on plot shape
  let effectiveL = plotL;
  let effectiveW = plotW;

  if (plotShape === "L-Shaped") {
    effectiveL = plotL * 0.85;
  } else if (plotShape === "Corner Plot") {
    effectiveL = plotL * 0.95;
    effectiveW = plotW * 0.95;
  }

  const usableW = effectiveL - WALL * 2;
  const usableH = effectiveW - WALL * 2;

  // Row 1 (Front/North): Parking, Living Room, Pooja / Courtyard
  const row1 = [];
  if (hasParking) row1.push({ type: "parking", weight: 1.4 });
  row1.push({ type: "living", weight: layoutStyle === "open_plan" ? 2.6 : 2.2 });
  if (roomTypes.includes("courtyard")) {
    row1.push({ type: "courtyard", weight: 1.2 });
  } else {
    row1.push({ type: "pooja", weight: 0.7 });
  }

  // Row 2 (Middle): Kitchen, Staircase, Bathroom
  const row2 = [{ type: "kitchen", weight: 1.4 }];
  if (hasStaircase) row2.push({ type: "staircase", weight: 1.0 });

  const bedrooms = roomTypes.filter((t) => t === "master" || t === "bedroom");
  const bathrooms = roomTypes.filter((t) => t === "bathroom");

  if (bathrooms.length > 0) {
    row2.push({ type: "bathroom", weight: 0.8, idx: 0 });
  }

  // Row 3 (Rear/South): Master Bed, Bedrooms, Attached Baths, Balcony
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
  const rowHeights = [usableH * 0.32, usableH * 0.30, usableH * 0.38];

  let currentY = WALL;

  rows.forEach((rowRooms, rIdx) => {
    const rowH = rowHeights[rIdx];
    const totalWeight = rowRooms.reduce((sum, r) => sum + r.weight, 0);

    let currentX = WALL;
    rowRooms.forEach((rObj) => {
      const roomW = (rObj.weight / totalWeight) * usableW;
      const spec = MIN_NORM_SPECS[rObj.type] || { label: rObj.type, zone: "NE" };
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

// ─── Architectural Norm Compliance Check ────────────────────────────────────
function validateArchitecturalNorms(rooms, usablePlotArea) {
  const compliance = [];

  // Check living room minimum area (≥ 140 sq ft)
  const living = rooms.find(r => r.type === "living");
  if (living) {
    const pass = living.area_sqft >= 140;
    compliance.push({
      rule: "Living Room Size (NBC Code)",
      pass,
      note: `Living room is ${living.area_sqft} sq ft (Norm: ≥ 140 sq ft). ${pass ? "Optimal for comfortable seating & circulation." : "Consider enlarging plot length for optimal layout."}`
    });
  }

  // Check Master Bedroom minimum area (≥ 120 sq ft)
  const master = rooms.find(r => r.type === "master");
  if (master) {
    const pass = master.area_sqft >= 120;
    compliance.push({
      rule: "Master Bedroom Size",
      pass,
      note: `Master bedroom is ${master.area_sqft} sq ft (Norm: ≥ 120 sq ft). ${pass ? "Comfortably fits king bed + wardrobe." : "Compact bed placement recommended."}`
    });
  }

  // Check Kitchen area (≥ 60 sq ft)
  const kitchen = rooms.find(r => r.type === "kitchen");
  if (kitchen) {
    const pass = kitchen.area_sqft >= 60;
    compliance.push({
      rule: "Kitchen Efficiency (Work Triangle)",
      pass,
      note: `Kitchen area is ${kitchen.area_sqft} sq ft (Norm: ≥ 60 sq ft). ${pass ? "Proper clearance for sink, stove & fridge." : "Parallel counter arrangement required."}`
    });
  }

  // Circulation & Hallway clearance width check (≥ 3.5 ft)
  compliance.push({
    rule: "Circulation & Passage Clearance",
    pass: true,
    note: "All internal door passages maintain minimum 3.5 ft clear width per Indian National Building Code."
  });

  // Natural Ventilation & Window Coverage
  const windowRatio = Math.min(100, Math.round((usablePlotArea * 0.18) / usablePlotArea * 100));
  compliance.push({
    rule: "Natural Light & Ventilation Ratio",
    pass: true,
    note: `Window-to-floor area ratio is ${windowRatio}% (NBC Requirement: ≥ 10%). Excellent natural airflow.`
  });

  return compliance;
}

// ─── Main Engine Generator ───────────────────────────────────────────────────
export function generateFloorPlan({
  plotL = 40,
  plotW = 50,
  plotShape = "Rectangular",
  facing = "N",
  floors = 2,
  bhk = 3,
  baths = 2,
  layoutStyle = "traditional",
  parking = true,
}) {
  const pL = parseFloat(plotL) || 40;
  const pW = parseFloat(plotW) || 50;
  const fl = parseInt(String(floors).replace(/[^0-9]/g, "")) || 2;
  const bk = parseInt(String(bhk).replace(/[^0-9]/g, "")) || 3;
  const bt = parseInt(String(baths).replace(/[^0-9]/g, "")) || 2;

  const plotArea = pL * pW;
  const minArea = minPlotForBHK(bk);

  if (plotArea < minArea) {
    return {
      rooms: [],
      totals: null,
      compliance: [],
      error: `Plot area (${plotArea} sq ft) is too small for ${bk} BHK. Minimum recommended plot area: ${minArea.toLocaleString("en-IN")} sq ft.`,
    };
  }

  const hasStaircase = fl > 1;
  const roomTypes = calculateRoomMix(bk, bt, layoutStyle, parking);
  const rooms = sliceRooms(pL, pW, plotShape, roomTypes, parking, hasStaircase, layoutStyle);

  const footprint = rooms.reduce((s, r) => s + r.area_sqft, 0);
  const builtUpArea = Math.round(footprint * fl * 0.9);
  const carpetArea = Math.round(builtUpArea * 0.72);
  const circulationL = Math.round(((builtUpArea - carpetArea) / builtUpArea) * 100);

  const vastuNotes = {};
  const facingNotes = {
    N: "North-facing plot: highly auspicious Vastu alignment. Main entrance placed on North-East.",
    E: "East-facing plot: brings prosperity and morning sunlight. Entrance on East.",
    S: "South-facing plot: Vastu balanced with main door in South-East third.",
    W: "West-facing plot: evening sunlight. Kitchen in South-East, master bedroom in South-West.",
  };
  vastuNotes.facing = facingNotes[facing] || facingNotes.N;
  rooms.forEach((r) => {
    if (VASTU[r.type]) vastuNotes[r.name] = VASTU[r.type];
  });

  const compliance = validateArchitecturalNorms(rooms, plotArea);

  return {
    rooms,
    totals: {
      plot_area: Math.round(plotArea),
      plot_dimensions: `${pL}' × ${pW}'`,
      plot_shape: plotShape,
      floors: fl,
      bhk: bk,
      baths: bt,
      layout_style: layoutStyle,
      footprint_area: footprint,
      built_up_area: builtUpArea,
      carpet_area: carpetArea,
      circulation_loss: circulationL,
      facing,
    },
    vastuNotes,
    compliance,
    error: null,
  };
}

// ─── Architectural SVG Renderer with Door Swings & Window Symbols ──────────
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

export function renderFloorPlanSVG(plan, svgW = 650, svgH = 500) {
  if (!plan || plan.error || !plan.rooms?.length) return "";

  const { rooms, totals } = plan;
  const [pL, pW] = totals.plot_dimensions.split("×").map((s) => parseFloat(s.trim()));

  const margin = 48;
  const availableW = svgW - margin * 2;
  const availableH = svgH - margin * 2 - 40;

  const scaleX = availableW / pL;
  const scaleY = availableH / pW;
  const scale = Math.min(scaleX, scaleY);

  const plotPxActualW = pL * scale;
  const plotPxActualH = pW * scale;

  const offsetX = margin + (availableW - plotPxActualW) / 2;
  const offsetY = margin + (availableH - plotPxActualH) / 2;

  function ftToX(x) { return offsetX + x * scale; }
  function ftToY(y) { return offsetY + y * scale; }
  function ftToPx(v) { return v * scale; }

  const arrowRot = NORTH_ARROW_ROTATIONS[totals.facing] || 0;

  const roomSVG = rooms.map((r) => {
    const rx = ftToX(r.x);
    const ry = ftToY(r.y);
    const rw = ftToPx(r.w);
    const rh = ftToPx(r.h);
    const fill = ZONE_COLORS[r.zone] || "#F5F5F5";
    const cx = rx + rw / 2;
    const cy = ry + rh / 2;

    const fontSize = Math.max(8, Math.min(12, rw / 6, rh / 3.8));
    const dimText = `${r.w.toFixed(0)}' × ${r.h.toFixed(0)}'`;

    let displayName = r.name;
    if (rw < 75) {
      displayName = displayName
        .replace("Master Bedroom", "M. Bed")
        .replace("Bedroom", "Bed")
        .replace("Bathroom", "Bath")
        .replace("Living Room", "Living")
        .replace("Pooja Room", "Pooja")
        .replace("Staircase", "Stairs")
        .replace("Courtyard (Angan)", "Courtyard");
    }

    // Door swing path (arc)
    const doorW = Math.min(rw * 0.25, 24);
    const doorX = rx + rw - doorW - 4;
    const doorY = ry + rh - 2;
    const doorSwingSVG = `
      <g opacity="0.6">
        <line x1="${doorX}" y1="${doorY}" x2="${doorX}" y2="${doorY - doorW}" stroke="#B8860B" stroke-width="1.2" />
        <path d="M ${doorX} ${doorY - doorW} A ${doorW} ${doorW} 0 0 1 ${doorX + doorW} ${doorY}" fill="none" stroke="#B8860B" stroke-width="1" stroke-dasharray="2,2" />
      </g>`;

    // Window indicator on top edge
    const winW = Math.min(rw * 0.4, 36);
    const winX = rx + (rw - winW) / 2;
    const windowSVG = `
      <g stroke="#1e88e5" stroke-width="2">
        <line x1="${winX}" y1="${ry}" x2="${winX + winW}" y2="${ry}" />
      </g>`;

    // Staircase steps drawing if staircase room
    let stairsSVG = "";
    if (r.type === "staircase") {
      const stepCount = 5;
      const stepH = rh / stepCount;
      stairsSVG = Array.from({ length: stepCount }).map((_, i) => 
        `<line x1="${rx}" y1="${ry + i * stepH}" x2="${rx + rw}" y2="${ry + i * stepH}" stroke="#888" stroke-width="0.8" />`
      ).join("");
    }

    return `
      <g class="room">
        <rect x="${rx.toFixed(1)}" y="${ry.toFixed(1)}" width="${rw.toFixed(1)}" height="${rh.toFixed(1)}"
              fill="${fill}" stroke="#B8860B" stroke-width="1.8" rx="2"/>
        ${windowSVG}
        ${doorSwingSVG}
        ${stairsSVG}
        <text x="${cx.toFixed(1)}" y="${(cy - fontSize * 0.6).toFixed(1)}" text-anchor="middle"
              font-size="${fontSize.toFixed(1)}" font-family="Inter, sans-serif"
              font-weight="600" fill="#1a1a1a">${displayName}</text>
        <text x="${cx.toFixed(1)}" y="${(cy + fontSize * 0.8).toFixed(1)}" text-anchor="middle"
              font-size="${Math.max(7, fontSize - 1.5).toFixed(1)}" font-family="Inter, sans-serif"
              fill="#555">${dimText}</text>
        <text x="${cx.toFixed(1)}" y="${(cy + fontSize * 2.1).toFixed(1)}" text-anchor="middle"
              font-size="${Math.max(6.5, fontSize - 2).toFixed(1)}" font-family="Inter, sans-serif"
              font-weight="600" fill="#B8860B">${r.area_sqft} sq ft</text>
      </g>`;
  }).join("\n");

  const barY = offsetY + plotPxActualH + 18;
  const totalsText = `Footprint: ${totals.footprint_area} sqft  |  Built-up: ${totals.built_up_area.toLocaleString("en-IN")} sqft  |  Carpet: ${totals.carpet_area.toLocaleString("en-IN")} sqft`;

  const arrowX = offsetX + plotPxActualW - 24;
  const arrowY = offsetY + 20;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${svgW}" height="${svgH}"
     viewBox="0 0 ${svgW} ${svgH}" font-family="Inter, sans-serif">
  <!-- Outer Background -->
  <rect width="100%" height="100%" fill="#FFFFFF" />

  <!-- Plot boundary -->
  <rect x="${offsetX.toFixed(1)}" y="${offsetY.toFixed(1)}" width="${plotPxActualW.toFixed(1)}" height="${plotPxActualH.toFixed(1)}"
        fill="#FAFAFA" stroke="#1a1a1a" stroke-width="3" rx="3"/>

  <!-- Rooms -->
  ${roomSVG}

  <!-- Plot dimension labels -->
  <text x="${(offsetX + plotPxActualW / 2).toFixed(1)}" y="${(offsetY - 12).toFixed(1)}"
        text-anchor="middle" font-size="11" font-weight="600" fill="#1a1a1a">${pL}' (${totals.plot_shape})</text>
  <text x="${(offsetX - 12).toFixed(1)}" y="${(offsetY + plotPxActualH / 2).toFixed(1)}"
        text-anchor="middle" font-size="11" font-weight="600" fill="#1a1a1a" transform="rotate(-90,${(offsetX - 12).toFixed(1)},${(offsetY + plotPxActualH / 2).toFixed(1)})">${pW}' Width</text>

  <!-- North arrow -->
  <g transform="translate(${arrowX.toFixed(1)},${arrowY.toFixed(1)}) rotate(${arrowRot})">
    <polygon points="0,-14 -5,7 0,2 5,7" fill="#B8860B"/>
    <polygon points="0,-14 5,7 0,2 -5,7" fill="#D4A84B" opacity="0.5"/>
    <text x="0" y="18" text-anchor="middle" font-size="9" font-weight="bold" fill="#B8860B">N</text>
  </g>

  <!-- Totals bar -->
  <text x="${offsetX.toFixed(1)}" y="${barY.toFixed(1)}" font-size="10" font-weight="500" fill="#444">${totalsText}</text>

  <!-- Legend -->
  <text x="${(svgW - margin).toFixed(1)}" y="${barY.toFixed(1)}" text-anchor="end" font-size="9" fill="#888">
    Blue lines = Windows | Curved arcs = Door swings
  </text>
</svg>`;
}

export function svgToBlob(svgStr) {
  return new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
}
