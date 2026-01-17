import { Observer } from "./Observer";
import { Subject } from "./Subject";
import {
  CurrentPlaylistEvents,
  SongQueueEvents,
  ObservedEvents,
} from "./types/apiRouterTypes";

export class CurrentPlaylistPageUi
  extends Subject<CurrentPlaylistEvents>
  implements Observer<ObservedEvents>
{
  private currentPlaylistId: number | null;
  private previousHiglightedElement: HTMLElement | null = null;
  constructor() {
    console.log("Initializing CurrentPlaylistPageUi");
    super();
    this.currentPlaylistId = null;
  }
  setCurrentPlaylistId(playlistId: number) {
    console.log("Setting current playlist ID to:", playlistId);
    this.currentPlaylistId = playlistId;
    this.notify("currentPlaylistChanged");
  }
  update(event: SongQueueEvents) {
    console.log("CurrentPlaylistPageUi received event:", event);
    if (event.event === "currentSongOnPlayer") {
      if (this.currentPlaylistId === event.data.playlistId) {
        // unhiglight the previous highlighted element
        this.previousHiglightedElement?.classList.remove("current-song");
        // find the song element with data-song-id = currentVideoId
        const currentSongElement = document.getElementById(`${event.data.id}`);
        // highlight it
        currentSongElement?.classList.add("current-song");
        // set previousHiglightedElement to the current highlighted element
        this.previousHiglightedElement = currentSongElement || null;
      }
    }
  }
  highlightCurrentSong(Element: HTMLElement) {
    Element.classList.add("current-song");
  }
}
