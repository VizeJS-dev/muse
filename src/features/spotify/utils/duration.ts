// src/features/spotify/utils/duration.ts

import type { Track } from '@/features/spotify/types'

/**
 * Sum the duration (in milliseconds) of an array of tracks.
 */
export const totalDurationMsFromTracks = (tracks: Track[]): number => {
  return tracks.reduce((total, t) => total + (t?.duration_ms ?? 0), 0)
}

/**
 * Format a total duration in milliseconds into a human-readable string used in playlist header.
 * Matches the existing UI format:
 * - If hours > 0: "Xh Ymin"
 * - Otherwise: "Ymin Zsec"
 */
export const formatPlaylistDuration = (ms: number): string => {
  const hours = Math.floor(ms / 3_600_000)
  const minutes = Math.floor((ms % 3_600_000) / 60_000)
  const seconds = Math.floor((ms % 60_000) / 1_000)

  return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min ${seconds}sec`
}
