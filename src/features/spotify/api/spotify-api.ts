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

interface SpotifyPlaylistTracksResponse {
    items: { track: import('@/features/spotify/types').Track | null }[]
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

// Get all tracks for a playlist (handles Spotify paging >100)
export const getAllPlaylistTracks = async (playlistId: string, pageLimit = 100): Promise<import('@/features/spotify/types').Track[]> => {
    const token = await getValidAccessToken()

    let allTracks: import('@/features/spotify/types').Track[] = []
    let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${pageLimit}`

    while (url) {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error('Failed to fetch playlist tracks')
        }

        const data: SpotifyPlaylistTracksResponse = await response.json()
        const pageTracks = data.items
            .map(i => i.track)
            .filter((t): t is import('@/features/spotify/types').Track => Boolean(t))
        allTracks = [...allTracks, ...pageTracks]
        url = data.next || ''
    }

    return allTracks
}

// Get user profile
export const getUserProfile = async (): Promise<import('@/features/spotify/types').UserDetails> => {
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

export const getUserProfileById = async (userId: string): Promise<import('@/features/spotify/types').UserDetails> => {
    const token = await getValidAccessToken()

    const response = await fetch(`https://api.spotify.com/v1/users/${userId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })

    if (!response.ok) {
        throw new Error('Failed to fetch user profile')
    }

    return response.json()
}

