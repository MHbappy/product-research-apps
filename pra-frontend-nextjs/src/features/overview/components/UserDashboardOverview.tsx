'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { useUser } from '@/hooks/use-user';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function UserDashboardOverview() {
  const { user } = useUser();

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      <Card>
        <CardHeader>
          <CardTitle>Welcome back, {user?.fullName || 'User'}!</CardTitle>
          <CardDescription>
            Manage your subscription and account settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href='/dashboard/billing'>Manage Subscription</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Status</CardTitle>
          <CardDescription>
            Your account is currently {user?.status}.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
