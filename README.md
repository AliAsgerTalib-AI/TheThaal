<div align="center">
<img width="1200" height="475" alt="TheThaal Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# The Thaal

**AI-powered orchestration platform for traditional Bohra culinary events.**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Gemini](https://img.shields.io/badge/Gemini_AI-1.5_|_2.5-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## Features

- **AI Event Planner** — Multi-step Thaal orchestration with Gemini 2.5 Pro: dish sequencing, ritual timing, and synchronized three-track timelines (Active Cooking / Host Rituals / Prep+Plating)
- **AI Recipe Synthesis** — Generate culturally authentic recipes from pantry ingredients using Gemini 1.5 Flash
- **Kitchen Mode** — Full-screen, step-by-step recipe execution with distraction-free UI
- **Verified Recipe Archive** — Curated library of traditional Bohra dishes with category, flavor profile, and heritage metadata
- **Master Ingredient List** — Auto-scaled, consolidated shopping list across all event dishes
- **Multi-Audit Engine** — AI-generated engineering, QA, safety, and culinary combination audits per plan
- **Spices & Traditions Pages** — Reference content for Bohra spice profiles and ritual context
- **Persistent Storage** — Plans and recipes archived to `localStorage`; print-ready output via CSS print styles

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript 5.8 |
| Build | Vite 6, `@vitejs/plugin-react` |
| Styling | Tailwind CSS 4 (Vite plugin), Framer Motion (`motion`) |
| AI | `@google/genai` — Gemini 1.5 Flash + Gemini 2.5 Pro |
| Icons | Lucide React |
| Deployment | Google AI Studio (Cloud Run) |

---

## Quick Start

**Prerequisites:** Node.js 18+

```bash
# 1. Clone and install
git clone https://github.com/AliAsgerTalib-AI/TheThaal.git
cd TheThaal
npm install

# 2. Configure environment
cp .env.example .env.local
# Set GEMINI_API_KEY in .env.local

# 3. Run dev server
npm run dev
# → http://localhost:3000
```

### Environment Variables

```env
GEMINI_API_KEY="your_gemini_api_key"   # Required — get one at aistudio.google.com
APP_URL="http://localhost:3000"         # Injected automatically on Cloud Run
```

### Other Commands

```bash
npm run build    # Production build → /dist
npm run preview  # Preview production build locally
npm run lint     # TypeScript type-check (tsc --noEmit)
```

---

## Project Structure

```
TheThaal/
├── src/
│   ├── App.tsx                    # Root: all page-level state, navigation, localStorage
│   ├── main.tsx                   # Vite entrypoint
│   ├── types.ts                   # Core interfaces: Recipe, ThaalPlan
│   ├── constants.ts               # Flavor profiles, cuisine types, ingredients
│   ├── index.css                  # Design tokens, Tailwind config, print styles
│   ├── data/
│   │   └── verifiedRecipes.ts     # Hardcoded verified recipe records
│   └── components/
│       ├── ThaalPlanner.tsx        # ~900 lines — event orchestration + AI audits
│       ├── RecipesPage.tsx         # Recipe gallery + AI synthesis from pantry
│       ├── KitchenMode.tsx         # Full-screen step-by-step cooking interface
│       ├── ArchivePage.tsx         # Saved plans and recipes
│       ├── MasterListPage.tsx      # Consolidated ingredient list
│       ├── SpicesPage.tsx          # Bohra spice reference
│       ├── TraditionPage.tsx       # Cultural ritual context
│       ├── AboutPage.tsx           # App introduction
│       └── Navigation.tsx          # State-driven navigation (no React Router)
├── .env.example
├── vite.config.ts                 # HMR disabled when DISABLE_HMR=true (Cloud Run)
├── tsconfig.json                  # Path alias: @/* → project root
└── package.json
```

> **Navigation note:** There is no React Router. All routing is boolean state in `App.tsx` toggled via `closeAllPages()` + flag setters.

---

## Deployment

The app targets **Google AI Studio (Cloud Run)**. At runtime, AI Studio injects `GEMINI_API_KEY` and `APP_URL` automatically. HMR is disabled in that environment via `DISABLE_HMR=true`.

For manual Cloud Run deployment, build the static assets and serve `/dist` behind any static host or Node/Express server.

---

## Roadmap

- [ ] Multi-guest dietary restriction tracking
- [ ] Cloud sync for plans (Firestore or Supabase)
- [ ] Offline-capable PWA with service worker
- [ ] Voice-guided Kitchen Mode
- [ ] Community recipe submission and verification pipeline
- [ ] Export plans to PDF / Google Calendar

---

## Contributing

1. Fork the repo and create a feature branch
2. Follow existing patterns: lifted state in `App.tsx`, Tailwind for styling, Framer Motion for transitions
3. Run `npm run lint` before opening a PR
4. Open a PR with a clear description of what changed and why

Bug reports and feature requests welcome via [GitHub Issues](https://github.com/AliAsgerTalib-AI/TheThaal/issues).

---

## License

MIT © Ali Asger Talib
