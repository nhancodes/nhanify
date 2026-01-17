import { renderSongs, renderUsers, renderPlaylists } from "./UiRender.js";
import { getPlaylist, getPlaylistSongs } from "./api.js";
import { getSongQueue, getPlayer } from "./appState.js";
const songQueue = getSongQueue();
const player = getPlayer();

async function getPartial(url: string): Promise<string> {
  const options = {
    headers: {
      "Content-Type": "text/html",
      "X-Partial": "Partial",
    },
  };
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(
      `Failed to load partial from ${url}: ${response.statusText}`,
    );
  }
  return await response.text();
}

window.addEventListener("click", async (event) => {
  // if some other handler already prevented the event, don't proceed
  const target = event.target as Element | null;
  if (!target) return;
  const closestEl = target.closest("a") ?? target.closest("i");
  const path =
    closestEl?.getAttribute("href") ?? closestEl?.dataset.dataApi ?? null;
  const pathType = closestEl?.getAttribute("href")
    ? "href"
    : closestEl?.dataset.dataApi
      ? "data-api"
      : null;
  console.log("Clicked link:", { target, closestEl, path });
  if (!closestEl || !path || !pathType) return;

  // resolve and ignore cross-origin links
  const url = new URL(path, location.href);
  if (url.origin !== location.origin) return;

  // perform SPA navigation
  event.preventDefault();
  try {
    await loadAndRender(url.pathname + url.search + url.hash, true, pathType);
  } catch (err) {
    console.error("router load failed:", err);
    // fallback to full navigation
    location.href = url.href;
  }
});

async function loadAndRender(path: string, push = true, pathType?: string) {
  if (pathType && pathType === "data-api") {
    if (
      /^\/api\/(your|anonPublic|contribution|public)\/playlists\/\d+\/playlist\/\d+\/\d+/.test(
        path,
      )
    ) {
      console.log("Api Fetch data for playlist", path);
      try {
        const data = await getPlaylistSongs(path);
        if (!data) {
          console.warn("No playlist data found for", path);
          return;
        }
        const { playlist, songs } = data;
        console.log("Fetched playlist data:", playlist);
        songQueue.setQueue(songs);
      } catch (err) {
        console.error("Failed to fetch playlist data for", path, err);
      }
    }
  } else if (pathType && pathType === "href") {
    const partial = await getPartial(path);
    document.querySelector("main")!.innerHTML = partial;

    const dataEl = document.getElementById("initial-data");
    console.log("Initial Data Element:", dataEl);
    const data = dataEl ? JSON.parse(dataEl.textContent) : null;
    console.log({ data });
    if (!data) {
      console.warn("No initial data found for", path);
      return;
    }
    if (
      /^\/(your|anonPublic|contribution|public)\/playlists\/\d+\/playlist\/\d+\/\d+/.test(
        path,
      )
    ) {
      const { playlists, playlistType, songs } = data;
      console.log("Rendering playlist songs:", songs);
      console.log("Rendering playlist info:", playlists);
      renderPlaylists(playlistType, playlists);
      renderSongs(songs, playlistType);
    } else if (path.includes("/home")) {
      const { latestSongs, latestUsers, topPlaylists, playlistType } = data;
      renderSongs(latestSongs, playlistType);
      renderUsers(latestUsers);
      renderPlaylists(playlistType, topPlaylists);
      // if partial is playlists
    } else if (/^\/(anon\/public|your|contribution)\/playlists/.test(path)) {
      const { playlists, playlistType } = data;
      console.log("playlists:", playlists);
      renderPlaylists(playlistType, playlists);
    }
    if (push) history.pushState({ path }, "", path);
  }
}

// handle back/forward
window.addEventListener("popstate", async (ev) => {
  const state = ev.state as { href?: string } | null;
  const href = state?.href ?? location.pathname;
  try {
    await loadAndRender(href, false); // don't push state when responding to popstate
  } catch (err) {
    console.error("Failed to restore partial for", href, err);
    // fallback: full navigation
    location.href = href;
  }
});
