'use client';

/**
 * Fully client-side hook for filtering navigation items based on RBAC
 *
 * This hook uses custom auth hooks to check user authentication
 * without any server calls. This is perfect for navigation visibility (UX only).
 *
 * Performance:
 * - All checks are synchronous (no server calls)
 * - Instant filtering
 * - No loading states
 * - No UI flashing
 *
 * Note: For actual security (API routes, server actions), always use server-side checks.
 * This is only for UI visibility.
 */

import { useMemo } from 'react';
import { useUser } from '@/hooks/use-user';
import type { NavItem } from '@/types';

/**
 * Check if user has access to a navigation item based on role
 */
function hasAccess(item: NavItem, userRoles: string[] | undefined): boolean {
  // No access restrictions - show to everyone
  if (!item.access) {
    return true;
  }

  // Has access restrictions but user not authenticated
  if (!userRoles || userRoles.length === 0) {
    return false;
  }

  const { role } = item.access;

  // Check role requirement
  if (role && !userRoles.includes(role)) {
    return false;
  }

  // Add other checks as needed (requireOrg, permission, plan, feature)
  // For now, if role check passes (or no role specified), grant access
  return true;
}

/**
 * Hook to filter navigation items based on RBAC (fully client-side)
 *
 * @param items - Array of navigation items to filter
 * @returns Filtered items
 */
export function useFilteredNavItems(items: NavItem[]) {
  const { user } = useUser();

  // Filter items synchronously (all client-side)
  const filteredItems = useMemo(() => {
    const userRoles = user?.roles;

    return items
      .filter((item) => hasAccess(item, userRoles))
      .map((item) => {
        // Recursively filter child items
        if (item.items && item.items.length > 0) {
          const filteredChildren = item.items.filter((childItem) =>
            hasAccess(childItem, userRoles)
          );

          return {
            ...item,
            items: filteredChildren
          };
        }

        return item;
      });
  }, [items, user?.roles]);

  return filteredItems;
}
