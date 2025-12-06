export async function apiFetch(url, options) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      return {
        status: response.status,
        message: response.statusText,
        data: null,
      };
    }
    const data = await response.json();
    return { status: response.status, message: response.statusText, data };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error(`Error fetching public playlists: ${message}`);
    return { status: 0, message, data: null };
  }
}
//# sourceMappingURL=api.js.map
