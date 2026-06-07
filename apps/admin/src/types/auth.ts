export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  displayName: string;
}

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  roles: string[];
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export interface RegisterResponse {
  userId: string;
  message: string;
}

export interface ConfirmEmailResponse {
  success: boolean;
  message: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface LogoutResponse {
  message: string;
}

export interface MeResponse {
  id: string;
  email: string;
  displayName: string;
  roles: string[];
  status: string;
}
