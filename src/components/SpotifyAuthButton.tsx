import React, { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { loginWithSpotify, logoutFromSpotify, isSpotifyAuthenticated, refreshAccessToken } from "@/services/spotify-auth"
import { LogIn, LogOut, RefreshCw } from "lucide-react"

/**
 * Small auth utility button that toggles Login/Logout for Spotify.
 * - If not authenticated: shows "Log in"
 * - If authenticated: shows "Log out" and a small refresh token button
 */
export const SpotifyAuthButton: React.FC = () => {
  const [authed, setAuthed] = useState<boolean>(isSpotifyAuthenticated())
  const [refreshing, setRefreshing] = useState(false)

  const syncAuthState = useCallback(() => {
    setAuthed(isSpotifyAuthenticated())
  }, [])

  useEffect(() => {
    // Update when storage changes (e.g., login completes in same tab after callback route)
    const onStorage = (e: StorageEvent) => {
      if (["access_token", "expires_at", "refresh_token"].includes(e.key || "")) {
        syncAuthState()
      }
    }
    // Update when tab gains focus (tokens may expire/refresh in background)
    const onFocus = () => syncAuthState()

    window.addEventListener("storage", onStorage)
    window.addEventListener("focus", onFocus)
    return () => {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener("focus", onFocus)
    }
  }, [syncAuthState])

  const handleLogin = async () => {
    await loginWithSpotify()
  }

  const handleLogout = () => {
    logoutFromSpotify()
    syncAuthState()
    // Optional: reload to force-reset any state depending on tokens
    // location.reload()
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await refreshAccessToken()
    } catch (err) {
      console.error("Failed to refresh token:", err)
    } finally {
      setRefreshing(false)
      syncAuthState()
    }
  }

  if (!authed) {
    return (
      <Button variant="outline" size="sm" onClick={handleLogin} title="Log in to Spotify">
        <LogIn className="mr-2 h-4 w-4" />
        Log in
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={handleLogout} title="Log out of Spotify">
        <LogOut className="mr-2 h-4 w-4" />
        Log out
      </Button>
      <Button variant="ghost" size="icon" onClick={handleRefresh} title="Refresh access token" disabled={refreshing}>
        <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
      </Button>
    </div>
  )
}

export default SpotifyAuthButton
