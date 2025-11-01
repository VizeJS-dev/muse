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

interface SpotifySavedAlbumsResponse {
    items: { album: {
        id: string
        name: string
        images: { url: string }[]
        artists: { name: string }[]
        total_tracks?: number
    } }[]
    total: number
    next: string | null
}

interface SpotifyAlbumTracksResponse {
    items: {
        id: string
        name: string
        artists: { name: string }[]
        duration_ms: number
    }[]
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

// Get all tracks for an album (handles paging) and maps to our Track with album images/name
export const getAllAlbumTracks = async (albumId: string, pageLimit = 50): Promise<import('@/features/spotify/types').Track[]> => {
    const token = await getValidAccessToken()

    // Fetch album details to enrich tracks with album images/name
    const albumRes = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
    })
    if (!albumRes.ok) {
        throw new Error('Failed to fetch album details')
    }
    const albumJson: { name: string; images: { url: string }[]; tracks: SpotifyAlbumTracksResponse } = await albumRes.json()

    // First page of tracks comes within albumJson.tracks
    let allTracks: import('@/features/spotify/types').Track[] = albumJson.tracks.items.map((t) => ({
        id: t.id,
        name: t.name,
        artists: t.artists.map(a => ({ name: a.name })),
        duration_ms: (t as any).duration_ms ?? 0,
        album: {
            name: albumJson.name,
            images: albumJson.images ?? [],
        },
    }))

    // Continue with pagination if next exists
    let url = albumJson.tracks.next ? albumJson.tracks.next.replace(/limit=\d+/, `limit=${pageLimit}`) : ''
    while (url) {
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` },
        })
        if (!response.ok) {
            throw new Error('Failed to fetch album tracks')
        }
        const data: SpotifyAlbumTracksResponse = await response.json()
        const page = data.items.map((t) => ({
            id: t.id,
            name: t.name,
            artists: t.artists.map(a => ({ name: a.name })),
            duration_ms: (t as any).duration_ms ?? 0,
            album: {
                name: albumJson.name,
                images: albumJson.images ?? [],
            },
        })) as import('@/features/spotify/types').Track[]
        allTracks = [...allTracks, ...page]
        url = data.next || ''
    }

    return allTracks
}

// Get user's saved albums
export const getUserSavedAlbums = async (limit = 50): Promise<import('@/features/spotify/types').Album[]> => {
    const token = await getValidAccessToken()

    let allAlbums: { id: string; name: string; images: { url: string }[]; artists: { name: string }[]; total_tracks?: number }[] = []
    let url = `https://api.spotify.com/v1/me/albums?limit=${limit}`

    while (url) {
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` },
        })
        if (!response.ok) {
            throw new Error('Failed to fetch saved albums')
        }
        const data: SpotifySavedAlbumsResponse = await response.json()
        const page = data.items.map(i => i.album)
        allAlbums = [...allAlbums, ...page]
        url = data.next || ''
    }

    return allAlbums as unknown as import('@/features/spotify/types').Album[]
}

// Get specific album details
export const getAlbum = async (albumId: string): Promise<import('@/features/spotify/types').AlbumDetails> => {
    const token = await getValidAccessToken()

    const response = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
    })
    if (!response.ok) {
        throw new Error('Failed to fetch album')
    }
    return response.json()
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

