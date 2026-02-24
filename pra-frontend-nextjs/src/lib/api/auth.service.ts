import { apiClient } from './client';
import {
  AuthResponse,
  LoginRequest,
  SignupRequest,
  OAuth2TokenRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  RefreshTokenRequest,
  LogoutRequest,
  ChangePasswordRequest
} from '@/types/auth';

export class AuthService {
  /**
   * User Registration (Signup)
   * POST /api/v1/auth/signup
   */
  static async signup(data: SignupRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/signup', data);
    return response.data;
  }

  /**
   * User Login
   * POST /api/v1/auth/login
   */
  static async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  }

  /**
   * OAuth2 Token Exchange
   * POST /api/v1/auth/oauth2/token
   */
  static async oauth2Login(data: OAuth2TokenRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      '/auth/oauth2/token',
      data
    );
    return response.data;
  }

  /**
   * Refresh Access Token
   * POST /api/v1/auth/refresh
   */
  static async refreshToken(data: RefreshTokenRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/refresh', data);
    return response.data;
  }

  /**
   * User Logout
   * POST /api/v1/auth/logout
   */
  static async logout(
    data: LogoutRequest
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
    }>('/auth/logout', data);
    return response.data;
  }

  /**
   * Email Verification
   * GET /api/v1/auth/verify-email?token={token}
   */
  static async verifyEmail(
    token: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.get<{ success: boolean; message: string }>(
      `/auth/verify-email?token=${token}`
    );
    return response.data;
  }

  /**
   * Forgot Password
   * POST /api/v1/auth/forgot-password?email={email}
   */
  static async forgotPassword(
    email: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
    }>(`/auth/forgot-password?email=${encodeURIComponent(email)}`);
    return response.data;
  }

  /**
   * Reset Password
   * POST /api/v1/auth/reset-password?token={token}&newPassword={newPassword}
   */
  static async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
    }>(
      `/auth/reset-password?token=${token}&newPassword=${encodeURIComponent(newPassword)}`
    );
    return response.data;
  }

  /**
   * Change Password
   * POST /api/v1/auth/change-password
   */
  static async changePassword(
    data: ChangePasswordRequest
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
    }>('/auth/change-password', data);
    return response.data;
  }

  /**
   * Get Current User Profile
   * GET /api/v1/profile
   */
  static async getProfile(): Promise<{
    success: boolean;
    message: string;
    data: any;
  }> {
    const response = await apiClient.get('/profile');
    return response.data;
  }
}
