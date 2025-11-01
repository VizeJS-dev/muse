export interface Playlist {
  id: string;
  name: string;
  owner: {
    display_name: string;
    id?: string;
    href?: string;
    type?: string;
    uri?: string;
    external_urls?: Record<string, string>;
  };
  images: { url: string }[];
  tracks: { total: number };
}

export interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
  duration_ms: number;
}

export interface PlaylistDetails {
  owner: {
    display_name: string;
    id: string;
    images?: {
      url: string;
      height: number;
      width: number;
    }[];
  };
  id: string;
  name: string;
  description: string;
  images: { url: string }[];
  tracks: {
    total: number;
    items: {
      track: Track;
    }[];
  };
}

export interface Album {
  id: string;
  name: string;
  images: { url: string }[];
  artists: { name: string }[];
  total_tracks?: number;
}

export interface AlbumDetails {
  id: string;
  name: string;
  images: { url: string }[];
  artists: { name: string }[];
  tracks: {
    total: number;
    items: {
      track: Track;
    }[];
  };
}

export interface UserDetails {
  id: string;
  display_name: string;
  images: {
    url: string;
    height: number;
    width: number;
  }[];
}
