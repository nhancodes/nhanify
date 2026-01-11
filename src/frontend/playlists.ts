import { getPublicPlaylists } from "./api.js";
import { renderPlaylists } from "./UiRender.js";

const publicPlaylists = await getPublicPlaylists();
renderPlaylists("anonPublic", publicPlaylists);
