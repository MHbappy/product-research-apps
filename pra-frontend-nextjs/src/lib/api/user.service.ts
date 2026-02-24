import { apiClient } from './client';
import {
  User,
  UserListResponse,
  UserDetailResponse,
  UpdateUserStatusRequest,
  UpdateUserStatusResponse,
  ChangePasswordRequest,
  CreateUserRequest,
  RolesListResponse,
  UpdateUserRolesRequest
} from '@/types/user.types';

export class UserService {
  /**
   * Get all users with pagination
   * GET /api/v1/admin/users
   */
  static async getUsers(
    page: number = 0,
    size: number = 10,
    sortBy: string = 'id',
    sortDir: string = 'DESC'
  ): Promise<UserListResponse> {
    const response = await apiClient.get<UserListResponse>('/admin/users', {
      params: { page, size, sortBy, sortDir }
    });
    return response.data;
  }

  /**
   * Search users by email or name
   * GET /api/v1/admin/users/search
   */
  static async searchUsers(
    query: string,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'id',
    sortDir: string = 'DESC'
  ): Promise<UserListResponse> {
    const response = await apiClient.get<UserListResponse>(
      '/admin/users/search',
      {
        params: { query, page, size, sortBy, sortDir }
      }
    );
    return response.data;
  }

  /**
   * Get user by ID
   * GET /api/v1/admin/users/{id}
   */
  static async getUserById(id: number): Promise<UserDetailResponse> {
    const response = await apiClient.get<UserDetailResponse>(
      `/admin/users/${id}`
    );
    return response.data;
  }

  /**
   * Update user status
   * PUT /api/v1/admin/users/{id}/status
   */
  static async updateUserStatus(
    id: number,
    data: UpdateUserStatusRequest
  ): Promise<UpdateUserStatusResponse> {
    const response = await apiClient.put<UpdateUserStatusResponse>(
      `/admin/users/${id}/status`,
      data
    );
    return response.data;
  }

  /**
   * Change user password (Admin only)
   * PUT /api/v1/admin/users/{id}/password
   */
  static async changeUserPassword(
    id: number,
    data: ChangePasswordRequest
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.put<{ success: boolean; message: string }>(
      `/admin/users/${id}/password`,
      data
    );
    return response.data;
  }

  /**
   * Create a new user (Admin only)
   * POST /api/v1/admin/users
   */
  static async createUser(
    data: CreateUserRequest
  ): Promise<UserDetailResponse> {
    const response = await apiClient.post<UserDetailResponse>(
      '/admin/users',
      data
    );
    return response.data;
  }

  /**
   * Verify user manually (Admin only)
   * PUT /api/v1/admin/users/{id}/verify
   */
  static async verifyUser(id: number): Promise<UserDetailResponse> {
    const response = await apiClient.put<UserDetailResponse>(
      `/admin/users/${id}/verify`
    );
    return response.data;
  }

  /**
   * Get all available roles (Admin only)
   * GET /api/v1/admin/users/roles
   */
  static async getAllRoles(): Promise<RolesListResponse> {
    const response =
      await apiClient.get<RolesListResponse>('/admin/users/roles');
    return response.data;
  }

  /**
   * Update user roles (Admin only)
   * PUT /api/v1/admin/users/{id}/roles
   */
  static async updateUserRoles(
    id: number,
    data: UpdateUserRolesRequest
  ): Promise<UserDetailResponse> {
    const response = await apiClient.put<UserDetailResponse>(
      `/admin/users/${id}/roles`,
      data
    );
    return response.data;
  }
}
