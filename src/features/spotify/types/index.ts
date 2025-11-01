export interface Playlist {
    id: string
    name: string
    images: { url: string }[]
    tracks: { total: number }
}

export interface Track {
    id: string
    name: string
    artists: { name: string }[]
    album: {
        name: string
        images: { url: string }[]
    }
    duration_ms: number
}

export interface PlaylistDetails {
    id: string
    name: string
    description: string
    images: { url: string }[]
    tracks: {
        items: {
            track: Track
        }[]
    }
}
