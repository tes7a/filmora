import type { AuthUser } from '@/types/auth';

const ACCESS_TOKEN_KEY = 'filmora_admin_access_token';
const USER_KEY = 'filmora_admin_user';

type StoredAuthUser = AuthUser;

export interface StoredAuthSession {
  accessToken: string | null;
  user: StoredAuthUser | null;
}

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

export function readAuthSession(): StoredAuthSession {
  if (!canUseStorage()) {
    return { accessToken: null, user: null };
  }

  const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  const userJson = window.localStorage.getItem(USER_KEY);

  let user: StoredAuthUser | null = null;

  if (userJson) {
    try {
      user = JSON.parse(userJson) as StoredAuthUser;
    } catch {
      user = null;
    }
  }

  return {
    accessToken,
    user,
  };
}

export function writeAuthSession(session: StoredAuthSession) {
  if (!canUseStorage()) return;

  if (session.accessToken) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);
  } else {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  }

  if (session.user) {
    window.localStorage.setItem(USER_KEY, JSON.stringify(session.user));
  } else {
    window.localStorage.removeItem(USER_KEY);
  }
}

export function clearAuthSession() {
  if (!canUseStorage()) return;

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}
