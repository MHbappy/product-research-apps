import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';

// Token expiry times (in days for cookies)
const ACCESS_TOKEN_EXPIRY = 15 / (24 * 60); // 15 minutes in days
const REFRESH_TOKEN_EXPIRY = 7; // 7 days

export class TokenManager {
  // Access Token Management
  static setAccessToken(token: string): void {
    if (typeof window !== 'undefined') {
      Cookies.set(ACCESS_TOKEN_KEY, token, {
        expires: ACCESS_TOKEN_EXPIRY,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
    }
  }

  static getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return Cookies.get(ACCESS_TOKEN_KEY) || null;
    }
    return null;
  }

  static removeAccessToken(): void {
    if (typeof window !== 'undefined') {
      Cookies.remove(ACCESS_TOKEN_KEY);
    }
  }

  // Refresh Token Management
  static setRefreshToken(token: string): void {
    if (typeof window !== 'undefined') {
      Cookies.set(REFRESH_TOKEN_KEY, token, {
        expires: REFRESH_TOKEN_EXPIRY,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
    }
  }

  static getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return Cookies.get(REFRESH_TOKEN_KEY) || null;
    }
    return null;
  }

  static removeRefreshToken(): void {
    if (typeof window !== 'undefined') {
      Cookies.remove(REFRESH_TOKEN_KEY);
    }
  }

  // User Data Management
  static setUser(user: unknown): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }

  static getUser<T>(): T | null {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem(USER_KEY);
      if (userData) {
        try {
          return JSON.parse(userData) as T;
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  static removeUser(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(USER_KEY);
    }
  }

  // Clear all tokens and user data
  static clearTokens(): void {
    this.removeAccessToken();
    this.removeRefreshToken();
    this.removeUser();
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!this.getAccessToken() && !!this.getRefreshToken();
  }

  // Decode JWT token (without verification - for client-side use only)
  static decodeToken(token: string): unknown | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  // Check if token is expired
  static isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token) as { exp?: number } | null;
    if (!decoded || !decoded.exp) {
      return true;
    }
    return Date.now() >= decoded.exp * 1000;
  }
}
