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
