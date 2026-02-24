'use client';

import { DashboardStatsGrid } from '@/features/payment/components/DashboardStatsGrid';
import { DailyRevenueChart } from '@/features/payment/components/DailyRevenueChart';
import { MonthlyRevenueChart } from '@/features/payment/components/MonthlyRevenueChart';
import { RecentSales } from '@/features/payment/components/RecentSales';

export function AdminDashboardOverview() {
  return (
    <div className='flex flex-1 flex-col space-y-2'>
      <DashboardStatsGrid />
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
        <div className='col-span-4'>
          <DailyRevenueChart />
        </div>
        <div className='col-span-3'>
          <MonthlyRevenueChart />
        </div>
        <div className='col-span-4 md:col-span-7'>
          <RecentSales />
        </div>
      </div>
    </div>
  );
}
