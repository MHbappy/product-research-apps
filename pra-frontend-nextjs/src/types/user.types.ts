export enum UserStatus {
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
  DELETED = 'DELETED',
  LOCKED = 'LOCKED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION'
}

export enum AuthProvider {
  LOCAL = 'LOCAL',
  GOOGLE = 'GOOGLE',
  GITHUB = 'GITHUB',
  FACEBOOK = 'FACEBOOK'
}

export interface User {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string;
  emailVerified: boolean;
  status: UserStatus;
  provider: AuthProvider;
  roles: string[];
  createdAt: string;
  updatedAt: string;
  avatarUrl?: string;
}

export interface UserListResponse {
  success: boolean;
  message: string;
  data: {
    content: User[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
  };
  timestamp: string;
}

export interface UserDetailResponse {
  success: boolean;
  message: string;
  data: User;
  timestamp: string;
}

export interface UpdateUserStatusRequest {
  status: UserStatus;
}

export interface ChangePasswordRequest {
  newPassword: string;
}

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  status: UserStatus;
}

export interface Role {
  id: number;
  name: string;
}

export interface RolesListResponse {
  success: boolean;
  message: string;
  data: Role[];
  timestamp: string;
}

export interface UpdateUserRolesRequest {
  roles: string[];
}

export interface UpdateUserStatusResponse {
  success: boolean;
  message: string;
  data: User;
  timestamp: string;
}
