import type { AxiosResponse } from 'axios';
import { describe, expect, it, vi } from 'vitest';

import {
  confirmEmailRequest,
  loginRequest,
  logoutRequest,
  meRequest,
  refreshTokenRequest,
  registerRequest,
} from '@/lib/dal/auth.dal';
import { ApiError } from '@/lib/http/api-error';
import { httpClient } from '@/lib/http/http-client';

describe('auth DAL', () => {
  it('sends login request to /auth/login', async () => {
    const requestSpy = vi.spyOn(httpClient, 'request');

    requestSpy.mockResolvedValueOnce({
      data: {
        accessToken: 'token',
        user: {
          id: 'user-1',
          email: 'admin@example.com',
          displayName: 'Admin',
          roles: ['admin'],
        },
      },
    } as AxiosResponse);

    await loginRequest({
      email: 'admin@example.com',
      password: 'password',
    });

    expect(requestSpy).toHaveBeenCalledWith({
      method: 'POST',
      url: '/auth/login',
      data: {
        email: 'admin@example.com',
        password: 'password',
      },
    });
  });

  it('sends register request to /auth/register', async () => {
    const requestSpy = vi.spyOn(httpClient, 'request');

    requestSpy.mockResolvedValueOnce({
      data: {
        userId: 'user-1',
        message: 'Registration successful',
      },
    } as AxiosResponse);

    await registerRequest({
      email: 'admin@example.com',
      password: 'StrongPassword123!',
      displayName: 'Admin',
    });

    expect(requestSpy).toHaveBeenCalledWith({
      method: 'POST',
      url: '/auth/register',
      data: {
        email: 'admin@example.com',
        password: 'StrongPassword123!',
        displayName: 'Admin',
      },
    });
  });

  it('sends confirm-email request to /auth/confirm-email', async () => {
    const requestSpy = vi.spyOn(httpClient, 'request');

    requestSpy.mockResolvedValueOnce({
      data: {
        success: true,
        message: 'Email confirmed successfully',
      },
    } as AxiosResponse);

    await confirmEmailRequest('token-1');

    expect(requestSpy).toHaveBeenCalledWith({
      method: 'GET',
      url: '/auth/confirm-email',
      params: { token: 'token-1' },
    });
  });

  it('sends refresh request to /auth/refresh', async () => {
    const requestSpy = vi.spyOn(httpClient, 'request');

    requestSpy.mockResolvedValueOnce({
      data: { accessToken: 'next-token' },
    } as AxiosResponse);

    await refreshTokenRequest();

    expect(requestSpy).toHaveBeenCalledWith({
      method: 'POST',
      url: '/auth/refresh',
    });
  });

  it('sends logout request to /auth/logout', async () => {
    const requestSpy = vi.spyOn(httpClient, 'request');

    requestSpy.mockResolvedValueOnce({
      data: { message: 'Logged out successfully' },
    } as AxiosResponse);

    await logoutRequest();

    expect(requestSpy).toHaveBeenCalledWith({
      method: 'POST',
      url: '/auth/logout',
    });
  });

  it('sends me request to /auth/me', async () => {
    const requestSpy = vi.spyOn(httpClient, 'request');

    requestSpy.mockResolvedValueOnce({
      data: {
        id: 'user-1',
        email: 'admin@example.com',
        displayName: 'Admin',
        roles: ['admin'],
        status: 'active',
      },
    } as AxiosResponse);

    await meRequest();

    expect(requestSpy).toHaveBeenCalledWith({
      method: 'GET',
      url: '/auth/me',
    });
  });

  it('throws ApiError with backend message for failed response', async () => {
    const requestSpy = vi.spyOn(httpClient, 'request');

    requestSpy.mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 401,
        data: {
          message: 'Invalid email or password',
        },
      },
    });

    await expect(
      loginRequest({
        email: 'admin@example.com',
        password: 'bad-password',
      }),
    ).rejects.toMatchObject({
      name: 'ApiError',
      status: 401,
      message: 'Invalid email or password',
    } satisfies Partial<ApiError>);
  });
});
