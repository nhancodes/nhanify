import type { Playlist, Song, User } from "./types/apiRouterTypes.js";

export function renderLastestUsers(users: User[]) {
  const parent = document.getElementById("recent-members-container");
  if (!parent) return;
  users.forEach((user) => {
    const userBadge = createElement("div", "user-badge", [
      createElement("i", "fas fa-user-circle"),
      createElement("p", undefined, [user.username ? user.username : ""]),
    ]);
    parent.appendChild(userBadge);
  });
}

export function renderTopPlaylists(playlists: Playlist[]) {
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
      createElement("div", "rating-container", [
        createElement("i", "fas fa-play"),
      ]),
    ]);
    const thumbnail = createElement("div", "thumbnail", [
      createElement("div", "thumbnail", []),
    ]);
    /*const playAction = createElement("div", "playButton", [
      createElement("div", "rating-container", [
        createElement("i", "fas fa-play"),
      ]),
    ]);*/

    const top = createElement("div", "top-card", [cardInfo]);
    // Create card container
    const card = createElement("div", "card", [thumbnail, top, actions]);

    parent.appendChild(card);
  });
}
export function renderLatestSongs(songs: Song[]) {
  const parent = document.getElementById("recent-songs-container");
  if (!parent) return;

  songs.forEach((song) => {
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
