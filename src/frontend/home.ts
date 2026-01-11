import { renderPlaylists, renderUsers, renderSongs } from "./UiRender.js";
import { lastestUsers, latestSongs, topPlaylists } from "./api.js";

// Todo : replace with real API calls
renderUsers(lastestUsers);
renderPlaylists("anonPublic", topPlaylists);
renderSongs(latestSongs);
