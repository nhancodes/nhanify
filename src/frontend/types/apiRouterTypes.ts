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

export type SongQueueEvents =
  | { event: "currentSongChanged"; data: Song }
  | { event: "queueChanged"; data: Song[] }
  | { event: "currentSongOnPlayer"; data: Song };

export type PlayerEvents =
  | { event: "finishedSong"; data?: never }
  | { event: "pauseSong"; data?: never }
  | { event: "playSong"; data?: never };
export type CurrentPlaylistEvents = "currentPlaylistChanged";
export type PlayerStateCallback = (state: YT.PlayerState) => void;
export type PlayerReadyCallback = (player: YT.Player) => void;
export type ObservedEvents = PlayerEvents | SongQueueEvents;
