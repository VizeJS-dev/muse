import React from 'react'
import type { Track } from '@/features/spotify/types'

interface TrackRowProps {
  track: Track
  index: number
  isCurrent: boolean
  isPlaying: boolean
  onClick: () => void
}

const formatDuration = (ms: number) => {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export const TrackRow: React.FC<TrackRowProps> = ({ track, index, isCurrent, isPlaying, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
        isCurrent ? 'bg-accent text-accent-foreground' : 'hover:bg-muted text-foreground'
      }`}
    >
      <span className="text-sm text-muted-foreground w-6">
        {isCurrent && isPlaying ? '♪' : index + 1}
      </span>

      {track.album.images[0] && (
        <img
          src={track.album.images[0].url}
          alt={track.album.name}
          className="w-10 h-10 rounded border border-border"
        />
      )}

      <div className="flex-1 min-w-0 text-left">
        <p className={`font-medium truncate ${isCurrent ? 'text-primary' : ''}`}>
          {track.name}
        </p>
        <p className="text-sm text-muted-foreground truncate">
          {track.artists.map(a => a.name).join(', ')}
        </p>
      </div>

      <span className="text-sm text-muted-foreground">
        {formatDuration(track.duration_ms)}
      </span>
    </button>
  )
}

export default TrackRow
