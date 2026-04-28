const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShortUrl {
  id: string;
  shortCode: string;
  shortUrl: string;
  qrCodeDataUrl: string;
  originalUrl: string;
  clickCount: number;
  createdAt: string;
  updatedAt?: string;
  expiresAt?: string | null;
}

export interface UrlStats {
  id: string;
  shortCode: string;
  shortUrl: string;
  qrCodeDataUrl: string;
  originalUrl: string;
  clickCount: number;
  createdAt: string;
  updatedAt?: string;
  expiresAt?: string | null;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}

async function getErrorMessage(response: Response): Promise<string> {
  try {
    const error: ApiError = await response.json();
    return Array.isArray(error.message) ? error.message.join(", ") : error.message;
  } catch {
    return `Request failed with status ${response.status}`;
  }
}

async function fetchWithRefresh(
  url: string,
  options: RequestInit,
  retry = true
): Promise<Response> {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
  });

  if (response.status === 401 && retry) {
    const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (refreshResponse.ok) {
      return fetchWithRefresh(url, options, false);
    }
  }

  return response;
}

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<{ user: User }> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ user: User }> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
}

export async function logoutUser(): Promise<void> {
  const response = await fetchWithRefresh(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
}

export async function getMe(): Promise<User> {
  const response = await fetchWithRefresh(`${API_BASE_URL}/auth/me`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
}

export async function refreshToken(): Promise<{ user: User }> {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
}

export async function createShortUrl(
  originalUrl: string,
  customAlias?: string
): Promise<ShortUrl> {
  const body: { originalUrl: string; customAlias?: string } = { originalUrl };
  if (customAlias) {
    body.customAlias = customAlias;
  }

  const response = await fetchWithRefresh(`${API_BASE_URL}/shorten`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
}

export async function getMyUrls(): Promise<ShortUrl[]> {
  const response = await fetchWithRefresh(`${API_BASE_URL}/urls`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
}

export async function getStats(shortCode: string): Promise<UrlStats> {
  const response = await fetchWithRefresh(
    `${API_BASE_URL}/stats/${shortCode}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
}

export async function getUrlStatsById(urlId: string): Promise<UrlStats> {
  const response = await fetchWithRefresh(`${API_BASE_URL}/urls/${urlId}/stats`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
}

export async function updateShortUrl(
  urlId: string,
  data: { originalUrl?: string; customAlias?: string }
): Promise<ShortUrl> {
  const response = await fetchWithRefresh(`${API_BASE_URL}/urls/${urlId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
}

export async function deleteShortUrl(
  urlId: string
): Promise<{ id: string; message: string }> {
  const response = await fetchWithRefresh(`${API_BASE_URL}/urls/${urlId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
}
