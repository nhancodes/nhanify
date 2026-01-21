import {
  Song,
  SongQueueEvents,
  Playlist,
  PlaylistSongs,
  ObservedEventMap,
} from "./types/apiRouterTypes";
import { Subject } from "./Subject.js";
import { Observer } from "./Observer.js";
import { getPlaylistSongs } from "./api.js";

export class SongQueue extends Subject<SongQueueEvents> implements Observer {
  private playlistSongs: PlaylistSongs | null;
  private currentSongIndex: number = 0;
  private currentSong: Song | null = null;
  private currentPlaylist: Playlist | null = null;
  private playlistType: string | null = null;
  constructor() {
    super();
    this.playlistSongs = null;
    this.currentSongIndex = 0;
    this.currentSong = null;
    this.currentPlaylist = null;
    this.playlistType = null;
  }
  //notify when song queue populates with songs
  setQueue(playlistSongs: PlaylistSongs, songId?: number) {
    console.log("Setting song queue");
    this.playlistSongs = playlistSongs;
    this.playlistType = playlistSongs.playlistType;
    this.currentPlaylist = this.playlistSongs?.playlist || null;
    if (songId) {
      const songIndex = this.playlistSongs.songs.findIndex(
        (s) => s.id === songId,
      );
      this.currentSongIndex = songIndex !== -1 ? songIndex : 0;
    } else {
      this.currentSongIndex = 0;
    }
    this.currentSong = this.playlistSongs?.songs[this.currentSongIndex] || null;
    console.log({ playlistSongs });
    console.log({
      currentSong: this.currentSong,
      currentplaylist: this.currentPlaylist,
    });
    if (this.currentSong) {
      this.notify({
        event: "currentSongChanged",
        data: {
          song: this.currentSong,
          playlist: this.currentPlaylist!,
          playlistType: this.playlistType,
        },
      });
    }
  }

  async setQueueByPlaylistSongId(
    playlistId: number,
    songId: number,
    playlistType: string,
  ) {
    console.log("Setting song queue by playlistId and songId", {
      playlistId,
      songId,
    });
    if (playlistId !== this.playlistSongs?.playlist.id) {
      //fetch playlist songs from backend
      const path = `/api/${playlistType}/playlists/1/playlist/1/${playlistId}`;
      try {
        const data = await getPlaylistSongs(path);
        if (!data) {
          console.warn("No playlist data found for", path);
          return;
        }
        console.log("Fetched data:", data);
        this.setQueue(data, songId);
      } catch (err) {
        console.error("Failed to fetch playlist data for", path, err);
      }
    } else {
      //playlist is already loaded, just set current song
      const songIndex = this.playlistSongs.songs.findIndex(
        (s) => s.id === songId,
      );
      if (songIndex !== -1) {
        this.currentSongIndex = songIndex;
        this.currentSong = this.playlistSongs.songs[this.currentSongIndex];
        this.notify({
          event: "currentSongChanged",
          data: {
            song: this.currentSong,
            playlist: this.currentPlaylist!,
            playlistType: this.playlistType,
          },
        });
      } else {
        console.warn("Song ID not found in current playlist:", songId);
      }
    }
  }

  //react when recieving notification
  update<K extends keyof ObservedEventMap>(event: {
    event: K;
    data: ObservedEventMap[K];
  }) {
    console.log("SongQueue received event:", event);
    switch (event.event) {
      case "finishedSong":
        this.setCurrentSong();
        this.notify({
          event: "currentSongChanged",
          data: {
            song: this.currentSong!,
            playlist: this.currentPlaylist!,
            playlistType: this.playlistType ?? null,
          },
        });
        break;

      case "currentPlaylistChanged":
        if (this.currentSong && this.currentPlaylist) {
          this.notify({
            event: "currentSongOnPlayer",
            data: {
              song: this.currentSong!,
              playlist: this.currentPlaylist!,
              playlistType: this.playlistType ?? null,
            },
          });
        }
        break;

      default:
        break;
    }
  }
  setCurrentSong() {
    this.currentSongIndex += 1;
    this.currentSong = this.playlistSongs?.songs[this.currentSongIndex] || null;
  }
}
