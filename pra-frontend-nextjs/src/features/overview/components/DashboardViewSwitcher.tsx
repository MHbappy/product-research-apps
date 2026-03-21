'use client';

import { useUser } from '@/hooks/use-user';
import { AdminDashboardOverview } from './AdminDashboardOverview';
import { UserDashboardOverview } from './UserDashboardOverview';
import { UserDashboardOverviewSkeleton } from '@/components/user-dash-board-skeleton';

export function DashboardViewSwitcher() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <UserDashboardOverviewSkeleton />;
  }

  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  if (isAdmin) {
    return <AdminDashboardOverview />;
  }

  return <UserDashboardOverview />;
}
