import React from 'react'
import type {Playlist} from '@/features/spotify/types'

interface PlaylistCardProps {
    playlist: Playlist
    selected?: boolean
    onClick: () => void
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({playlist, selected, onClick}) => {
    return (
        <button
            onClick={onClick}
            className={`text-card-foreground p-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-left ${
                selected ? 'bg-accent' : ''
            }`}
        >
            <div className="flex space-x-4">
                {playlist.images[0] && (
                    <img
                        src={playlist.images[0].url}
                        alt={playlist.name}
                        className="w-16 h-16 object-cover rounded-md"
                    />
                )}
                <div>
                    <h3 className="font-semibold truncate">{playlist.name}</h3>
                    <p className="text-sm text-muted-foreground">
                        {`Playlist - ${playlist.owner.display_name}`}
                    </p>
                </div>
            </div>
        </button>
    )
}

export default PlaylistCard
