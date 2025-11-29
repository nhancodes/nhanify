import "express";
import "express-session";
import "express-serve-static-core";
declare global {
  interface User {
    id: number;
    username?: string;
  }
}
declare module "express-session" {
  interface SessionData {
    user?: {
      id: number;
      username?: string;
    } | null;
    requestMethod?: string;
    referrer?: string;
  }
}
declare module "express-serve-static-core" {
  interface Request {
    flash(type: string, ...msg: any[]): void;
    flash(type: string): string[];
  }
}
export interface PlaylistInfo {
  count: number;
}
export interface Playlist {
  id: number;
  title: string;
}
export interface GetPlaylistsResult {
  startPage: number;
  endPage: number;
  totalPages: number;
  playlistType: string;
  pageTitle: string;
  playlists: Playlist[];
  page: number;
  playlistTotal: number;
}
export interface PlaylistSong {
  id: number;
  video_id: string;
  duration_sec: number | string;
  [key: string]: any;
}
export interface PlaylistObj {
  info: {
    title: string;
    [key: string]: any;
  };
  songs: PlaylistSong[];
  count: number | string;
  [key: string]: any;
}
export interface Persistence {
  getPublicPlaylistTotal(): Promise<PlaylistInfo | null>;
  getPublicPlaylistsPage(offset: number, limit: number): Promise<Playlist[]>;
  getYourPlaylistTotal(userId: number): Promise<PlaylistInfo | null>;
  getYourPlaylistsPage(
    userId: number,
    offset: number,
    limit: number,
  ): Promise<Playlist[]>;
  getContributionPlaylistTotal(userId: number): Promise<PlaylistInfo | null>;
  getContributionPlaylistsPage(
    userId: number,
    offset: number,
    limit: number,
  ): Promise<Playlist[]>;
  getSongTotal(id: number): Promise<{
    count: number;
  } | null>;
  getPlaylistInfoSongs(
    id: number,
    offset: number,
    limit: number,
  ): Promise<PlaylistObj>;
}
