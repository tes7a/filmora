export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  roles: string[];
}

export type UserStatus = 'active' | 'blocked' | 'deleted' | 'pending';

export interface AuthMeUser extends AuthUser {
  status: UserStatus;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export interface RegisterResponse {
  userId: string;
  message: string;
}

export interface AuthFormValues {
  email: string;
  password: string;
}

export interface RegisterFormValues extends AuthFormValues {
  displayName: string;
}
