import { SongQueue } from "./SongQueue.js";
import { Player } from "./Player.js";

export let songQueue: SongQueue | null = null;
export let player: Player | null = null;

export function initAppState(sq: SongQueue, p: Player) {
  songQueue = sq;
  player = p;
}

export function getSongQueue(): SongQueue {
  if (!songQueue) throw new Error("songQueue not initialized");
  return songQueue;
}

export function getPlayer(): Player {
  if (!player) throw new Error("player not initialized");
  return player;
}
