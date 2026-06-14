import { publicUrls } from './public.urls';
import { requestJson } from '../http/fetch-json';
import type {
  AuthMeUser,
  LoginResponse,
  RegisterFormValues,
  RegisterResponse,
} from '../../types/auth';

export interface LoginPayload {
  email: string;
  password: string;
}

export function login(payload: LoginPayload): Promise<LoginResponse> {
  return requestJson(publicUrls.auth.login, {
    method: 'POST',
    body: payload,
  });
}

export function register(payload: RegisterFormValues): Promise<RegisterResponse> {
  return requestJson(publicUrls.auth.register, {
    method: 'POST',
    body: payload,
  });
}

export function me(accessToken: string): Promise<AuthMeUser> {
  return requestJson(publicUrls.auth.me, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function logout(): Promise<{ message: string }> {
  return requestJson(publicUrls.auth.logout, {
    method: 'POST',
  });
}
