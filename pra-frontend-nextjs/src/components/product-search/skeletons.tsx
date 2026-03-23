'use client';

import React from 'react';
import { UploadCloud } from 'lucide-react';

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  SectionCard,
  SoftPill
} from '@/components/product-search/product-search-ui';

function SkeletonBlock({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800 ${className}`}
    />
  );
}

export function SearchPanelSkeleton() {
  return (
    <div className='space-y-5'>
      <div className='rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50'>
        <SkeletonBlock className='mb-3 h-5 w-40' />
        <SkeletonBlock className='h-11 w-full rounded-2xl' />
      </div>

      <div className='grid gap-5 lg:grid-cols-2'>
        <div className='rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50'>
          <SkeletonBlock className='mb-3 h-5 w-44' />
          <div className='flex flex-wrap gap-2'>
            {Array.from({ length: 7 }).map((_, idx) => (
              <SkeletonBlock key={idx} className='h-8 w-20 rounded-full' />
            ))}
          </div>
        </div>

        <div className='rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50'>
          <SkeletonBlock className='mb-3 h-5 w-24' />
          <div className='flex flex-wrap gap-2'>
            {Array.from({ length: 6 }).map((_, idx) => (
              <SkeletonBlock key={idx} className='h-8 w-24 rounded-full' />
            ))}
          </div>
        </div>
      </div>

      <div className='grid gap-5 lg:grid-cols-2'>
        <div className='rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50'>
          <SkeletonBlock className='mb-3 h-5 w-36' />
          <div className='flex flex-wrap gap-2'>
            {Array.from({ length: 5 }).map((_, idx) => (
              <SkeletonBlock key={idx} className='h-8 w-20 rounded-full' />
            ))}
          </div>
        </div>

        <div className='rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50'>
          <SkeletonBlock className='mb-3 h-5 w-32' />
          <SkeletonBlock className='h-2 w-full rounded-full' />
          <div className='mt-3 flex justify-between'>
            <SkeletonBlock className='h-3 w-4' />
            <SkeletonBlock className='h-3 w-8' />
            <SkeletonBlock className='h-3 w-4' />
          </div>
        </div>
      </div>

      <div className='rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50'>
        <SkeletonBlock className='mb-3 h-5 w-40' />
        <div className='grid gap-3 sm:grid-cols-2'>
          <SkeletonBlock className='h-11 w-full rounded-2xl' />
          <SkeletonBlock className='h-11 w-full rounded-2xl' />
        </div>
      </div>

      <div className='rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <SkeletonBlock className='h-10 w-full rounded-2xl sm:w-3/5' />
          <div className='flex gap-2'>
            <SkeletonBlock className='h-10 w-24 rounded-2xl' />
            <SkeletonBlock className='h-10 w-36 rounded-2xl' />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ResultSkeletonCard() {
  return (
    <div className='overflow-hidden rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/60'>
      <div className='flex animate-pulse gap-4'>
        <div className='h-28 w-28 shrink-0 rounded-3xl bg-slate-200 dark:bg-slate-800' />
        <div className='min-w-0 flex-1 space-y-3'>
          <div className='flex flex-wrap gap-2'>
            <div className='h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-800' />
            <div className='h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-800' />
            <div className='h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-800' />
          </div>
          <div className='h-5 w-4/5 rounded bg-slate-200 dark:bg-slate-800' />
          <div className='h-5 w-3/5 rounded bg-slate-200 dark:bg-slate-800' />
          <div className='grid gap-2 sm:grid-cols-2'>
            <div className='h-20 rounded-2xl bg-slate-200 dark:bg-slate-800' />
            <div className='h-20 rounded-2xl bg-slate-200 dark:bg-slate-800' />
          </div>
          <div className='flex flex-wrap gap-2'>
            <div className='h-6 w-24 rounded-full bg-slate-200 dark:bg-slate-800' />
            <div className='h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-800' />
            <div className='h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-800' />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ResultsSkeletonGrid() {
  return (
    <div className='grid gap-4 lg:grid-cols-2'>
      {Array.from({ length: 8 }).map((_, idx) => (
        <ResultSkeletonCard key={idx} />
      ))}
    </div>
  );
}

export function LoadingPanel() {
  return (
    <div className='grid gap-6 xl:grid-cols-[1.15fr_0.85fr]'>
      <SectionCard>
        <CardHeader className='pb-4'>
          <div className='flex items-center justify-between gap-3'>
            <div>
              <CardTitle className='text-xl'>Search filters</CardTitle>
              <CardDescription>
                Preparing your search interface...
              </CardDescription>
            </div>
            <SoftPill tone='indigo'>
              <span className='mr-2 inline-flex'>
                <UploadCloud className='h-3.5 w-3.5 animate-pulse' />
              </span>
              Loading
            </SoftPill>
          </div>
        </CardHeader>
        <CardContent>
          <SearchPanelSkeleton />
        </CardContent>
      </SectionCard>

      <SectionCard>
        <CardHeader className='pb-4'>
          <CardTitle className='text-xl'>Image search</CardTitle>
          <CardDescription>Preparing upload panel...</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='rounded-[24px] border-2 border-dashed border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900'>
            <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200'>
              <UploadCloud className='h-7 w-7 animate-pulse' />
            </div>
            <div className='mx-auto mt-4 h-5 w-56 rounded bg-slate-200 dark:bg-slate-800' />
            <div className='mx-auto mt-2 h-4 w-44 rounded bg-slate-200 dark:bg-slate-800' />
          </div>

          <div className='rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50'>
            <div className='space-y-3'>
              <SkeletonBlock className='h-5 w-32' />
              <SkeletonBlock className='h-56 w-full rounded-3xl' />
            </div>
          </div>

          <div className='grid gap-3 sm:grid-cols-2'>
            <div className='rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50'>
              <SkeletonBlock className='h-3 w-24' />
              <SkeletonBlock className='mt-2 h-6 w-28' />
            </div>
            <div className='rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50'>
              <SkeletonBlock className='h-3 w-24' />
              <SkeletonBlock className='mt-2 h-6 w-28' />
            </div>
          </div>
        </CardContent>
      </SectionCard>
    </div>
  );
}
