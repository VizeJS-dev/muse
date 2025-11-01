import React from "react";
import type { Album } from "@/features/spotify/types";

interface AlbumCardProps {
  album: Album;
  selected?: boolean;
  onClick: () => void;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({ album, selected, onClick }) => {
  const primaryArtist = album.artists?.[0]?.name ?? "Unknown";
  return (
    <button
      onClick={onClick}
      className={`text-card-foreground p-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-left ${
        selected ? "bg-accent" : ""
      }`}
    >
      <div className="flex space-x-4">
        {album.images?.[0] && (
          <img
            src={album.images[0].url}
            alt={album.name}
            className="w-16 h-16 object-cover rounded-md"
          />
        )}
        <div>
          <h3 className="font-semibold truncate">{album.name}</h3>
          <p className="text-sm text-muted-foreground">
            {`Album - ${primaryArtist}`}
          </p>
        </div>
      </div>
    </button>
  );
};

export default AlbumCard;
