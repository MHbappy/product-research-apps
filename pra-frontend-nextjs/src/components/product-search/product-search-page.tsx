'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import PageContainer from '@/components/layout/page-container';

import {
  INITIAL_FILTERS,
  searchProductsMock,
  type Filters,
  type Product
} from '@/data/product-search-data';

import { LoadingPanel } from '@/components/product-search/loading-panel';
import { ImageSearchPanel } from '@/components/product-search/image-search-panel';
import { ResultsPanel } from '@/components/product-search/results-panel';
import { SearchFiltersPanel } from '@/components/product-search/search-filters-panel';

type ViewMode = 'search' | 'loading' | 'results';

function getTypeTone(type: string) {
  return type === 'WINNING'
    ? 'emerald'
    : type === 'DYING' || type === 'FADE'
      ? 'rose'
      : 'amber';
}

function getSentimentTone(sentiment: string) {
  return sentiment === 'positive'
    ? 'emerald'
    : sentiment === 'neutral'
      ? 'amber'
      : 'rose';
}

export default function ProductSearchPage() {
  const [draft, setDraft] = useState<Filters>(INITIAL_FILTERS);
  const [applied, setApplied] = useState<Filters>(INITIAL_FILTERS);

  const [viewMode, setViewMode] = useState<ViewMode>('search');
  const [results, setResults] = useState<Product[]>([]);
  const [totalResults, setTotalResults] = useState(0);

  const [page, setPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResultsFetching, setIsResultsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSeed, setResetSeed] = useState(0);

  const pageSize = 8;
  const isImageMode = Boolean(draft.imageFile);
  const canUseNormalFilters = !isImageMode;

  const requestIdRef = useRef(0);
  const previewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      requestIdRef.current += 1;
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));

  useEffect(() => {
    if (viewMode === 'results' && page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages, viewMode]);

  const activeFilterCount = useMemo(() => {
    if (applied.imageFile) return 1;

    let count = 0;
    if (applied.text) count += 1;
    if (applied.categoryIds.length) count += 1;
    if (applied.types.length) count += 1;
    if (applied.sentiments.length) count += 1;
    if (applied.minPrice !== '' || applied.maxPrice !== '') count += 1;
    if (applied.minRating > 0) count += 1;

    return count;
  }, [applied]);

  const firstIndex = totalResults === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastIndex = Math.min(page * pageSize, totalResults);

  function toggleArray<T extends string>(value: T, key: keyof Filters) {
    setDraft((prev) => {
      const current = prev[key] as T[];
      const exists = current.includes(value);

      return {
        ...prev,
        [key]: exists
          ? current.filter((item) => item !== value)
          : [...current, value]
      };
    });
  }

  function handleImageChange(file: File | null) {
    setDraft((prev) => {
      if (!file) {
        if (previewUrlRef.current) {
          URL.revokeObjectURL(previewUrlRef.current);
          previewUrlRef.current = null;
        }
        return { ...prev, imageFile: null, imagePreview: null };
      }

      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }

      const nextUrl = URL.createObjectURL(file);
      previewUrlRef.current = nextUrl;

      return {
        ...prev,
        imageFile: file,
        imagePreview: nextUrl
      };
    });
  }

  function clearAll() {
    requestIdRef.current += 1;

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    setDraft(INITIAL_FILTERS);
    setApplied(INITIAL_FILTERS);
    setResults([]);
    setTotalResults(0);
    setPage(1);
    setViewMode('search');
    setError(null);
    setIsSubmitting(false);
    setIsResultsFetching(false);
    setResetSeed((v) => v + 1);
  }

  function goBackToSearch() {
    setViewMode('search');
    setPage(1);
    setError(null);
  }

  async function runSearch(nextFilters: Filters, nextPage: number) {
    const requestId = ++requestIdRef.current;

    setError(null);
    setApplied(nextFilters);
    setPage(nextPage);
    setIsSubmitting(true);
    setViewMode('loading');

    try {
      const response = await searchProductsMock({
        filters: nextFilters,
        page: nextPage,
        pageSize
      });

      if (requestId !== requestIdRef.current) return;

      setResults(response.items);
      setTotalResults(response.total);
      setPage(response.page);
      setViewMode('results');
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      setResults([]);
      setTotalResults(0);
      setViewMode('results');
      setError(
        err instanceof Error ? err.message : 'Failed to search products'
      );
    } finally {
      if (requestId === requestIdRef.current) {
        setIsSubmitting(false);
      }
    }
  }

  async function submitSearch(e?: React.FormEvent) {
    e?.preventDefault();
    await runSearch(draft, 1);
  }

  async function changePage(nextPage: number) {
    if (nextPage < 1 || nextPage > totalPages || isResultsFetching) return;

    const requestId = ++requestIdRef.current;
    setIsResultsFetching(true);
    setError(null);

    try {
      const response = await searchProductsMock({
        filters: applied,
        page: nextPage,
        pageSize
      });

      if (requestId !== requestIdRef.current) return;

      setResults(response.items);
      setTotalResults(response.total);
      setPage(response.page);
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      setError(err instanceof Error ? err.message : 'Failed to load page');
    } finally {
      if (requestId === requestIdRef.current) {
        setIsResultsFetching(false);
      }
    }
  }

  return (
    <PageContainer>
      <div className='relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100'>
        <div className='pointer-events-none absolute inset-0 opacity-80'>
          <div className='absolute top-[-8rem] left-[-8rem] h-[28rem] w-[28rem] rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-500/10' />
          <div className='absolute top-[10rem] right-[-8rem] h-[22rem] w-[22rem] rounded-full bg-emerald-200/20 blur-3xl dark:bg-emerald-500/10' />
        </div>

        <div className='relative mx-auto w-full max-w-[1680px] px-4 py-6 sm:px-6 lg:px-8'>
          <div className='mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
            <div className='space-y-3'>
              <Button
                asChild
                variant='ghost'
                className='h-9 w-fit px-2 text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white'
              >
                <Link href='/dashboard/product'>
                  <ArrowLeft className='mr-2 h-4 w-4' />
                  Back
                </Link>
              </Button>

              <div className='flex flex-wrap items-center gap-2'>
                <span className='inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-200/70 dark:bg-indigo-900/25 dark:text-indigo-200 dark:ring-indigo-900/40'>
                  Advanced search
                </span>
                <span className='inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200/70 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700'>
                  Multi-filter
                </span>
                <span className='inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200/70 dark:bg-emerald-900/25 dark:text-emerald-200 dark:ring-emerald-900/40'>
                  Paginated results
                </span>
              </div>

              <h1 className='max-w-5xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white'>
                Product Research Console
              </h1>

              <p className='max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400'>
                Search by category tree, price range, type, title text,
                sentiment, rating, or image. After submit, the search area is
                hidden and replaced with a loading skeleton.
              </p>
            </div>
          </div>

          {viewMode === 'search' ? (
            <form
              onSubmit={submitSearch}
              className='grid gap-10 xl:grid-cols-[1.15fr_0.85fr]'
            >
              <SearchFiltersPanel
                draft={draft}
                setDraft={setDraft}
                canUseNormalFilters={canUseNormalFilters}
                isImageMode={isImageMode}
                isSubmitting={isSubmitting}
                resetSeed={resetSeed}
                onReset={clearAll}
                onToggleArray={toggleArray}
                getTypeTone={getTypeTone}
                getSentimentTone={getSentimentTone}
              />

              <ImageSearchPanel
                draft={draft}
                isImageMode={isImageMode}
                handleImageChange={handleImageChange}
              />
            </form>
          ) : viewMode === 'loading' ? (
            <LoadingPanel />
          ) : (
            <ResultsPanel
              results={results}
              totalResults={totalResults}
              page={page}
              totalPages={totalPages}
              applied={applied}
              error={error}
              isResultsFetching={isResultsFetching}
              activeFilterCount={activeFilterCount}
              firstIndex={firstIndex}
              lastIndex={lastIndex}
              onGoBackToSearch={goBackToSearch}
              onChangePage={changePage}
            />
          )}
        </div>
      </div>
    </PageContainer>
  );
}
