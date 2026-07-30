# Electric Canvas — Client

> **React + Vite 8** — Frontend for the AI-powered t-shirt design platform.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![MUI](https://img.shields.io/badge/MUI-9-007FFF?logo=mui&logoColor=white)](https://mui.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?logo=reactquery&logoColor=white)](https://tanstack.com/query)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

---

## Overview

The Electric Canvas client is a full-featured t-shirt design studio built with modern React. Users can:

- **Design** t-shirts with text, images, and color overlays
- **Drag & drop** elements with rotation, flip, and alignment controls
- **Generate** AI product descriptions via OpenRouter/LangChain
- **Browse** the collection of community and AI-generated designs
- **Cart** & checkout flow with tax calculation

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Bundler | Vite 8 + rolldown |
| UI Kit | MUI 9 (Material-UI) |
| Styling | Tailwind CSS v4 + Emotion |
| Routing | react-router-dom 7 |
| Data Fetching | TanStack Query 5 |
| State | Zustand |
| Animations | GSAP 3 |
| Validation | Zod 4 |
| Auth | Clerk (removed — now auth-free) |
| AI | LangChain + OpenRouter (via server) |

---

## Project Structure

```
client/
├── public/              # Static assets (favicon, images)
│   └── favicon.svg
├── src/
│   ├── components/      # Shared UI components (Header, etc.)
│   ├── lib/             # API client, utilities
│   │   └── api.ts
│   ├── pages/           # Route pages
│   │   ├── Home.tsx
│   │   ├── DesignStudio.tsx   ← Main design canvas
│   │   ├── Collection.tsx     ← Product gallery
│   │   └── Cart.tsx
│   ├── store/           # Zustand stores
│   │   ├── designStore.ts
│   │   └── cartStore.ts
│   ├── App.tsx          # Router setup
│   ├── main.tsx         # Entry point
│   └── index.css        # Tailwind + theme
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (port 5173)
npm run dev

# Type-check & build
npm run build

# Lint
npm run lint

# Preview production build
npm run preview
```

---

## Key Features

### Design Studio (`/design-studio`)
- **Canvas**: T-shirt mockup with draggable, rotatable, flippable text & images
- **Text Tools**: Multiline input, font picker (6 fonts), color swatches, alignment
- **Image Tools**: Upload device images, 8 predefined designs, crop dialog
- **Shirt Colors**: 12 solid swatches, 6 gradient blocks, HEX input, mouseenter preview
- **Eraser Tool**: Click to clear text or remove placed images
- **AI Save**: Captures canvas as PNG via `html2canvas`, sends to server for AI description generation

### Collection (`/collection`)
- Static product grid + AI-generated designs (polled every 3s)
- Search by name, filter by price
- Product detail dialog with Buy Now / Delete (AI products)

### Cart (`/cart`)
- Items from collection or direct purchase
- 2% tax calculation, quantity/size management

---

## TypeScript Conventions

- `verbatimModuleSyntax: true` — use `import type` for type-only imports
- `erasableSyntaxOnly: true` — no enums/namespaces/parameter properties
- `noUnusedLocals` / `noUnusedParameters` — both on, will fail build
- `allowArbitraryExtensions: true` — CSS module imports

---

## Environment

No client-side `.env` needed. API base URL is hardcoded to `http://localhost:3001/api` in `src/lib/api.ts`.
