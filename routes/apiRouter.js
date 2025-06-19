const { NODE_ENV } = process.env;
const isProduction = NODE_ENV === "production";
let Sentry;
if (isProduction) Sentry = require("@sentry/node");
const { Router, json } = require("express");
const apiRouter = Router();
const {
  TooManyError,
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} = require("../lib/errors.js");
const { YT_API_KEY } = process.env;
const { getVidInfo, durationSecsToHHMMSS } = require("../lib/playlist.js");
const catchError = require("./catch-error.js");
const { apiAuth } = require("./middleware.ts");
let clients = [];
apiRouter.use(json());

const getPublicPlaylists = async (req, res) => {
  const persistence = req.app.locals.persistence;
  const playlists = await persistence.getPublicPlaylistsPage(0, 50);
  const formattedData = playlists.map((playlist) => {
    return {
      id: playlist.id,
      title: playlist.title,
      creator: { id: playlist.creator_id, username: playlist.username },
      isPrivate: playlist.private,
      songCount: +playlist.count,
    };
  });
  res.json({ playlists: formattedData });
};

const getPlaylist = async (req, res) => {
  const id = req.params.id;
  if( id === "" || Number.isNaN(+id) || !Number.isInteger(+id) || +id < 0 ) {
    throw new BadRequestError();
  }
  const persistence = req.app.locals.persistence;
  const playlist = await persistence.getPlaylist(+id);
  if (!playlist) throw new NotFoundError();
  const result = await persistence.getPlaylistInfoSongs(req.params.id, 0, 100);
  const info = result.info;
  const songs = result.songs.map((song) => {
    return {
      id: song.id,
      title: song.title,
      videoId: song.video_id,
      addedBy: song.username,
      durationSec: song.duration_sec,
    };
  });

  res.json({
    id: +req.params.id,
    title: info.title,
    creatorId: info.creator_id,
    isPrivate: info.private,
    songCount: result.songTotal,
    songs,
  });
};

const getPlaylistsByIds = async (req, res) => {
  const persistence = req.app.locals.persistence;
  const ids = typeof req.query.id === "string" ? [req.query.id] : req.query.id;

  const queryParams = ids.reduce((accum, id) => {
    if (!Number.isNaN(+id) && Number.isInteger(+id) && +id >= 0 && id !== "")
      accum.push(+id);
    return accum;
  }, []);
  if (queryParams.length === 0) return res.json({ playlists: [] });
  const playlists = await persistence.getPlaylistsByIdPage(queryParams);
  const formattedData = playlists.map((playlist) => {
    return {
      id: playlist.id,
      title: playlist.title,
      creator: { id: playlist.creator_id, username: playlist.username },
      isPrivate: playlist.private,
      songCount: +playlist.count,
    };
  });
  res.json({ playlists: formattedData });
};

apiRouter.get(
  "/playlists/public",
  catchError(apiAuth),
  catchError(getPublicPlaylists),
);

apiRouter.get("/playlists", catchError(apiAuth), catchError(getPlaylistsByIds));

apiRouter.get("/playlist/:id", catchError(apiAuth), catchError(getPlaylist));

apiRouter.get(
  "/users/:id",
  catchError(apiAuth),
  catchError(async (req, res) => {
    const id = req.params.id;
    if (
      !id ||
      id === "" ||
      Number.isNaN(+id) ||
      !Number.isInteger(+id) ||
      +id > 0
    ) {
      throw new BadRequestError();
    }
    const persistence = req.app.locals.persistence;
    const user = await persistence.getUserById(+req.params.id);
    if (!user) throw new NotFoundError();
    res.json({ username: user.username });
  }),
);

apiRouter.post(
  "/playlist/addSong",
  catchError(apiAuth),
  catchError(async (req, res) => {
    const persistence = req.app.locals.persistence;
    const playlistTitle = "Saved Songs";
    let createdPlaylist;
    let user = await persistence.getUserIdByUsername(req.body.addedBy);
    if (!user) throw new ForbiddenError();
    const playlist = await persistence.getPlaylistByUserPlaylistName(
      req.body.addedBy,
      playlistTitle,
    );
    if (!playlist) {
      //create the playlist for the user called Saved Songs
      createdPlaylist = await persistence.createPlaylist(
        playlistTitle,
        true,
        user.id,
      );
      console.log({ createdPlaylist });
    }
    const vidInfo = await getVidInfo(req.body.url, YT_API_KEY);
    if (!vidInfo) throw new NotFoundError("invalid_video_id");
    const playlistId = !createdPlaylist ? playlist.id : createdPlaylist.id;
    const song = await persistence.addSong(
      vidInfo.title,
      vidInfo.videoId,
      playlistId,
      user.id,
      vidInfo.durationSecs,
    );
    if (song.rowCount === 0) throw new ForbiddenError("playlist_max_limit");
    //make a query for the added song in the playlist
    const addedSong = await persistence.getSong(vidInfo.videoId, playlistId);
    if (!addedSong) {
      throw new NotFoundError();
    } else {
      sendEvent({
        title: addedSong.title,
        videoId: addedSong.video_id,
        playlistId: addedSong.playlist_id,
        songId: addedSong.id,
        addedBy: req.body.addedBy,
        duration: durationSecsToHHMMSS(addedSong.duration_sec),
      });
      res.json({ message: "success", song: addedSong });
    }
  }),
);

apiRouter.get("/event", (req, res) => {
  console.log("IN EVENT");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Status", "200");
  clients.push(res);
  req.on("close", () => {
    clients = [];
  });
});

function sendEvent(data) {
  console.log("IN SENTEVENT");
  console.log({ clients });
  clients.forEach((client) => {
    console.log({ data });
    try {
      client.write(`data: ${JSON.stringify(data)}\n\n`);
    } catch (err) {
      console.error(err);
    }
  });
}

// error handlers
apiRouter.use("*", (req, res, next) => {
  next(new NotFoundError());
});
apiRouter.use((err, req, res, _next) => {
  // do not remove next parameter
  if (err.constraint === "unique_video_id_playlist_id") {
    res.status(403).json({ message: "duplicate_video_id" });
  } else if (err instanceof ForbiddenError) {
    res.status(403).json({ message: err.message });
  } else if (err instanceof NotFoundError) {
    res.status(404).json({ message: err.message });
  } else if (err instanceof TooManyError) {
    res.status(429).json({ message: err.message });
  } else if (err instanceof BadRequestError) {
    res.status(400).json({ message: err.message });
  } else {
    if (isProduction) Sentry.captureException(err);
    res.status(500).json({ message: "server_error" });
  }
});
module.exports = { apiRouter, getPlaylistsByIds };
