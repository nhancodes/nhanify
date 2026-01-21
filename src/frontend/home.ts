import { renderPlaylists, renderUsers, renderSongs } from "./UiRender.js";
import { getLatestUsers, getLatestSongs, getTopPlaylists } from "./api.js";

// Todo : replace with real API calls
const latestUsers = await getLatestUsers();
const topPlaylists = await getTopPlaylists();
const latestSongs = await getLatestSongs();
renderUsers(latestUsers);
renderPlaylists("anonPublic", topPlaylists);
renderSongs(latestSongs, "anonPublic");
