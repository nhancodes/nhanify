export interface User {
  id: number;
  username?: string;
  createdAt?: string;
}

export interface Playlist {
  id: number;
  title: string;
  creator: User;
  songCount: number;
  totalLikes?: number;
  createdAt?: string;
  contributors?: User[];
  thumbnail?: string;
}

export interface Song {
  id: number;
  playlistId: number;
  videoId: string;
  title: string;
  durationSec: number;
  createdAt?: string;
  totalLikes?: number;
  creator?: User;
}

export interface PlaylistSongs {
  playlist: Playlist;
  playlistType: string;
  songs: Song[];
}
export interface CurrentSong {
  song: Song;
  playlist: Playlist;
  playlistType?: string | null;
}

export type SongQueueEvents =
  | { event: "currentSongChanged"; data: CurrentSong }
  | { event: "currentSongOnPlayer"; data: CurrentSong };

export type PlayerEvents =
  | { event: "finishedSong"; data?: never }
  | { event: "pauseSong"; data?: never }
  | { event: "playSong"; data?: never };
export type CurrentPlaylistEvents = {
  event: "currentPlaylistChanged";
  data?: never;
};
export type PlayerStateCallback = (state: YT.PlayerState) => void;
export type PlayerReadyCallback = (player: YT.Player) => void;
export type ObservedEvents =
  | PlayerEvents
  | SongQueueEvents
  | CurrentPlaylistEvents;
export type GenericEvent = {
  event: string;
  data?: unknown;
};

type EventUnionToMap<T extends GenericEvent> = {
  [E in T as E["event"]]: E["data"];
};
export type ObservedEventMap = EventUnionToMap<ObservedEvents>;
