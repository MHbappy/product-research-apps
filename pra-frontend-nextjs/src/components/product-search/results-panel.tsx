'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import {
  type Filters,
  type Product,
  getCategoryPathLabelById,
  toTitle
} from '@/data/product-search-data';
import { ProductCard } from '@/components/product-search/product-card';
import { ResultsSkeletonGrid } from '@/components/product-search/skeletons';
import { SoftPill } from '@/components/product-search/product-search-ui';

export function ResultsPanel({
  results,
  totalResults,
  page,
  totalPages,
  applied,
  error,
  isResultsFetching,
  activeFilterCount,
  firstIndex,
  lastIndex,
  onGoBackToSearch,
  onChangePage
}: {
  results: Product[];
  totalResults: number;
  page: number;
  totalPages: number;
  applied: Filters;
  error: string | null;
  isResultsFetching: boolean;
  activeFilterCount: number;
  firstIndex: number;
  lastIndex: number;
  onGoBackToSearch: () => void;
  onChangePage: (nextPage: number) => void;
}) {
  return (
    <div className='rounded-[28px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950/60'>
      <CardHeader className='pb-3 pt-6'>
        <div className='flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between'>
          <div className='flex items-start gap-3'>
            <Button
              type='button'
              variant='outline'
              className='gap-2 rounded-2xl'
              onClick={onGoBackToSearch}
            >
              <ArrowLeft className='h-4 w-4' />
              Back to filters
            </Button>

            <div>
              <CardTitle className='text-xl'>Results</CardTitle>
              <CardDescription>
                Submitted search results are shown here in a paginated list.
              </CardDescription>
            </div>
          </div>

          <div className='flex flex-wrap gap-2'>
            <SoftPill tone='indigo'>Matches {totalResults}</SoftPill>
            <SoftPill tone='slate'>Active filters {activeFilterCount}</SoftPill>
            <SoftPill tone='emerald'>
              Page {page} / {totalPages}
            </SoftPill>
            {isResultsFetching ? (
              <SoftPill tone='amber'>
                <Loader2 className='mr-2 h-3.5 w-3.5 animate-spin' />
                Loading page
              </SoftPill>
            ) : null}
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-5'>
        <div className='flex flex-wrap gap-2'>
          {applied.text ? (
            <SoftPill tone='indigo'>Text: {applied.text}</SoftPill>
          ) : null}

          {applied.categoryIds.map((id) => (
            <SoftPill key={id} tone='slate'>
              {getCategoryPathLabelById(id)}
            </SoftPill>
          ))}

          {applied.minPrice !== '' || applied.maxPrice !== '' ? (
            <SoftPill tone='amber'>
              Price: {applied.minPrice || '0'} - {applied.maxPrice || '∞'}
            </SoftPill>
          ) : null}

          {applied.types.map((item) => (
            <SoftPill
              key={item}
              tone={
                item === 'WINNING'
                  ? 'emerald'
                  : item === 'DYING' || item === 'FADE'
                    ? 'rose'
                    : 'amber'
              }
            >
              {item}
            </SoftPill>
          ))}

          {applied.sentiments.map((item) => (
            <SoftPill
              key={item}
              tone={
                item === 'positive'
                  ? 'emerald'
                  : item === 'neutral'
                    ? 'amber'
                    : 'rose'
              }
            >
              {toTitle(item)}
            </SoftPill>
          ))}

          {applied.minRating > 0 ? (
            <SoftPill tone='emerald'>
              Rating {applied.minRating.toFixed(1)}+
            </SoftPill>
          ) : null}

          {applied.imageFile ? (
            <SoftPill tone='indigo'>Image: {applied.imageFile.name}</SoftPill>
          ) : null}
        </div>

        {error ? (
          <div className='rounded-[24px] border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200'>
            {error}
          </div>
        ) : null}

        {totalResults === 0 ? (
          <div className='rounded-[24px] border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-950/60'>
            <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200'>
              <Search className='h-6 w-6' />
            </div>
            <div className='mt-4 text-lg font-semibold text-slate-950 dark:text-white'>
              No products matched
            </div>
            <p className='mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400'>
              Relax one or more filters, or go back to search again.
            </p>
          </div>
        ) : isResultsFetching ? (
          <ResultsSkeletonGrid />
        ) : (
          <>
            <div className='grid gap-4 lg:grid-cols-2'>
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className='flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 pb-3'>
              <div className='text-sm text-slate-600 dark:text-slate-400'>
                Showing{' '}
                <span className='font-semibold text-slate-950 dark:text-white'>
                  {firstIndex}
                </span>{' '}
                to{' '}
                <span className='font-semibold text-slate-950 dark:text-white'>
                  {lastIndex}
                </span>{' '}
                of{' '}
                <span className='font-semibold text-slate-950 dark:text-white'>
                  {totalResults}
                </span>{' '}
                results.
              </div>

              <div className='flex items-center gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  className='gap-2 rounded-2xl'
                  disabled={page === 1 || isResultsFetching}
                  onClick={() => onChangePage(page - 1)}
                >
                  <ChevronLeft className='h-4 w-4' />
                  Prev
                </Button>

                <div className='hidden items-center gap-1 md:flex'>
                  {Array.from({ length: totalPages }, (_, idx) => idx + 1)
                    .slice(
                      Math.max(0, page - 2),
                      Math.min(totalPages, page + 1)
                    )
                    .map((p) => (
                      <Button
                        key={p}
                        type='button'
                        variant={p === page ? 'default' : 'outline'}
                        className={`h-10 w-10 rounded-2xl ${
                          p === page
                            ? 'bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200'
                            : ''
                        }`}
                        disabled={isResultsFetching}
                        onClick={() => onChangePage(p)}
                      >
                        {p}
                      </Button>
                    ))}
                </div>

                <Button
                  type='button'
                  variant='outline'
                  className='gap-2 rounded-2xl'
                  disabled={page === totalPages || isResultsFetching}
                  onClick={() => onChangePage(page + 1)}
                >
                  Next
                  <ChevronRight className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </div>
  );
}
