import { apiFetch, ApiResponse } from "./api.js";
import type { Playlist, Song, User } from "./types/apiRouterTypes.js";
//Dummy data for lastest users
export const lastestUsers: User[] = [
  { id: 1, username: "user123" },
  { id: 2, username: "musiclover99" },
  { id: 3, username: "djmaster" },
  { id: 4, username: "swiftie4ever" },
  { id: 5, username: "rockfan21" },
];

// Dummy data for latest songs (matching Song interface)
export const latestSongs: Song[] = [
  {
    id: 1,
    playlistId: 3,
    videoId: "dQw4w9WgXcQ",
    title: "Midnight Dreams",
    durationSec: 225,
    creator: { id: 1, username: "user123" },
    createdAt: "2024-12-01T12:00:00Z",
    totalLikes: 142,
    totalImpressions: 1523,
  },
  {
    id: 2,
    playlistId: 5,
    videoId: "9bZkp7q19f0",
    title: "Ocean Waves",
    durationSec: 252,
    creator: { id: 2, username: "musiclover99" },
    createdAt: "2024-12-01T10:30:00Z",
    totalLikes: 89,
    totalImpressions: 987,
  },
  {
    id: 3,
    playlistId: 2,
    videoId: "kJQP7kiw5Fk",
    title: "Electric Pulse",
    durationSec: 323,
    creator: { id: 3, username: "djmaster" },
    createdAt: "2024-11-30T18:45:00Z",
    totalLikes: 256,
    totalImpressions: 3421,
  },
  {
    id: 4,
    playlistId: 6,
    videoId: "hT_nvWreIhg",
    title: "Summer Nights",
    durationSec: 238,
    creator: { id: 4, username: "swiftie4ever" },
    createdAt: "2024-11-30T14:20:00Z",
    totalLikes: 178,
    totalImpressions: 2156,
  },
  {
    id: 5,
    playlistId: 1,
    videoId: "YykjpeuMNEk",
    title: "Neon Lights",
    durationSec: 270,
    creator: { id: 5, username: "rockfan21" },
    createdAt: "2024-11-29T22:10:00Z",
    totalLikes: 312,
    totalImpressions: 4892,
  },
];

const publicPlaylistResult: ApiResponse<Playlist[] | null> = await apiFetch(
  "/api/playlists/public",
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  },
);
export let publicPlaylists: Playlist[] = [];
if (publicPlaylistResult.status === 200 && publicPlaylistResult.data) {
  publicPlaylists = publicPlaylistResult.data;
}
