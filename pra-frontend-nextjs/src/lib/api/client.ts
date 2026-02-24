import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig
} from 'axios';
import { TokenManager } from '../auth/token-manager';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
  }> = [];

  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add access token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = TokenManager.getAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          // Don't intercept 401s for login requests - let the UI handle it
          if (originalRequest.url?.includes('/auth/login')) {
            return Promise.reject(error);
          }

          if (this.isRefreshing) {
            // If already refreshing, queue this request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then(() => {
                return this.client(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          const refreshToken = TokenManager.getRefreshToken();

          if (!refreshToken) {
            this.isRefreshing = false;
            TokenManager.clearTokens();
            if (typeof window !== 'undefined') {
              window.location.href = '/auth/sign-in';
            }
            return Promise.reject(error);
          }

          try {
            // Attempt to refresh the token
            const response = await axios.post(
              `${API_BASE_URL}/api/${API_VERSION}/auth/refresh`,
              { refreshToken },
              {
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            );

            const { accessToken, refreshToken: newRefreshToken } =
              response.data.data;

            TokenManager.setAccessToken(accessToken);
            TokenManager.setRefreshToken(newRefreshToken);

            // Retry all queued requests
            this.failedQueue.forEach((prom) => {
              prom.resolve();
            });
            this.failedQueue = [];

            // Retry the original request
            return this.client(originalRequest);
          } catch (refreshError) {
            // Refresh failed, clear tokens and redirect to login
            this.failedQueue.forEach((prom) => {
              prom.reject(refreshError);
            });
            this.failedQueue = [];

            TokenManager.clearTokens();
            if (typeof window !== 'undefined') {
              window.location.href = '/auth/sign-in';
            }
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  public getClient(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient().getClient();
