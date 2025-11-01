import React from 'react'
import { Playlist } from './types'

interface PlaylistCardProps {
  playlist: Playlist
  selected?: boolean
  onClick: () => void
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, selected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-card text-card-foreground p-4 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-left border border-border ${
        selected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
      }`}
    >
      {playlist.images[0] && (
        <img
          src={playlist.images[0].url}
          alt={playlist.name}
          className="w-full aspect-square object-cover rounded-md mb-2"
        />
      )}
      <h3 className="font-semibold truncate">{playlist.name}</h3>
      <p className="text-sm text-muted-foreground">{playlist.tracks.total} tracks</p>
    </button>
  )
}

export default PlaylistCard
