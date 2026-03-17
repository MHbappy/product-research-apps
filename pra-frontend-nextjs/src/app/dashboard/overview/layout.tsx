import PageContainer from '@/components/layout/page-container';
import { DashboardViewSwitcher } from '@/features/overview/components/DashboardViewSwitcher';
import React from 'react';

export default function OverViewLayout({}: {
  sales: React.ReactNode;
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
}) {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Hi, Welcome back 👋
          </h2>
        </div>
        <DashboardViewSwitcher />
      </div>
    </PageContainer>
  );
}
