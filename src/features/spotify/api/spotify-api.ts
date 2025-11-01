// src/features/spotify/api/spotify-api.ts

import { getValidAccessToken } from '@/services/spotify-auth'

interface SpotifyPlaylist {
    id: string
    name: string
    description: string
    images: { url: string }[]
    tracks: { total: number }
    external_urls: { spotify: string }
    owner: {
        display_name: string
    }
}

interface SpotifyPlaylistsResponse {
    items: SpotifyPlaylist[]
    total: number
    next: string | null
}

// Fetch user's playlists
export const getUserPlaylists = async (limit = 50): Promise<import('@/features/spotify/types').Playlist[]> => {
    const token = await getValidAccessToken()

    let allPlaylists: SpotifyPlaylist[] = []
    let url = `https://api.spotify.com/v1/me/playlists?limit=${limit}`

    while (url) {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error('Failed to fetch playlists')
        }

        const data: SpotifyPlaylistsResponse = await response.json()
        allPlaylists = [...allPlaylists, ...data.items]
        url = data.next || ''
    }

    // Rely on structural typing: SpotifyPlaylist is compatible with our shared Playlist
    return allPlaylists
}

// Get specific playlist details
export const getPlaylist = async (playlistId: string): Promise<import('@/features/spotify/types').PlaylistDetails> => {
    const token = await getValidAccessToken()

    const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}`,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        }
    )

    if (!response.ok) {
        throw new Error('Failed to fetch playlist')
    }

    return response.json()
}

// Get user profile
export const getUserProfile = async () => {
    const token = await getValidAccessToken()

    const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })

    if (!response.ok) {
        throw new Error('Failed to fetch user profile')
    }

    return response.json()
}
