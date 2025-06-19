const { apiAuth } = require("./middleware");
const { BadRequestError } = require("../lib/errors");
const { getPlaylistsByIds } = require("./apiRouter");
const client = require("../lib/pg-connect");
const Persistence = require("../lib/pg-persistence");
const persistence = new Persistence();

describe("api auth middleware", () => {
  const baseReq = {
    app: {
      locals: {
        persistence: undefined,
      },
    },
  };
  test.concurrent.each([
    //auth with empty string athorizations
    [
      {
        ...baseReq,
        headers: {
          "user-id": "13",
          authorization: "",
        },
      },
      {},
    ],
    //auth with no authorization
    [
      {
        ...baseReq,
        headers: {
          "user-id": "13",
        },
      },
      {},
    ],
    //auth with no user-id
    [
      {
        ...baseReq,
        headers: {
          authorization: "randomstring",
        },
      },
      {},
    ],
    //auth with empty string
    [
      {
        ...baseReq,
        headers: {
          "user-id": "",
          authorization: "randomstring",
        },
      },
      {},
    ],
    //auth with alpha string user-id
    [
      {
        ...baseReq,
        headers: {
          "user-id": "invalid",
          authorization: "randomstring",
        },
      },
      {},
    ],
    //auth with float string user-id
    [
      {
        ...baseReq,
        headers: {
          "user-id": "13.44",
          authorization: "randomstring",
        },
      },
      {},
    ],
  ])("invalid headers for auth %o", async (req, res) => {
    await expect(async () => {
      await apiAuth(req, res);
    }).rejects.toThrow(BadRequestError);
  });

  describe("get playlists by ids", () => {
    let result;
    const response = { json: (data) => (result = data) };
    const req = { app: { locals: { persistence: persistence } } };
    test.concurrent.each([
      [{ ...req, query: { id: "1.2" } }, response, []],
      [{ ...req, query: { id: "string" } }, response, []],
      [{ ...req, query: { id: "-1" } }, response, []],
      [{ ...req, query: { id: "0" } }, response, []],

      [
        { ...req, query: { id: ["7", "1.2"] } },
        response,
        [
          {
            id: 7,
            title: "Twitch Stream",
            creator: {
              id: 1,
              username: "username1",
            },
            isPrivate: false,
            songCount: 10,
          },
        ],
      ],
      [
        { ...req, query: { id: ["7", "0"] } },
        response,
        [
          {
            id: 7,
            title: "Twitch Stream",
            creator: {
              id: 1,
              username: "username1",
            },
            isPrivate: false,
            songCount: 10,
          },
        ],
      ],
      [
        { ...req, query: { id: ["7", "string"] } },
        response,
        [
          {
            id: 7,
            title: "Twitch Stream",
            creator: {
              id: 1,
              username: "username1",
            },
            isPrivate: false,
            songCount: 10,
          },
        ],
      ],
      [
        { ...req, query: { id: ["7", "4"] } },
        response,
        [
          {
            id: 4,
            title: "Party",
            creator: {
              id: 1,
              username: "username1",
            },
            isPrivate: false,
            songCount: 1,
          },
          {
            id: 7,
            title: "Twitch Stream",
            creator: {
              id: 1,
              username: "username1",
            },
            isPrivate: false,
            songCount: 10,
          },
        ],
      ],
    ])("%p fetches playlist ids", async (req, res, expected) => {
      await getPlaylistsByIds(req, res);
      expect(result.playlists).toEqual(expected);
    });
  });
  afterAll(async () => {
    await client.end();
  });
});
