'use client';

import React from 'react';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type ProductGridSkeletonProps = {
  count?: number;
};

function ProductCardSkeleton() {
  return (
    <article className='h-full'>
      <Card className='group relative h-full overflow-hidden rounded-[28px] border border-slate-200/80 bg-gradient-to-b from-white to-slate-50 shadow-[0_8px_30px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:from-slate-950 dark:to-slate-900'>
        <div className='pointer-events-none absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-slate-200/30 blur-3xl dark:bg-slate-500/10' />

        <CardContent className='relative flex h-full flex-col'>
          <div className='flex gap-3'>
            <div className='relative h-24 w-24 shrink-0 overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm ring-1 ring-black/5 dark:border-slate-800 dark:bg-slate-950 dark:ring-white/10'>
              <Skeleton className='h-full w-full rounded-[24px] bg-slate-300/90 dark:bg-slate-600/80' />
              <div className='absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-black/10' />
            </div>

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

              <div className='mt-3 grid grid-cols-2 gap-2'>
                <Skeleton className='h-7 rounded-2xl bg-slate-300/90 dark:bg-slate-600/80' />
                <Skeleton className='h-7 rounded-2xl bg-slate-300/90 dark:bg-slate-600/80' />
                <Skeleton className='h-7 rounded-2xl bg-slate-300/90 dark:bg-slate-600/80' />
                <Skeleton className='h-7 rounded-2xl bg-slate-300/90 dark:bg-slate-600/80' />
              </div>
            </div>
          </div>

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

function ProductGridSkeleton({ count = 9 }: ProductGridSkeletonProps) {
  return (
    <div className='grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 xl:grid-cols-3'>
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

function PaginationSkeleton() {
  return (
    <>
      <div className='hidden items-center gap-2 sm:flex'>
        <Skeleton className='h-9 w-16 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
        <Skeleton className='h-5 w-20 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
        <Skeleton className='h-9 w-16 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
      </div>

      <div className='mt-6 flex items-center justify-between sm:hidden'>
        <Skeleton className='h-5 w-24 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
        <div className='flex items-center gap-2'>
          <Skeleton className='h-9 w-16 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
          <Skeleton className='h-9 w-16 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
        </div>
      </div>
    </>
  );
}

function FiltersSkeleton() {
  return (
    <Card className='relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-gradient-to-b from-white to-slate-50 shadow-[0_8px_30px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:from-slate-950 dark:to-slate-900'>
      <div
        className='pointer-events-none absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full opacity-70 blur-3xl'
        style={{
          background:
            'radial-gradient(circle, rgba(99,102,241,0.18), transparent 70%)'
        }}
        aria-hidden
      />

      <CardHeader className='relative space-y-3 border-b border-slate-200/70 pb-4 dark:border-slate-800'>
        <div className='flex items-start justify-between gap-3'>
          <div className='min-w-0'>
            <div className='flex items-center gap-2'>
              <Skeleton className='h-8 w-8 rounded-2xl bg-slate-300/90 dark:bg-slate-600/80' />
              <Skeleton className='h-5 w-20 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            </div>
            <Skeleton className='mt-3 h-4 w-[230px] rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            <Skeleton className='mt-2 h-4 w-[170px] rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
          </div>

          <div className='shrink-0 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-right shadow-sm dark:border-slate-800 dark:bg-slate-950'>
            <Skeleton className='h-3 w-14 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            <Skeleton className='mt-2 h-4 w-12 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
          </div>
        </div>

        <div className='grid grid-cols-2 gap-2'>
          <div className='rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm dark:border-slate-800 dark:bg-slate-950'>
            <Skeleton className='h-3 w-16 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            <Skeleton className='mt-2 h-4 w-10 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
          </div>

          <div className='group rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm dark:border-slate-800 dark:bg-slate-950'>
            <div className='flex items-center gap-2'>
              <Skeleton className='h-7 w-7 rounded-xl bg-slate-300/90 dark:bg-slate-600/80' />
              <div className='min-w-0 flex-1'>
                <Skeleton className='h-3 w-16 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
                <Skeleton className='mt-2 h-4 w-20 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className='relative space-y-5 pt-4'>
        <div className='rounded-[24px] border border-slate-200/80 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950'>
          <Skeleton className='h-3 w-16 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
          <Skeleton className='mt-2 h-4 w-[210px] rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
          <div className='mt-3 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900'>
            <Skeleton className='h-4 w-4 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            <Skeleton className='h-4 flex-1 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
          </div>
        </div>

        <div className='rounded-[24px] border border-slate-200/80 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950'>
          <Skeleton className='h-3 w-24 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
          <Skeleton className='mt-2 h-4 w-[220px] rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
          <div className='mt-4 space-y-4'>
            <div>
              <Skeleton className='mb-2 h-3 w-16 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
              <Skeleton className='h-11 w-full rounded-2xl bg-slate-300/90 dark:bg-slate-600/80' />
            </div>
            <div>
              <Skeleton className='mb-2 h-3 w-10 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
              <Skeleton className='h-11 w-full rounded-2xl bg-slate-300/90 dark:bg-slate-600/80' />
            </div>
          </div>
        </div>

        <div className='rounded-[24px] border border-slate-200/80 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950'>
          <div className='flex items-start justify-between gap-3'>
            <div>
              <Skeleton className='h-3 w-16 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
              <Skeleton className='mt-2 h-4 w-[190px] rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            </div>
            <Skeleton className='h-4 w-10 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
          </div>

          <div className='mt-3 flex flex-wrap gap-2'>
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={index}
                className='h-8 w-20 rounded-full bg-slate-300/90 dark:bg-slate-600/80'
              />
            ))}
          </div>

          <Skeleton className='mt-3 h-7 w-28 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
        </div>

        <div className='rounded-[24px] border border-slate-200/80 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950'>
          <div className='flex items-start justify-between gap-3'>
            <div>
              <Skeleton className='h-3 w-20 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
              <Skeleton className='mt-2 h-4 w-[170px] rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            </div>
            <Skeleton className='h-4 w-28 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
          </div>

          <div className='mt-3 grid grid-cols-2 gap-2'>
            <Skeleton className='h-11 rounded-2xl bg-slate-300/90 dark:bg-slate-600/80' />
            <Skeleton className='h-11 rounded-2xl bg-slate-300/90 dark:bg-slate-600/80' />
          </div>
        </div>

        <div className='rounded-[24px] border border-slate-200/80 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950'>
          <div className='flex items-start justify-between gap-3'>
            <div>
              <Skeleton className='h-3 w-24 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
              <Skeleton className='mt-2 h-4 w-[175px] rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            </div>
            <Skeleton className='h-4 w-12 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
          </div>

          <div className='mt-3 space-y-2'>
            <Skeleton className='h-2 w-full rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            <Skeleton className='h-3 w-28 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
          </div>
        </div>

        <div className='rounded-[24px] border border-slate-200/80 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950'>
          <div className='flex items-start justify-between gap-3'>
            <div>
              <Skeleton className='h-3 w-24 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
              <Skeleton className='mt-2 h-4 w-[175px] rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            </div>
            <Skeleton className='h-4 w-10 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
          </div>

          <div className='mt-3 space-y-2'>
            <Skeleton className='h-2 w-full rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            <Skeleton className='h-3 w-24 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
          </div>
        </div>

        <div className='rounded-[24px] border border-slate-200/80 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950'>
          <div className='flex items-start justify-between gap-3'>
            <div>
              <Skeleton className='h-3 w-20 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
              <Skeleton className='mt-2 h-4 w-[160px] rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            </div>
            <Skeleton className='h-4 w-10 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
          </div>

          <div className='mt-3 flex flex-wrap gap-2'>
            <Skeleton className='h-7 w-24 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            <Skeleton className='h-7 w-28 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProductListingPageSkeleton() {
  return (
    <PageContainer>
      <div className='min-h-full w-full bg-slate-50 p-4 text-slate-900 sm:p-6 dark:bg-slate-950 dark:text-slate-100'>
        <div className='sticky top-0 z-30 -mx-4 mb-4 border-b border-slate-200/80 bg-slate-50/95 px-4 pt-4 pb-4 backdrop-blur sm:-mx-6 sm:px-6 dark:border-slate-800 dark:bg-slate-950/95'>
          <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
            <div className='min-w-0'>
              <Skeleton className='h-8 w-56 rounded-full bg-slate-300/90 sm:h-9 dark:bg-slate-600/80' />
              <Skeleton className='mt-3 h-5 w-[290px] rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            </div>

            <div className='flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto'>
              <div className='flex w-full gap-3 sm:w-auto'>
                <Skeleton className='h-11 flex-1 rounded-2xl bg-slate-300/90 sm:hidden dark:bg-slate-600/80' />
                <Skeleton className='h-11 flex-1 rounded-2xl bg-slate-300/90 dark:bg-slate-600/80' />
                <Skeleton className='h-11 flex-1 rounded-2xl bg-slate-300/90 dark:bg-slate-600/80' />
              </div>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-4 md:items-start'>
          <aside className='hidden md:sticky md:top-28 md:col-span-1 md:block md:self-start'>
            <FiltersSkeleton />
          </aside>

          <main className='min-w-0 md:col-span-3'>
            <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              <Skeleton className='h-5 w-32 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
              <PaginationSkeleton />
            </div>

            <ProductGridSkeleton count={9} />

            <div className='mt-6'>
              <PaginationSkeleton />
            </div>
          </main>
        </div>

        <div className='mt-6 rounded-[28px] border border-slate-200/80 bg-gradient-to-r from-white via-white to-slate-50 p-3 shadow-[0_8px_30px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900/90'>
          <Skeleton className='h-4 w-[92%] rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
          <Skeleton className='mt-2 h-4 w-[72%] rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
        </div>
      </div>
    </PageContainer>
  );
}
