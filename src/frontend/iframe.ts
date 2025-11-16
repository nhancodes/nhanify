/* global YT */

// Add type declarations for YouTube API

declare namespace YT {
  class Player {
    constructor(elementId: string, options: any);
    loadVideoById(videoId: string): void;
  }

  enum PlayerState {
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 5
  }

  interface OnStateChangeEvent {
    data: number;
  }
}
// 2. This code loads the IFrame Player API code asynchronously.
export function initalizeIframe() {
  console.log("IN INITIALIZE IFRAME");
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
  let player: YT.Player;
  let prevExistingIdx = 0;
  const songCards = document.querySelectorAll(".songCard");
  let existingVideoIds: string[] = [];
  if (songCards)
    existingVideoIds = populatePlaylist(songCards as NodeListOf<HTMLElement>);

  // 3. This function creates an <iframe> (and YouTube player)
  //    after the API code downloads.
  // eslint-disable-next-line no-unused-vars
  function onYouTubeIframeAPIReady() {
    player = new YT.Player("player", {
      height: "auto",
      width: "100%",
      playerVars: {
        playsinline: 1,
        enablejsapi: 1,
        loop: 1,
        autoplay: 1,
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    });
  }

  // ADD THIS LINE - Make it globally accessible
  (window as any).onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

  // 4. The API will call this function when the video player is ready.
  function onPlayerReady() {
    console.log("IN ON PLAYER READY");
    console.log("IN ELSE BRANCH OF ON PLAYER READY");
    renderCurSong();
    player.loadVideoById(existingVideoIds[prevExistingIdx]);
  }

  // 5. The API calls this function when the player's state changes.
  //    The function indicates that when playing a video (state=1),
  async function onPlayerStateChange(event: YT.OnStateChangeEvent) {
    if (event.data == YT.PlayerState.ENDED) {
      playSong();
    }
  }

  function playSong() {
    prevExistingIdx += 1;
    renderCurSong();
    player.loadVideoById(existingVideoIds[prevExistingIdx]);
    if (prevExistingIdx + 1 === existingVideoIds.length) {
      prevExistingIdx = -1;
    }
  }

  function renderCurSong() {
    const songCard = document.querySelector(
      `.songCard:nth-child(${prevExistingIdx + 1})`,
    );
    if (!songCard) return;
    const songIdx = songCard.querySelector("div.valNo > p") as HTMLElement;
    const songTitle = songCard.querySelector(
      "div.valTitle > p ",
    ) as HTMLElement;
    const songAddedBy = songCard.querySelector(
      "div.valAddedBy > p",
    ) as HTMLElement;
    if (!songIdx || !songTitle || !songAddedBy) return;

    const curSongNo = document.getElementById("curSongNo");
    const curSongTitle = document.getElementById("curSongTitle");
    const curAddedBy = document.getElementById("curAddedBy");
    if (!curSongNo || !curSongTitle || !curAddedBy) return;
    curSongNo.innerText = songIdx.innerText;
    curSongTitle.innerText = songTitle.innerText;
    curAddedBy.innerText = songAddedBy.innerText;
  }

  const shuffleBtn = document.getElementById("shuffle");
  if (shuffleBtn) {
    shuffleBtn.addEventListener("click", function () {
      //const songs = Array.from(songCards);
      for (let i = songCards.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [songCards[i], songCards[randomIndex]] = [
          songCards[randomIndex],
          songCards[i],
        ];
      }
      const playlist = document.getElementsByClassName("playListWrap")[0];
      songCards.forEach((song, index) => {
        song.children[0].children[0].children[0].textContent = String(
          index + 1,
        );
        playlist.appendChild(song);
      });
      existingVideoIds = populatePlaylist(songCards as NodeListOf<HTMLElement>);
      prevExistingIdx = 0;
      renderCurSong();
      player.loadVideoById(existingVideoIds[0]);
    });
  }
  function populatePlaylist(
    songCards: NodeListOf<HTMLElement> | HTMLElement[],
  ) {
    const videoIds: string[] = [];
    songCards.forEach((songCard: HTMLElement, index: number) => {
      videoIds.push(songCard.dataset.videoId as string);
      songCard.addEventListener("click", function () {
        player.loadVideoById(songCard.dataset.videoId as string);
        prevExistingIdx = index;
        renderCurSong();
        if (prevExistingIdx + 1 === existingVideoIds.length) {
          prevExistingIdx = -1;
        }
      });
    });
    return videoIds;
  }
}
