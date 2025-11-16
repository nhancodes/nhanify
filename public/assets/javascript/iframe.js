/* global YT */
// 2. This code loads the IFrame Player API code asynchronously.
export function initalizeIframe() {
    console.log("IN INITIALIZE IFRAME");
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    let player;
    let prevExistingIdx = 0;
    const songCards = document.querySelectorAll(".songCard");
    let existingVideoIds = [];
    if (songCards)
        existingVideoIds = populatePlaylist(songCards);
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
    window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    // 4. The API will call this function when the video player is ready.
    function onPlayerReady() {
        console.log("IN ON PLAYER READY");
        console.log("IN ELSE BRANCH OF ON PLAYER READY");
        renderCurSong();
        player.loadVideoById(existingVideoIds[prevExistingIdx]);
    }
    // 5. The API calls this function when the player's state changes.
    //    The function indicates that when playing a video (state=1),
    async function onPlayerStateChange(event) {
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
        const songCard = document.querySelector(`.songCard:nth-child(${prevExistingIdx + 1})`);
        if (!songCard)
            return;
        const songIdx = songCard.querySelector("div.valNo > p");
        const songTitle = songCard.querySelector("div.valTitle > p ");
        const songAddedBy = songCard.querySelector("div.valAddedBy > p");
        if (!songIdx || !songTitle || !songAddedBy)
            return;
        const curSongNo = document.getElementById("curSongNo");
        const curSongTitle = document.getElementById("curSongTitle");
        const curAddedBy = document.getElementById("curAddedBy");
        if (!curSongNo || !curSongTitle || !curAddedBy)
            return;
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
                song.children[0].children[0].children[0].textContent = String(index + 1);
                playlist.appendChild(song);
            });
            existingVideoIds = populatePlaylist(songCards);
            prevExistingIdx = 0;
            renderCurSong();
            player.loadVideoById(existingVideoIds[0]);
        });
    }
    function populatePlaylist(songCards) {
        const videoIds = [];
        songCards.forEach((songCard, index) => {
            videoIds.push(songCard.dataset.videoId);
            songCard.addEventListener("click", function () {
                player.loadVideoById(songCard.dataset.videoId);
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
//# sourceMappingURL=iframe.js.map