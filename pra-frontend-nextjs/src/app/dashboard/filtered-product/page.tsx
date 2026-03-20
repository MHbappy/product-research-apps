'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  Trash2,
  UploadCloud,
  X
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import PageContainer from '@/components/layout/page-container';

import {
  CATEGORY_OPTIONS,
  filterProducts,
  INITIAL_FILTERS,
  PRODUCTS,
  SENTIMENT_OPTIONS,
  TYPE_OPTIONS,
  toTitle,
  type Filters,
  type ProductType
} from '@/data/product-search-data';

import {
  FilterIconTitle,
  ImageIconTitle,
  LoadingPanel,
  ProductCard,
  PriceIconTitle,
  RatingIconTitle,
  SearchIconTitle,
  SectionCard,
  SentimentIconTitle,
  SoftPill,
  ToggleChip,
  TypeIconTitle
} from '@/components/product-search-ui';

type ViewMode = 'search' | 'loading' | 'results';

export default function ProductSearchPage() {
  const [draft, setDraft] = useState<Filters>(INITIAL_FILTERS);
  const [applied, setApplied] = useState<Filters>(INITIAL_FILTERS);
  const [viewMode, setViewMode] = useState<ViewMode>('search');
  const [page, setPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeoutRef = useRef<number | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  const pageSize = 8;
  const isImageMode = Boolean(draft.imageFile);
  const canUseNormalFilters = !isImageMode;

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const results = useMemo(() => {
    if (viewMode !== 'results') return [];
    return filterProducts(PRODUCTS, applied);
  }, [applied, viewMode]);

  const totalResults = results.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));

  const paginatedResults = useMemo(() => {
    const start = (page - 1) * pageSize;
    return results.slice(start, start + pageSize);
  }, [page, results]);

  const activeFilterCount = useMemo(() => {
    if (applied.imageFile) return 1;
    let count = 0;
    if (applied.text) count += 1;
    if (applied.categories.length) count += 1;
    if (applied.types.length) count += 1;
    if (applied.sentiments.length) count += 1;
    if (applied.minPrice !== '' || applied.maxPrice !== '') count += 1;
    if (applied.minRating > 0) count += 1;
    return count;
  }, [applied]);

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
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    setDraft(INITIAL_FILTERS);
    setApplied(INITIAL_FILTERS);
    setViewMode('search');
    setPage(1);
    setIsSubmitting(false);
  }

  function goBackToSearch() {
    setViewMode('search');
    setPage(1);
  }

  function submitSearch(e?: React.FormEvent) {
    e?.preventDefault();

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    setIsSubmitting(true);
    setViewMode('loading');

    timeoutRef.current = window.setTimeout(() => {
      setApplied(draft);
      setPage(1);
      setIsSubmitting(false);
      setViewMode('results');
    }, 1200);
  }

  const firstIndex = totalResults === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastIndex = Math.min(page * pageSize, totalResults);

  return (
    <PageContainer>
      <div className='relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100'>
        <div className='pointer-events-none absolute inset-0 opacity-80'>
          <div className='absolute top-[-8rem] left-[-8rem] h-[28rem] w-[28rem] rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-500/10' />
          <div className='absolute top-[10rem] right-[-8rem] h-[22rem] w-[22rem] rounded-full bg-emerald-200/20 blur-3xl dark:bg-emerald-500/10' />
        </div>

        <div className='relative mx-auto w-full max-w-[1680px] px-4 py-6 sm:px-6 lg:px-8'>
          <div className='mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
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
                <SoftPill tone='indigo'>Advanced search</SoftPill>
                <SoftPill tone='slate'>Multi-filter</SoftPill>
                <SoftPill tone='emerald'>Paginated results</SoftPill>
              </div>

              <h1 className='max-w-5xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white'>
                Product Research Console
              </h1>
              <p className='max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400'>
                Search by category, price range, type, title text, sentiment,
                rating, or image. After submit, the search area is hidden and
                replaced with a loading skeleton.
              </p>
            </div>
          </div>

          {viewMode === 'search' ? (
            <form
              onSubmit={submitSearch}
              className='grid gap-6 xl:grid-cols-[1.15fr_0.85fr]'
            >
              <SectionCard>
                <CardHeader className='pb-4'>
                  <div className='flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between'>
                    <div>
                      <CardTitle className='text-xl'>Search filters</CardTitle>
                      <CardDescription>
                        Build a query first, then submit to show the product
                        list.
                      </CardDescription>
                    </div>
                    <SoftPill tone={isImageMode ? 'amber' : 'indigo'}>
                      {isImageMode
                        ? 'Image search mode'
                        : 'Attribute search mode'}
                    </SoftPill>
                  </div>
                </CardHeader>

                <CardContent className='space-y-5'>
                  <div
                    className={`rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50 ${!canUseNormalFilters ? 'opacity-50' : ''}`}
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

                  <div className='grid gap-5 lg:grid-cols-2'>
                    <div
                      className={`rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50 ${!canUseNormalFilters ? 'opacity-50' : ''}`}
                    >
                      <div className='mb-3 flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100'>
                        <FilterIconTitle />
                        Search by multiple category
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        {CATEGORY_OPTIONS.map((category) => {
                          const active = draft.categories.includes(category);
                          return (
                            <ToggleChip
                              key={category}
                              label={category}
                              active={active}
                              disabled={!canUseNormalFilters}
                              onClick={() =>
                                toggleArray(category, 'categories')
                              }
                              tone={active ? 'indigo' : 'slate'}
                            />
                          );
                        })}
                      </div>
                    </div>

                    <div
                      className={`rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50 ${!canUseNormalFilters ? 'opacity-50' : ''}`}
                    >
                      <div className='mb-3 flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100'>
                        <TypeIconTitle />
                        Search by type
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        {TYPE_OPTIONS.map((type) => {
                          const active = draft.types.includes(type);
                          const tone =
                            type === 'WINNING'
                              ? 'emerald'
                              : type === 'DYING' || type === 'FADE'
                                ? 'rose'
                                : 'amber';
                          return (
                            <ToggleChip
                              key={type}
                              label={type}
                              active={active}
                              disabled={!canUseNormalFilters}
                              onClick={() => toggleArray(type, 'types')}
                              tone={tone}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className='grid gap-5 lg:grid-cols-2'>
                    <div
                      className={`rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50 ${!canUseNormalFilters ? 'opacity-50' : ''}`}
                    >
                      <div className='mb-3 flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100'>
                        <SentimentIconTitle />
                        Search by sentiment
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        {SENTIMENT_OPTIONS.map((sentiment) => {
                          const active = draft.sentiments.includes(sentiment);
                          const tone =
                            sentiment === 'positive'
                              ? 'emerald'
                              : sentiment === 'neutral'
                                ? 'amber'
                                : 'rose';
                          return (
                            <ToggleChip
                              key={sentiment}
                              label={toTitle(sentiment)}
                              active={active}
                              disabled={!canUseNormalFilters}
                              onClick={() =>
                                toggleArray(sentiment, 'sentiments')
                              }
                              tone={tone}
                            />
                          );
                        })}
                      </div>
                    </div>

                    <div
                      className={`rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50 ${!canUseNormalFilters ? 'opacity-50' : ''}`}
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
                  </div>

                  <div
                    className={`rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50 ${!canUseNormalFilters ? 'opacity-50' : ''}`}
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
                      Categories: {draft.categories.length}
                    </SoftPill>
                    <SoftPill tone='amber'>
                      Types: {draft.types.length}
                    </SoftPill>
                    <SoftPill tone='rose'>
                      Sentiments: {draft.sentiments.length}
                    </SoftPill>
                    <SoftPill tone='emerald'>
                      Rating: {draft.minRating.toFixed(1)}+
                    </SoftPill>
                  </div>

                  <div className='mt-2 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60'>
                    <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                      <div className='text-sm leading-6 text-slate-600 dark:text-slate-400'>
                        Fill the filters above, then press{' '}
                        <span className='font-semibold text-slate-950 dark:text-white'>
                          Submit Search
                        </span>{' '}
                        to render paginated results.
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        <Button
                          type='button'
                          variant='outline'
                          className='gap-2 rounded-2xl'
                          onClick={clearAll}
                        >
                          <Trash2 className='h-4 w-4' />
                          Reset
                        </Button>
                        <Button
                          type='submit'
                          className='gap-2 rounded-2xl bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200'
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
              </SectionCard>

              <SectionCard>
                <CardHeader className='pb-4'>
                  <CardTitle className='text-xl'>Image search</CardTitle>
                  <CardDescription>
                    Upload one image to switch the page into image-only mode.
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <label className='block cursor-pointer'>
                    <div className='rounded-[24px] border-2 border-dashed border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 text-center transition-colors hover:border-slate-300 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900 dark:hover:border-slate-700'>
                      <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200'>
                        <UploadCloud className='h-7 w-7' />
                      </div>
                      <div className='mt-4 text-base font-semibold text-slate-950 dark:text-white'>
                        Drop image or click to upload
                      </div>
                      <div className='mt-1 text-sm text-slate-500 dark:text-slate-400'>
                        When an image is selected, other filters are locked.
                      </div>
                      <input
                        type='file'
                        accept='image/*'
                        className='hidden'
                        onChange={(e) =>
                          handleImageChange(e.target.files?.[0] ?? null)
                        }
                      />
                    </div>
                  </label>

                  {draft.imagePreview ? (
                    <div className='space-y-3 rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50'>
                      <div className='flex items-center justify-between gap-3'>
                        <div className='flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100'>
                          <ImageIconTitle />
                          Image mode active
                        </div>
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          className='h-8 px-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-white'
                          onClick={() => handleImageChange(null)}
                        >
                          <X className='mr-1 h-4 w-4' />
                          Clear
                        </Button>
                      </div>
                      <div className='overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800'>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={draft.imagePreview}
                          alt='Uploaded preview'
                          className='h-56 w-full object-cover'
                        />
                      </div>
                      <div className='rounded-2xl bg-amber-50 p-3 text-sm leading-6 text-amber-800 ring-1 ring-amber-200/60 dark:bg-amber-900/20 dark:text-amber-200 dark:ring-amber-900/40'>
                        In this mode, category, price, type, text, sentiment,
                        and rating filters are disabled. The demo search uses
                        filename keywords to rank products. Replace that branch
                        with your real vision / vector search API.
                      </div>
                    </div>
                  ) : (
                    <div className='rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400'>
                      Uploading an image is optional. For regular search, submit
                      the attribute filters above.
                    </div>
                  )}

                  <div className='grid gap-3 sm:grid-cols-2'>
                    <div className='rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50'>
                      <div className='text-xs font-medium tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400'>
                        Search mode
                      </div>
                      <div className='mt-2 text-lg font-semibold text-slate-950 dark:text-white'>
                        {isImageMode ? 'Image only' : 'Attribute based'}
                      </div>
                    </div>
                    <div className='rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50'>
                      <div className='text-xs font-medium tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400'>
                        Ready state
                      </div>
                      <div className='mt-2 text-lg font-semibold text-slate-950 dark:text-white'>
                        {isImageMode ? 'Locked filters' : 'Editable filters'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </SectionCard>
            </form>
          ) : viewMode === 'loading' ? (
            <LoadingPanel />
          ) : (
            <SectionCard>
              <CardHeader className='pb-3'>
                <div className='flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between'>
                  <div className='flex items-start gap-3'>
                    <Button
                      type='button'
                      variant='outline'
                      className='gap-2 rounded-2xl'
                      onClick={goBackToSearch}
                    >
                      <ArrowLeft className='h-4 w-4' />
                      Back to filters
                    </Button>

                    <div>
                      <CardTitle className='text-xl'>Results</CardTitle>
                      <CardDescription>
                        Submitted search results are shown here in a paginated
                        list.
                      </CardDescription>
                    </div>
                  </div>

                  <div className='flex flex-wrap gap-2'>
                    <SoftPill tone='indigo'>Matches {totalResults}</SoftPill>
                    <SoftPill tone='slate'>
                      Active filters {activeFilterCount}
                    </SoftPill>
                    <SoftPill tone='emerald'>
                      Page {page} / {totalPages}
                    </SoftPill>
                  </div>
                </div>
              </CardHeader>

              <CardContent className='space-y-5'>
                <div className='flex flex-wrap gap-2'>
                  {applied.text ? (
                    <SoftPill tone='indigo'>Text: {applied.text}</SoftPill>
                  ) : null}
                  {applied.minPrice !== '' || applied.maxPrice !== '' ? (
                    <SoftPill tone='amber'>
                      Price: {applied.minPrice || '0'} -{' '}
                      {applied.maxPrice || '∞'}
                    </SoftPill>
                  ) : null}
                  {applied.categories.map((item) => (
                    <SoftPill key={item} tone='slate'>
                      {item}
                    </SoftPill>
                  ))}
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
                    <SoftPill tone='indigo'>
                      Image: {applied.imageFile.name}
                    </SoftPill>
                  ) : null}
                </div>

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
                ) : (
                  <>
                    <div className='grid gap-4 lg:grid-cols-2'>
                      {paginatedResults.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>

                    <div className='flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800'>
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
                          disabled={page === 1}
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                        >
                          <ChevronLeft className='h-4 w-4' />
                          Prev
                        </Button>

                        <div className='hidden items-center gap-1 md:flex'>
                          {Array.from(
                            { length: totalPages },
                            (_, idx) => idx + 1
                          )
                            .slice(
                              Math.max(0, page - 2),
                              Math.min(totalPages, page + 1)
                            )
                            .map((p) => (
                              <Button
                                key={p}
                                type='button'
                                variant={p === page ? 'default' : 'outline'}
                                className={`h-10 w-10 rounded-2xl ${p === page ? 'bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200' : ''}`}
                                onClick={() => setPage(p)}
                              >
                                {p}
                              </Button>
                            ))}
                        </div>

                        <Button
                          type='button'
                          variant='outline'
                          className='gap-2 rounded-2xl'
                          disabled={page === totalPages}
                          onClick={() =>
                            setPage((p) => Math.min(totalPages, p + 1))
                          }
                        >
                          Next
                          <ChevronRight className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </SectionCard>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
