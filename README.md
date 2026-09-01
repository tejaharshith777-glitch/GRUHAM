# GRUHAM — AI-Powered Home Design Platform

GRUHAM is a full-stack style web application for designing and planning Indian homes.
A user describes what they want (or uploads a photo), and the app produces blueprints,
3D-style visualisations, room-by-room interior designs, exterior/compound concepts,
material lists with Indian market rates, construction cost estimates and a directory
of verified contractors.

The app was prototyped on Base44 and is packaged here as a standard **React 18 + Vite
+ Tailwind** project that runs anywhere — no paid hosting, no paid export plan.

---

## 1. Features / modules

| Module | What it does |
| --- | --- |
| **Home** | Hero carousel, feature highlights, design-style showcase, room-type marquee, 4-step "how it works", testimonials, trust stats |
| **Blueprint Generator** | Enter BHK / plot size / floors / budget → generates a 2D floor-plan blueprint and a 3D exterior visualisation, then saves it |
| **Interior Design** | Pick a room + style (optionally upload a photo) → generates a redesigned render |
| **Exterior Design** | Facade, balcony and terrace concepts |
| **Compound Design** | Garden, parking, boundary wall and entrance ideas |
| **Designer** | Apply one of 50+ interior styles to a room |
| **Design Library** | Every generated design, with favourite / preview / share / delete |
| **Materials** | Construction material catalogue with Indian city-wise rates |
| **Contractors** | Verified contractor directory with city, rating, specialisation filters |
| **Contractor Register** | Onboarding form for contractors (specialisations, cities, portfolio upload) |
| **Pricing** | Plan comparison + construction cost estimator |
| **Gallery / Services / Team / Contact / Sitemap / Admin** | Marketing and administration screens |
| **AI Assistant** | Floating chat widget that answers questions and routes the user to the right module |

## 2. Tech stack

- **React 18** (components, hooks) + **Vite** (dev server & build)
- **React Router v6** — one route per screen
- **Tailwind CSS** + **shadcn/ui** (Radix primitives) — design system
- **Framer Motion** — animations and page transitions
- **Lucide** — icon set
- **TanStack Query** — data fetching / cache for the entity layer
- **localStorage** — the demo database

## 3. Getting started

```bash
npm install
npm run dev        # http://localhost:5173
```

```bash
npm run build      # production build into dist/
npm run preview    # serve the production build
```

### Pre-Deploy Verification
Before pushing or deploying updates, run:
```bash
npm run build && npm run preview
```
Then open `http://localhost:4173` in your browser to confirm the homepage and routes render without blank screens or console errors.

No API key, database or environment variable is required — the app boots with demo
data and a built-in offline AI engine.

## 4. Project structure

```
src/
├─ main.jsx                  React entry point (router + query provider)
├─ App.jsx                   Route table for all screens
├─ index.css                 Tailwind entry + shadcn design tokens
├─ lib/
│  ├─ utils.js               cn() class merger, createPageUrl()
│  └─ base44.js              backend layer: entities, auth, AI integrations
├─ components/
│  ├─ Layout.jsx             navigation bar + footer + AI assistant
│  ├─ AIAssistant.jsx        floating chat widget
│  └─ ui/                    shadcn components (button, input, textarea, select, tabs)
└─ pages/                    one file per screen (19 screens + 404)
```

## 5. Architecture

**Routing.** `App.jsx` maps every screen to `/ScreenName`; `createPageUrl("Design Library")`
returns the matching URL. The shared `Layout` renders the navigation, footer and the
floating assistant around the active page.

**Data layer (`src/lib/base44.js`).** All screens talk to a small client with the
same call surface the app was written against:

```js
base44.entities.SavedDesign.list("-created_date");
base44.entities.Contractor.filter({ city: "Chennai" });
base44.entities.SavedDesign.create({ title, design_type, ... });
base44.entities.SavedDesign.update(id, { is_favorite: true });
base44.entities.SavedDesign.delete(id);
```

Records are persisted in `localStorage` (`gruham:<Entity>`), so designs survive a
page reload. Demo rows for `Contractor`, `Appointment` and `BookingNotification` are
seeded on first run.

**AI layer.** `base44.integrations.Core` exposes `GenerateImage`, `InvokeLLM`,
`UploadFile` and `SendEmail`:

- `GenerateImage({ prompt })` → `{ url }`. Offline mode returns a curated, prompt-matched
  render; `VITE_IMAGE_MODE=online` switches to a public text-to-image endpoint.
- `InvokeLLM({ prompt, response_json_schema })` → object or text. Offline it runs a
  built-in engine that (a) computes a full construction cost breakdown from the built-up
  area and finish level, and (b) answers assistant questions and suggests the right page.
- `UploadFile({ file })` → `{ file_url }` (stored as a data URL).

**Optional: use a real model.** Copy `.env.example` to `.env` and set
`VITE_GEMINI_API_KEY`. Every `InvokeLLM` call then goes to Gemini, and the offline
engine stays as the automatic fallback. No other code changes are needed.

## 6. Data model

| Entity | Key fields |
| --- | --- |
| `SavedDesign` | `title`, `design_type` (full_house / interior / exterior / compound), `style`, `bhk`, `floors`, `plot_size`, `budget`, `blueprint_url`, `visualization_url`, `prompt`, `is_favorite` |
| `Contractor` | `name`, `city`, `area`, `specialization`, `rating`, `experience`, `projects`, `verified`, `phone`, `email`, `bio` |
| `Appointment` | `customer_name`, `customer_email`, `customer_phone`, `service_name`, `appointment_date`, `preferred_time`, `status`, `message` |
| `BookingNotification` | `booking_id`, `service_name`, `customer_name`, `appointment_date`, `notification_status` |

## 7. Notes

- Screens are self-contained: page-specific sections and their data live in the same
  file under `src/pages/`.
- The UI is responsive (mobile navigation collapses into a drawer) and follows a
  single gold/shell colour theme defined through CSS variables.
