// src/services/spotify-auth.ts

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI
const SCOPES = [
    'user-read-private',
    'user-read-email',
    'user-read-playback-state',
    'user-modify-playback-state',
].join(' ')

// Generate random string for state verification
const generateRandomString = (length: number) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const values = crypto.getRandomValues(new Uint8Array(length))
    return values.reduce((acc, x) => acc + possible[x % possible.length], '')
}

// Authorization Code Flow with PKCE (recommended)
export const loginWithSpotify = async () => {
    const codeVerifier = generateRandomString(64)
    const data = new TextEncoder().encode(codeVerifier)
    const hashed = await crypto.subtle.digest('SHA-256', data)

    const codeChallenge = btoa(String.fromCharCode(...new Uint8Array(hashed)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')

    // Store code verifier for later use
    localStorage.setItem('code_verifier', codeVerifier)

    const authUrl = new URL('https://accounts.spotify.com/authorize')
    const params = {
        client_id: CLIENT_ID,
        response_type: 'code',
        redirect_uri: REDIRECT_URI,
        scope: SCOPES,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
    }

    authUrl.search = new URLSearchParams(params).toString()
    window.location.href = authUrl.toString()
}

// Handle callback and exchange code for token
export const handleCallback = async (code: string) => {
    const codeVerifier = localStorage.getItem('code_verifier')

    if (!codeVerifier) {
        throw new Error('Code verifier not found')
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: CLIENT_ID,
            grant_type: 'authorization_code',
            code,
            redirect_uri: REDIRECT_URI,
            code_verifier: codeVerifier,
        }),
    })

    if (!response.ok) {
        throw new Error('Failed to exchange code for token')
    }

    const data = await response.json()

    // Store tokens
    localStorage.setItem('access_token', data.access_token)
    localStorage.setItem('refresh_token', data.refresh_token)
    localStorage.setItem('expires_at', String(Date.now() + data.expires_in * 1000))

    // Clean up
    localStorage.removeItem('code_verifier')

    return data
}