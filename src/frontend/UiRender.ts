import { Playlist, Song, User } from "./types/apiRouterTypes.js";
import { songQueue } from "./appState.js";
import { getPlaylistSongs } from "./api.js";

export function renderPlaylists(type: string, playlists: Playlist[]) {
  const parent = document.getElementById("top-playlists-container");
  if (!parent) return;

  playlists.forEach((playlist) => {
    console.log({ playlist });
    const playlistCount =
      playlist.songCount > 1
        ? `${playlist.songCount} songs`
        : `${playlist.songCount} song`;
    const contributors =
      playlist.contributors && playlist.contributors.length > 0
        ? playlist.contributors.length > 1
          ? {
              text: `${playlist.contributors.length} contributors`,
              link: "link",
            }
          : {
              text: `${playlist.contributors.length} contributor`,
              link: "link",
            }
        : null;

    const cardInfoChildren = [
      {
        text: playlist.creator.username!,
        link: `/user/${playlist.creator.id}`,
      },
      { text: playlistCount },
      contributors,
    ];

    const cardInfoChildrenFiltered = cardInfoChildren.filter(
      (item) => item !== null,
    ) as { text: string; link?: string }[];
    const cardInfo = createInfo(playlist.title, cardInfoChildrenFiltered);
    const actions = createActions(
      playlist.id,
      type,
      playlist.id,
      playlist.totalLikes,
    );
    const menu = createDropdownActionsMenu();
    const top = createElement("div", "top-card", [cardInfo]);
    const description = createElement("div", "description", [top, actions]);
    const playIcon = createElement("i", "fas fa-play");
    const playContainer = createElement("div", "rating-container", [playIcon]);
    const rightContainer = createElement("div", "right-container", [
      menu,
      playContainer,
    ]);
    const thumbnail = createElement("a", "thumbnail t-medium", [
      description,
      rightContainer,
    ]);
    const card = createElement("div", "card", [thumbnail]);
    thumbnail.setAttribute(
      "href",
      `/${type}/playlists/1/playlist/1/${playlist.id}`,
    );
    playIcon.dataset.dataApi = `/api/${type}/playlists/1/playlist/1/${playlist.id}`;
    playIcon.addEventListener("click", async (event) => {
      event.stopPropagation();
      event.preventDefault();
      //const card = event.currentTarget as HTMLElement;
      console.log("Play icon clicked for playlist", playlist.id);
      const path = `/api/${type}/playlists/1/playlist/1/${playlist.id}`;
      console.log("Api Fetch data for playlist", path);
      try {
        const data = await getPlaylistSongs(path);
        if (!data) {
          console.warn("No playlist data found for", path);
          return;
        }
        console.log("Fetched data:", data);
        songQueue.setQueue(data);
      } catch (err) {
        console.error("Failed to fetch playlist data for", path, err);
      }
    });
    parent.appendChild(card);
  });
}

function createActions(
  id: number,
  type: string,
  playlistId: number,
  totalLikes?: number,
) {
  //const menu = createDropdownActionsMenu();
  //const playIcon = createElement("i", "fas fa-play");
  //const playContainer = createElement("div", "rating-container", [playIcon]);
  const actions = createElement("div", "playButton", [
    createLikeAction(totalLikes),
    // playContainer,
    // menu,
  ]);
  //playIcon.dataset.dataApi = `/api/${type}/playlists/1/playlist/1/${playlistId}`;
  return actions;
}

export function renderUsers(users: User[]) {
  const parent = document.getElementById("recent-members-container");
  if (!parent) return;
  users.forEach((user) => {
    const userBadge = createElement("div", "user-badge", [
      createElement("i", "fas fa-user-circle"),
    ]);
    const info = createInfo(user.username ? user.username : "", [
      {
        text: user.createdAt
          ? `${new Date(user.createdAt).toLocaleDateString()}`
          : "",
      },
    ]);
    const card = createElement("div", "top-card", [userBadge, info]);
    parent.appendChild(card);
  });
}

export function renderSongs(songs: Song[], type: string) {
  const parent = document.getElementById("recent-songs-container");
  if (!parent) return;

  songs.forEach((song) => {
    const actions = createActions(
      song.id,
      type,
      song.playlistId,
      song.totalLikes,
    );
    const thumbnail = createElement("div", "thumbnail t-small", []);
    //const songTitle = createElement("p", "bold", [song.title]);
    const songCard = createInfo(song.title, [
      {
        text: song.creator?.username ? song.creator.username : "",
        link: "link",
      },
    ]);
    const menu = createDropdownActionsMenu();
    const card = createElement("div", "card-info-container", [
      createElement("div", "top-card", [
        thumbnail,
        createElement("div", "info-actions-container", [
          //songTitle,
          createElement("div", "info-actions", [
            createElement("div", "description", [songCard, actions]),
            //add dropdown menu here
            menu,
          ]),
        ]),
      ]),
    ]);
    console.log("Playlist Type in renderSongs:", type);
    card.setAttribute("id", song.id.toString());
    card.dataset.playlistId = song.playlistId.toString();
    card.dataset.playlistType = type;
    card.addEventListener("click", (event) => {
      console.log("Song card clicked", event.currentTarget);
      const card = event.currentTarget as HTMLElement;
      const songId = card.getAttribute("id");
      const playlistId = card.dataset.playlistId;
      const playlistType = card.dataset.playlistType;
      //notify song queue to play this song and send over SongId and PlaylistId
      if (songId && playlistId) {
        console.log("Fetching song data for", {
          songId,
          playlistId,
          playlistType,
        });
        songQueue.setQueueByPlaylistSongId(
          parseInt(playlistId),
          parseInt(songId),
          playlistType!,
        );
      }
    });
    parent.appendChild(card);
  });
}

function createDropdownActionsMenu() {
  // build elements manually so we can attach stopPropagation handlers
  const details = createElement(
    "details",
    `profileMenu`,
    [],
  ) as HTMLDetailsElement;
  const summary = createElement("summary", undefined, [
    createElement("i", "fas fa-ellipsis-v"),
  ]) as HTMLElement;

  const profileDropdown = createElement("div", "profileDropdown", [
    createElement("div", "menuItem", [
      createElement("i", "fas fa-comment"),
      createElement("p", undefined, ["Comments"]),
    ]),
    createElement("div", "menuItem", [
      createElement("i", "fas fa-share-alt"),
      createElement("p", undefined, ["Share"]),
    ]),
    createElement("div", "menuItem", [
      createElement("i", "fas fa-plus"),
      createElement("p", undefined, ["Add to Playlist"]),
    ]),
  ]);

  details.appendChild(summary);
  details.appendChild(profileDropdown);

  // prevent clicks inside the dropdown (including the summary toggle) from bubbling up to the card
  const stop = (e: Event) => {
    e.stopPropagation();
  };
  summary.addEventListener("click", stop);
  summary.addEventListener("mousedown", stop); // guard against mousedown before click
  profileDropdown.addEventListener("click", stop);

  return details;
}

function createLikeAction(totalLikes?: number) {
  return createElement("div", "rating-container", [
    createElement("div", "likes-container", [
      createElement("i", "fas fa-thumbs-up"),
      createElement("p", undefined, [totalLikes ? totalLikes.toString() : "0"]),
    ]),
    createElement("i", "fas fa-thumbs-down"),
  ]);
}

export function createInfo(title: string, subtitles: Record<string, string>[]) {
  const subs = subtitles.map((subtitle) => {
    return subtitle.link
      ? createElement("a", undefined, [subtitle.text])
      : createElement("p", undefined, [subtitle.text]);
  });
  const subsWithDots: (HTMLElement | string)[] = subs.flatMap((s, i) =>
    i < subs.length - 1 ? [s, " • "] : [s],
  );
  return createElement("div", "card-info-container", [
    createElement("div", "card-info", [
      createElement("h3", "", [title]),
      createElement("p", undefined, subsWithDots),
    ]),
  ]);
}

// Helper to create element with class and optional children
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  children?: (ElementChild | string)[],
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);

  if (className) el.className = className;

  if (children) {
    for (const child of children) {
      if (typeof child === "string") {
        el.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        el.appendChild(child);
      } else {
        console.warn("Invalid child skipped:", child);
      }
    }
  }
  return el;
}
type Subtitle = {
  text: string;
  link?: string;
};

type ElementChild = HTMLElement | Text;
