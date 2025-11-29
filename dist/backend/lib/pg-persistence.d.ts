export = Persistence;
declare class Persistence {
  createApiKey(apiKey: any, userId: any): Promise<any>;
  decryptedApiKey(userId: any): Promise<any>;
  addRequest(userId: any, maxRequest: any): Promise<any>;
  /**
   * Finds and authenicate the user signing in.
   * @param   {string} username - The user's username.
   * @param   {string} password - The user's password.
   * @returns {object | false} - The user object or false.
   */
  authenticateUser(username: string, password: string): object | false;
  updateUser(username: any, twitchId: any): Promise<any>;
  /**
   * Creates a user account.
   * @param {string} username - The user's username.
   * @param {string} password - The user's password.
   * @returns {object | error} - The user object or unique_username constraint.
   */
  createUser(username: string, password: string): object | error;
  createUserTwitch(username: any, twitchId: any): Promise<any>;
  getUserIdByUsername(username: any): Promise<any>;
  /**
   * Creates a playlist.
   * @param {String} title - The title of the playlist.
   * @param {boolean} isPrivate - The visibility of the playlist.
   * @param {number} creatorId - The creator of the playlist.
   * @param {number} maxPlaylists - The maximum number of playlists a user can create. Default is 100.
   * @returns {object} - Object containing the id of the created playlist.
   */
  createPlaylist(
    title: string,
    isPrivate: boolean,
    creatorId: number,
    maxPlaylists?: number,
  ): object;
  /**
   * Gets a page of public playlists in alphabetical order.
   * @param {number} offset - The starting playlist of a page.
   * @param {number} limit - The number of playlists on a page.
   * @returns {array} - The collection of song objects on a page.
   */
  getPublicPlaylistsPage(offset: number, limit: number): array;
  /**
   * Gets public playlist total.
   * @returns {object}  - The object containing count property.
   */
  getPublicPlaylistTotal(): object;
  /**
   * Gets a page of the user's created playlists in alphabetical order.
   * @param {number} userId - The user's id.
   * @param {number} offset - The starting playlist of a page.
   * @param {number} limit - The number of playlists on a page.
   * @returns {array} - The collection of song objects on a page.
   */
  getYourPlaylistsPage(userId: number, offset: number, limit: number): array;
  /**
   * Gets a user's created playlist total.
   * @params {number} userId - The user's id.
   * @returns {Object}  - The object containing the count property.
   */
  getYourPlaylistTotal(userId: any): Object;
  /**
   * Gets a page of the user's contribution playlists in alphabetical order.
   * @param {number} userId - The user's id.
   * @param {number} offset - The starting playlist of a page.
   * @param {number} limit - The number of playlists on a page.
   * @returns {array} - The collection of song objects on a page.
   */
  getContributionPlaylistsPage(
    userId: number,
    offset: number,
    limit: number,
  ): array;
  /**
   * Gets a user's contribution playlist total.
   * @params {number} userId - The user's id.
   * @returns {Object}  - The Object containing the count property.
   */
  getContributionPlaylistTotal(userId: any): Object;
  /**
   * Is the playlist created by the user.
   * @param {number} playlistId - The playlist's id.
   * @param {number} userId - The user's id.
   * @returns {boolean}
   */
  isYourPlaylist(playlistId: number, userId: number): boolean;
  /**
   * Edits a playlist.
   * @param {number} playlistId - The playlist's id.
   * @param {String} newTitle - The new title of the playlist.
   * @param {boolean} isPrivate - The visibility of the playilst.
   * @returns {boolean \ error} - If palylist was edited | The unique_creator_id_title constraint.
   */
  editPlaylist(
    playlistId: number,
    newTitle: string,
    isPrivate: boolean,
  ): boolean;
  /**
   * Gets the playlist title.
   * param {number} playlistId - The playlist's id.
   * @returns {object} - Object containing title property.
   */
  getPlaylistTitle(playlistId: any): object;
  /**
   * Gets the playlist.
   * param {number} playlistId - The playlist's id.
   * @returns {object} - The playlist object.
   */
  getPlaylist(playlistId: any): object;
  /**
   * Deletes the playlist.
   * param {number} playlistId - The playlist's id.
   * @returns {boolean} - If the playlist has been deleted.
   */
  deletePlaylist(playlistId: any): boolean;
  /**
   * Does user have read authorization to playlist.
   * param {number} playlistId - The playlist id.
   * param {number} userId - The user's id.
   * @returns {boolean}
   */
  isReadPlaylistAuthorized(playlistId: any, userId: any): boolean;
  getPublicPlaylist(playlistId: any): Promise<boolean>;
  /**
   * Does user have read authorization to playlist.
   * param {number} playlistId - The playlist id.
   * param {number} userId - The user's id.
   * @returns {boolean}
   */
  isWriteSongAuthorized(playlistId: any, userId: any): boolean;
  /**
   * Gets the playlist songs, info and song total.
   * param {number} playlistId - The playlist id.
   * @param {number} offset - The starting playlist of a page.
   * @param {number} limit - The number of playlists on a page.
   * @returns {object} - The object of songs collection, playlist info, and song total.
   */
  getPlaylistInfoSongs(playlistId: any, offset: number, limit: number): object;
  /**
   * Adds a song.
   * @param {String} title - The title of the playlist.
   * @param {String} videoId  - The video's id.
   * @param {number} playlistId  - The playlist the song is added to.
   * @param {String} addedBy - The user that added the song.
   * @param {number} durationSecs - The duration of the song in seconds.
   * @param {number} maxPlaylistSongs - The maximum number of songs in a playlist. Default is 500.
   * @returns {void | error} - The unique_title_playlist_id or unique_video_id_playlist_id  constraint
   */
  addSong(
    title: string,
    videoId: string,
    playlistId: number,
    addedBy: string,
    durationSecs: number,
    maxPlaylistSongs?: number,
  ): void | error;
  /**
   * Gets contributors of a playlist of a page.
   * params {number} playlistId - The playlist's id.
   * @param {number} offset - The starting playlist of a page.
   * @param {number} limit - The number of playlists on a page.
   * @returns {array} - The collection of contributors of a page .
   */
  getContributorsPage(playlistId: any, offset: number, limit: number): array;
  /**
   * Gets the total number of songs in a playlist.
   * @param {number} playlstId - The playlist's id.
   * returns {object} - The object containing a count property.
   */
  getContributorTotal(playlistId: any): Promise<any>;
  /**
   * Gets the title of a song.
   * params {number} songId - The song's id.
   * returns {object} - The object containing title property.
   */
  getSongTitle(songId: any): Promise<any>;
  /**
   * Gets the title and videoId of a song.
   * params {string} videoId - The video's id.
   * returns {object} - The object containing title and videoId property.
   */
  getSong(videoId: any, playlistId: any): Promise<any>;
  /**
   * Deletes the song.
   * param {number} songId - The song's id.
   * @returns {boolean} - If the song has been deleted.
   */
  deleteSong(songId: any): boolean;
  /**
   * Deletes a contributor.
   * param {number} playlistId - The playlist's id.
   * param {number} contributorId - The contributor's id.
   * @returns {boolean} - If the contributor has been deleted.
   */
  deleteContributor(playlistId: any, contributorId: any): boolean;
  /**
   * Deletes a contribution playlist.
   * param {number} playlistId - The playlist's id.
   * param {number} contributorId - The contributor's id.
   * @returns {boolean} - If the contribution playlist has been deleted.
   */
  deleteContributionPlaylist(playlistId: any, contributorId: any): boolean;
  /**
   * Gets a contributor' id.
   * @param {string} username - The contributor's username.
   * @returns {object} - The object containing an id property.
   */
  getContributor(username: string): object;
  /**
   * Adds a contributor.
   * @param {number} contributorId - The contributor's id.
   * @param {number} playlistId - The playlist's id.
   * @returns {void | error} - The unique contributor constraint
   */
  addContributor(contributorId: number, playlistId: number): void | error;
  /**
   * Gets the total number of songs in a playlist.
   * @param {number} playlstId - The playlist's id.
   * returns {object} - The object containing a count property.
   */
  getSongTotal(playlistId: any): Promise<any>;
  /**
   * Edits a song
   * @param {number} songId - The song's id.
   * @param {String} newTitle - The new title of the song.
   * @returns {boolean | error} - If song  was edited | The unique_title_playlist_id constraint.
   */
  editSong(songId: number, newTitle: string): boolean | error;
  getUserById(id: any): Promise<any>;
  getPlaylistByUserPlaylistName(username: any, playlistName: any): Promise<any>;
  /**
   *@param {number []} playlistIds - The collection of playlist ids.
   * Gets a page of playlists by id in alphabetical order.
   * @returns {array} - The collection of song objects on a page.
   */
  getPlaylistsByIdPage(playlistIds: number[]): array;
}
