/**
 * Parses the url for the video id.
 
 * @params {String} URLInput - The url input. must be a valid Youtube URL including video id. Behaviour is undefined (and may crash) if query string is mising or invalid.
 * @returns {String} - The video id.
 */
export function parseURL(URLInput: any): string;
/**
 * Is the URL input a valid url by hostname, pathname and is absolute.
 * @params {String} url - The url input.
 * @returns {boolean}
 */
export function isValidURL(URLInput: any): boolean;
/**
 * Is the URL input a valid url by hostname and is absolute.
 * @params {String} URLInput - The url input.
 * @returns {boolean}
 */
export function isValidRedirectURL(URLInput: any): boolean;
export function durationSecsToHHMMSS(secs: any): string;
export function getVidInfo(
  vidUrl: any,
  YT_API_KEY: any,
): Promise<{
  title: any;
  videoId: any;
  durationSecs: any;
} | null>;
export function getVidInfoByVidId(
  videoId: any,
  YT_API_KEY: any,
): Promise<{
  title: any;
  videoId: any;
  durationSecs: any;
} | null>;
