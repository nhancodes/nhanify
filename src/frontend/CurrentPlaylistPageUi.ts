import { Observer } from "./Observer.js";
import { Subject } from "./Subject.js";
import { CurrentPlaylistEvents, SongQueueEvents } from "./types/apiRouterTypes";
import { renderSongs } from "./UiRender.js";

export class CurrentPlaylistPageUi
  extends Subject<CurrentPlaylistEvents>
  implements Observer
{
  private currentPlaylistId: number | null;
  private previousHiglightedElement: HTMLElement | null = null;
  private songsContainerEl: HTMLElement | null;
  constructor() {
    console.log("Initializing CurrentPlaylistPageUi");
    super();
    this.currentPlaylistId = null;
    this.songsContainerEl = document.getElementById("recent-songs-container");
  }
  setCurrentPlaylistId(playlistId: number) {
    console.log("Setting current playlist ID to:", playlistId);
    this.currentPlaylistId = playlistId;
    this.notify({ event: "currentPlaylistChanged" });
  }
  update(event: SongQueueEvents) {
    console.log("CurrentPlaylistPageUi received event:", event);
    switch (event.event) {
      case "shuffledSongs":
        this.songsContainerEl!.innerHTML = "";
        renderSongs(event.data, "your");
        break;
      case "currentSongChanged":
      case "currentSongOnPlayer":
        if (!event.data) {
          console.log("No data in event, cannot update UI");
          return;
        }
        if (this.currentPlaylistId === null) {
          console.log("Current playlist ID is not set, cannot update UI");
          this.currentPlaylistId = event.data.playlist.id;
        }
        console.log("Updating current song highlight in playlist UI");
        console.log({
          "SONG QUEUE": event.data.song.playlistId,
          UI: this.currentPlaylistId,
        });
        if (this.currentPlaylistId === event.data.song.playlistId) {
          // unhiglight the previous highlighted element
          this.previousHiglightedElement?.classList.remove("current-song");
          // find the song element with data-song-id = currentVideoId
          const currentSongElement = document.getElementById(
            `${event.data.song.id}`,
          );
          // highlight it
          console.log({ currentSongElement });
          currentSongElement?.classList.add("current-song");
          // set previousHiglightedElement to the current highlighted element
          this.previousHiglightedElement = currentSongElement || null;
        }
      default:
        break;
    }
  }
  highlightCurrentSong(Element: HTMLElement) {
    Element.classList.add("current-song");
  }
}
