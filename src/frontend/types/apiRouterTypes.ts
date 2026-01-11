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
