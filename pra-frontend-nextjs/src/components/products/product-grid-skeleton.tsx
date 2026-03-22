'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type ProductGridSkeletonProps = {
  count?: number;
};

function ProductCardSkeleton() {
  return (
    <article className='h-full'>
      <Card className='group relative h-full overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-900'>
        <div className='pointer-events-none absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-slate-200/30 blur-3xl dark:bg-slate-500/10' />

        <CardContent className='relative flex h-full flex-col p-4'>
          <div className='flex gap-3'>
            {/* product visual */}
            <div className='relative h-24 w-24 shrink-0 overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm ring-1 ring-black/5 dark:border-slate-800 dark:bg-slate-950 dark:ring-white/10'>
              <Skeleton className='h-full w-full rounded-[24px] bg-slate-300/90 dark:bg-slate-600/80' />
              <div className='absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-black/10' />
            </div>

            {/* main content */}
            <div className='min-w-0 flex-1'>
              <div className='flex items-start justify-between gap-2'>
                <div className='min-w-0 flex-1'>
                  <div className='flex items-center gap-2'>
                    <Skeleton className='h-6 w-16 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
                    <Skeleton className='h-6 w-10 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
                  </div>

                  <div className='mt-2 space-y-2'>
                    <Skeleton className='h-4 w-[85%] rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
                    <Skeleton className='h-4 w-[68%] rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
                  </div>

                  <div className='mt-1 space-y-2'>
                    <Skeleton className='h-3.5 w-[92%] rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
                    <Skeleton className='h-3.5 w-[72%] rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
                  </div>
                </div>

                <div className='shrink-0 text-right'>
                  <Skeleton className='ml-auto h-6 w-16 rounded-md bg-slate-300/90 dark:bg-slate-600/80' />
                  <div className='mt-1 flex items-center justify-end'>
                    <Skeleton className='h-7 w-20 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
                  </div>
                </div>
              </div>

              {/* metric chips */}
              <div className='mt-3 grid grid-cols-2 gap-2'>
                <Skeleton className='h-7 rounded-2xl bg-slate-300/90 dark:bg-slate-600/80' />
                <Skeleton className='h-7 rounded-2xl bg-slate-300/90 dark:bg-slate-600/80' />
                <Skeleton className='h-7 rounded-2xl bg-slate-300/90 dark:bg-slate-600/80' />
                <Skeleton className='h-7 rounded-2xl bg-slate-300/90 dark:bg-slate-600/80' />
              </div>
            </div>
          </div>

          {/* footer */}
          <div className='mt-auto pt-4'>
            <div className='flex items-center justify-between rounded-[22px] border border-slate-200/80 bg-white/80 px-3 py-2 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/70'>
              <Skeleton className='h-4 w-28 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
              <Skeleton className='h-6 w-20 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            </div>

            <div className='mt-3 flex items-center justify-between gap-2'>
              <div className='flex items-center gap-2'>
                <Skeleton className='h-8 w-20 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
                <Skeleton className='h-8 w-8 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
              </div>

              <Skeleton className='h-8 w-16 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            </div>
          </div>
        </CardContent>
      </Card>
    </article>
  );
}

export function ProductGridSkeleton({ count = 9 }: ProductGridSkeletonProps) {
  return (
    <div className='grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 xl:grid-cols-3'>
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
