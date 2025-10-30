// src/components/SpotifyCallback.tsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { handleCallback } from '@/services/spotify-auth'

export function SpotifyCallback() {
    const navigate = useNavigate()

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        const error = urlParams.get('error')

        if (error) {
            console.error('Spotify auth error:', error)
            navigate('/')
            return
        }

        if (code) {
            handleCallback(code)
                .then(() => {
                    navigate('/')
                })
                .catch((err) => {
                    console.error('Error handling callback:', err)
                    navigate('/')
                })
        }
    }, [navigate])

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h2 className="text-xl font-semibold">Connecting to Spotify...</h2>
                <p className="text-muted-foreground mt-2">Please wait</p>
            </div>
        </div>
    )
}