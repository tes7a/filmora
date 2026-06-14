export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3002/api',
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3002',
} as const;
