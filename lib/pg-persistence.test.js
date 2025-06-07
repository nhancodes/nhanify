const client = require("./pg-connect.js");
const Persistence = require("./pg-persistence.js");
const persistence = new Persistence();

describe("Persistence", () => {
  test.concurrent.each([
    [1, 1, true], // user1 has read access to user created playlist 1
    [6, 1, true], // userId 1 has read access to public playlist 6
    [11, 1, true], // UserId 1, a contributor to playlist 11, has read access
    [11, 2, false], // UserId 2 is not authorized read access to playlist 11
  ])(
    "user %p has access to playlist %p",
    async (userId, playlistId, expected) => {
      expect(
        await persistence.isReadPlaylistAuthorized(userId, playlistId),
      ).toBe(expected);
    },
  );

  test.concurrent.each([
    // Gets three playlists userId 1 contributes to
    [
      1,
      0,
      5,
      [
        {
          count: "0",
          username: "username3",
          id: 9,
          title: "Dance Class",
          creator_id: 3,
          private: false,
        },
        {
          count: "0",
          username: "username2",
          id: 8,
          title: "Focus Study",
          creator_id: 2,
          private: false,
        },
        {
          count: "0",
          username: "username5",
          id: 11,
          title: "Summer Jam",
          creator_id: 5,
          private: true,
        },
      ],
    ],

    // Gets twot playlists userId 2 contributes to
    [
      2,
      0,
      5,
      [
        {
          count: "7",
          username: "username1",
          id: 1,
          title: "Lofi",
          creator_id: 1,
          private: false,
        },
        {
          count: "10",
          username: "username1",
          id: 7,
          title: "Twitch Stream",
          creator_id: 1,
          private: false,
        },
      ],
    ],
  ])(
    "user %p contributes these playists",
    async (userId, offset, limit, expected) => {
      expect(
        await persistence.getContributionPlaylistsPage(userId, offset, limit),
      ).toStrictEqual(expected);
    },
  );

  test.concurrent.each([
    // Gets five playlists created by userId 1
    [
      1,
      0,
      5,
      [
        {
          count: "0",
          username: "username1",
          id: 3,
          title: "Chill & Relaxing",
          creator_id: 1,
          private: false,
        },
        {
          count: "1",
          username: "username1",
          id: 6,
          title: "Christmas Jams",
          creator_id: 1,
          private: false,
        },
        {
          count: "1",
          username: "username1",
          id: 5,
          title: "Coding",
          creator_id: 1,
          private: false,
        },
        {
          count: "1",
          username: "username1",
          id: 2,
          title: "Gym",
          creator_id: 1,
          private: false,
        },
        {
          count: "7",
          username: "username1",
          id: 1,
          title: "Lofi",
          creator_id: 1,
          private: false,
        },
      ],
    ],
    [
      2,
      0,
      5,
      [
        {
          count: "0",
          username: "username2",
          id: 8,
          title: "Focus Study",
          creator_id: 2,
          private: false,
        },
      ],
    ],
  ])(
    "user %p created these playlists",
    async (userId, offset, limit, expected) => {
      expect(
        await persistence.getYourPlaylistsPage(userId, offset, limit),
      ).toStrictEqual(expected);
    },
  );

  test("Gets five public playlists", async () => {
    const expected = [
      {
        count: "0",
        username: "username1",
        id: 3,
        title: "Chill & Relaxing",
        creator_id: 1,
        private: false,
      },
      {
        count: "1",
        username: "username1",
        id: 6,
        title: "Christmas Jams",
        creator_id: 1,
        private: false,
      },
      {
        count: "1",
        username: "username1",
        id: 5,
        title: "Coding",
        creator_id: 1,
        private: false,
      },
      {
        count: "0",
        username: "username3",
        id: 9,
        title: "Dance Class",
        creator_id: 3,
        private: false,
      },
      {
        count: "0",
        username: "username2",
        id: 8,
        title: "Focus Study",
        creator_id: 2,
        private: false,
      },
    ];
    expect(await persistence.getPublicPlaylistsPage(0, 5)).toStrictEqual(
      expected,
    );
  });

  test("Get playlistId 1 info", async () => {
    const expected = {
      title: "Lofi",
      creator_id: 1,
      private: false,
    };
    expect(await persistence.getPlaylist(1)).toStrictEqual(expected);
  });

  test.concurrent.each([
    [
      1,
      0,
      5,
      {
        songs: [
          {
            added_by: "username1",
            id: 6,
            title: "Blankets",
            video_id: "HdXrkgZP438",
            duration_sec: 214,
          },
          {
            added_by: "username1",
            id: 1,
            title: "Chilling In Tokyo",
            video_id: "y7qZFji19Rg",
            duration_sec: 319,
          },
          {
            added_by: "username2",
            id: 7,
            title: "Dreaming",
            video_id: "DFVuYoDVS_g",
            duration_sec: 285,
          },
          {
            added_by: "username1",
            id: 5,
            title: "Eternal Youth",
            video_id: "_BWPNPtsZm8",
            duration_sec: 206,
          },
          {
            added_by: "username1",
            id: 2,
            title: "Good Days",
            video_id: "L9VcK_pT1Y4",
            duration_sec: 152,
          },
        ],
        info: {
          title: "Lofi",
          creator_id: 1,
          private: false,
        },
        songTotal: "7",
      },
    ],
    [
      2,
      0,
      5,
      {
        songs: [
          {
            added_by: "username2",
            id: 8,
            title: "Pink - Raise Your Glass",
            video_id: "XjVNlG5cZyQ",
            duration_sec: 203,
          },
        ],
        info: {
          title: "Gym",
          creator_id: 1,
          private: false,
        },
        songTotal: "1",
      },
    ],
  ])("user %p song info", async (userId, offset, limit, expected) => {
    expect(
      await persistence.getPlaylistInfoSongs(userId, offset, limit),
    ).toStrictEqual(expected);
  });

  test.concurrent.each([
    //Get playlist by playlist title Christmas Jams and username username1
    ["username1", "Christmas Jams", { id: 6 }],
    //Get playlist by playlist title Christmas Jams and username username60
    ["username60", "Christmas Jams", undefined],
  ])(
    "playlist created by %p and titled %p",
    async (userName, playlistName, expected) => {
      expect(
        await persistence.getPlaylistByUserPlaylistName(userName, playlistName),
      ).toStrictEqual(expected);
    },
  );

  afterAll(async () => {
    await client.end();
  });
});
