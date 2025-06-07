const { apiAuth } = require("./middleware");
const { BadRequestError } = require("../lib/errors");

describe("apiRouter", () => {
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
  ])("bad auth requests %o", async (req, res) => {
    await expect(async () => {
      await apiAuth(req, res);
    }).rejects.toThrow(BadRequestError);
  });
});
