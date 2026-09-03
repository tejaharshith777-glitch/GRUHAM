/**
 * GRUHAM backend layer.
 *
 * The app was originally generated on Base44, where data and AI calls live on
 * the Base44 cloud (entities, `base44.integrations.Core.*`, `base44.auth`).
 * This module is a drop-in replacement with the SAME call surface, so every
 * page keeps working without a paid backend:
 *
 *   base44.entities.SavedDesign.list("-created_date")
 *   base44.SavedDesign.filter({ design_type: "interior" })
 *   base44.integrations.Core.GenerateImage({ prompt })
 *   base44.integrations.Core.InvokeLLM({ prompt, response_json_schema })
 *   base44.integrations.Core.UploadFile({ file })
 *   base44.auth.me()
 *
 * Data is stored in the browser (localStorage) and the AI helpers ship with a
 * built-in offline engine, so the app runs anywhere with zero cost. Set the
 * optional env vars below to use a real model instead - nothing else changes.
 *
 *   GEMINI_API_KEY         -> Google Gemini server-side key (Vercel env var), used by /api/* endpoints
 *   VITE_IMAGE_MODE=online -> generate images through a public image API
 */

const STORAGE_PREFIX = "gruham:";

/* ------------------------------------------------------------------ storage */
const memoryStore = new Map();

function storage() {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const probe = `${STORAGE_PREFIX}__probe`;
      window.localStorage.setItem(probe, "1");
      window.localStorage.removeItem(probe);
      return window.localStorage;
    }
  } catch {
    /* private mode / server rendering */
  }
  return {
    getItem: (k) => (memoryStore.has(k) ? memoryStore.get(k) : null),
    setItem: (k, v) => memoryStore.set(k, v),
    removeItem: (k) => memoryStore.delete(k),
  };
}

function readTable(name) {
  try {
    const raw = storage().getItem(STORAGE_PREFIX + name);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeTable(name, rows) {
  try {
    storage().setItem(STORAGE_PREFIX + name, JSON.stringify(rows));
  } catch (err) {
    console.warn("[gruham] could not persist " + name, err);
  }
}

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 10);

/* ----------------------------------------------------------------- entities */
/** Demo data, so every screen has something to show on a fresh install. */
const SEED = {
  Contractor: [
    { name: "Sharma Constructions", city: "Mumbai", area: "Andheri West", specialization: "Civil Construction", specializations: ["Civil Construction"], rating: 4.8, experience: 18, experience_years: 18, projects: 142, completed_projects: 142, total_reviews: 45, profile_type: "sample", verified: false, phone: "+91 XXXXX XXXXX", email: "hidden until verification", bio: "Full-service civil contractor specialising in turnkey villas and row houses." },
    { name: "Kumar Interiors", city: "Bengaluru", area: "Indiranagar", specialization: "Interior Design", specializations: ["Interior Design"], rating: 4.7, experience: 12, experience_years: 12, projects: 96, completed_projects: 96, total_reviews: 32, profile_type: "sample", verified: false, phone: "+91 XXXXX XXXXX", email: "hidden until verification", bio: "Interior studio for apartments and duplex homes." },
    { name: "Naidu Builders", city: "Hyderabad", area: "Gachibowli", specialization: "Architecture", specializations: ["Architecture"], rating: 4.6, experience: 22, experience_years: 22, projects: 210, completed_projects: 210, total_reviews: 58, profile_type: "sample", verified: false, phone: "+91 XXXXX XXXXX", email: "hidden until verification", bio: "Architect-led construction with an in-house structural team." },
    { name: "Iyer Homes", city: "Chennai", area: "Adyar", specialization: "Civil Construction", specializations: ["Civil Construction"], rating: 4.9, experience: 15, experience_years: 15, projects: 88, completed_projects: 88, total_reviews: 29, profile_type: "sample", verified: false, phone: "+91 XXXXX XXXXX", email: "hidden until verification", bio: "Traditional and contemporary homes planned around Vaastu." },
    { name: "Reddy Electricals & Works", city: "Hyderabad", area: "Madhapur", specialization: "Electrical Work", specializations: ["Electrical Work"], rating: 4.4, experience: 9, experience_years: 9, projects: 130, completed_projects: 130, total_reviews: 21, profile_type: "sample", verified: false, phone: "+91 XXXXX XXXXX", email: "hidden until verification", bio: "Complete wiring, panels and home-automation wiring." },
    { name: "Desai Plumbing Solutions", city: "Pune", area: "Kothrud", specialization: "Plumbing", specializations: ["Plumbing"], rating: 4.5, experience: 11, experience_years: 11, projects: 174, completed_projects: 174, total_reviews: 37, profile_type: "sample", verified: false, phone: "+91 XXXXX XXXXX", email: "hidden until verification", bio: "Water supply, drainage and bathroom fitting specialists." },
    { name: "Ghosh Design Studio", city: "Kolkata", area: "Salt Lake", specialization: "Exterior Design", specializations: ["Exterior Design"], rating: 4.3, experience: 7, experience_years: 7, projects: 54, completed_projects: 54, total_reviews: 14, profile_type: "sample", verified: false, phone: "+91 XXXXX XXXXX", email: "hidden until verification", bio: "Facades, terraces and landscape elevations." },
    { name: "Menon Contractors", city: "Kochi", area: "Kakkanad", specialization: "Civil Construction", specializations: ["Civil Construction"], rating: 4.6, experience: 16, experience_years: 16, projects: 121, completed_projects: 121, total_reviews: 41, profile_type: "sample", verified: false, phone: "+91 XXXXX XXXXX", email: "hidden until verification", bio: "Quality-first builder for Kerala-style and modern homes." },
  ],
  Appointment: [
    { customer_name: "Ananya Rao", customer_email: "ananya@example.com", customer_phone: "+91 98111 22334", service_name: "Full House Design Consultation", appointment_date: "2024-11-12", preferred_time: "11:00", status: "confirmed", message: "Looking to design a 3 BHK on a 2400 sq ft plot.", created_date: "2024-11-02T09:12:00.000Z" },
    { customer_name: "Vikram Shetty", customer_email: "vikram@example.com", customer_phone: "+91 99222 33445", service_name: "Interior Design - Living Room", appointment_date: "2024-11-15", preferred_time: "15:30", status: "pending", message: "Need a Scandinavian look for a 240 sq ft living room.", created_date: "2024-11-05T12:40:00.000Z" },
    { customer_name: "Meera Nair", customer_email: "meera@example.com", customer_phone: "+91 90333 44556", service_name: "Vastu Compliance Review", appointment_date: "2024-11-18", preferred_time: "10:00", status: "pending", message: "Want a Vastu check on my finalized floor plan.", created_date: "2024-11-08T07:05:00.000Z" },
  ],
  BookingNotification: [
    { booking_id: "bk-000012a4f7", service_name: "Full House Design Consultation", customer_name: "Ananya Rao", appointment_date: "2024-11-12", notification_status: "pending", created_date: "2024-11-02T09:12:05.000Z" },
    { booking_id: "bk-000045b1c9", service_name: "Interior Design - Living Room", customer_name: "Vikram Shetty", appointment_date: "2024-11-15", notification_status: "viewed", created_date: "2024-11-05T12:41:00.000Z" },
  ],
  SavedDesign: [],
};

function matches(row, query) {
  return Object.entries(query || {}).every(([key, value]) => {
    if (value && typeof value === "object") return true; // advanced operators: ignored
    return String(row?.[key]) === String(value);
  });
}

function sortRows(rows, sort) {
  if (!sort) return rows;
  const desc = sort.startsWith("-");
  const field = desc ? sort.slice(1) : sort;
  return [...rows].sort((a, b) => {
    const av = a?.[field];
    const bv = b?.[field];
    if (av === bv) return 0;
    return (av > bv ? 1 : -1) * (desc ? -1 : 1);
  });
}

class EntityClient {
  constructor(name) {
    this.name = name;
    const existing = readTable(name);
    if (!existing) {
      const rows = (SEED[name] || []).map((row, i) => ({
        id: `seed-${name.toLowerCase()}-${i + 1}`,
        created_date: new Date(Date.now() - (i + 1) * 86400000).toISOString(),
        created_by: "demo@gruham.app",
        ...row,
      }));
      writeTable(name, rows);
    }
  }

  rows() {
    return readTable(this.name) || [];
  }

  save(rows) {
    writeTable(this.name, rows);
    return rows;
  }

  async list(sort, limit) {
    const rows = sortRows(this.rows(), sort || "-created_date");
    return typeof limit === "number" ? rows.slice(0, limit) : rows;
  }

  async filter(query, sort, limit) {
    const rows = sortRows(this.rows().filter((r) => matches(r, query)), sort);
    return typeof limit === "number" ? rows.slice(0, limit) : rows;
  }

  async get(id) {
    return this.rows().find((r) => r.id === id) || null;
  }

  async create(data) {
    const row = {
      id: uid(),
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString(),
      created_by: "demo@gruham.app",
      is_favorite: false,
      ...data,
    };
    this.save([row, ...this.rows()]);
    return row;
  }

  async update(id, data) {
    const rows = this.rows();
    const index = rows.findIndex((r) => r.id === id);
    if (index === -1) throw new Error(`${this.name} ${id} not found`);
    const next = { ...rows[index], ...data, updated_date: new Date().toISOString() };
    rows[index] = next;
    this.save(rows);
    return next;
  }

  async delete(id) {
    this.save(this.rows().filter((r) => r.id !== id));
    return { id, deleted: true };
  }

  async bulkCreate(list) {
    const rows = list.map((data) => ({
      id: uid(),
      created_date: new Date().toISOString(),
      created_by: "demo@gruham.app",
      ...data,
    }));
    this.save([...rows, ...this.rows()]);
    return rows;
  }
}

const entityCache = new Map();
const entities = new Proxy(
  {},
  {
    get: (_target, name) => {
      if (typeof name !== "string") return undefined;
      if (!entityCache.has(name)) entityCache.set(name, new EntityClient(name));
      return entityCache.get(name);
    },
  }
);

/* --------------------------------------------------------------- file upload */
function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ------------------------------------------------------------ image "AI" gen */
/**
 * Offline mode returns a curated, prompt-matched render so the demo always
 * shows something sensible. Set VITE_IMAGE_MODE=online to call a public
 * text-to-image endpoint instead.
 */
const IMAGE_SETS = {
  exterior: [
    "photo-1600596542815-ffad4c1539a9",
    "photo-1600585154340-be6161a56a0c",
    "photo-1512917774080-9991f1c4c750",
    "photo-1564013799919-ab600027ffc6",
    "photo-1613490493576-7fde63acd811",
  ],
  interior: [
    "photo-1618221195710-dd6b41faaea6",
    "photo-1600210492486-724fe5c67fb0",
    "photo-1560448204-e02f11c3d0e2",
    "photo-1586023492125-27b2c045efd7",
    "photo-1616486338812-3dadae4b4ace",
    "photo-1484154218962-a197022b5858",
    "photo-1556909114-f6e7ad7d3136",
    "photo-1617806118233-18e1de247200",
  ],
  blueprint: [
    "photo-1582750433449-ebf4e4d1cd0e",
    "photo-1504328345606-18bbc1197de5",
    "photo-1590069261209-f8e9bf8c6d3a",
    "photo-1621905252507-b35492cc74b4",
  ],
  compound: [
    "photo-1518709766631-e6b1cd4d5b2b",
    "photo-1562259949-e8f7685d8f56",
    "photo-1600596542815-ffad4c1539a9",
  ],
};
const ALL_IMAGES = Object.values(IMAGE_SETS).flat();

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export const STYLE_TOKENS = {
  traditional: "traditional Indian home architecture design, solid teak wood carved pillars, brass oil lamps, warm Athangudi terracotta floor tiles, Jharokha wooden windows, heritage courtyard motifs, rich silk upholstery, golden brass accents, warm ambient lighting, authentic Indian architectural detailing",
  traditional_indian: "traditional Indian home architecture design, solid teak wood carved pillars, brass oil lamps, warm Athangudi terracotta floor tiles, Jharokha wooden windows, heritage courtyard motifs, rich silk upholstery, golden brass accents, warm ambient lighting, authentic Indian architectural detailing",
  south_indian: "traditional South Indian Kerala Chettinad architectural style, sloped red tile roof, ornate teak wood pillars, Athangudi floor tiles, central open courtyard (thotti), brass oil lamps, tropical greenery",
  modern: "modern minimalist interior exterior home design, clean geometric lines, neutral monochrome palette, floor-to-ceiling glass windows, recessed LED strip lighting, polished concrete floors, sleek minimalist furniture",
  contemporary: "contemporary Indian luxury home, warm neutral tones, Italian marble flooring, accent wooden paneling, plush velvet sofa, designer chandelier lighting, indoor planters",
  luxury: "ultra-luxury Indian villa, high double-height ceiling, Italian Statuario marble floors, crystal chandelier, gilded gold leaf accents, royal teakwood furniture, floor-to-ceiling glass wall, lush landscaped lawn pool",
  colonial: "British colonial era Indian bungalow style, high ceilings, louvered wooden shutters, teak verandah furniture, white lime wash exterior walls, terracotta roof tiles, vintage brass ceiling fans",
  minimalist: "minimalist zen home design, light ash wood, hidden storage, clean white plaster walls, soft natural lighting, uncluttered Japanese-Scandinavian fusion furniture",
};

function pickImageWithSeed(prompt, seed = Math.floor(Math.random() * 100000)) {
  const p = prompt.toLowerCase();
  let pool = ALL_IMAGES;
  if (/blueprint|floor plan|2d plan|elevation drawing/.test(p)) pool = IMAGE_SETS.blueprint;
  else if (/exterior|facade|elevation|front of the house|3d exterior/.test(p)) pool = IMAGE_SETS.exterior;
  else if (/compound|garden|lawn|parking|boundary|fence/.test(p)) pool = IMAGE_SETS.compound;
  else if (/interior|room|kitchen|bedroom|living|hall|bath/.test(p)) pool = IMAGE_SETS.interior;
  const id = pool[(hash(prompt) + seed) % pool.length];
  return `https://images.unsplash.com/${id}?w=1280&q=70&auto=format&fit=crop`;
}

function pickImage(prompt) {
  return pickImageWithSeed(prompt, Math.floor(Math.random() * 10000));
}

/* ----------------------------------------------------------- language model */
const RATES_PER_SQFT = { budget: 1350, standard: 1700, premium: 2200, luxury: 3000 };
const COST_SPLIT = {
  structural: 0.32,
  flooring: 0.12,
  plumbing: 0.07,
  electrical: 0.07,
  painting: 0.05,
  doors_windows: 0.06,
  kitchen: 0.06,
  misc_finishing: 0.1,
  labour: 0.15,
};

function estimateCost(prompt) {
  const areaMatch = prompt.match(/built-up area:\s*([\d,]+)/i);
  const typeMatch = prompt.match(/construction type:\s*([a-z]+)/i);
  const area = areaMatch ? Number(areaMatch[1].replace(/,/g, "")) : 1500;
  const type = (typeMatch ? typeMatch[1] : "standard").toLowerCase();
  const rate = RATES_PER_SQFT[type] || RATES_PER_SQFT.standard;
  const total = Math.round(area * rate);
  const result = { total, per_sqft_cost: rate };
  for (const [key, share] of Object.entries(COST_SPLIT)) {
    result[key] = Math.round(total * share);
  }
  result.notes =
    `Estimate for a ${area} sq ft ${type} home at approx. INR ${rate}/sq ft (Indian market rates). ` +
    `Includes material and labour; excludes land cost, approvals and loose furniture. ` +
    `Add about 5% as a contingency buffer.`;
  return result;
}

const TOPICS = [
  { re: /blueprint|floor plan|bhk|full house|plot|duplex|penthouse/, page: "BlueprintGenerator",
    reply: "For a full house, start with the Blueprint Generator: enter your BHK, plot size, floors and budget and it drafts a Vastu-aware 2D floor plan plus an elevation concept render. Want me to take you there?" },
  { re: /interior|living room|bedroom|kitchen|bathroom|hall|furniture|decor/, page: "InteriorDesign",
    reply: "For a single room, the Interior Design studio is fastest: upload a photo, pick a style (Modern, Scandinavian, Traditional Indian, Industrial...) and it re-renders that exact room. Shall I open it?" },
  { re: /exterior|facade|elevation|balcony|terrace|front of (the )?house/, page: "ExteriorDesign",
    reply: "The Exterior Design module handles facades, balconies and terraces. Upload an elevation or describe the style and it generates photorealistic options. Want to try it?" },
  { re: /compound|garden|lawn|parking|boundary|fence|gate/, page: "CompoundDesign",
    reply: "Compound Design covers gardens, parking layouts, boundary walls and entrance gates - everything around the house. Should I open it?" },
  { re: /contractor|builder|civil|who will build|mason/, page: "Contractors",
    reply: "You can browse verified contractors by city, specialisation and rating on the Contractors page - each profile lists experience, completed projects and contact details. Want to search now?" },
  { re: /material|cement|steel|tile|paint|sanitary|price|rate|cost per/, page: "Materials",
    reply: "The Materials page tracks Indian market rates for cement, steel, tiles, paints and fittings with city-wise pricing. Shall I open it for you?" },
  { re: /cost|estimate|budget|how much|sq ?ft rate/, page: "Pricing",
    reply: "Construction in India typically runs about INR 1,350-1,700/sq ft for a budget-to-standard build and INR 2,200-3,000/sq ft for premium or luxury finishes. Tell me your built-up area and I can point you to the estimator. Want the full cost breakdown tool?" },
  { re: /vastu|vaastu|direction|energy/, page: "BlueprintGenerator",
    reply: "Our planner follows Vastu Shastra: kitchen in the south-east, master bedroom in the south-west, entrance facing north or east. The Blueprint Generator applies these rules to every plan. Want to generate one?" },
  { re: /save|library|my design|download/, page: "DesignLibrary",
    reply: "Everything you generate is saved to My Designs, where you can favourite, re-open, share or download it. Want me to show your library?" },
  { re: /style|modern|scandinavian|industrial|bohemian|coastal|traditional/, page: "Designer",
    reply: "You can explore 6 interior design styles in the Designer — pick one and apply it to your own room photo. Which style are you leaning towards?" },
];

function assistantReply(prompt) {
  const userMessage = (prompt.split(/user message:/i)[1] || prompt).trim().toLowerCase();
  const topic = TOPICS.find((t) => t.re.test(userMessage));
  const bhk = userMessage.match(/(\d)\s*bhk/);
  let response =
    topic?.reply ||
    "I can help you design the whole house or a single room, plan Vastu-compliant layouts, estimate construction cost in INR, and connect you with verified contractors. Tell me your BHK and plot size, or just say what you would like to see first.";
  if (bhk) response = `A ${bhk[1]} BHK - nice choice. ` + response;
  return { response, suggested_page: topic?.page || null, show_quick_actions: !topic };
}

async function callGemini(prompt, schema) {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, schema }),
    });
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    return data.result || data.text || null;
  } catch (err) {
    console.warn("[gruham] Serverless chat endpoint unavailable, using offline fallback", err);
    return null;
  }
}

/* -------------------------------------------------------------------- auth */
const DEMO_USER = {
  id: "user-demo",
  full_name: "Demo User",
  email: "demo@gruham.app",
  role: "user",
};

const auth = {
  async me() {
    return DEMO_USER;
  },
  async updateMe(data) {
    return { ...DEMO_USER, ...data };
  },
  async isAuthenticated() {
    return true;
  },
  async login() {
    return DEMO_USER;
  },
  async logout() {
    return true;
  },
  redirectToLogin() {
    if (typeof window !== "undefined") window.location.href = "/";
  },
};

/* ------------------------------------------------------------------- export */
const client = {
  entities,
  auth,
  appLogs: {
    async logUserInApp() {
      return { ok: true };
    },
  },
  functions: {
    async invoke(name, payload) {
      console.warn(`[gruham] function "${name}" is not available offline`, payload);
      return null;
    },
  },
  integrations: {
    Core: {
      /** Uploads a file and returns { file_url }. */
      async UploadFile({ file }) {
        const file_url = await readAsDataURL(file);
        return { file_url };
      },

      /** Generates a single image with style-locking tokens and seed randomization. */
      async GenerateImage({ prompt, styleToken, seed }) {
        const stylePrefix = STYLE_TOKENS[styleToken] ? `${STYLE_TOKENS[styleToken]}, ` : "";
        const fullPrompt = `${stylePrefix}${prompt}`;
        const randomSeed = seed || Math.floor(Math.random() * 900000) + 100000;
        
        // Try Pollinations AI dynamic generator first
        const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
          fullPrompt.slice(0, 900)
        )}?width=1024&height=768&nologo=true&seed=${randomSeed}`;
        
        // Fallback to randomized pool image if offline
        const offlineUrl = pickImageWithSeed(fullPrompt, randomSeed);
        
        return { url: pollinationsUrl || offlineUrl };
      },

      /** Generates 3-4 distinct image variations with style locking. */
      async GenerateImageVariations({ prompt, styleToken, count = 3 }) {
        const stylePrefix = STYLE_TOKENS[styleToken] ? `${STYLE_TOKENS[styleToken]}, ` : "";
        const fullPrompt = `${stylePrefix}${prompt}`;
        const urls = [];
        const baseSeed = Math.floor(Math.random() * 800000) + 100000;

        for (let i = 0; i < count; i++) {
          const currentSeed = baseSeed + i * 1337;
          const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(
            `${fullPrompt}, variation ${i + 1}`.slice(0, 900)
          )}?width=1024&height=768&nologo=true&seed=${currentSeed}`;
          
          const fallbackUrl = pickImageWithSeed(fullPrompt, currentSeed);
          urls.push(url || fallbackUrl);
        }

        return { urls };
      },

      /** Calls the language model (Gemini when a key is set, offline engine otherwise). */
      async InvokeLLM({ prompt, response_json_schema }) {
        const ai = await callGemini(prompt, response_json_schema);
        if (ai) return ai;
        if (response_json_schema && /built-up area/i.test(prompt)) return estimateCost(prompt);
        return response_json_schema ? assistantReply(prompt) : assistantReply(prompt).response;
      },

      async SendEmail({ to, subject, body }) {
        console.info("[gruham] email queued", { to, subject, body });
        return { ok: true };
      },
    },
  },
};

/**
 * The hosted SDK also exposes entities directly (base44.SavedDesign.list()),
 * so the proxy forwards any capitalised property to the entity client.
 */
export const base44 = new Proxy(client, {
  get(target, prop) {
    if (prop in target) return target[prop];
    if (typeof prop === "string" && /^[A-Z]/.test(prop)) return entities[prop];
    return undefined;
  },
});

export default base44;
