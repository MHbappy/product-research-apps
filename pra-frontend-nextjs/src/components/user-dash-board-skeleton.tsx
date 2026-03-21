'use client';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function StatCardSkeleton() {
  return (
    <Card className='group relative w-full overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-900'>
      <div className='pointer-events-none absolute -top-6 -left-6 h-32 w-32 rounded-full bg-slate-200/30 blur-3xl dark:bg-slate-500/10' />
      <CardHeader className='flex flex-row items-start justify-between gap-3 pb-3'>
        <div className='flex min-w-0 items-center gap-3'>
          <Skeleton className='h-9 w-9 shrink-0 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
          <div className='min-w-0 space-y-2'>
            <Skeleton className='h-4 w-28 max-w-full rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            <Skeleton className='h-3 w-20 max-w-full rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
          </div>
        </div>
        <Skeleton className='h-4 w-14 shrink-0 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
      </CardHeader>

      <CardContent className='space-y-3 pt-0'>
        <Skeleton className='h-9 w-20 rounded-xl bg-slate-300/90 dark:bg-slate-600/80' />
        <Skeleton className='h-3 w-36 max-w-full rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
      </CardContent>
    </Card>
  );
}

function ChartHeaderSkeleton({
  titleClassName,
  rightClassName
}: {
  titleClassName: string;
  rightClassName: string;
}) {
  return (
    <div className='flex items-start justify-between gap-4'>
      <div className='min-w-0 space-y-3'>
        <div className='flex min-w-0 items-center gap-3'>
          <Skeleton className='h-9 w-9 shrink-0 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
          <Skeleton
            className={`h-5 max-w-full ${titleClassName} rounded-full bg-slate-300/90 dark:bg-slate-600/80`}
          />
        </div>
        <Skeleton className='h-4 w-full max-w-[520px] rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
      </div>
      <Skeleton
        className={`h-4 shrink-0 ${rightClassName} rounded-full bg-slate-300/90 dark:bg-slate-600/80`}
      />
    </div>
  );
}

function CategoryDemandSkeleton() {
  const rows = [
    { label: 'w-10', bar: 'w-[78%]' },
    { label: 'w-12', bar: 'w-[72%]' },
    { label: 'w-14', bar: 'w-[58%]' },
    { label: 'w-10', bar: 'w-[34%]' },
    { label: 'w-14', bar: 'w-[28%]' },
    { label: 'w-12', bar: 'w-[20%]' },
    { label: 'w-12', bar: 'w-[88%]' }
  ];

  return (
    <Card className='w-full overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-900'>
      <CardHeader className='pb-2'>
        <ChartHeaderSkeleton titleClassName='w-52' rightClassName='w-48' />
      </CardHeader>

      <CardContent className='space-y-5'>
        <div className='rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40'>
          <div className='space-y-4'>
            {rows.map((row, index) => (
              <div
                key={index}
                className='grid grid-cols-[64px_1fr_36px] items-center gap-2 sm:grid-cols-[76px_1fr_40px] sm:gap-3'
              >
                <Skeleton
                  className={`h-4 ${row.label} justify-self-end rounded-full bg-slate-300/90 dark:bg-slate-600/80`}
                />
                <Skeleton
                  className={`h-4 ${row.bar} rounded-full bg-slate-300/90 dark:bg-slate-600/80`}
                />
                <Skeleton className='h-4 w-8 justify-self-end rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
              </div>
            ))}
          </div>

          <div className='mt-6 flex items-center justify-between gap-2'>
            <Skeleton className='h-3 w-10 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            <Skeleton className='h-3 w-10 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            <Skeleton className='h-3 w-10 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            <Skeleton className='h-3 w-10 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
          </div>

          <div className='mt-4 flex items-center justify-between gap-2'>
            <Skeleton className='h-3 w-8 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            <Skeleton className='h-3 w-8 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            <Skeleton className='h-3 w-8 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            <Skeleton className='h-3 w-8 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            <Skeleton className='h-3 w-8 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
          </div>
        </div>

        <div className='flex flex-wrap items-center gap-4'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-3 w-3 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            <Skeleton className='h-3 w-12 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
          </div>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-3 w-3 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            <Skeleton className='h-3 w-12 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
          </div>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-3 w-3 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            <Skeleton className='h-3 w-12 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MarketShareSkeleton() {
  const legend = Array.from({ length: 12 });

  return (
    <Card className='w-full overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-900'>
      <CardHeader className='pb-2'>
        <ChartHeaderSkeleton titleClassName='w-48' rightClassName='w-40' />
      </CardHeader>

      <CardContent className='space-y-4'>
        <div className='rounded-[24px] border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/40'>
          <div className='mx-auto flex min-h-[200px] w-full max-w-[640px] items-center justify-center sm:min-h-[220px]'>
            <div className='relative h-[128px] w-[128px] sm:h-[144px] sm:w-[144px]'>
              <Skeleton className='absolute inset-0 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />

              <div className='absolute inset-[20%] rounded-full bg-slate-50 dark:bg-slate-950/40' />
              <Skeleton className='absolute inset-[20%] rounded-full bg-slate-300/90 opacity-75 dark:bg-slate-600/80' />

              <div className='absolute inset-[40%] rounded-full bg-slate-50 dark:bg-slate-950/40' />
              <Skeleton className='absolute inset-[40%] rounded-full bg-slate-300/90 opacity-60 dark:bg-slate-600/80' />

              <div className='absolute inset-[60%] rounded-full bg-slate-50 dark:bg-slate-950/40' />

              <div className='absolute inset-0 flex items-center justify-center'>
                <div className='h-full w-[2px] bg-slate-200/70 dark:bg-slate-700/70' />
              </div>
              <div className='absolute inset-0 flex rotate-[45deg] items-center justify-center'>
                <div className='h-full w-[2px] bg-slate-200/50 dark:bg-slate-700/50' />
              </div>
              <div className='absolute inset-0 flex -rotate-[45deg] items-center justify-center'>
                <div className='h-full w-[2px] bg-slate-200/50 dark:bg-slate-700/50' />
              </div>
            </div>
          </div>

          <div className='mt-4 grid grid-cols-4 gap-2'>
            <Skeleton className='h-3 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            <Skeleton className='h-3 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            <Skeleton className='h-3 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            <Skeleton className='h-3 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
          </div>

          <div className='mt-3 grid grid-cols-5 gap-2'>
            <Skeleton className='h-3 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            <Skeleton className='h-3 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            <Skeleton className='h-3 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            <Skeleton className='h-3 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            <Skeleton className='h-3 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
          </div>
        </div>

        <div className='flex flex-wrap gap-2'>
          {legend.map((_, index) => (
            <div
              key={index}
              className='flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50 px-2 py-1 dark:border-slate-800 dark:bg-slate-950/40'
            >
              <Skeleton className='h-3 w-3 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
              <Skeleton className='h-3 w-12 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            </div>
          ))}
        </div>

        <Skeleton className='h-3 w-[78%] rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
      </CardContent>
    </Card>
  );
}

function TimeSeriesSkeleton() {
  const bars = [
    'h-[24%]',
    'h-[40%]',
    'h-[32%]',
    'h-[52%]',
    'h-[58%]',
    'h-[46%]',
    'h-[62%]',
    'h-[54%]',
    'h-[68%]',
    'h-[60%]',
    'h-[74%]',
    'h-[66%]',
    'h-[80%]',
    'h-[88%]'
  ];

  return (
    <Card className='w-full overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-900'>
      <CardHeader className='pb-2'>
        <ChartHeaderSkeleton titleClassName='w-44' rightClassName='w-24' />
      </CardHeader>

      <CardContent className='space-y-5'>
        <div className='rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40'>
          <div className='flex h-[240px] items-end gap-1.5 sm:h-[280px] sm:gap-3'>
            {bars.map((h, index) => (
              <div
                key={index}
                className='flex min-w-0 flex-1 flex-col items-center justify-end gap-2'
              >
                <Skeleton
                  className={`w-full rounded-t-xl ${h} bg-slate-300/90 dark:bg-slate-600/80`}
                />
                <Skeleton className='h-3 w-5 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
              </div>
            ))}
          </div>
        </div>

        <div className='flex items-center justify-between gap-3'>
          <Skeleton className='h-3 w-24 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
          <Skeleton className='h-3 w-20 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
        </div>
      </CardContent>
    </Card>
  );
}

function QuadrantSkeleton() {
  const chips = Array.from({ length: 4 });

  return (
    <Card className='w-full overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-900'>
      <CardHeader className='pb-2'>
        <ChartHeaderSkeleton titleClassName='w-52' rightClassName='w-48' />
      </CardHeader>

      <CardContent className='space-y-5'>
        <div className='rounded-[24px] border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40'>
          <div className='relative h-[240px] rounded-[20px] border border-dashed border-slate-200 sm:h-[280px] dark:border-slate-700'>
            <div className='absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-slate-200/80 dark:bg-slate-700/80' />
            <div className='absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-slate-200/80 dark:bg-slate-700/80' />

            <Skeleton className='absolute top-[18%] left-[18%] h-4 w-20 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            <Skeleton className='absolute top-[24%] right-[14%] h-4 w-24 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            <Skeleton className='absolute bottom-[22%] left-[20%] h-4 w-28 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            <Skeleton className='absolute right-[18%] bottom-[20%] h-4 w-24 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />

            <div className='absolute top-[26%] left-[28%] h-3 w-3 animate-pulse rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            <div className='absolute top-[30%] right-[26%] h-3 w-3 animate-pulse rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            <div className='absolute bottom-[28%] left-[30%] h-3 w-3 animate-pulse rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            <div className='absolute right-[30%] bottom-[30%] h-3 w-3 animate-pulse rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
          </div>
        </div>

        <div className='flex flex-wrap gap-2'>
          {chips.map((_, index) => (
            <div
              key={index}
              className='flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-950/40'
            >
              <Skeleton className='h-3 w-3 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
              <Skeleton className='h-3 w-20 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ToolCardSkeleton() {
  return (
    <Card className='group relative w-full overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-900'>
      <div className='pointer-events-none absolute -top-6 -left-6 h-28 w-28 rounded-full bg-slate-200/30 blur-3xl dark:bg-slate-500/10' />
      <CardHeader className='space-y-3 pb-4'>
        <Skeleton className='h-5 w-36 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
        <Skeleton className='h-4 w-full max-w-[18rem] rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
      </CardHeader>
      <CardContent>
        <Skeleton className='h-11 w-full rounded-2xl bg-slate-300/90 dark:bg-slate-600/80' />
      </CardContent>
    </Card>
  );
}

export function UserDashboardOverviewSkeleton() {
  return (
    <PageContainer>
      <div className='min-h-full w-full space-y-6 overflow-x-hidden bg-slate-50 p-4 text-slate-900 sm:p-6 dark:bg-slate-950 dark:text-slate-100'>
        <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
          <div className='min-w-0'>
            <Skeleton className='h-8 w-56 max-w-full rounded-full bg-slate-300/90 sm:h-10 sm:w-72 dark:bg-slate-600/80' />
            <Skeleton className='mt-3 h-4 w-full max-w-[420px] rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
          </div>

          <div className='flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto'>
            <Skeleton className='h-11 w-full rounded-2xl bg-slate-300/90 sm:w-40 dark:bg-slate-600/80' />
            <Skeleton className='h-11 w-full rounded-2xl bg-slate-300/90 sm:w-44 dark:bg-slate-600/80' />
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <CategoryDemandSkeleton />
          <MarketShareSkeleton />
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <TimeSeriesSkeleton />
          <QuadrantSkeleton />
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          <ToolCardSkeleton />
          <ToolCardSkeleton />
          <ToolCardSkeleton />
        </div>

        <div className='rounded-[28px] border border-slate-200/80 bg-gradient-to-r from-white via-white to-slate-50 p-4 text-sm leading-6 text-slate-600 shadow-[0_8px_30px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900/90 dark:text-slate-400'>
          <div className='space-y-3'>
            <Skeleton className='h-4 w-32 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            <Skeleton className='h-4 w-[92%] rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            <Skeleton className='h-4 w-[74%] rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
