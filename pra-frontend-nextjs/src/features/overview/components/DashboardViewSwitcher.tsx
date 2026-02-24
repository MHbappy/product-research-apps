'use client';

import { useUser } from '@/hooks/use-user';
import { AdminDashboardOverview } from './AdminDashboardOverview';
import { UserDashboardOverview } from './UserDashboardOverview';
import { Loader2 } from 'lucide-react';

export function DashboardViewSwitcher() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className='flex justify-center p-8'>
        <Loader2 className='h-8 w-8 animate-spin text-gray-400' />
      </div>
    );
  }

  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  if (isAdmin) {
    return <AdminDashboardOverview />;
  }

  return <UserDashboardOverview />;
}
