import { SongQueueEvents, Song, PlayerEvents } from "./types/apiRouterTypes";
import { Subject } from "./Subject.js";
import { Observer } from "./Observer.js";
import { initializeIframe } from "./iframe.js";

export class Player
  extends Subject<PlayerEvents>
  implements Observer<SongQueueEvents>
{
  private currentSong: Song | null = null;
  private IsPlayerReady = false;
  private YTPlayer: YT.Player | null;
  private playerTitleElement: HTMLElement | null;
  private playerUsernameElement: HTMLElement | null;
  constructor() {
    super();
    initializeIframe(
      this.handlePlayerStateChange.bind(this),
      this.handlePlayerReady.bind(this),
    );
    this.currentSong = null;
    this.IsPlayerReady = false;
    this.YTPlayer = null;
    this.playerTitleElement = document.getElementById("player-title");
    this.playerUsernameElement = document.getElementById("player-username");
  }
  // Observer: receives updates when the song changes
  update(event: SongQueueEvents) {
    console.log("Player received event:", event);
    if (
      event.event === "currentSongChanged" &&
      this.IsPlayerReady &&
      this.YTPlayer
    ) {
      this.currentSong = event.data;
      this.YTPlayer.mute();
      this.YTPlayer.loadVideoById(this.currentSong.videoId);
      this.YTPlayer.playVideo();
      this.YTPlayer.unMute();
      console.log("Now playing:", this.currentSong.title);
      this.updateUI();
    }
  }

  handlePlayerReady(player: YT.Player) {
    console.log("Player is ready:", player);
    this.IsPlayerReady = true;
    this.YTPlayer = player;
    console.log({ player });
    console.log(`Player is set to ${this.IsPlayerReady}`);
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
    this.playerTitleElement!.textContent =
      this.currentSong?.title || "No song playing";
    this.playerUsernameElement!.textContent =
      this.currentSong?.creator?.username || "Unknown";
  }
}
