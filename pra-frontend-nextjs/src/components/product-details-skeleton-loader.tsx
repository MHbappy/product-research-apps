'use client';

import React from 'react';
import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

function PillSkeleton({ className = 'w-16' }: { className?: string }) {
  return (
    <Skeleton
      className={`h-6 rounded-full bg-slate-300/90 dark:bg-slate-600/80 ${className}`}
    />
  );
}

function HeaderSkeleton() {
  return (
    <div className='mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
      <div className='space-y-3'>
        <Skeleton className='h-9 w-24 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />

        <div className='flex flex-wrap items-center gap-2'>
          <PillSkeleton className='w-14' />
          <PillSkeleton className='w-24' />
          <PillSkeleton className='w-20' />
          <PillSkeleton className='w-24' />
        </div>

        <Skeleton className='h-10 w-full max-w-5xl rounded-full bg-slate-300/90 sm:h-12 sm:w-[70%] dark:bg-slate-600/80' />
        <Skeleton className='h-4 w-full max-w-3xl rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
        <Skeleton className='h-4 w-full max-w-2xl rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
      </div>

      <div className='flex flex-wrap gap-2'>
        <Skeleton className='h-11 w-24 rounded-2xl bg-slate-300/90 dark:bg-slate-600/80' />
        <Skeleton className='h-11 w-28 rounded-2xl bg-slate-300/90 dark:bg-slate-600/80' />
      </div>
    </div>
  );
}

function ProductSnapshotSkeleton() {
  return (
    <Card className='overflow-hidden rounded-[28px] border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950/60'>
      <CardContent className='p-0'>
        <div className='grid lg:grid-cols-[360px_minmax(0,1fr)]'>
          <div className='relative min-h-[360px] overflow-hidden'>
            <div className='absolute inset-0 bg-gradient-to-br from-slate-300/90 via-slate-500/90 to-slate-900 dark:from-slate-700 dark:via-slate-800 dark:to-slate-950' />
            <div className='absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.16)_0%,transparent_35%,transparent_65%,rgba(255,255,255,0.08)_100%)]' />
            <div className='relative z-10 flex h-full flex-col justify-between p-6'>
              <div className='flex items-center gap-2'>
                <Skeleton className='h-4 w-4 rounded-full bg-slate-200/90 dark:bg-slate-500/80' />
                <Skeleton className='h-4 w-28 rounded-full bg-slate-200/90 dark:bg-slate-500/80' />
              </div>

              <div className='space-y-4'>
                <Skeleton className='h-8 w-40 rounded-full bg-slate-200/90 dark:bg-slate-500/80' />
                <Skeleton className='h-11 w-44 rounded-full bg-slate-200/90 dark:bg-slate-500/80' />

                <div className='grid grid-cols-2 gap-3 sm:max-w-sm'>
                  <div className='rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-md'>
                    <Skeleton className='h-3 w-16 rounded-full bg-slate-200/90 dark:bg-slate-500/80' />
                    <Skeleton className='mt-2 h-4 w-20 rounded-full bg-slate-200/90 dark:bg-slate-500/80' />
                  </div>
                  <div className='rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-md'>
                    <Skeleton className='h-3 w-20 rounded-full bg-slate-200/90 dark:bg-slate-500/80' />
                    <Skeleton className='mt-2 h-4 w-24 rounded-full bg-slate-200/90 dark:bg-slate-500/80' />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='min-w-0 p-5 sm:p-6'>
            <div className='grid gap-4 sm:grid-cols-2'>
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className='group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/60'
                >
                  <div className='absolute inset-x-0 top-0 h-[2px] bg-slate-300/90 dark:bg-slate-600/80' />
                  <div className='flex items-start gap-3'>
                    <Skeleton className='h-11 w-11 shrink-0 rounded-2xl bg-slate-300/90 dark:bg-slate-600/80' />
                    <div className='min-w-0 flex-1'>
                      <Skeleton className='h-3 w-20 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
                      <Skeleton className='mt-2 h-7 w-28 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
                      <Skeleton className='mt-2 h-3 w-24 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className='mt-4 grid gap-4 md:grid-cols-3'>
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className='relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4 shadow-sm dark:border-slate-800 dark:from-slate-950 dark:to-slate-900'
                >
                  <div className='flex items-center gap-2'>
                    <Skeleton className='h-8 w-8 rounded-2xl bg-slate-300/90 dark:bg-slate-600/80' />
                    <Skeleton className='h-3 w-20 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
                  </div>
                  <Skeleton className='mt-3 h-6 w-28 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
                  <Skeleton className='mt-2 h-3 w-24 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
                </div>
              ))}
            </div>

            <div className='mt-4 flex flex-wrap gap-2'>
              <PillSkeleton className='w-24' />
              <PillSkeleton className='w-28' />
              <PillSkeleton className='w-28' />
              <PillSkeleton className='w-28' />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickInterpretationSkeleton() {
  return (
    <Card className='rounded-[28px] border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950/60'>
      <CardHeader className='pb-3'>
        <Skeleton className='h-6 w-48 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
        <Skeleton className='mt-2 h-4 w-32 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
      </CardHeader>

      <CardContent className='space-y-4'>
        <div className='rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950'>
          <Skeleton className='h-3 w-32 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
          <div className='mt-4 flex items-end justify-between gap-4'>
            <div>
              <Skeleton className='h-12 w-28 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
              <Skeleton className='mt-2 h-4 w-40 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            </div>
            <Skeleton className='h-6 w-24 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
          </div>
        </div>

        <div className='grid gap-3 sm:grid-cols-2'>
          <div className='rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4 shadow-sm dark:border-slate-800 dark:from-slate-950 dark:to-slate-900'>
            <Skeleton className='h-3 w-24 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            <Skeleton className='mt-3 h-8 w-20 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            <Skeleton className='mt-2 h-3 w-28 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
          </div>
          <div className='rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4 shadow-sm dark:border-slate-800 dark:from-slate-950 dark:to-slate-900'>
            <Skeleton className='h-3 w-20 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            <Skeleton className='mt-3 h-8 w-24 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            <Skeleton className='mt-2 h-3 w-32 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
          </div>
        </div>

        <div className='rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950'>
          <div className='flex items-start justify-between gap-3'>
            <div className='min-w-0 flex-1'>
              <Skeleton className='h-4 w-28 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
              <Skeleton className='mt-2 h-4 w-full rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
              <Skeleton className='mt-2 h-4 w-[80%] rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            </div>
            <Skeleton className='h-6 w-20 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
          </div>
        </div>

        <div className='rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60'>
          <Skeleton className='h-4 w-28 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
          <Skeleton className='mt-3 h-4 w-full rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
          <Skeleton className='mt-2 h-4 w-[88%] rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
        </div>
      </CardContent>
    </Card>
  );
}

function ChartCardSkeleton({
  titleWidth,
  descriptionWidth,
  pills = 3,
  chartHeight = 'h-[360px]'
}: {
  titleWidth: string;
  descriptionWidth: string;
  pills?: number;
  chartHeight?: string;
}) {
  return (
    <Card className='mt-6 overflow-hidden rounded-[28px] border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950/60'>
      <CardHeader className='pb-2'>
        <div className='flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between'>
          <div>
            <Skeleton
              className={`h-6 rounded-full bg-slate-300/90 dark:bg-slate-600/80 ${titleWidth}`}
            />
            <Skeleton
              className={`mt-2 h-4 rounded-full bg-slate-300/90 dark:bg-slate-600/80 ${descriptionWidth}`}
            />
          </div>

          <div className='flex flex-wrap gap-2'>
            {Array.from({ length: pills }).map((_, index) => (
              <Skeleton
                key={index}
                className='h-6 w-28 rounded-full bg-slate-300/90 dark:bg-slate-600/80'
              />
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className='grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]'>
          <div className='min-w-0 rounded-[24px] border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900'>
            <div
              className={`w-full rounded-[20px] border border-dashed border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40 ${chartHeight}`}
            >
              <div className='flex h-full w-full items-center justify-center'>
                <div className='space-y-3'>
                  <Skeleton className='h-4 w-36 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
                  <Skeleton className='h-4 w-56 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
                  <Skeleton className='h-4 w-48 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
                </div>
              </div>
            </div>
          </div>

          <div className='grid gap-3'>
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className='relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4 shadow-sm dark:border-slate-800 dark:from-slate-950 dark:to-slate-900'
              >
                <div className='flex items-center gap-2'>
                  <Skeleton className='h-8 w-8 rounded-2xl bg-slate-300/90 dark:bg-slate-600/80' />
                  <div className='min-w-0 flex-1'>
                    <Skeleton className='h-3 w-24 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
                    <Skeleton className='mt-2 h-7 w-20 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
                    <Skeleton className='mt-2 h-3 w-28 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
                  </div>
                </div>
              </div>
            ))}

            <div className='rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60'>
              <Skeleton className='h-4 w-36 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
              <Skeleton className='mt-2 h-4 w-full rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
              <Skeleton className='mt-2 h-4 w-[84%] rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SentimentTrendSkeleton() {
  return (
    <ChartCardSkeleton
      titleWidth='w-48'
      descriptionWidth='w-[360px] max-w-full'
      pills={3}
      chartHeight='h-[360px]'
    />
  );
}

function StarDistributionSkeleton() {
  return (
    <ChartCardSkeleton
      titleWidth='w-44'
      descriptionWidth='w-[340px] max-w-full'
      pills={1}
      chartHeight='h-[350px]'
    />
  );
}

function StabilityDiagnosticSkeleton() {
  return (
    <ChartCardSkeleton
      titleWidth='w-64'
      descriptionWidth='w-[420px] max-w-full'
      pills={1}
      chartHeight='h-[340px]'
    />
  );
}

function SummarySkeleton() {
  return (
    <Card className='mt-6 rounded-[28px] border-slate-200/80 bg-gradient-to-r from-white via-white to-slate-50 shadow-[0_8px_30px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900/90'>
      <CardContent className='p-5'>
        <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
          <div className='min-w-0 flex-1 space-y-2'>
            <Skeleton className='h-4 w-40 rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            <Skeleton className='h-4 w-full rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
            <Skeleton className='h-4 w-[82%] rounded-full bg-slate-300/90 dark:bg-slate-600/80' />
          </div>

          <div className='flex flex-wrap gap-2'>
            <PillSkeleton className='w-24' />
            <PillSkeleton className='w-20' />
            <PillSkeleton className='w-16' />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProductDetailsPageSkeleton() {
  return (
    <PageContainer>
      <div className='relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100'>
        <div className='pointer-events-none absolute inset-0 opacity-80'>
          <div className='absolute top-[-8rem] left-[-8rem] h-[28rem] w-[28rem] rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-500/10' />
          <div className='absolute top-[10rem] right-[-8rem] h-[22rem] w-[22rem] rounded-full bg-emerald-200/20 blur-3xl dark:bg-emerald-500/10' />
        </div>

        <div className='relative mx-auto w-full max-w-[1680px] px-4 py-6 sm:px-6 lg:px-8'>
          <HeaderSkeleton />

          <div className='grid gap-6 xl:grid-cols-[1.08fr_0.92fr]'>
            <ProductSnapshotSkeleton />
            <QuickInterpretationSkeleton />
          </div>

          <SentimentTrendSkeleton />
          <StarDistributionSkeleton />
          <StabilityDiagnosticSkeleton />
          <SummarySkeleton />
        </div>
      </div>
    </PageContainer>
  );
}
