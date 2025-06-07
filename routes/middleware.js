var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g = Object.create(
        (typeof Iterator === "function" ? Iterator : Object).prototype,
      );
    return (
      (g.next = verb(0)),
      (g["throw"] = verb(1)),
      (g["return"] = verb(2)),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                    ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                    : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var _a = process.env,
  DOMAIN = _a.DOMAIN,
  NHANCODES_ID = _a.NHANCODES_ID;
var _b = require("../lib/errors.js"),
  NotFoundError = _b.NotFoundError,
  TooManyError = _b.TooManyError,
  BadRequestError = _b.BadRequestError;
var MSG = require("../lib/msg.json");
var durationSecsToHHMMSS = require("../lib/playlist.js").durationSecsToHHMMSS;
var ForbiddenError = require("../lib/errors.js").ForbiddenError;
var MAX_API_REQUEST = 900;
function apiAuth(req, res, next) {
  return __awaiter(this, void 0, void 0, function () {
    var _a,
      authorization,
      userId,
      whatever,
      userIdNum,
      response,
      decryptedApiKey,
      request;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          (_a = req.headers),
            (authorization = _a.authorization),
            (userId = _a["user-id"]);
          whatever = req.app.locals.persistence;
          userIdNum = +userId;
          if (Number.isNaN(userIdNum) || !Number.isInteger(userIdNum)) {
            throw new BadRequestError();
          }
          return [4 /*yield*/, persistence.decryptedApiKey(userIdNum)];
        case 1:
          response = _b.sent();
          if (!response) throw new ForbiddenError();
          decryptedApiKey = response.decrypted_api_key;
          if ("Bearer ".concat(decryptedApiKey) !== authorization)
            throw new ForbiddenError();
          return [
            4 /*yield*/,
            persistence.addRequest(+userId, MAX_API_REQUEST),
          ];
        case 2:
          request = _b.sent();
          if (!request) throw new TooManyError();
          next();
          return [2 /*return*/];
      }
    });
  });
}
function apiAuthStream(req, res, next) {
  return __awaiter(this, void 0, void 0, function () {
    var authorization, persistence, response, decryptedApiKey;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          authorization = req.headers.authorization;
          persistence = req.app.locals.persistence;
          return [4 /*yield*/, persistence.decryptedApiKey(NHANCODES_ID)];
        case 1:
          response = _a.sent();
          if (!response) throw new ForbiddenError();
          decryptedApiKey = response.decrypted_api_key;
          if ("Bearer ".concat(decryptedApiKey) !== authorization) {
            throw new ForbiddenError();
          }
          next();
          return [2 /*return*/];
      }
    });
  });
}
function requireAuth(req, res, next) {
  if (!req.session.user) {
    var requestURL = encodeURIComponent(req.originalUrl);
    var fullRequestURL = "".concat(DOMAIN).concat(requestURL);
    req.session.requestMethod = req.method;
    req.session.referrer = req.header("Referrer");
    req.flash("errors", MSG.error401);
    res.redirect("/signin?fullRedirectUrl=".concat(fullRequestURL));
  } else {
    next();
  }
}
function getPlaylists(
  playlistType,
  page,
  ITEMS_PER_PAGE,
  persistence,
  PAGE_OFFSET,
  userId,
) {
  return __awaiter(this, void 0, void 0, function () {
    var offset, totalPages, playlists, playlist, pageTitle, startPage, endPage;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          offset = (+page - 1) * ITEMS_PER_PAGE;
          if (!(playlistType === "public" || playlistType === "anonPublic"))
            return [3 /*break*/, 3];
          pageTitle = "Public Playlists";
          return [4 /*yield*/, persistence.getPublicPlaylistTotal()];
        case 1:
          playlist = _a.sent();
          if (!playlist) throw new NotFoundError();
          totalPages = Math.ceil(+playlist.count / ITEMS_PER_PAGE);
          if ((+page > totalPages && +page !== 1) || +page < 1)
            throw new NotFoundError();
          return [
            4 /*yield*/,
            persistence.getPublicPlaylistsPage(offset, ITEMS_PER_PAGE),
          ];
        case 2:
          playlists = _a.sent();
          _a.label = 3;
        case 3:
          if (!(playlistType === "your")) return [3 /*break*/, 6];
          pageTitle = "Your Playlists";
          return [4 /*yield*/, persistence.getYourPlaylistTotal(userId)];
        case 4:
          playlist = _a.sent();
          if (!playlist) throw new NotFoundError();
          totalPages = Math.ceil(+playlist.count / ITEMS_PER_PAGE);
          if ((+page > totalPages && +page !== 1) || +page < 1)
            throw new NotFoundError();
          return [
            4 /*yield*/,
            persistence.getYourPlaylistsPage(userId, offset, ITEMS_PER_PAGE),
          ];
        case 5:
          playlists = _a.sent();
          _a.label = 6;
        case 6:
          if (!(playlistType === "contribution")) return [3 /*break*/, 9];
          pageTitle = "Contribution Playlists";
          return [
            4 /*yield*/,
            persistence.getContributionPlaylistTotal(userId),
          ];
        case 7:
          playlist = _a.sent();
          totalPages = Math.ceil(+playlist.count / ITEMS_PER_PAGE);
          if ((+page > totalPages && +page !== 1) || +page < 1)
            throw new NotFoundError();
          if (!playlist) throw new NotFoundError();
          return [
            4 /*yield*/,
            persistence.getContributionPlaylistsPage(
              userId,
              offset,
              ITEMS_PER_PAGE,
            ),
          ];
        case 8:
          playlists = _a.sent();
          _a.label = 9;
        case 9:
          startPage = Math.max(+page - PAGE_OFFSET, 1);
          endPage = Math.min(+page + PAGE_OFFSET, totalPages);
          return [
            2 /*return*/,
            {
              startPage: startPage,
              endPage: endPage,
              totalPages: totalPages,
              playlistType: playlistType,
              pageTitle: pageTitle,
              playlists: playlists,
              page: +page,
              playlistTotal: +playlist.count,
            },
          ];
      }
    });
  });
}
function getPlaylist(
  persistence,
  ITEMS_PER_PAGE,
  PAGE_OFFSET,
  playlistType,
  playlistId,
  page,
  pagePl,
) {
  return __awaiter(this, void 0, void 0, function () {
    var offset, playlist, totalPages, playlistObj, videoIds, startPage, endPage;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          offset = (+pagePl - 1) * ITEMS_PER_PAGE;
          return [4 /*yield*/, persistence.getSongTotal(+playlistId)];
        case 1:
          playlist = _a.sent();
          if (!playlist) throw new NotFoundError();
          totalPages = Math.ceil(+playlist.count / ITEMS_PER_PAGE);
          if ((+pagePl > totalPages && +pagePl !== 1) || +pagePl < 1)
            throw new NotFoundError();
          return [
            4 /*yield*/,
            persistence.getPlaylistInfoSongs(
              +playlistId,
              offset,
              ITEMS_PER_PAGE,
            ),
          ];
        case 2:
          playlistObj = _a.sent();
          videoIds = playlistObj.songs.map(function (song) {
            return song.video_id;
          });
          playlistObj.songs.forEach(function (song) {
            song.duration_sec = durationSecsToHHMMSS(song.duration_sec);
          });
          startPage = Math.max(+pagePl - PAGE_OFFSET, 1);
          endPage = Math.min(+pagePl + PAGE_OFFSET, totalPages);
          return [
            2 /*return*/,
            {
              playlist: playlistObj,
              pageTitle: playlistObj.info.title,
              videoIds: videoIds,
              totalPages: totalPages,
              page: +page,
              pagePl: +pagePl,
              endPage: endPage,
              startPage: startPage,
              playlistTotal: +playlistObj.count,
              playlistType: playlistType,
              playlistId: +playlistId,
            },
          ];
      }
    });
  });
}
module.exports = {
  getPlaylists: getPlaylists,
  getPlaylist: getPlaylist,
  requireAuth: requireAuth,
  apiAuth: apiAuth,
  apiAuthStream: apiAuthStream,
};
