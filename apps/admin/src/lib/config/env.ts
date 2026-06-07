const DEFAULT_API_BASE_URL = 'http://localhost:3002/api';

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

export const envConfig = {
  apiBaseUrl: normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL),
};
