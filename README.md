# Muse - Custom Spotify Web Widget

MusicVibe is a modern web application built with React, TypeScript and Vite that displays a customizable Spotify
playback widget. It allows you to view and control your currently playing Spotify track with a beautiful and responsive
interface.

## Features

- Real-time display of currently playing Spotify track
- Playback controls (play, pause, next, previous)
- Progress bar with seeking capability
- Album artwork display
- Track and artist information
- Light/Dark theme toggle
- Responsive design that works on desktop and mobile
- OAuth2 authentication flow with Spotify

## Tech Stack

- React 18 with TypeScript
- Vite for fast development and optimized builds
- TailwindCSS for styling
- Radix UI primitives for accessible components
- React Router for navigation
- Spotify Web Playback SDK

## Getting Started

1. Clone this repository
2. Install dependencies:
# Muse - Custom Spotify Web Widget

Muse is a modern web application built with React, TypeScript and Vite that displays a customizable Spotify
playback widget. It allows you to view and control your currently playing Spotify track with a beautiful and responsive
interface.

## Features

- Real-time display of currently playing Spotify track
- Playback controls (play, pause, next, previous)
- Progress bar with seeking capability
- Album artwork display
- Track and artist information
- Light/Dark theme toggle
- Responsive design that works on desktop and mobile
- OAuth2 authentication flow with Spotify

## Tech Stack

- React 18 with TypeScript
- Vite for fast development and optimized builds
- TailwindCSS for styling
- Radix UI primitives for accessible components
- React Router for navigation
- Spotify Web Playback SDK

## Getting Started

1. Clone this repository
2. Install dependencies:


## Folder structure (updated)

We reorganized the codebase to a feature‑oriented structure. The Spotify widget and its related code now live under `src/features/spotify`.

- src/
  - features/
    - spotify/
      - components/
        - SpotifyWidget.tsx
        - PlaylistCard.tsx
        - TrackRow.tsx
      - types/
        - index.ts
      - api/
        - spotify-api.ts
  - components/
    - ui/ … shared UI primitives (Button, Slider, Spinner, Resizable, etc.)
  - services/
    - spotify-auth.ts … shared auth/token utilities
  - App.tsx, main.tsx, etc.

Notes:
- The legacy folder `src/components/widgets/SpotifyWidget/` and its duplicated files (SpotifyWidget.tsx, PlaylistCard.tsx, TrackRow.tsx, types.ts) have been removed as part of the completed migration.
- We kept the shared `spotify-auth.ts` in `src/services` since it’s not Spotify‑feature UI specific and may be reused.

## Import examples

- Use the Spotify widget in your app:

```tsx
import { SpotifyWidget } from '@/features/spotify/components/SpotifyWidget'

export default function Home() {
  return <SpotifyWidget />
}
```

- Import Spotify feature types in other parts of the app:

```ts
import type { Track, Playlist, PlaylistDetails } from '@/features/spotify/types'
```

- Call Spotify feature API:

```ts
import { getUserPlaylists, getPlaylist, getUserProfile } from '@/features/spotify/api/spotify-api'
```

- Shared UI primitives remain under `@/components/ui/*`:

```tsx
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
```

## Rationale

- Feature‑first layout keeps UI, API calls, and types for a feature co‑located.
- Shared, reusable primitives (UI, providers, generic services) remain under their existing top‑level folders.
- Minimal aliasing: we continue using the existing root alias `@/*` (configured in `tsconfig.json`), so no tooling changes are required.

## Next steps (optional)

- Remove the old `src/components/widgets/SpotifyWidget` files once you’re comfortable with the new structure.
- If you plan to add more features, mirror this layout by creating `src/features/<feature-name>/{components,api,types}`.
