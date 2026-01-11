import { Router } from "express";
import type * as express from "express";
const catchError = require("./catch-error.js");
const homeRouter = Router();

homeRouter.get(
  "/home",
  catchError(async (req: express.Request, res: express.Response) => {
    const topPlaylists = [
      {
        id: 101,
        title: "Chill Vibes",
        creator: { id: 2, username: "musiclover99" },
        songCount: 24,
        totalLikes: 420,
        createdAt: "2024-11-20T12:00:00Z",
        contributors: [],
        thumbnail: "",
      },
      {
        id: 102,
        title: "Workout Pump",
        creator: { id: 3, username: "djmaster" },
        songCount: 30,
        totalLikes: 315,
        createdAt: "2024-10-05T09:30:00Z",
        contributors: [],
        thumbnail: "",
      },
      {
        id: 103,
        title: "Late Night Drive",
        creator: { id: 1, username: "user123" },
        songCount: 18,
        totalLikes: 278,
        createdAt: "2024-09-12T22:15:00Z",
        contributors: [],
        thumbnail: "",
      },
      {
        id: 104,
        title: "Indie Discoveries",
        creator: { id: 5, username: "rockfan21" },
        songCount: 27,
        totalLikes: 241,
        createdAt: "2024-08-30T16:45:00Z",
        contributors: [],
        thumbnail: "",
      },
    ];

    const latestUsers = [
      { id: 1, username: "user123", createdAt: "2024-12-01T15:30:00Z" },
      { id: 2, username: "musiclover99", createdAt: "2024-11-30T09:15:00Z" },
      { id: 3, username: "djmaster", createdAt: "2024-11-29T20:45:00Z" },
      { id: 4, username: "swiftie4ever", createdAt: "2024-11-28T13:00:00Z" },
      { id: 5, username: "rockfan21", createdAt: "2024-11-27T18:25:00Z" },
    ];

    const latestSongs = [
      {
        id: 1,
        playlistId: 3,
        videoId: "dQw4w9WgXcQ",
        title: "Midnight Dreams",
        durationSec: 225,
        creator: { id: 1, username: "user123" },
        createdAt: "2024-12-01T12:00:00Z",
        totalLikes: 142,
      },
      {
        id: 2,
        playlistId: 5,
        videoId: "9bZkp7q19f0",
        title: "Ocean Waves",
        durationSec: 252,
        creator: { id: 2, username: "musiclover99" },
        createdAt: "2024-12-01T10:30:00Z",
        totalLikes: 89,
      },
      {
        id: 3,
        playlistId: 2,
        videoId: "kJQP7kiw5Fk",
        title: "Electric Pulse",
        durationSec: 323,
        creator: { id: 3, username: "djmaster" },
        createdAt: "2024-11-30T18:45:00Z",
        totalLikes: 256,
      },
      {
        id: 4,
        playlistId: 6,
        videoId: "hT_nvWreIhg",
        title: "Summer Nights",
        durationSec: 238,
        creator: { id: 4, username: "swiftie4ever" },
        createdAt: "2024-11-30T14:20:00Z",
        totalLikes: 178,
      },
      {
        id: 5,
        playlistId: 1,
        videoId: "YykjpeuMNEk",
        title: "Neon Lights",
        durationSec: 270,
        creator: { id: 5, username: "rockfan21" },
        createdAt: "2024-11-29T22:10:00Z",
        totalLikes: 312,
      },
    ];
    res.locals.partial
      ? res.render("partials/partial_home", {
          playlistType: "anonPublic",
          topPlaylists,
          latestSongs,
          latestUsers,
        })
      : res.render("home", {
          playlistType: "anonPublic",
          topPlaylists,
          latestSongs,
          latestUsers,
        });
  }),
);
module.exports = { homeRouter };
