export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T | null;
}
import type { Playlist, User, Song } from "./types/apiRouterTypes.js";

// Todo : Replace with real API calls
export async function getLastestSongs(): Promise<Song[]> {
  const response = await apiFetch<Song[]>("/api/songs/lastest", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.data) {
    console.error(
      `Failed to fetch lastest added songs: ${response.message} (status: ${response.status})`,
    );
    return [];
  }
  return response.data;
}

// Todo : Replace with real API calls
export async function getLastestUsers(): Promise<User[]> {
  const response = await apiFetch<User[]>("/api/users/lastest", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.data) {
    console.error(
      `Failed to fetch lastest joined users: ${response.message} (status: ${response.status})`,
    );
    return [];
  }
  return response.data;
}

// Todo : Replace with real API calls
export async function getTopPlaylists(): Promise<Playlist[]> {
  const response = await apiFetch<Playlist[]>("/api/playlists/public/top", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.data) {
    console.error(
      `Failed to fetch top public playlists: ${response.message} (status: ${response.status})`,
    );
    return [];
  }
  return response.data;
}

export async function getPublicPlaylists(): Promise<Playlist[]> {
  const response = await apiFetch<Playlist[]>("/api/playlists/public", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.data) {
    console.error(
      `Failed to fetch public playlists: ${response.message} (status: ${response.status})`,
    );
    return [];
  }
  return response.data;
}

async function apiFetch<T>(
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
    return { status: 0, message, data: null } as ApiResponse<T>;
  }
}
