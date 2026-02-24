'use client';

import PageContainer from '@/components/layout/page-container';
import { ActiveSubscribersTable } from '@/features/payment/components/ActiveSubscribersTable';
import {
  getActiveSubscribers,
  PageResponse,
  ActiveSubscriber
} from '@/lib/api/admin-payment.service';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export default function ActiveSubscribersPage() {
  const [data, setData] = useState<PageResponse<ActiveSubscriber> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshData = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    setLoading(true);
    getActiveSubscribers(page, pageSize)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, pageSize, refreshKey]);

  if (loading && !data) {
    return (
      <PageContainer pageTitle='Active Subscribers'>
        <div className='flex h-64 items-center justify-center'>
          <Loader2 className='text-muted-foreground h-8 w-8 animate-spin' />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      pageTitle='Active Subscribers'
      pageDescription='List of all currently active and trialing subscriptions.'
    >
      <div className='space-y-4'>
        <ActiveSubscribersTable
          subscribers={data?.content || []}
          onRefresh={refreshData}
        />

        {data && (
          <div className='flex items-center justify-end space-x-2 py-4'>
            <div className='text-muted-foreground flex-1 text-sm'>
              Page {data.number + 1} of {data.totalPages}
            </div>
            <div className='space-x-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                <ChevronLeft className='h-4 w-4' />
                Previous
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() =>
                  setPage((p) => Math.min(data.totalPages - 1, p + 1))
                }
                disabled={page >= data.totalPages - 1}
              >
                Next
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
