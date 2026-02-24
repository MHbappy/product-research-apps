'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  IconTrendingUp,
  IconUsers,
  IconCreditCard,
  IconActivity
} from '@tabler/icons-react';
import {
  getDashboardStats,
  DashboardStats
} from '@/lib/api/admin-payment.service';
import { Loader2 } from 'lucide-react';

export function DashboardStatsGrid() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {[...Array(4)].map((_, i) => (
          <Card key={i} className='flex h-40 items-center justify-center'>
            <Loader2 className='h-8 w-8 animate-spin text-gray-300' />
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4'>
      {/* Card 1: Total Revenue */}
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            ${stats.totalRevenue.toFixed(2)}
          </CardTitle>
          <CardAction>
            <IconCreditCard className='text-gray-500' />
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='text-muted-foreground'>Lifetime earnings</div>
        </CardFooter>
      </Card>

      {/* Card 2: Today's Revenue */}
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Today's Revenue</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            ${stats.todaysRevenue.toFixed(2)}
          </CardTitle>
          <CardAction>
            <IconTrendingUp className='text-green-500' />
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='text-muted-foreground'>Generated today</div>
        </CardFooter>
      </Card>

      {/* Card 3: Active Subscriptions */}
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Active Subscriptions</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {stats.activeSubscriptions}
          </CardTitle>
          <CardAction>
            <IconActivity className='text-blue-500' />
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='text-muted-foreground'>Paying customers</div>
        </CardFooter>
      </Card>

      {/* Card 4: Total Users */}
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Total Users</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {stats.totalUsers}
          </CardTitle>
          <CardAction>
            <IconUsers className='text-orange-500' />
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='text-muted-foreground'>Registered accounts</div>
        </CardFooter>
      </Card>
    </div>
  );
}
