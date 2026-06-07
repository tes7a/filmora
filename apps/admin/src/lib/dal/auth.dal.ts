import { authUrls } from '@/lib/api/auth.urls';
import { requestJson } from '@/lib/http/http-client';
import type {
  ConfirmEmailResponse,
  LoginPayload,
  LoginResponse,
  LogoutResponse,
  MeResponse,
  RefreshTokenResponse,
  RegisterPayload,
  RegisterResponse,
} from '@/types/auth';

export function loginRequest(payload: LoginPayload): Promise<LoginResponse> {
  return requestJson<LoginResponse>({
    method: 'POST',
    url: authUrls.login,
    data: payload,
  });
}

export function registerRequest(payload: RegisterPayload): Promise<RegisterResponse> {
  return requestJson<RegisterResponse>({
    method: 'POST',
    url: authUrls.register,
    data: payload,
  });
}

export function confirmEmailRequest(token: string): Promise<ConfirmEmailResponse> {
  return requestJson<ConfirmEmailResponse>({
    method: 'GET',
    url: authUrls.confirmEmail,
    params: { token },
  });
}

export function refreshTokenRequest(): Promise<RefreshTokenResponse> {
  return requestJson<RefreshTokenResponse>({
    method: 'POST',
    url: authUrls.refresh,
  });
}

export function logoutRequest(): Promise<LogoutResponse> {
  return requestJson<LogoutResponse>({
    method: 'POST',
    url: authUrls.logout,
  });
}

export function meRequest(): Promise<MeResponse> {
  return requestJson<MeResponse>({
    method: 'GET',
    url: authUrls.me,
  });
}
