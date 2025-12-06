import type { Playlist, Song } from "./types/apiRouterTypes.js";
import { apiFetch, type ApiResponse } from "./api.js";

// Dummy data for latest songs (matching Song interface)
// Dummy data for latest songs (matching Song interface)
const latestSongs: Song[] = [
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

if (publicPlaylistResult.status === 200 && publicPlaylistResult.data) {
  const publicPlaylists: Playlist[] = publicPlaylistResult.data;
  console.log("Fetched public playlists:", publicPlaylists);
  renderTopPlaylists(publicPlaylists);
}

renderLatestSongs(latestSongs);

function renderTopPlaylists(playlists: Playlist[]) {
  const parent = document.getElementById("top-playlists-container");
  if (!parent) return;

  playlists.forEach((playlist) => {
    // Create card info section
    const cardInfo = createElement("div", "card-info", [
      createElement("h3", undefined, [playlist.title]),
      createElement("p", undefined, [
        playlist.creator.username ? playlist.creator.username : "",
      ]),
      createElement("p", undefined, [`${playlist.songCount} songs`]),
    ]);

    // Create play button with icon
    const actions = createElement("div", "playButton", [
      createElement("div", "rating-container", [
        createElement("div", "likes-container", [
          createElement("i", "fas fa-thumbs-up"),
          createElement("p", undefined, ["9K"]),
        ]),
        createElement("i", "fas fa-thumbs-down"),
      ]),
      createElement("div", "rating-container", [
        createElement("i", "fas fa-comment"),
      ]),
      createElement("div", "rating-container", [
        createElement("i", "fas fa-share-alt"),
      ]),
      createElement("div", "rating-container", [
        createElement("i", "fas fa-plus"),
      ]),
    ]);
    const playAction = createElement("div", "playButton", [
      createElement("div", "rating-container", [
        createElement("i", "fas fa-play"),
      ]),
    ]);

    const top = createElement("div", "top-card", [cardInfo, playAction]);
    // Create card container
    const card = createElement("div", "card", [top, actions]);

    parent.appendChild(card);
  });
}
function renderLatestSongs(songs: Song[]) {
  const parent = document.getElementById("recent-songs-container");
  if (!parent) return;

  songs.forEach((song) => {
    // Format duration as MM:SS
    const minutes = Math.floor(song.durationSec / 60);
    const seconds = song.durationSec % 60;
    const duration = `${minutes}:${seconds.toString().padStart(2, "0")}`;

    // Create song card
    const songCard = createElement("div", "card", [
      createElement("div", "card-info", [
        createElement("h4", undefined, [song.title]),
        createElement("p", undefined, [
          song.creator?.username ? song.creator.username : "",
        ]),
        createElement("p", undefined, [
          `${(((song.totalLikes ?? 0) / (song.totalImpressions ?? 1)) * 100).toFixed(2)}% likes rating`,
        ]),
        createElement("p", undefined, [
          `${song.totalLikes ?? 0} likes / ${song.totalImpressions ?? 0} impressions`,
        ]),
      ]),
      createElement("div", "playButton", [createElement("i", "fas fa-play")]),
    ]);

    parent.appendChild(songCard);
  });
}
// Helper to create element with class and optional children
function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  children?: (HTMLElement | string)[],
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (children) {
    children.forEach((child) => {
      if (typeof child === "string") {
        el.appendChild(document.createTextNode(child));
      } else {
        el.appendChild(child);
      }
    });
  }
  return el;
}
