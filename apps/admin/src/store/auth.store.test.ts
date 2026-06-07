import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  confirmEmailRequest,
  loginRequest,
  logoutRequest,
  meRequest,
  refreshTokenRequest,
  registerRequest,
} from '@/lib/dal/auth.dal';
import { resetAuthStore, useAuthStore } from '@/store/auth.store';

vi.mock('@/lib/dal/auth.dal', () => ({
  loginRequest: vi.fn(),
  registerRequest: vi.fn(),
  confirmEmailRequest: vi.fn(),
  refreshTokenRequest: vi.fn(),
  logoutRequest: vi.fn(),
  meRequest: vi.fn(),
}));

describe('auth store', () => {
  const loginRequestMock = vi.mocked(loginRequest);
  const registerRequestMock = vi.mocked(registerRequest);
  const confirmEmailRequestMock = vi.mocked(confirmEmailRequest);
  const refreshTokenRequestMock = vi.mocked(refreshTokenRequest);
  const logoutRequestMock = vi.mocked(logoutRequest);
  const meRequestMock = vi.mocked(meRequest);

  beforeEach(() => {
    resetAuthStore();
    vi.clearAllMocks();
  });

  it('starts with idle auth state', () => {
    const state = useAuthStore.getState();

    expect(state.status).toBe('idle');
    expect(state.accessToken).toBeNull();
    expect(state.user).toBeNull();
    expect(state.error).toBeNull();
    expect(state.info).toBeNull();
  });

  it('stores token and user after successful login', async () => {
    loginRequestMock.mockResolvedValueOnce({
      accessToken: 'access-token',
      user: {
        id: 'user-1',
        email: 'admin@example.com',
        displayName: 'Admin',
        roles: ['admin'],
      },
    });

    const response = await useAuthStore.getState().login({
      email: 'admin@example.com',
      password: 'password',
    });

    const state = useAuthStore.getState();

    expect(response.accessToken).toBe('access-token');
    expect(state.status).toBe('authenticated');
    expect(state.accessToken).toBe('access-token');
    expect(state.user?.email).toBe('admin@example.com');
  });

  it('stores info message after register', async () => {
    registerRequestMock.mockResolvedValueOnce({
      userId: 'user-1',
      message:
        'Registration successful. Please check your email to confirm your account.',
    });

    const response = await useAuthStore.getState().register({
      email: 'admin@example.com',
      password: 'StrongPassword123!',
      displayName: 'Admin',
    });

    const state = useAuthStore.getState();

    expect(response.userId).toBe('user-1');
    expect(state.status).toBe('idle');
    expect(state.info).toContain('Registration successful');
  });

  it('stores info message after confirmEmail', async () => {
    confirmEmailRequestMock.mockResolvedValueOnce({
      success: true,
      message: 'Email confirmed successfully',
    });

    await useAuthStore.getState().confirmEmail('token-1');

    const state = useAuthStore.getState();

    expect(confirmEmailRequestMock).toHaveBeenCalledWith('token-1');
    expect(state.info).toBe('Email confirmed successfully');
    expect(state.status).toBe('idle');
  });

  it('updates access token on refreshSession', async () => {
    refreshTokenRequestMock.mockResolvedValueOnce({ accessToken: 'fresh-token' });

    const response = await useAuthStore.getState().refreshSession();

    const state = useAuthStore.getState();

    expect(response.accessToken).toBe('fresh-token');
    expect(state.accessToken).toBe('fresh-token');
  });

  it('hydrates user from /auth/me', async () => {
    meRequestMock.mockResolvedValueOnce({
      id: 'user-1',
      email: 'admin@example.com',
      displayName: 'Admin',
      roles: ['admin'],
      status: 'active',
    });

    const response = await useAuthStore.getState().fetchMe();

    const state = useAuthStore.getState();

    expect(response.email).toBe('admin@example.com');
    expect(state.user?.displayName).toBe('Admin');
    expect(state.status).toBe('authenticated');
  });

  it('resets state on logout even if request fails', async () => {
    loginRequestMock.mockResolvedValueOnce({
      accessToken: 'access-token',
      user: {
        id: 'user-1',
        email: 'admin@example.com',
        displayName: 'Admin',
        roles: ['admin'],
      },
    });

    await useAuthStore.getState().login({
      email: 'admin@example.com',
      password: 'password',
    });

    logoutRequestMock.mockRejectedValueOnce(new Error('Network error'));

    const result = await useAuthStore.getState().logout();

    const state = useAuthStore.getState();

    expect(result).toBeNull();
    expect(state.status).toBe('idle');
    expect(state.accessToken).toBeNull();
    expect(state.user).toBeNull();
  });

  it('stores error state when login request fails', async () => {
    loginRequestMock.mockRejectedValueOnce(new Error('Invalid email or password'));

    await expect(
      useAuthStore.getState().login({
        email: 'admin@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toThrow('Invalid email or password');

    const state = useAuthStore.getState();

    expect(state.status).toBe('error');
    expect(state.error).toBe('Invalid email or password');
    expect(state.accessToken).toBeNull();
    expect(state.user).toBeNull();
  });
});
