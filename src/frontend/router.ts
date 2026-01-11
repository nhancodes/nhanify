import { renderSongs, renderUsers, renderPlaylists } from "./UiRender.js";
import { getPublicPlaylists } from "./api.js";

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
  debugger;
  // if some other handler already prevented the event, don't proceed
  const target = event.target as Element | null;
  if (!target) return;
  const link = target.closest("a");
  const href = link?.getAttribute("href") ?? "";
  console.log("Clicked link:", href);
  debugger;
  if (!href) return;

  console.log({ target, href });
  // resolve and ignore cross-origin links
  const url = new URL(href, location.href);
  if (url.origin !== location.origin) return;
  // perform SPA navigation
  event.preventDefault();
  try {
    await loadAndRender(url.pathname + url.search + url.hash, true);
  } catch (err) {
    console.error("router load failed:", err);
    // fallback to full navigation
    location.href = url.href;
  }
});

async function loadAndRender(href: string, push = true) {
  const partial = await getPartial(href);
  document.querySelector("main")!.innerHTML = partial;

  const dataEl = document.getElementById("initial-data");
  console.log("Initial Data Element:", dataEl);
  const data = dataEl ? JSON.parse(dataEl.textContent) : null;
  console.log({ data });
  // re-run your view renderers / init
  // if partial is home
  if (!data) {
    console.warn("No initial data found for", href);
    return;
  }
  console.log(href.includes("/your/playlists/1/playlist/1/"));
  if (
    href.includes("/public/playlists/1/playlist/1/") ||
    href.includes("/your/playlists/1/playlist/1/") ||
    href.includes("/contribution/playlists/1/playlist/1/") ||
    href.includes("/anonPublic/playlists/1/playlist/1/")
  ) {
    debugger;
    const { playlist, playlistType, songs } = data;
    console.log("Rendering playlist songs:", songs);
    console.log("Rendering playlist info:", playlist);
    renderPlaylists(playlistType, playlist);
    renderSongs(songs);
  } else if (href.includes("/home")) {
    const { latestSongs, latestUsers, topPlaylists, playlistType } = data;
    renderSongs(latestSongs);
    renderUsers(latestUsers);
    renderPlaylists(playlistType, topPlaylists);
    // if partial is playlists
  } else if (
    href.includes("/anon/public/playlists") ||
    href.includes("your/playlists") ||
    href.includes("contribution/playlists")
  ) {
    //const publicPlaylists = await getPublicPlaylists();
    const { playlists, playlistType } = data;
    console.log("playlists:", playlists);
    renderPlaylists(playlistType, playlists);
  }
  if (push) history.pushState({ href }, "", href);
  debugger;
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
