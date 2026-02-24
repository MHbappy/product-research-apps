import { NavItem } from '@/types';

/**
 * Navigation configuration with RBAC support
 *
 * This configuration is used for both the sidebar navigation and Cmd+K bar.
 *
 * RBAC Access Control:
 * Each navigation item can have an `access` property that controls visibility
 * based on permissions, plans, features, roles, and organization context.
 *
 * Examples:
 *
 * 1. Require organization:
 *    access: { requireOrg: true }
 *
 * 2. Require specific permission:
 *    access: { requireOrg: true, permission: 'org:teams:manage' }
 *
 * 3. Require specific plan:
 *    access: { plan: 'pro' }
 *
 * 4. Require specific feature:
 *    access: { feature: 'premium_access' }
 *
 * 5. Require specific role:
 *    access: { role: 'ROLE_ADMIN' }
 *
 * 6. Multiple conditions (all must be true):
 *    access: { requireOrg: true, permission: 'org:teams:manage', plan: 'pro' }
 *
 * Available Roles:
 * - ROLE_USER: Basic user access
 * - ROLE_MODERATOR: Moderator access
 * - ROLE_ADMIN: Administrator access
 *
 * Note: The `visible` function is deprecated but still supported for backward compatibility.
 * Use the `access` property for new items.
 */
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
    // No access restriction - all authenticated users can see
  },
  {
    title: 'Product',
    url: '/dashboard/product',
    icon: 'product',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [],
    access: { role: 'ROLE_USER' } // Requires ROLE_USER or higher
  },
  {
    title: 'Kanban',
    url: '/dashboard/kanban',
    icon: 'kanban',
    shortcut: ['k', 'k'],
    isActive: false,
    items: [],
    access: { role: 'ROLE_MODERATOR' } // Requires ROLE_MODERATOR or higher
  },
  {
    title: 'User Management',
    url: '/dashboard/admin/users',
    icon: 'users',
    shortcut: ['u', 'm'],
    isActive: false,
    items: [],
    access: { role: 'ROLE_ADMIN' } // Requires ROLE_ADMIN only
  },
  {
    title: 'Payment',
    url: '/dashboard/admin/payment',
    icon: 'billing',
    shortcut: ['p', 'y'],
    isActive: false,
    items: [],
    access: { role: 'ROLE_ADMIN' }
  },
  {
    title: 'Active Subscribers',
    url: '/dashboard/admin/subscribers',
    icon: 'userPen',
    isActive: false,
    items: [],
    access: { role: 'ROLE_ADMIN' }
  },
  {
    title: 'Billing',
    url: '/dashboard/billing',
    icon: 'billing',
    shortcut: ['b', 'b'],
    isActive: false,
    items: [],
    access: { role: 'ROLE_USER' }
  },
  {
    title: 'Account',
    url: '#', // Placeholder as there is no direct link for the parent
    icon: 'account',
    isActive: true,
    items: [
      {
        title: 'Profile',
        url: '/dashboard/profile',
        icon: 'profile',
        shortcut: ['m', 'm']
      }
    ]
  }
];
