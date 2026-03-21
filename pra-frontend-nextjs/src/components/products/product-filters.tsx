'use client';

import React from 'react';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { Lifecycle, SortBy } from '@/types/product';

type Props = {
  query: string;
  onQueryChange: (value: string) => void;

  category: string;
  onCategoryChange: (value: string) => void;
  categories: string[];

  sortBy: SortBy;
  onSortByChange: (value: SortBy) => void;

  lifecycleFilters: Set<Lifecycle>;
  onToggleLifecycle: (value: Lifecycle) => void;
  onClearLifecycle: () => void;

  minPrice: number;
  maxPrice: number;
  onMinPriceChange: (value: number) => void;
  onMaxPriceChange: (value: number) => void;

  minQuality: number;
  onMinQualityChange: (value: number) => void;

  minScore: number;
  onMinScoreChange: (value: number) => void;

  filteredCount: number;
  totalProducts: number;
  avgRating: number;

  onReset: () => void;
};

const LIFECYCLES: Lifecycle[] = [
  'trendy',
  'evergreen',
  'seasonal',
  'fade',
  'winning'
];

function SectionTitle({
  title,
  description
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className='mb-2'>
      <div className='text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase dark:text-slate-400'>
        {title}
      </div>
      {description ? (
        <div className='mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400'>
          {description}
        </div>
      ) : null}
    </div>
  );
}

export function ProductFilters({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  categories,
  sortBy,
  onSortByChange,
  lifecycleFilters,
  onToggleLifecycle,
  onClearLifecycle,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  minQuality,
  onMinQualityChange,
  minScore,
  onMinScoreChange,
  filteredCount,
  totalProducts,
  avgRating,
  onReset
}: Props) {
  const hasActiveLifecycle = lifecycleFilters.size > 0;

  return (
    <Card className='relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-gradient-to-b from-white to-slate-50 shadow-[0_8px_30px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:from-slate-950 dark:to-slate-900'>
      <div
        className='pointer-events-none absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full opacity-70 blur-3xl'
        style={{
          background:
            'radial-gradient(circle, rgba(99,102,241,0.35), transparent 70%)'
        }}
        aria-hidden
      />

      <CardHeader className='relative space-y-3 border-b border-slate-200/70 pb-4 dark:border-slate-800'>
        <div className='flex items-start justify-between gap-3'>
          <div className='min-w-0'>
            <CardTitle className='flex items-center gap-2 text-base font-semibold tracking-tight text-slate-950 dark:text-white'>
              <span className='inline-flex h-8 w-8 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950'>
                <SlidersHorizontal className='h-4 w-4 text-slate-700 dark:text-slate-300' />
              </span>
              Filters
            </CardTitle>
            <CardDescription className='mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400'>
              Refine results with search, pricing, quality, and lifecycle
              signals.
            </CardDescription>
          </div>

          <div className='shrink-0 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-right shadow-sm dark:border-slate-800 dark:bg-slate-950'>
            <div className='text-[11px] font-medium tracking-[0.12em] text-slate-500 uppercase dark:text-slate-400'>
              Results
            </div>
            <div className='text-sm font-semibold text-slate-950 tabular-nums dark:text-white'>
              {filteredCount}/{totalProducts}
            </div>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-2'>
          <div className='rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm dark:border-slate-800 dark:bg-slate-950'>
            <div className='text-[11px] text-slate-500 dark:text-slate-400'>
              Avg rating
            </div>
            <div className='mt-1 text-sm font-semibold text-slate-950 tabular-nums dark:text-white'>
              {avgRating.toFixed(1)}
            </div>
          </div>

          <button
            type='button'
            onClick={onReset}
            className='group rounded-2xl border border-slate-200 bg-white px-3 py-2 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950'
          >
            <div className='flex items-center gap-2'>
              <span className='inline-flex h-7 w-7 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition-colors group-hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:group-hover:bg-slate-800'>
                <RotateCcw className='h-3.5 w-3.5' />
              </span>
              <div>
                <div className='text-[11px] text-slate-500 dark:text-slate-400'>
                  Reset all
                </div>
                <div className='text-sm font-medium text-slate-950 dark:text-white'>
                  Clear filters
                </div>
              </div>
            </div>
          </button>
        </div>
      </CardHeader>

      <CardContent className='relative space-y-5 pt-4'>
        <div className='sm:hidden'>
          <SectionTitle title='Search' />
          <div className='flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white px-3 py-2 shadow-sm dark:border-slate-800 dark:bg-slate-950'>
            <Search className='h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400' />
            <Input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder='Search products...'
              className='h-8 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0'
            />
          </div>
        </div>

        <div className='space-y-5'>
          <div className='rounded-[24px] border border-slate-200/80 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950'>
            <SectionTitle
              title='Search'
              description='Find products by name, category, or keyword.'
            />
            <div className='flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900'>
              <Search className='h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400' />
              <Input
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder='Search products, categories...'
                className='h-8 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0'
              />
            </div>
          </div>

          <div className='rounded-[24px] border border-slate-200/80 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950'>
            <SectionTitle
              title='Sort & category'
              description='Narrow the catalog before applying deeper filters.'
            />

            <div className='space-y-4'>
              <div>
                <label className='mb-2 block text-xs font-medium text-slate-600 dark:text-slate-300'>
                  Category
                </label>
                <Select value={category} onValueChange={onCategoryChange}>
                  <SelectTrigger className='h-11 w-full rounded-2xl border-slate-200 bg-slate-50 text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-white'>
                    <SelectValue placeholder='All' />
                  </SelectTrigger>
                  <SelectContent className='rounded-2xl border-slate-200 bg-white text-slate-950 shadow-lg dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100'>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className='mb-2 block text-xs font-medium text-slate-600 dark:text-slate-300'>
                  Sort
                </label>
                <Select
                  value={sortBy}
                  onValueChange={(v) => onSortByChange(v as SortBy)}
                >
                  <SelectTrigger className='h-11 w-full rounded-2xl border-slate-200 bg-slate-50 text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-white'>
                    <SelectValue placeholder='Relevance' />
                  </SelectTrigger>
                  <SelectContent className='rounded-2xl border-slate-200 bg-white text-slate-950 shadow-lg dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100'>
                    <SelectItem value='relevance'>Relevance</SelectItem>
                    <SelectItem value='demand'>Demand (high → low)</SelectItem>
                    <SelectItem value='rating'>Rating (high → low)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className='rounded-[24px] border border-slate-200/80 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950'>
            <div className='flex items-start justify-between gap-3'>
              <div>
                <SectionTitle
                  title='Lifecycle'
                  description='Pick product phases that match your strategy.'
                />
              </div>

              <button
                onClick={onClearLifecycle}
                className='text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200'
                type='button'
              >
                Clear
              </button>
            </div>

            <div className='mt-3 flex flex-wrap gap-2'>
              {LIFECYCLES.map((l) => {
                const active = lifecycleFilters.has(l);

                return (
                  <button
                    key={l}
                    type='button'
                    onClick={() => onToggleLifecycle(l)}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                      active
                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm shadow-indigo-600/20 dark:border-indigo-500 dark:bg-indigo-500'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:-translate-y-0.5 hover:bg-white hover:shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    {l.charAt(0).toUpperCase() + l.slice(1)}
                  </button>
                );
              })}
            </div>

            <div className='mt-3'>
              <Badge
                className={`rounded-full border px-2.5 py-1 text-[11px] shadow-sm ${
                  hasActiveLifecycle
                    ? 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/40 dark:bg-indigo-900/20 dark:text-indigo-200'
                    : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                }`}
              >
                {hasActiveLifecycle
                  ? `${lifecycleFilters.size} selected`
                  : 'All lifecycle stages'}
              </Badge>
            </div>
          </div>

          <div className='rounded-[24px] border border-slate-200/80 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950'>
            <div className='flex items-start justify-between gap-3'>
              <div>
                <SectionTitle
                  title='Price range'
                  description='Set the minimum and maximum budget.'
                />
              </div>
              <div className='rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'>
                ${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}
              </div>
            </div>

            <div className='mt-3 grid grid-cols-2 gap-2'>
              <Input
                type='number'
                value={minPrice}
                onChange={(e) => onMinPriceChange(Number(e.target.value || 0))}
                inputMode='decimal'
                placeholder='Min'
                className='h-11 rounded-2xl border-slate-200 bg-slate-50 text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-white'
              />
              <Input
                type='number'
                value={maxPrice}
                onChange={(e) => onMaxPriceChange(Number(e.target.value || 0))}
                inputMode='decimal'
                placeholder='Max'
                className='h-11 rounded-2xl border-slate-200 bg-slate-50 text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-white'
              />
            </div>
          </div>

          <div className='rounded-[24px] border border-slate-200/80 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950'>
            <div className='flex items-start justify-between gap-3'>
              <div>
                <SectionTitle
                  title='Minimum quality'
                  description='Filter out weak matches and keep stronger products.'
                />
              </div>
              <div className='rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'>
                {minQuality}%
              </div>
            </div>

            <div className='mt-3'>
              <input
                type='range'
                min={0}
                max={100}
                value={minQuality}
                onChange={(e) => onMinQualityChange(Number(e.target.value))}
                className='w-full accent-indigo-600'
                aria-label='Minimum quality'
              />
              <div className='mt-2 text-xs text-slate-500 dark:text-slate-400'>
                Show products with quality ≥ {minQuality}%
              </div>
            </div>
          </div>

          <div className='rounded-[24px] border border-slate-200/80 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950'>
            <div className='flex items-start justify-between gap-3'>
              <div>
                <SectionTitle
                  title='Minimum score'
                  description='Raise the threshold to focus on stronger opportunities.'
                />
              </div>
              <div className='rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'>
                {minScore}
              </div>
            </div>

            <div className='mt-3'>
              <input
                type='range'
                min={0}
                max={100}
                value={minScore}
                onChange={(e) => onMinScoreChange(Number(e.target.value))}
                className='w-full accent-indigo-600'
                aria-label='Minimum score'
              />
              <div className='mt-2 text-xs text-slate-500 dark:text-slate-400'>
                Show products with score ≥ {minScore}
              </div>
            </div>
          </div>

          <div className='rounded-[24px] border border-slate-200/80 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950'>
            <div className='flex items-start justify-between gap-3'>
              <div>
                <SectionTitle
                  title='Quick stats'
                  description='Snapshot of the current filtered catalog.'
                />
              </div>
              <button
                onClick={onReset}
                className='text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200'
                type='button'
              >
                Reset
              </button>
            </div>

            <div className='mt-3 flex flex-wrap gap-2'>
              <Badge className='rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'>
                Products: {totalProducts}
              </Badge>
              <Badge className='rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'>
                Avg. Rating: {avgRating.toFixed(1)}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
