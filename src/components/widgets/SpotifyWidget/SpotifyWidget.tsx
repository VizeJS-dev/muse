
import { useEffect, useState } from 'react'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable.tsx";
import { getUserPlaylists, getPlaylist } from '@/services/spotify-api'
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'

interface Playlist {
    id: string
    name: string
    images: { url: string }[]
    tracks: { total: number }
}

interface Track {
    id: string
    name: string
    artists: { name: string }[]
    album: {
        name: string
        images: { url: string }[]
    }
    duration_ms: number
}

interface PlaylistDetails {
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

export const SpotifyWidget = () => {
    const [playlists, setPlaylists] = useState<Playlist[]>([])
    const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistDetails | null>(null)
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [volume, setVolume] = useState(50)
    const [loading, setLoading] = useState(true)
    const [loadingTracks, setLoadingTracks] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        getUserPlaylists()
            .then(setPlaylists)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }, [])

    const handlePlaylistClick = async (playlistId: string) => {
        setLoadingTracks(true)
        try {
            const playlistDetails = await getPlaylist(playlistId)
            setSelectedPlaylist(playlistDetails)
        } catch (err) {
            console.error('Failed to load playlist:', err)
        } finally {
            setLoadingTracks(false)
        }
    }

    const handleTrackClick = (track: Track) => {
        setCurrentTrack(track)
        setIsPlaying(true)
        setProgress(0)
    }

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying)
    }

    const formatDuration = (ms: number) => {
        const minutes = Math.floor(ms / 60000)
        const seconds = Math.floor((ms % 60000) / 1000)
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-foreground">Loading playlists...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-destructive">Error: {error}</p>
            </div>
        )
    }

    return (
        <div id="resizable" className="h-full w-full bg-background">
            <ResizablePanelGroup direction="vertical">
                {/* Main Content Area (Horizontal Split) */}
                <ResizablePanel defaultSize={85} minSize={50}>
                    <ResizablePanelGroup direction="horizontal">
                        {/* Playlists Panel */}
                        <ResizablePanel defaultSize={40} minSize={30}>
                            <div className="h-full overflow-y-auto bg-background">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                                    {playlists.map((playlist) => (
                                        <button
                                            key={playlist.id}
                                            onClick={() => handlePlaylistClick(playlist.id)}
                                            className={`bg-card text-card-foreground p-4 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-left border border-border ${
                                                selectedPlaylist?.id === playlist.id ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
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
                                            <p className="text-sm text-muted-foreground">
                                                {playlist.tracks.total} tracks
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </ResizablePanel>

                        <ResizableHandle/>

                        {/* Tracks Panel */}
                        <ResizablePanel defaultSize={60}>
                            <div className="h-full overflow-y-auto p-4 bg-background">
                                {loadingTracks ? (
                                    <div className="flex items-center justify-center h-full">
                                        <p className="text-muted-foreground">Loading tracks...</p>
                                    </div>
                                ) : selectedPlaylist ? (
                                    <div>
                                        {/* Playlist Header */}
                                        <div className="mb-6 flex gap-4 items-start p-4 bg-card rounded-lg border border-border">
                                            {selectedPlaylist.images[0] && (
                                                <img
                                                    src={selectedPlaylist.images[0].url}
                                                    alt={selectedPlaylist.name}
                                                    className="w-32 h-32 object-cover rounded-md border border-border"
                                                />
                                            )}
                                            <div className="flex-1">
                                                <h2 className="text-2xl font-bold mb-2 text-card-foreground">
                                                    {selectedPlaylist.name}
                                                </h2>
                                                {selectedPlaylist.description && (
                                                    <p className="text-muted-foreground text-sm mb-2">
                                                        {selectedPlaylist.description}
                                                    </p>
                                                )}
                                                <p className="text-sm text-muted-foreground">
                                                    {selectedPlaylist.tracks.items.length} tracks
                                                </p>
                                            </div>
                                        </div>

                                        {/* Track List */}
                                        <div className="space-y-1">
                                            {selectedPlaylist.tracks.items.map((item, index) => {
                                                const track = item.track
                                                const isCurrentTrack = currentTrack?.id === track.id
                                                return (
                                                    <button
                                                        key={`${track.id}-${index}`}
                                                        onClick={() => handleTrackClick(track)}
                                                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                                                            isCurrentTrack
                                                                ? 'bg-accent text-accent-foreground'
                                                                : 'hover:bg-muted text-foreground'
                                                        }`}
                                                    >
                                                        {/* Track Number */}
                                                        <span className="text-sm text-muted-foreground w-6">
                                                            {isCurrentTrack && isPlaying ? '♪' : index + 1}
                                                        </span>

                                                        {/* Album Art */}
                                                        {track.album.images[0] && (
                                                            <img
                                                                src={track.album.images[0].url}
                                                                alt={track.album.name}
                                                                className="w-10 h-10 rounded border border-border"
                                                            />
                                                        )}

                                                        {/* Track Info */}
                                                        <div className="flex-1 min-w-0 text-left">
                                                            <p className={`font-medium truncate ${
                                                                isCurrentTrack ? 'text-primary' : ''
                                                            }`}>
                                                                {track.name}
                                                            </p>
                                                            <p className="text-sm text-muted-foreground truncate">
                                                                {track.artists.map(a => a.name).join(', ')}
                                                            </p>
                                                        </div>

                                                        {/* Duration */}
                                                        <span className="text-sm text-muted-foreground">
                                                            {formatDuration(track.duration_ms)}
                                                        </span>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <p className="text-muted-foreground">
                                            Select a playlist to view tracks
                                        </p>
                                    </div>
                                )}
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>

                <ResizableHandle/>

                {/* Player Controls Panel (Bottom) */}
                <ResizablePanel defaultSize={15} minSize={10} maxSize={25}>
                    <div className="h-full bg-card text-card-foreground border-t border-border flex flex-col">
                        {currentTrack ? (
                            <>
                                {/* Now Playing Info */}
                                <div className="flex items-center gap-4 p-4 border-b border-border">
                                    {currentTrack.album.images[0] && (
                                        <img
                                            src={currentTrack.album.images[0].url}
                                            alt={currentTrack.album.name}
                                            className="w-14 h-14 rounded border border-border"
                                        />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold truncate text-card-foreground">
                                            {currentTrack.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground truncate">
                                            {currentTrack.artists.map(a => a.name).join(', ')}
                                        </p>
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="flex-1 flex flex-col justify-center px-4">
                                    {/* Playback Buttons */}
                                    <div className="flex mt-3 items-center justify-center gap-2 mb-3">
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Shuffle className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <SkipBack className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="default"
                                            size="icon"
                                            className="h-10 w-10"
                                            onClick={togglePlayPause}
                                        >
                                            {isPlaying ? (
                                                <Pause className="h-5 w-5" />
                                            ) : (
                                                <Play className="h-5 w-5" />
                                            )}
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <SkipForward className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Repeat className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground w-10 text-right">
                                            {formatDuration(progress)}
                                        </span>
                                        <Slider
                                            value={[progress]}
                                            max={currentTrack.duration_ms}
                                            step={1000}
                                            onValueChange={(value) => setProgress(value[0])}
                                            className="flex-1"
                                        />
                                        <span className="text-xs text-muted-foreground w-10">
                                            {formatDuration(currentTrack.duration_ms)}
                                        </span>
                                    </div>
                                </div>

                                {/* Volume Control */}
                                <div className="flex items-center gap-2 px-4 pb-4">
                                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                                    <Slider
                                        value={[volume]}
                                        max={100}
                                        step={1}
                                        onValueChange={(value) => setVolume(value[0])}
                                        className="w-24"
                                    />
                                    <span className="text-xs text-muted-foreground w-8">
                                        {volume}%
                                    </span>
                                </div>
                            </>
                        ) : (
                            <div className="h-full flex items-center justify-center">
                                <p className="text-muted-foreground text-sm">
                                    Select a track to play
                                </p>
                            </div>
                        )}
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}