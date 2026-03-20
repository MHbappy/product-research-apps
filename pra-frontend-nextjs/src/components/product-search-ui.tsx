'use client';

import React from 'react';
import {
  Filter,
  Image as ImageIcon,
  Loader2,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Tag,
  UploadCloud
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import type { Product } from '@/data/product-search-data';
import { fmtNumber, fmtPrice, toTitle } from '@/data/product-search-data';

export function SoftPill({
  children,
  tone = 'slate'
}: {
  children: React.ReactNode;
  tone?: 'emerald' | 'indigo' | 'amber' | 'rose' | 'slate';
}) {
  const map: Record<string, string> = {
    emerald:
      'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/70 dark:bg-emerald-900/25 dark:text-emerald-200 dark:ring-emerald-900/40',
    indigo:
      'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200/70 dark:bg-indigo-900/25 dark:text-indigo-200 dark:ring-indigo-900/40',
    amber:
      'bg-amber-50 text-amber-700 ring-1 ring-amber-200/70 dark:bg-amber-900/25 dark:text-amber-200 dark:ring-amber-900/40',
    rose: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200/70 dark:bg-rose-900/25 dark:text-rose-200 dark:ring-rose-900/40',
    slate:
      'bg-slate-100 text-slate-700 ring-1 ring-slate-200/70 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${map[tone]}`}
    >
      {children}
    </span>
  );
}

export function SectionCard({
  children,
  className = ''
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={`rounded-[28px] border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950/60 ${className}`}
    >
      {children}
    </Card>
  );
}

export function ToggleChip({
  label,
  active,
  disabled,
  onClick,
  tone = 'slate'
}: {
  label: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  tone?: 'emerald' | 'indigo' | 'amber' | 'rose' | 'slate';
}) {
  const base =
    'inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium transition-all';
  const activeMap: Record<string, string> = {
    emerald:
      'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/25 dark:text-emerald-200',
    indigo:
      'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-900/25 dark:text-indigo-200',
    amber:
      'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-900/25 dark:text-amber-200',
    rose: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-900/25 dark:text-rose-200',
    slate:
      'border-slate-200 bg-slate-100 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50'
  };
  const inactive =
    'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-900';

  return (
    <button
      type='button'
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${active ? activeMap[tone] : inactive} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
    >
      {label}
    </button>
  );
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className='group overflow-hidden rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950/60'>
      <div className='flex gap-4'>
        <div
          className='relative h-28 w-28 shrink-0 overflow-hidden rounded-3xl'
          style={{
            background: `radial-gradient(circle at 20% 20%, ${product.color}50, transparent 40%), linear-gradient(160deg, ${product.color}dd 0%, #0f172a 100%)`
          }}
        >
          <div className='absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.18)_0%,transparent_35%,transparent_65%,rgba(255,255,255,0.08)_100%)]' />
          <div className='absolute inset-x-3 bottom-3'>
            <SoftPill tone='slate'>#{product.id}</SoftPill>
          </div>
        </div>

        <div className='min-w-0 flex-1'>
          <div className='flex flex-wrap items-center gap-2'>
            <SoftPill tone='indigo'>{product.category}</SoftPill>
            <SoftPill
              tone={
                product.type === 'WINNING'
                  ? 'emerald'
                  : product.type === 'DYING' || product.type === 'FADE'
                    ? 'rose'
                    : 'amber'
              }
            >
              {product.type}
            </SoftPill>
            <SoftPill
              tone={
                product.sentiment === 'positive'
                  ? 'emerald'
                  : product.sentiment === 'neutral'
                    ? 'amber'
                    : 'rose'
              }
            >
              {toTitle(product.sentiment)}
            </SoftPill>
          </div>

          <h3 className='mt-3 line-clamp-2 text-lg font-semibold tracking-tight text-slate-950 dark:text-white'>
            {product.title}
          </h3>

          <div className='mt-3 grid gap-2 sm:grid-cols-2'>
            <div className='rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50'>
              <div className='text-[11px] tracking-[0.16em] text-slate-500 uppercase dark:text-slate-400'>
                Price
              </div>
              <div className='mt-1 text-base font-semibold text-slate-950 dark:text-white'>
                {fmtPrice(product.price)}
              </div>
            </div>
            <div className='rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50'>
              <div className='text-[11px] tracking-[0.16em] text-slate-500 uppercase dark:text-slate-400'>
                Rating
              </div>
              <div className='mt-1 flex items-center gap-2 text-base font-semibold text-slate-950 dark:text-white'>
                <Star className='h-4 w-4 fill-amber-400 text-amber-400' />
                {product.rating.toFixed(1)} / 5
              </div>
            </div>
          </div>

          <div className='mt-3 flex flex-wrap gap-2'>
            <SoftPill tone='slate'>
              {fmtNumber(product.reviews)} reviews
            </SoftPill>
            <SoftPill tone='indigo'>Score {product.score}</SoftPill>
            {product.visualTags.slice(0, 3).map((tag) => (
              <SoftPill key={tag} tone='slate'>
                {tag}
              </SoftPill>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

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
              <Loader2 className='mr-2 h-3.5 w-3.5 animate-spin' />
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

export function SearchIconTitle() {
  return <Search className='h-4 w-4 text-indigo-500' />;
}

export function FilterIconTitle() {
  return <Filter className='h-4 w-4 text-indigo-500' />;
}

export function TypeIconTitle() {
  return <Tag className='h-4 w-4 text-indigo-500' />;
}

export function SentimentIconTitle() {
  return <Sparkles className='h-4 w-4 text-indigo-500' />;
}

export function PriceIconTitle() {
  return <SlidersHorizontal className='h-4 w-4 text-indigo-500' />;
}

export function ImageIconTitle() {
  return <ImageIcon className='h-4 w-4 text-indigo-500' />;
}

export function RatingIconTitle() {
  return <Star className='h-4 w-4 text-amber-500' />;
}
