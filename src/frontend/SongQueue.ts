import {
  PlayerEvents,
  Song,
  SongQueueEvents,
  CurrentPlaylistEvents,
  ObservedEvents,
} from "./types/apiRouterTypes";
import { Subject } from "./Subject.js";
import { Observer } from "./Observer.js";

export class SongQueue
  extends Subject<SongQueueEvents>
  implements Observer<ObservedEvents>
{
  songs: Song[] = [];
  currentSongIndex: number = 0;
  currentSong: Song | null = null;

  //notify when song queue populates with songs
  setQueue(songs: Song[]) {
    console.log("Setting song queue");
    this.songs = songs;
    this.currentSong = songs[0] || null;
    if (this.currentSong) {
      this.notify({ event: "currentSongChanged", data: this.currentSong });
    }
  }
  //react when Player finishes playing a song
  update(event: PlayerEvents) {
    console.log("SongQueue received event:", event);
    if (event.event === "finishedSong") {
      this.setCurrentSong();
    }
  }
  setCurrentSong() {
    this.currentSongIndex += 1;
    this.currentSong = this.songs[this.currentSongIndex];
    this.notify({ event: "currentSongChanged", data: this.currentSong });
  }
}
