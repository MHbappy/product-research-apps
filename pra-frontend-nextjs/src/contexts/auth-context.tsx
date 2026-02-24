'use client';

import React, {
  createContext,
  useCallback,
  useEffect,
  useState,
  useMemo
} from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/api/auth.service';
import { TokenManager } from '@/lib/auth/token-manager';
import { User, LoginRequest, SignupRequest } from '@/types/auth';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    data: LoginRequest
  ) => Promise<{ success: boolean; error?: string } | undefined>;
  signup: (
    data: SignupRequest
  ) => Promise<{ success: boolean; error?: string } | undefined>;
  logout: () => Promise<void>;
  refreshUser: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state from stored tokens (runs once on mount)
  useEffect(() => {
    const initAuth = () => {
      const storedUser = TokenManager.getUser<User>();
      const isAuth = TokenManager.isAuthenticated();

      if (isAuth && storedUser) {
        setUser(storedUser);
      } else {
        TokenManager.clearTokens();
        setUser(null);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Separate effect for token validation checks
  useEffect(() => {
    // Check auth state when tab becomes visible (detects manual cookie deletion)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const isAuth = TokenManager.isAuthenticated();
        const currentUser = TokenManager.getUser<User>();

        if (!isAuth && currentUser) {
          TokenManager.clearTokens();
          setUser(null);
          router.push('/auth/sign-in');
        }
      }
    };

    // Also check periodically (every 5 seconds) for token changes
    const intervalId = setInterval(() => {
      const isAuth = TokenManager.isAuthenticated();
      const currentUser = TokenManager.getUser<User>();

      if (!isAuth && currentUser) {
        TokenManager.clearTokens();
        setUser(null);
        router.push('/auth/sign-in');
      }
    }, 5000);

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(intervalId);
    };
  }, [router]);

  // Login function
  const login = useCallback(
    async (data: LoginRequest) => {
      try {
        const response = await AuthService.login(data);

        if (response.success && response.data) {
          const { accessToken, refreshToken, user: userData } = response.data;

          // Store tokens and user data
          TokenManager.setAccessToken(accessToken);
          TokenManager.setRefreshToken(refreshToken);

          // Add fullName to user object
          const userWithFullName = {
            ...userData,
            fullName: `${userData.firstName} ${userData.lastName}`
          };

          TokenManager.setUser(userWithFullName);
          setUser(userWithFullName);

          toast.success('Login successful!');
          router.push('/dashboard');
          return { success: true };
        }
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        const errorMessage =
          err.response?.data?.message || 'Login failed. Please try again.';
        // Don't show toast here - let the form handle error display
        // Return error instead of throwing to prevent component re-render
        return { success: false, error: errorMessage };
      }
    },
    [router]
  );

  // Signup function
  const signup = useCallback(
    async (data: SignupRequest) => {
      try {
        const response = await AuthService.signup(data);

        if (response.success && response.data) {
          const { accessToken, refreshToken, user: userData } = response.data;

          // Store tokens and user data
          TokenManager.setAccessToken(accessToken);
          TokenManager.setRefreshToken(refreshToken);

          // Add fullName to user object
          const userWithFullName = {
            ...userData,
            fullName: `${userData.firstName} ${userData.lastName}`
          };

          TokenManager.setUser(userWithFullName);
          setUser(userWithFullName);

          toast.success(
            'Account created successfully! Please verify your email.'
          );
          router.push('/dashboard');
          return { success: true };
        }
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        const errorMessage =
          err.response?.data?.message || 'Signup failed. Please try again.';
        // Don't show toast here - let the form handle error display
        // Return error instead of throwing to prevent component re-render
        return { success: false, error: errorMessage };
      }
    },
    [router]
  );

  // Logout function
  const logout = useCallback(async () => {
    try {
      const refreshToken = TokenManager.getRefreshToken();

      if (refreshToken) {
        await AuthService.logout({ refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens and user data regardless of API call success
      TokenManager.clearTokens();
      setUser(null);
      toast.success('Logged out successfully');
      router.push('/auth/sign-in');
    }
  }, [router]);

  // Refresh user data from API
  const refreshUser = useCallback(async () => {
    try {
      // Fetch fresh user data from API
      const response = await AuthService.getProfile();

      if (response.success && response.data) {
        const userData = response.data;

        // Add fullName to user object
        const userWithFullName = {
          ...userData,
          fullName:
            userData.firstName && userData.lastName
              ? `${userData.firstName} ${userData.lastName}`
              : userData.firstName || userData.lastName || userData.email
        };

        // Update localStorage
        TokenManager.setUser(userWithFullName);

        // Update React state
        setUser(userWithFullName);
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      // Fallback to localStorage if API call fails
      const storedUser = TokenManager.getUser<User>();
      if (storedUser) {
        setUser(storedUser);
      }
    }
  }, []);

  const value: AuthContextType = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user && TokenManager.isAuthenticated(),
      login,
      signup,
      logout,
      refreshUser
    }),
    [user, isLoading, login, signup, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
