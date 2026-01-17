import {
  PlayerStateCallback,
  PlayerReadyCallback,
} from "./types/apiRouterTypes";

// 2. This code loads the IFrame Player API code asynchronously.
export function initializeIframe(
  onPlayerStateChange: PlayerStateCallback,
  onPlayerReady: PlayerReadyCallback,
) {
  console.log("Initializing YouTube Iframe API");
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
  //let player: YT.Player;

  // 3. This function creates an <iframe> (and YouTube player) after the API code downloads.
  // eslint-disable-next-line no-unused-vars
  (window as any).onYouTubeIframeAPIReady = function () {
    const player = new YT.Player("player", {
      height: "auto",
      width: "100%",
      playerVars: {
        playsinline: 1,
        enablejsapi: 1,
        loop: 1,
        autoplay: 1,
      },
      events: {
        onReady: () => {
          console.log("Player ready in iframe.ts");
          onPlayerReady(player);
        },
        onStateChange: (event: YT.OnStateChangeEvent) => {
          onPlayerStateChange(event.data);
        },
      },
    });
  };

  // 4. The API will call this function when the video player is ready.
  /*function onPlayerReady() {
    console.log("Player ready");
    //player.loadVideoById(videoId);
  }*/

  // 5. The API calls this function when the player's state changes.
  //    The function indicates that when playing a video (state=1),
  /* async function onPlayerStateChange(event: YT.OnStateChangeEvent) {
     if (event.data == YT.PlayerState.ENDED) {
       console.log("Video ended, loading next video");
     }
   }*/
}
