import React from 'react';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

import KBar from '@/components/kbar';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export const metadata: Metadata = {
  title: 'Next Shadcn Dashboard Starter',
  description: 'Basic dashboard with Next.js and Shadcn',
};

export default async function DashboardLayout({
                                                children,
                                              }: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <KBar>
      <SidebarProvider defaultOpen={defaultOpen}>
        <div className="flex h-dvh w-full overflow-hidden">
          <AppSidebar />
          <SidebarInset className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <Header />
            <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </KBar>
  );
}
