'use client';

import React from 'react';
import { Search } from 'lucide-react';
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
  return (
    <Card className='border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800'>
      <CardHeader>
        <div className='flex w-full items-center justify-between'>
          <div>
            <CardTitle className='text-sm'>Filters</CardTitle>
            <CardDescription className='text-xs'>
              Refine results
            </CardDescription>
          </div>
          <div className='text-xs text-slate-500 dark:text-slate-400'>
            {filteredCount} items
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className='mb-3 block sm:hidden'>
          <label className='sr-only'>Search</label>
          <div className='flex items-center gap-2 rounded-md border border-slate-100 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800'>
            <Search className='h-4 w-4 text-slate-500 dark:text-slate-400' />
            <Input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder='Search'
              className='bg-transparent'
            />
          </div>
        </div>

        <div className='space-y-4'>
          <div>
            <label className='text-xs font-medium text-slate-600 dark:text-slate-300'>
              Category
            </label>
            <div className='mt-2'>
              <Select value={category} onValueChange={onCategoryChange}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='All' />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className='text-xs font-medium text-slate-600 dark:text-slate-300'>
              Sort
            </label>
            <div className='mt-2'>
              <Select
                value={sortBy}
                onValueChange={(v) => onSortByChange(v as SortBy)}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Relevance' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='relevance'>Relevance</SelectItem>
                  <SelectItem value='demand'>Demand (high → low)</SelectItem>
                  <SelectItem value='rating'>Rating (high → low)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <div className='flex items-center justify-between'>
              <div className='text-xs font-medium text-slate-600 dark:text-slate-300'>
                Lifecycle
              </div>
              <button
                onClick={onClearLifecycle}
                className='text-xs text-indigo-600 dark:text-indigo-300'
                type='button'
              >
                Clear
              </button>
            </div>

            <div className='mt-2 flex flex-wrap gap-2'>
              {LIFECYCLES.map((l) => {
                const active = lifecycleFilters.has(l);

                return (
                  <button
                    key={l}
                    type='button'
                    onClick={() => onToggleLifecycle(l)}
                    className={`rounded-full border px-3 py-1 text-xs ${
                      active
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-slate-200 bg-transparent text-slate-700 dark:border-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {l.charAt(0).toUpperCase() + l.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className='flex items-center justify-between'>
              <div className='text-xs font-medium text-slate-600 dark:text-slate-300'>
                Price range
              </div>
              <div className='text-xs text-slate-500 dark:text-slate-400'>
                ${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}
              </div>
            </div>

            <div className='mt-2 grid grid-cols-2 gap-2'>
              <Input
                type='number'
                value={minPrice}
                onChange={(e) => onMinPriceChange(Number(e.target.value || 0))}
                inputMode='decimal'
                className='w-full'
              />
              <Input
                type='number'
                value={maxPrice}
                onChange={(e) => onMaxPriceChange(Number(e.target.value || 0))}
                inputMode='decimal'
              />
            </div>
          </div>

          <div>
            <div className='flex items-center justify-between'>
              <div className='text-xs font-medium text-slate-600 dark:text-slate-300'>
                Min quality
              </div>
              <div className='text-xs text-slate-500 dark:text-slate-400'>
                {minQuality}%
              </div>
            </div>

            <div className='mt-2'>
              <input
                type='range'
                min={0}
                max={100}
                value={minQuality}
                onChange={(e) => onMinQualityChange(Number(e.target.value))}
                className='w-full'
                aria-label='Minimum quality'
              />
              <div className='mt-1 text-xs text-slate-500 dark:text-slate-400'>
                Show products with quality ≥ {minQuality}%
              </div>
            </div>
          </div>

          <div>
            <div className='flex items-center justify-between'>
              <div className='text-xs font-medium text-slate-600 dark:text-slate-300'>
                Min score
              </div>
              <div className='text-xs text-slate-500 dark:text-slate-400'>
                {minScore}
              </div>
            </div>

            <div className='mt-2'>
              <input
                type='range'
                min={0}
                max={100}
                value={minScore}
                onChange={(e) => onMinScoreChange(Number(e.target.value))}
                className='w-full'
                aria-label='Minimum score'
              />
              <div className='mt-1 text-xs text-slate-500 dark:text-slate-400'>
                Show products with score ≥ {minScore}
              </div>
            </div>
          </div>

          <div>
            <div className='flex items-center justify-between'>
              <div className='text-xs font-medium text-slate-600 dark:text-slate-300'>
                Quick stats
              </div>
              <button
                onClick={onReset}
                className='text-xs text-indigo-600 dark:text-indigo-300'
                type='button'
              >
                Reset
              </button>
            </div>

            <div className='mt-2 flex flex-wrap gap-2'>
              <Badge className='bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200'>
                Products: {totalProducts}
              </Badge>
              <Badge className='bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200'>
                Avg. Rating: {avgRating.toFixed(1)}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
