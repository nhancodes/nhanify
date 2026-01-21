import {
  Song,
  PlayerEvents,
  ObservedEvents,
  Playlist,
  ObservedEventMap,
} from "./types/apiRouterTypes";
import { Subject } from "./Subject.js";
import { Observer } from "./Observer.js";
import { initializeIframe } from "./iframe.js";

export class Player extends Subject<PlayerEvents> implements Observer {
  private currentSong: Song | null = null;
  private IsPlayerReady = false;
  private YTPlayer: YT.Player | null;
  private playerTitleElement: HTMLElement | null;
  private playerUsernameElement: HTMLElement | null;
  private playerPlaylistElement: HTMLElement | null;
  private playerAnchorElement: HTMLElement | null;
  private currentPlaylist: Playlist | null = null;
  private currentPlaylistType: string | null = null;
  constructor() {
    super();
    initializeIframe(
      this.handlePlayerStateChange.bind(this),
      this.handlePlayerReady.bind(this),
    );
    this.currentSong = null;
    this.currentPlaylist = null;
    this.currentPlaylistType = null;
    this.IsPlayerReady = false;
    this.YTPlayer = null;
    this.playerTitleElement = document.getElementById("player-title");
    this.playerUsernameElement = document.getElementById("player-username");
    this.playerPlaylistElement = document.getElementById("player-playlist");
    this.playerAnchorElement = document.getElementById("player-playlist-link");
  }

  // Observer: receives updates when the song changes
  update<K extends keyof ObservedEventMap>(event: {
    event: K;
    data: ObservedEventMap[K];
  }) {
    console.log("Player received event:", event);
    switch (event.event) {
      case "currentSongChanged":
        if (!event.data) {
          console.log("No data in event, cannot update player");
          return;
        }
        if (this.YTPlayer) {
          this.currentSong = event.data.song;
          this.currentPlaylist = event.data.playlist;
          this.currentPlaylistType = event.data.playlistType || null;
          this.YTPlayer.mute();
          this.YTPlayer.loadVideoById(this.currentSong.videoId);
          this.YTPlayer.playVideo();
          this.YTPlayer.unMute();
          console.log("Now playing:", this.currentSong.title);
          this.updateUI();
        }
        break;
      default:
        break;
    }
  }
  handlePlayerReady(player: YT.Player) {
    console.log("Player is ready:", player);
    this.IsPlayerReady = true;
    this.YTPlayer = player;
    console.log({ player });
    console.log(`Player is set to ${this.currentPlaylist?.title}`);
  }

  handlePlayerStateChange(state: YT.PlayerState) {
    if (state === YT.PlayerState.ENDED) {
      this.songFinished();
    }
  }
  // Subject: notifies observers when a song finishes
  private songFinished() {
    console.log("Song finished:", this.currentSong?.title);
    if (this.currentSong) {
      this.notify({ event: "finishedSong" });
    }
  }

  private updateUI() {
    console.log("Updating player UI");
    console.log(
      `/${this.currentPlaylistType}/playlists/1/playlist/1/${this.currentPlaylist?.id}`,
    );
    this.playerTitleElement!.textContent =
      this.currentSong?.title || "No song playing";
    this.playerUsernameElement!.textContent =
      this.currentSong?.creator?.username || "Unknown";
    this.playerPlaylistElement!.textContent =
      `${this.currentPlaylist?.title}` || "Unknown Playlist";
    this.playerAnchorElement!.setAttribute(
      "href",
      `/${this.currentPlaylistType}/playlists/1/playlist/1/${this.currentPlaylist?.id}`,
    );
  }
}
