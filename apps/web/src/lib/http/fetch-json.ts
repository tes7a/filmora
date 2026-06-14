import { env } from '../config/env';

type RequestParams = Record<
  string,
  string | number | boolean | Array<string | number | boolean> | undefined
>;

type RequestJsonOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  params?: RequestParams;
  body?: unknown;
  cache?: RequestCache;
  credentials?: RequestCredentials;
  headers?: Record<string, string>;
};

function buildUrl(path: string, params?: RequestParams): string {
  const normalizedBaseUrl = env.apiBaseUrl.replace(/\/+$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`${normalizedBaseUrl}${normalizedPath}`);

  if (!params) return url.toString();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;

    if (Array.isArray(value)) {
      for (const entry of value) {
        url.searchParams.append(key, String(entry));
      }
      continue;
    }

    url.searchParams.set(key, String(value));
  }

  return url.toString();
}

export async function requestJson<TResponse>(
  path: string,
  options: RequestJsonOptions = {},
): Promise<TResponse> {
  const response = await fetch(buildUrl(path, options.params), {
    method: options.method ?? 'GET',
    cache: options.cache ?? 'no-store',
    credentials: options.credentials ?? 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const message = await response.text().catch(() => '');
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return (await response.json()) as TResponse;
}
