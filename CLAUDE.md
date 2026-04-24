# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Dev server on http://localhost:3000 (HMR enabled by default)
npm run build        # Production build → dist/
npm run preview      # Preview production build locally
npm run lint         # TypeScript type check (tsc --noEmit)
npm run clean        # Remove build artifacts
```

## Environment Setup

Copy `.env.example` to `.env.local` and set `GEMINI_API_KEY` from Google AI Studio. When deployed to Cloud Run via AI Studio, secrets are injected automatically. `APP_URL` is set by Cloud Run at runtime.

## Architecture

This is a Vite + React 19 + TypeScript SPA. There is no backend beyond a minimal Express server (`express` is listed as a dependency for potential Cloud Run use). All AI calls happen client-side via `@google/genai`.

**Data flow:**
1. User selects ingredients/filters in `PantrySection` → state lives in `App.tsx`
2. `App.tsx` builds a prompt and calls Gemini 2.0-Flash-Preview with a structured JSON response schema
3. The AI response is validated and stored as a `Recipe` object in `aiGeneratedRecipe` state
4. `AIGeneratedRecipe` component renders the result; user can save it to `userRecipes` or print to PDF
5. All recipes (built-in + user-added + AI-generated) are filtered via `useMemo` in `App.tsx` and rendered as `RecipeCard` components

**Key files:**
- `src/App.tsx` — all state management, AI generation logic, and recipe filtering
- `src/types.ts` — `Recipe` and `Profile` interfaces
- `src/constants.ts` — Bohra flavor profiles (7), cuisine types, ingredient list, difficulty levels
- `src/components/` — presentational components; `PantrySection` owns filter UI, `AIGeneratedRecipe` owns the AI result display

## Tech Stack

- **UI:** React 19, Tailwind CSS 4 (via Vite plugin), Motion/React 12 for animations, Lucide React icons
- **AI:** `@google/genai` SDK, model `gemini-2.0-flash-preview-image-generation` (or `gemini-2.0-flash-preview`)
- **Build:** Vite 6.2, TypeScript targeting ES2022
- **Path alias:** `@/*` → project root (configured in both `vite.config.ts` and `tsconfig.json`)

## Styling Conventions

The design uses a dark luxury theme with these brand tokens (defined as Tailwind config and CSS variables in `index.css`):
- Gold: `#DAA520` | Brown: `#8B4513` | Background: `#0F0D0B` | Cream: `#E8E1D9`
- Glass-morphism utility classes: `glass-card`, `glass-nav`
- Print styles are in `index.css` under `@media print` — preserving these is important for the PDF export feature

## Domain Context

The app is culturally specific to **Dawoodi Bohra** cuisine. The 7 flavor profiles (`Khatt-Mitth`, `Zaikedaar`, `Kurkura`, `Masaledaar`, `Malai`, `Dhungaar`, `Kharas`) have defined descriptions in `constants.ts` that are passed verbatim into the AI prompt. Preserve the Urdu/Bohra terminology and cultural framing in any AI prompt modifications.

Do not make any changes, until you have 955 confidence in what you need to build. Ask me followup questions until you reach that level of confidence.
