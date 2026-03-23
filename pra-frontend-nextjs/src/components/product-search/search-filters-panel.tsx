'use client';

import React from 'react';
import { Loader2, Search, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import {
  SENTIMENT_OPTIONS,
  TYPE_OPTIONS,
  toTitle,
  type Filters
} from '@/data/product-search-data';

import { CategoryMultiSelect } from '@/components/product-search/category-multi-select';
import {
  PriceIconTitle,
  RatingIconTitle,
  SearchIconTitle,
  SentimentIconTitle,
  SoftPill,
  TypeIconTitle
} from '@/components/product-search/product-search-ui';

export function SearchFiltersPanel({
  draft,
  setDraft,
  canUseNormalFilters,
  isImageMode,
  isSubmitting,
  resetSeed,
  onReset,
  onToggleArray,
  getTypeTone,
  getSentimentTone
}: {
  draft: Filters;
  setDraft: React.Dispatch<React.SetStateAction<Filters>>;
  canUseNormalFilters: boolean;
  isImageMode: boolean;
  isSubmitting: boolean;
  resetSeed: number;
  onReset: () => void;
  onToggleArray: <T extends string>(value: T, key: keyof Filters) => void;
  getTypeTone: (
    value: string
  ) => 'emerald' | 'indigo' | 'amber' | 'rose' | 'slate';
  getSentimentTone: (
    value: string
  ) => 'emerald' | 'indigo' | 'amber' | 'rose' | 'slate';
}) {
  return (
    <Card className='rounded-[28px] border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950/60'>
      <CardHeader className='px-6 pt-6 pb-4'>
        <div className='flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between'>
          <div>
            <CardTitle className='text-xl'>Search filters</CardTitle>
            <CardDescription>
              Build a query first, then submit to show the product list.
            </CardDescription>
          </div>
          <SoftPill tone={isImageMode ? 'amber' : 'indigo'}>
            {isImageMode ? 'Image search mode' : 'Attribute search mode'}
          </SoftPill>
        </div>
      </CardHeader>

      <CardContent className='space-y-5 px-6 pb-6'>
        <div
          className={`rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50 ${
            !canUseNormalFilters ? 'opacity-50' : ''
          }`}
        >
          <div className='mb-3 flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100'>
            <SearchIconTitle />
            Search by title or text
          </div>
          <Input
            value={draft.text}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, text: e.target.value }))
            }
            placeholder='Type product title, keyword, category, or tag'
            disabled={!canUseNormalFilters}
            className='h-11 rounded-2xl'
          />
        </div>

        <CategoryMultiSelect
          value={draft.categoryIds}
          onChange={(next) =>
            setDraft((prev) => ({
              ...prev,
              categoryIds: next
            }))
          }
          disabled={!canUseNormalFilters}
          resetSeed={resetSeed}
        />

        <div className='grid gap-5 lg:grid-cols-2'>
          <div
            className={`rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50 ${
              !canUseNormalFilters ? 'opacity-50' : ''
            }`}
          >
            <div className='mb-3 flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100'>
              <TypeIconTitle />
              Search by type
            </div>
            <div className='flex flex-wrap gap-2'>
              {TYPE_OPTIONS.map((type) => {
                const active = draft.types.includes(type);

                return (
                  <button
                    key={type}
                    type='button'
                    disabled={!canUseNormalFilters}
                    onClick={() => onToggleArray(type, 'types')}
                    className={`inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium transition-all ${
                      active
                        ? {
                            emerald:
                              'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/25 dark:text-emerald-200',
                            rose: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-900/25 dark:text-rose-200',
                            amber:
                              'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-900/25 dark:text-amber-200',
                            indigo:
                              'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-900/25 dark:text-indigo-200',
                            slate:
                              'border-slate-200 bg-slate-100 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50'
                          }[getTypeTone(type)]
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-900'
                    } ${!canUseNormalFilters ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          <div
            className={`rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50 ${
              !canUseNormalFilters ? 'opacity-50' : ''
            }`}
          >
            <div className='mb-3 flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100'>
              <SentimentIconTitle />
              Search by sentiment
            </div>
            <div className='flex flex-wrap gap-2'>
              {SENTIMENT_OPTIONS.map((sentiment) => {
                const active = draft.sentiments.includes(sentiment);

                return (
                  <button
                    key={sentiment}
                    type='button'
                    disabled={!canUseNormalFilters}
                    onClick={() => onToggleArray(sentiment, 'sentiments')}
                    className={`inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium transition-all ${
                      active
                        ? {
                            emerald:
                              'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/25 dark:text-emerald-200',
                            rose: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-900/25 dark:text-rose-200',
                            amber:
                              'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-900/25 dark:text-amber-200',
                            indigo:
                              'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-900/25 dark:text-indigo-200',
                            slate:
                              'border-slate-200 bg-slate-100 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50'
                          }[getSentimentTone(sentiment)]
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-900'
                    } ${!canUseNormalFilters ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    {toTitle(sentiment)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div
          className={`rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50 ${
            !canUseNormalFilters ? 'opacity-50' : ''
          }`}
        >
          <div className='mb-3 flex items-center justify-between gap-3 text-sm font-medium text-slate-900 dark:text-slate-100'>
            <div className='flex items-center gap-2'>
              <RatingIconTitle />
              Search by rating
            </div>
            <span className='rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200'>
              {draft.minRating.toFixed(1)}+
            </span>
          </div>

          <input
            type='range'
            min={0}
            max={5}
            step={0.1}
            value={draft.minRating}
            disabled={!canUseNormalFilters}
            onChange={(e) =>
              setDraft((prev) => ({
                ...prev,
                minRating: Number(e.target.value)
              }))
            }
            className='w-full accent-slate-900 dark:accent-white'
          />

          <div className='mt-2 flex justify-between text-xs text-slate-500 dark:text-slate-400'>
            <span>0</span>
            <span>2.5</span>
            <span>5</span>
          </div>
        </div>

        <div
          className={`rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50 ${
            !canUseNormalFilters ? 'opacity-50' : ''
          }`}
        >
          <div className='mb-3 flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100'>
            <PriceIconTitle />
            Search by price range
          </div>
          <div className='grid gap-3 sm:grid-cols-2'>
            <div>
              <label className='mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400'>
                Min price
              </label>
              <Input
                type='number'
                inputMode='decimal'
                value={draft.minPrice}
                disabled={!canUseNormalFilters}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    minPrice: e.target.value
                  }))
                }
                placeholder='0'
                className='h-11 rounded-2xl'
              />
            </div>
            <div>
              <label className='mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400'>
                Max price
              </label>
              <Input
                type='number'
                inputMode='decimal'
                value={draft.maxPrice}
                disabled={!canUseNormalFilters}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    maxPrice: e.target.value
                  }))
                }
                placeholder='999'
                className='h-11 rounded-2xl'
              />
            </div>
          </div>
        </div>

        <div className='flex flex-wrap gap-2'>
          <SoftPill tone='indigo'>
            Categories: {draft.categoryIds.length}
          </SoftPill>
          <SoftPill tone='amber'>Types: {draft.types.length}</SoftPill>
          <SoftPill tone='rose'>Sentiments: {draft.sentiments.length}</SoftPill>
          <SoftPill tone='emerald'>
            Rating: {draft.minRating.toFixed(1)}+
          </SoftPill>
        </div>

        <div className='mt-2 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <div className='text-sm leading-6 text-slate-600 sm:max-w-[70%] dark:text-slate-400'>
              Fill the filters above, then press{' '}
              <span className='font-semibold text-slate-950 dark:text-white'>
                Submit Search
              </span>{' '}
              to call the mock backend and render paginated results.
            </div>

            <div className='flex flex-wrap gap-2 sm:flex-nowrap'>
              <Button
                type='button'
                variant='outline'
                className='gap-2 rounded-2xl whitespace-nowrap'
                onClick={onReset}
              >
                <Trash2 className='h-4 w-4' /> Reset
              </Button>

              <Button
                type='submit'
                className='gap-2 rounded-2xl bg-slate-950 whitespace-nowrap text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200'
              >
                {isSubmitting ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  <Search className='h-4 w-4' />
                )}
                Submit Search
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
