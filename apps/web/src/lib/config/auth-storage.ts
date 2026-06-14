import type { AuthUser } from '../../types/auth';

const ACCESS_TOKEN_KEY = 'filmora_web_access_token';
const USER_KEY = 'filmora_web_user';

export function saveAuthSession(accessToken: string, user: AuthUser): void {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthSession(): void {
  if (typeof window === 'undefined') return;

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export function getAuthSession(): { accessToken: string | null; user: AuthUser | null } {
  if (typeof window === 'undefined') {
    return { accessToken: null, user: null };
  }

  const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  const userValue = window.localStorage.getItem(USER_KEY);

  return {
    accessToken,
    user: userValue ? (JSON.parse(userValue) as AuthUser) : null,
  };
}
