const { apiAuth } = require("./middleware.ts");
const { BadRequestError } = require("../lib/errors");

describe("apiRouter", () => {
  test("get public playlist with alpha character client id", async () => {
    const req = {
      app: {
        locals: {
          persistence: undefined,
        },
      },
      headers: {
        "user-id": "invalid",
        authorization: "randomstring",
      },
    };
    await expect(async () => {
      await apiAuth(req, {});
    }).rejects.toThrow(BadRequestError);
  });

  test("get public playlist with float client id", async () => {
    const req = {
      app: {
        locals: {
          persistence: undefined,
        },
      },
      headers: {
        "user-id": "1.5",
        authorization: "randomstring",
      },
    };
    await expect(async () => {
      await apiAuth(req, {});
    }).rejects.toThrow(BadRequestError);
  });
});
