# Muse Dashboard (MERN boilerplate - frontend)

Barebones React + TypeScript + Vite setup with Tailwind CSS, Framer Motion, Zustand, and React Router.

Features
- Vite + React + TS
- Tailwind CSS (darkMode: class)
- Framer Motion
- Zustand (theme store example)
- React Router with routes: `/` (Dashboard) and `/settings`
- Minimal layout with a top navbar and theme toggle

Getting started
1. Install deps: `npm install`
2. Run dev server: `npm run dev`
3. Build: `npm run build`

Project structure
- src/
  - components/
    - Navbar.tsx
    - ThemeToggle.tsx
  - layouts/
    - AppLayout.tsx
  - pages/
    - Dashboard.tsx
    - Settings.tsx
  - routes/
    - router.tsx
  - store/
    - themeStore.ts
  - App.tsx
  - main.tsx
  - index.css

Notes
- Theme is controlled with a simple Zustand store and toggled by adding/removing the `dark` class on `document.documentElement`.
- Tailwind v4 works zero‑config with the `@tailwindcss/vite` plugin and `@import "tailwindcss"` in `src/index.css`. No `tailwind.config.ts` is required for this boilerplate. If you need custom theming or plugins later, you can add a config file back.


## shadcn/ui setup
- Token-based theming (light/dark) is defined in `src/index.css` using CSS variables.
- Tailwind is configured in `tailwind.config.ts` to expose semantic color utilities like `bg-background`, `text-foreground`, etc.
- A `cn` helper is available at `src/lib/utils.ts`.
- Vite alias `@` points to `src` so imports like `@/components/...` and `@/lib/utils` work.
- `components.json` is present to configure the shadcn CLI.

Add components
- Install deps if you haven’t yet: `npm install`
- Add a component via CLI, for example Button:
  - `npx shadcn@latest add button`
- Components will be placed under `src/components` and will work with the provided Tailwind tokens and aliasing.

Notes
- Dark mode is toggled via the `dark` class on `document.documentElement` (handled by the existing Zustand theme store).
- If you customize the color palette, update the CSS variables in `src/index.css` and keep the semantic color mapping in `tailwind.config.ts` in sync.
