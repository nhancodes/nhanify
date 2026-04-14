# Project Structure

```
nhanify/
│
├── public/
|   ├── css/
|   └── js/
|       ├── main.ts                     # entry point
|       ├── dist/                       # compiled output — gitignore this
|       │   └── main.js
|       ├── router (global event to map user navigation to api and view)
|       ├── Model/
|       |   ├── Pages/ (defines the data need for the pages)
|       |   |   ├── Home.ts (I don't know if this should be an interface or class)
|       |   |   ├── Playlist.ts (I don't know if this should be an interface or class)
|       |   |   └── Playlists.ts (I don't know if this should be an interface or class)
|       |   |
|       |   └── Lib/
|       |       ├── Observer.ts (interface)
|       |       └── Subject.ts (class)
|       |
|       ├── ViewModel/
|       |   ├── Home.ts (I don't know if this should be an interface or class)
|       |   ├── Playlist.ts (I don't know if this should be an interface or class)
|       |   ├── Playlists.ts (I don't know if this should be an interface or class)
|       |   └── Lib/
|       |       ├── client
|       |       └──  api
|       |
|       ├── View/
|       |    ├── playlist.ts
|       |    ├── playlists.ts
|       |    ├── home.ts
|       |    ├── UIcomponents/ (store ui renderings)
|       |    └── Lib/
|       |       ├── cards.ts
|       |       └── actions.ts
|       |
|       └── Domain/
|           └── Entities/ (stores the data and state for the entity)
|              ├── Player.ts (extends subject, implements observer)
|              ├── SongQueue.ts (extends subject, implements observer)
|              └── CurrentPlaylistPage.ts (extends subject implements observer)
|          
├── src/
│   │
│   ├── interfaces/ (web)
│   │   ├── web/
|   │   │   ├── controllers/
│   │   │   │   ├── PlaylistController.ts
│   │   │   │   ├── SongController.ts
│   │   │   │   └── CollaboratorController.ts
│   │   │   │
│   │   │   ├── routes/
│   │   │   │   ├── playlistRoutes.ts
│   │   │   │   ├── songRoutes.ts
│   │   │   │   └── collaboratorRoutes.ts
│   │   │   │
│   │   │   ├── middleware/
│   │   │   │   ├── errorHandler.ts
│   │   │   │   ├── authMiddleware.ts
│   │   │   │   └── requestLogger.ts
│   │   │   │
│   │   │   └── mappers/
│   │   │       ├── PlaylistResponseMapper.ts
│   │   │       └── SongResponseMapper.ts
|   |   |
│   │   └── api/
│   │       ├── v1/
│   │       │   ├── controllers/
│   │       │   │   ├── PlaylistApiController.ts
│   │       │   │   └── SongApiController.ts
│   │       │   ├── routes/
│   │       │   │   ├── playlistApiRoutes.ts
│   │       │   │   └── songApiRoutes.ts
│   │       │   └── mappers/
│   │       │       ├── PlaylistApiMapper.ts
│   │       │       └── SongApiMapper.ts
│   │       │
│   │       └── middleware/
│   │           ├── apiKeyAuth.ts           # API key validation
│   │           ├── rateLimiter.ts          # rate limiting per key
│   │           └── apiErrorHandler.ts      # consistent error format
|   │      
│   ├── domain/
│   │   ├── song/
│   │   │   ├── Song.ts
│   │   │   ├── ISongRepository.ts
│   │   │   └── ObjectValues/
│   │   │       ├── SongId.ts
|   │   │       └── ValidateYTVideoId.ts
│   │   │
│   │   ├── playlist/ (aggregate)
│   │   │   ├── Playlist.ts
│   │   │   ├── IPlaylistRepository.ts
│   │   │   ├── ObjectValues/
│   │   │   |    ├── PlaylistId.ts
|   │   │   |    ├── PlaylistTitle.ts
|   │   │   |    ├── PlaylistSong.ts
│   │   │   └── Events/
|   |   │       ├── SongAddedToPlaylist.ts
|   |   │       └── SongRemovedFromPlaylist.ts
|   │   │
|   |   ├── collaborator/
|   |   │   ├── Collaborator.ts
|   |   │   └── ICollaboratorRepository.ts
|   │   │
│   │   └── user/
│   │       ├── User.ts
│   │       ├── IUserRepository.ts
│   │       └── ObjectValues/
│   │           ├── UserId.ts
│   │           └── UserName.ts
│   │
│   ├── application/
│   │   ├── playlist/
│   │   │   ├── PlaylistService.ts
│   │   │   └── dtos/
│   │   │       ├── CreatePlaylistDto.ts
│   │   │       ├── AddSongToPlaylistDto.ts
│   │   │       ├── RemoveSongFromPlaylistDto.ts
│   │   │       └── PlaylistResponseDto.ts
│   │   │
│   │   ├── song/
│   │   │   ├── SongService.ts
│   │   │   └── dtos/
│   │   │       ├── AddSongDto.ts
│   │   │       └── SongResponseDto.ts
│   │   │
│   │   └── collaborator/
│   │       ├── CollaboratorService.ts
│   │       └── dtos/
│   │           ├── AddCollaboratorDto.ts
│   │           └── CollaboratorResponseDto.ts
│   │
│   ├── infrastructure/
│   │   ├── config.ts
│   │   │
│   │   ├── database/
│   │   │   ├── index.ts
│   │   │   ├── migrations/
│   │   │   │   └── 001_init.sql
│   │   │   └── seeds/
│   │   │       └── dev.sql
│   │   │
│   │   ├── persistence/
|   │   │   ├── song/
|   │   │   │   ├── SongRepository.ts
|   │   │   │   └── SongMapper.ts
│   │   |   │
|   │   │   ├── Playlist/
|   │   │   │   ├── PlaylistRepository.ts
|   │   │   │   └── PlaylistMapper.ts
│   │   |   │
|   │   │   └── Collaborator/
|   │   │       ├── CollaboratorRepository.ts
|   │   │       └── CollaboratorMapper.ts
│   │   │
│   │   ├── messaging/
│   │   │   └── EventBus.ts (calls domain handlers )
│   │   │
│   │   ├── external/
│   │   |   ├── youtube/
|   |   │   ├── YoutubeClient.ts        # API calls to YouTube
|   |   │   ├── YoutubeMapper.ts        # YouTube response → domain entity
|   |   │   └── YoutubeConfig.ts        # API key, base URL, quota limits
│   │   │
|   |   └── twitch/
|   |       ├── TwitchClient.ts         # API calls to Twitch
|   |       ├── TwitchMapper.ts         # Twitch response → domain entity
|   |       └── TwitchConfig.ts         # client id, secret, base URL
│   │
│   └── app.ts
|
├── docker/
│   ├── nginx/
│   │   └── nginx.conf
│   └── postgres/
│       └── init.sql
│
├── docs/
│   └── architecture.md
│
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .env
├── .env.example
├── .gitignore
├── package.json
└── tsconfig.json
```