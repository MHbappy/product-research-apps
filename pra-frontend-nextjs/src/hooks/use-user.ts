'use client';

import { useAuth } from './use-auth';

/**
 * Custom hook that mimics Clerk's useUser hook
 * Returns user data and loading state
 */
export function useUser() {
  const { user, isLoading, refreshUser } = useAuth();

  return {
    user,
    isLoaded: !isLoading,
    isSignedIn: !!user,
    mutate: refreshUser
  };
}
