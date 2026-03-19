'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type Props = {
  count?: number;
};

export function ProductGridSkeleton({ count = 9 }: Props) {
  return (
    <div className='grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 xl:grid-cols-3'>
      {Array.from({ length: count }).map((_, index) => (
        <Card
          key={index}
          className='h-full overflow-hidden border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800'
        >
          <CardContent className='flex h-full flex-col p-3'>
            <div className='flex gap-2.5'>
              <Skeleton className='h-24 w-24 shrink-0 rounded-xl' />

              <div className='min-w-0 flex-1'>
                <div className='flex items-start justify-between gap-2'>
                  <div className='min-w-0 flex-1 space-y-2'>
                    <Skeleton className='h-4 w-[85%]' />
                    <Skeleton className='h-3 w-[55%]' />
                  </div>

                  <div className='shrink-0 space-y-2 text-right'>
                    <Skeleton className='ml-auto h-4 w-16' />
                    <Skeleton className='ml-auto h-3 w-20' />
                  </div>
                </div>

                <div className='mt-2 grid grid-cols-2 gap-1'>
                  <Skeleton className='h-5 rounded-full' />
                  <Skeleton className='h-5 rounded-full' />
                  <Skeleton className='h-5 rounded-full' />
                  <Skeleton className='h-5 rounded-full' />
                </div>
              </div>
            </div>

            <div className='mt-auto space-y-2 pt-2'>
              <Skeleton className='h-3 w-28' />

              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-1.5'>
                  <Skeleton className='h-7 w-20 rounded-md' />
                  <Skeleton className='h-7 w-7 rounded-md' />
                </div>
                <Skeleton className='h-6 w-14 rounded-full' />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
