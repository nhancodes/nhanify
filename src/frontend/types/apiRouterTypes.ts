export interface User {
  id: number;
  username?: string;
}

export interface Playlist {
  id: number;
  title: string;
  creator: User;
  isPrivate: boolean;
  songCount: number;
}

export interface Song {
  id: number;
  playlistId: number;
  videoId: string;
  title: string;
  durationSec: number;
  createdAt?: string;
  totalLikes?: number;
  totalImpressions?: number;
  creator?: User;
}
