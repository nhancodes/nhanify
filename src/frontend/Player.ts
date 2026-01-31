import {
  Song,
  PlayerEvents,
  Playlist,
  SongQueueEvents,
  //ObservedEventMap,
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
  private nextEl: HTMLElement | null = null;
  private previousEl: HTMLElement | null = null;
  private progressEl: HTMLElement | null = null;
  private progressFillEl: HTMLElement | null = null;
  private rafId: number | null = null;
  private isScrubbing = false;
  private progressTimeEl: HTMLElement | null = null;
  private playPauseEl: HTMLElement | null = null;
  private IsPlaying: boolean = false;
  private shuffleEl: HTMLElement | null;
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
    this.nextEl = document.getElementById("next");
    this.previousEl = document.getElementById("previous");
    this.nextEl?.addEventListener("click", this.handleNextSong.bind(this));
    this.previousEl?.addEventListener(
      "click",
      this.handlePreviousSong.bind(this),
    );
    this.progressEl = document.getElementById("progress-container");
    this.progressFillEl = document.getElementById(
      "progress-bar",
    ) as HTMLElement | null;

    // pointer handlers for clicking / dragging on progress bar
    this.progressEl?.addEventListener(
      "pointerdown",
      this.onProgressPointerDown,
    );
    this.progressTimeEl = document.getElementById("progress-time");
    this.playPauseEl = document.getElementById("play-pause");
    this.playPauseEl?.addEventListener(
      "click",
      this.handleTogglePausePlaySong.bind(this),
    );
    this.disablePlayPause();
    this.shuffleEl = document.getElementById("shuffle-icon");
    this.shuffleEl?.addEventListener(
      "click",
      this.handleShuffleSongs.bind(this),
    );
  }

  // Observer: receives updates when the song changes
  update(event: SongQueueEvents) {
    console.log("Player received event:", event);
    switch (event.event) {
      case "currentSongChanged":
        if (!event.data) {
          console.log("No data in event, cannot update player");
          return;
        }
        if (this.YTPlayer) {
          //if (event.event === "c")
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
        this.IsPlaying = true;
        console.log(
          "Youtube Player State After play:",
          this.YTPlayer?.getPlayerState(),
        );
        this.playPauseEl?.classList.remove("fa-play");
        this.playPauseEl?.classList.add("fa-pause");
        this.playPauseEl?.parentElement?.classList.remove("disabled");
        break;
      default:
        break;
    }
  }
  private handleNextSong() {
    console.log("Next song requested");
    this.notify({ event: "nextSong" });
  }
  private handlePreviousSong() {
    console.log("Previous song requested");
    this.notify({ event: "previousSong" });
  }

  private disablePlayPause() {
    if (!this.currentSong) {
      console.log("No song is currently loaded, cannot toggle play/pause");
      this.playPauseEl?.classList.add("fa-play");
      this.playPauseEl?.parentElement?.classList.add("disabled");
    } else {
      this.playPauseEl?.parentElement?.classList.remove("disabled");
    }
  }

  private handleTogglePausePlaySong() {
    if (!this.currentSong) {
      console.log("No song is currently loaded, cannot toggle play/pause");
      this.playPauseEl?.classList.add("fa-play");
      this.playPauseEl?.parentElement?.classList.add("disabled");
    } else {
      this.playPauseEl?.parentElement?.classList.remove("disabled");
    }
    if (this.currentSong && this.IsPlaying) {
      console.log("Pausing song:", this.currentSong.title);
      console.log("Youtube Player State:", this.YTPlayer?.getPlayerState());
      this.IsPlaying = false;
      this.YTPlayer?.pauseVideo();
      console.log(
        "Youtube Player State After play:",
        this.YTPlayer?.getPlayerState(),
      );
      this.playPauseEl?.classList.remove("fa-pause");
      this.playPauseEl?.classList.add("fa-play");
    } else {
      console.log("Playing song:", this.currentSong?.title);
      console.log("Youtube Player State:", this.YTPlayer?.getPlayerState());
      this.IsPlaying = true;
      this.YTPlayer?.playVideo();
      console.log(
        "Youtube Player State After play:",
        this.YTPlayer?.getPlayerState(),
      );
      this.playPauseEl?.classList.remove("fa-play");
      this.playPauseEl?.classList.add("fa-pause");
    }
  }
  private handleShuffleSongs() {
    console.log("Shuffle songs requested");
    // Implement shuffle logic if needed
    this.notify({ event: "shuffledSong" });
  }
  private handlePlayerReady(player: YT.Player) {
    console.log("Player is ready:", player);
    this.IsPlayerReady = true;
    this.YTPlayer = player;
    console.log({ player });
    console.log(`Player is set to ${this.currentPlaylist?.title}`);
  }

  private handlePlayerStateChange(state: YT.PlayerState) {
    if (state === YT.PlayerState.ENDED) {
      this.songFinished();
    }
    if (state === YT.PlayerState.PLAYING) {
      this.startProgressLoop();
    } else {
      this.stopProgressLoop();
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
  private startProgressLoop = () => {
    if (this.rafId != null) return;
    const loop = () => {
      this.updateProgress();
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  };

  private stopProgressLoop = () => {
    if (this.rafId != null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  };

  private updateProgress = () => {
    if (!this.YTPlayer || !this.progressFillEl) return;
    const duration = this.YTPlayer.getDuration();
    if (!duration || duration === 0) {
      this.progressFillEl.style.width = "0%";
      this.progressTimeEl!.textContent = "0:00 / 0:00";
      return;
    }
    const current = this.YTPlayer.getCurrentTime();
    const pct = Math.max(0, Math.min(1, current / duration));
    this.progressFillEl.style.width = `${pct * 100}%`;
    this.progressTimeEl!.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
  };

  // pointer event handlers: support click and drag scrubbing
  private onProgressPointerDown = (ev: PointerEvent) => {
    if (!this.progressEl || !this.YTPlayer) return;
    this.isScrubbing = true;
    (this.progressEl as HTMLElement).setPointerCapture(ev.pointerId);
    this.seekFromPointerEvent(ev);
    // listen for move/up on the same element
    this.progressEl.addEventListener("pointermove", this.onProgressPointerMove);
    this.progressEl.addEventListener("pointerup", this.onProgressPointerUp, {
      once: true,
    });
    this.progressEl.addEventListener(
      "pointercancel",
      this.onProgressPointerUp,
      { once: true },
    );
    // pause automatic loop while scrubbing
    this.stopProgressLoop();
  };

  private onProgressPointerMove = (ev: PointerEvent) => {
    if (!this.isScrubbing) return;
    this.seekFromPointerEvent(ev, /*livePreview=*/ true);
  };

  private onProgressPointerUp = (ev: PointerEvent) => {
    if (!this.progressEl) return;
    this.isScrubbing = false;
    try {
      this.progressEl.releasePointerCapture(ev.pointerId);
    } catch {}
    this.progressEl.removeEventListener(
      "pointermove",
      this.onProgressPointerMove,
    );
    // resume loop if player is playing
    if (
      this.YTPlayer &&
      this.YTPlayer.getPlayerState() === YT.PlayerState.PLAYING
    ) {
      this.startProgressLoop();
    }
  };

  private seekFromPointerEvent = (ev: PointerEvent, livePreview = false) => {
    if (!this.progressEl || !this.YTPlayer) return;
    const rect = this.progressEl.getBoundingClientRect();
    const x = ev.clientX;
    const pct = Math.max(0, Math.min(1, (x - rect.left) / rect.width));
    const duration = this.YTPlayer.getDuration() || 0;
    const secs = pct * duration;
    // update UI immediately
    if (this.progressFillEl) this.progressFillEl.style.width = `${pct * 100}%`;
    // on pointerup we do final seek; on move we can optionally preview
    if (!livePreview) {
      this.YTPlayer.seekTo(secs, true);
    }
  };
}
function formatTime(current: number) {
  //format current secconds to mm:ss or h:mm:ss
  const hours = Math.floor(current / 3600);
  const minutes = Math.floor((current % 3600) / 60);
  const seconds = Math.floor(current % 60);
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }
}
