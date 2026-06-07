import axios, { type AxiosRequestConfig } from 'axios';

import { readAuthSession } from '@/lib/config/auth-storage';
import { envConfig } from '@/lib/config/env';

import { ApiError } from './api-error';

interface ErrorPayload {
  message?: string;
}

export const httpClient = axios.create({
  baseURL: envConfig.apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use((config) => {
  const session = readAuthSession();

  if (session.accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }

  return config;
});

function getErrorMessage(status: number, payload: unknown): string {
  if (payload && typeof payload === 'object' && 'message' in payload) {
    const message = (payload as ErrorPayload).message;

    if (typeof message === 'string' && message.length > 0) {
      return message;
    }
  }

  if (status > 0) {
    return `Request failed with status ${status}`;
  }

  return 'Network error';
}

export async function requestJson<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response = await httpClient.request<T>(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 0;
      const payload = error.response?.data;
      const message = getErrorMessage(status, payload);

      throw new ApiError(message, status, payload);
    }

    throw error;
  }
}
