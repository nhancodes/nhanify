import { toggleMenu } from "./menu.js";
import { SongQueue } from "./SongQueue.js";
import { Player } from "./Player.js";
import { initAppState } from "./appState.js";
import { CurrentPlaylistPageUi } from "./CurrentPlaylistPageUi.js";

toggleMenu();
const songQueue = new SongQueue();
const player = new Player();
const currentPlaylistPageUi = new CurrentPlaylistPageUi();
songQueue.addObserver(player);
player.addObserver(songQueue);
currentPlaylistPageUi.addObserver(songQueue);
// register singletons for other modules (router, UI, etc.)
initAppState(songQueue, player);
