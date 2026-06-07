import { create } from 'zustand';

import {
  confirmEmailRequest,
  loginRequest,
  logoutRequest,
  meRequest,
  refreshTokenRequest,
  registerRequest,
} from '@/lib/dal/auth.dal';
import {
  clearAuthSession,
  readAuthSession,
  writeAuthSession,
} from '@/lib/config/auth-storage';
import type {
  AuthUser,
  ConfirmEmailResponse,
  LoginPayload,
  LoginResponse,
  LogoutResponse,
  MeResponse,
  RefreshTokenResponse,
  RegisterPayload,
  RegisterResponse,
} from '@/types/auth';

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'error';

interface AuthState {
  status: AuthStatus;
  accessToken: string | null;
  user: AuthUser | null;
  error: string | null;
  info: string | null;
}

interface AuthActions {
  login: (payload: LoginPayload) => Promise<LoginResponse>;
  register: (payload: RegisterPayload) => Promise<RegisterResponse>;
  confirmEmail: (token: string) => Promise<ConfirmEmailResponse>;
  refreshSession: () => Promise<RefreshTokenResponse>;
  fetchMe: () => Promise<MeResponse>;
  logout: () => Promise<LogoutResponse | null>;
  clearError: () => void;
  clearInfo: () => void;
}

export type AuthStore = AuthState & AuthActions;

const defaultAuthState: AuthState = {
  ...(() => {
    const session = readAuthSession();

    return {
      status: session.accessToken && session.user ? 'authenticated' : 'idle',
      accessToken: session.accessToken,
      user: session.user,
    };
  })(),
  error: null,
  info: null,
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.length > 0) {
    return error.message;
  }

  return 'Auth request failed';
}

function toAuthUser(user: MeResponse): AuthUser {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    roles: user.roles,
  };
}

function getStoredSessionUser(): AuthUser | null {
  return readAuthSession().user;
}

export const useAuthStore = create<AuthStore>()((set, get) => ({
  ...defaultAuthState,

  async login(payload) {
    set({ status: 'loading', error: null, info: null });

    try {
      const response = await loginRequest(payload);

      set({
        status: 'authenticated',
        accessToken: response.accessToken,
        user: response.user,
        error: null,
      });
      writeAuthSession({
        accessToken: response.accessToken,
        user: response.user,
      });

      return response;
    } catch (error) {
      set({
        status: 'error',
        accessToken: null,
        user: null,
        error: getErrorMessage(error),
      });

      throw error;
    }
  },

  async register(payload) {
    set({ status: 'loading', error: null, info: null });

    try {
      const response = await registerRequest(payload);

      set({
        status: 'idle',
        error: null,
        info: response.message,
      });

      return response;
    } catch (error) {
      set({
        status: 'error',
        error: getErrorMessage(error),
      });

      throw error;
    }
  },

  async confirmEmail(token) {
    set({ status: 'loading', error: null, info: null });

    try {
      const response = await confirmEmailRequest(token);

      set({
        status: 'idle',
        error: null,
        info: response.message,
      });

      return response;
    } catch (error) {
      set({
        status: 'error',
        error: getErrorMessage(error),
      });

      throw error;
    }
  },

  async refreshSession() {
    const currentToken = get().accessToken;

    if (currentToken === null) {
      set({ status: 'idle', error: null });
    }

    try {
      const response = await refreshTokenRequest();

      set({
        accessToken: response.accessToken,
        status: get().user ? 'authenticated' : 'idle',
      });
      writeAuthSession({
        accessToken: response.accessToken,
        user: get().user,
      });

      return response;
    } catch (error) {
      set({
        status: 'error',
        accessToken: null,
        user: null,
        error: getErrorMessage(error),
      });

      throw error;
    }
  },

  async fetchMe() {
    set({ status: 'loading', error: null });

    try {
      const response = await meRequest();

      set({
        user: toAuthUser(response),
        status: 'authenticated',
        error: null,
      });
      writeAuthSession({
        accessToken: get().accessToken,
        user: toAuthUser(response),
      });

      return response;
    } catch (error) {
      set({
        status: 'error',
        user: null,
        error: getErrorMessage(error),
      });

      throw error;
    }
  },

  async logout() {
    try {
      const response = await logoutRequest();
      set(defaultAuthState);
      clearAuthSession();
      return response;
    } catch {
      set(defaultAuthState);
      clearAuthSession();
      return null;
    }
  },

  clearError() {
    set((state) => ({
      error: null,
      status: state.status === 'error' ? 'idle' : state.status,
    }));
  },

  clearInfo() {
    set({ info: null });
  },
}));

export function getStoredAuthUser() {
  return getStoredSessionUser();
}

export function resetAuthStore() {
  clearAuthSession();
  useAuthStore.setState(defaultAuthState);
}
