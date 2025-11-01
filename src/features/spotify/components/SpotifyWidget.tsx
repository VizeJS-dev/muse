import { useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable.tsx";
import {
  getUserPlaylists,
  getPlaylist,
  getUserProfileById,
  getAllPlaylistTracks,
} from "@/features/spotify/api/spotify-api";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Shuffle,
  Repeat,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaylistCard } from "./PlaylistCard";
import { TrackRow } from "./TrackRow";
import type {
  Playlist,
  Track,
  PlaylistDetails,
} from "@/features/spotify/types";

export const SpotifyWidget = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] =
    useState<PlaylistDetails | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(50);
  const [loading, setLoading] = useState(true);
  const [loadingTracks, setLoadingTracks] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getUserPlaylists()
      .then(setPlaylists)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : String(err)),
      )
      .finally(() => setLoading(false));
  }, []);

  const handlePlaylistClick = async (playlistId: string) => {
    setLoadingTracks(true);
    try {
      const playlistDetails = await getPlaylist(playlistId);

      // Fetch owner profile to get images
      try {
        const ownerProfile = await getUserProfileById(playlistDetails.owner.id);
        playlistDetails.owner.images = ownerProfile.images;
      } catch (err) {
        console.warn("Failed to load owner profile:", err);
        // Continue without owner images - fallback will show
      }

      // Fetch all tracks with pagination (overcomes Spotify's 100-item limit)
      try {
        const allTracks = await getAllPlaylistTracks(playlistId);
        const items = allTracks.map((t) => ({ track: t }));
        const merged: PlaylistDetails = {
          ...playlistDetails,
          tracks: {
            ...playlistDetails.tracks,
            items,
            total: allTracks.length,
          },
        };
        setSelectedPlaylist(merged);
      } catch (err) {
        console.warn("Failed to load all tracks (showing first page only):", err);
        // Fallback to the first page that came with playlistDetails
        setSelectedPlaylist(playlistDetails);
      }
    } catch (err) {
      console.error("Failed to load playlist:", err);
    } finally {
      setLoadingTracks(false);
    }
  };

  const handleTrackClick = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(0);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-destructive">Error: {error}</p>
      </div>
    );
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
                <div className="grid grid-cols-1 gap-4 p-4">
                  {playlists.map((playlist) => (
                    <PlaylistCard
                      key={playlist.id}
                      playlist={playlist}
                      selected={selectedPlaylist?.id === playlist.id}
                      onClick={() => handlePlaylistClick(playlist.id)}
                    />
                  ))}
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle />

            {/* Tracks Panel */}
            <ResizablePanel defaultSize={60}>
              <div className="h-full overflow-y-auto p-4 bg-background">
                {loadingTracks ? (
                  <div className="flex items-center justify-center h-full">
                    <Spinner className="h-8 w-8 text-primary" />
                  </div>
                ) : selectedPlaylist ? (
                  <div>
                    {/* Playlist Header */}
                    <div className="mb-6 flex gap-4 items-start p-4 rounded-lg">
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
                        <div className="text-sm text-muted-foreground">
                          {(() => {
                            const totalMs =
                              selectedPlaylist.tracks.items.reduce(
                                (total, item) => total + item.track.duration_ms,
                                0,
                              );
                            const hours = Math.floor(totalMs / 3600000);
                            const minutes = Math.floor(
                              (totalMs % 3600000) / 60000,
                            );
                            const seconds = Math.floor(
                              (totalMs % 60000) / 1000,
                            );

                            const durationString =
                              hours > 0
                                ? `${hours}h ${minutes}min`
                                : `${minutes}min ${seconds}sec`;

                            return (
                              <p className="text-sm text-muted-foreground flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={
                                      selectedPlaylist.owner.images?.[0]?.url
                                    }
                                  />
                                  <AvatarFallback>
                                    {selectedPlaylist.owner.display_name[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <span>
                                  {selectedPlaylist.owner.display_name} •{" "}
                                  {selectedPlaylist.tracks.total} tracks,{" "}
                                  {durationString}
                                </span>
                              </p>
                            );
                          })()}
                        </div>
                      </div>
                    </div>

                    {/* Track List */}
                    <div className="space-y-1">
                      {selectedPlaylist.tracks.items.map((item, index) => {
                        const track = item.track;
                        const isCurrentTrack = currentTrack?.id === track.id;
                        return (
                          <TrackRow
                            key={`${track.id}-${index}`}
                            track={track}
                            index={index}
                            isCurrent={isCurrentTrack}
                            isPlaying={isPlaying}
                            onClick={() => handleTrackClick(track)}
                          />
                        );
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

        <ResizableHandle />

        {/* Player Controls Panel (Bottom) */}
        <ResizablePanel defaultSize={15} minSize={10} maxSize={25}>
          <div className="h-full bg-card text-card-foreground border-t border-border">
            {currentTrack ? (
              <div className="h-full flex items-center gap-4 px-4 py-3">
                {/* Album Art & Track Info */}
                <div
                  className="flex items-center gap-3 min-w-0 flex-shrink-0"
                  style={{ width: "15%" }}
                >
                  {currentTrack.album.images[0] && (
                    <img
                      src={currentTrack.album.images[0].url}
                      alt={currentTrack.album.name}
                      className="w-14 h-14 rounded border border-border"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate text-card-foreground text-sm">
                      {currentTrack.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {currentTrack.artists.map((a) => a.name).join(", ")}
                    </p>
                  </div>
                </div>

                {/* Center Controls */}
                <div className="flex-1 flex flex-col gap-2 items-center">
                  {/* Playback Buttons */}
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Shuffle className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="default"
                      size="icon"
                      className="h-9 w-9"
                      onClick={togglePlayPause}
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
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
                  <div className="flex items-center gap-2 w-full max-w-2xl">
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
                <div
                  className="flex items-center gap-2 flex-shrink-0"
                  style={{ width: "15%" }}
                >
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                  <Slider
                    value={[volume]}
                    max={100}
                    step={1}
                    onValueChange={(value) => setVolume(value[0])}
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground w-8 text-right">
                    {volume}%
                  </span>
                </div>
              </div>
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
  );
};
