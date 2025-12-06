export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T | null;
}

export async function apiFetch<T>(
  url: string,
  options: RequestInit,
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      return {
        status: response.status,
        message: response.statusText,
        data: null,
      } as ApiResponse<T>;
    }
    const data = (await response.json()) as T;
    return {
      status: response.status,
      message: response.statusText,
      data,
    } as ApiResponse<T>;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error(`Error fetching public playlists: ${message}`);
    return { status: 0, message, data: null } as ApiResponse<T>;
  }
}
