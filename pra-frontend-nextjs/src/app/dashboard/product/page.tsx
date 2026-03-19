'use client';

import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductCard } from '@/components/products/product-card';
import { ProductFilters } from '@/components/products/product-filters';
import { ProductPagination } from '@/components/products/product-pagination';
import { PRODUCTS } from '@/data/products';
import { useProductFilters } from '@/hooks/use-product-filters';
import { ProductGridSkeleton } from '@/components/products/product-grid-skeleton';

export default function ProductListingPage() {
  const {
    query,
    setQuery,
    category,
    setCategory,
    sortBy,
    setSortBy,
    lifecycleFilters,
    toggleLifecycle,
    clearLifecycleFilters,
    clearFilters,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    minQuality,
    setMinQuality,
    minScore,
    setMinScore,
    categories,
    filtered,
    page,
    setPage,
    pageCount,
    pageItems,
    avgRating,
    totalProducts
  } = useProductFilters(PRODUCTS, 9);

  const [isPaginating, setIsPaginating] = useState(false);
  const paginationTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (paginationTimerRef.current !== null) {
        window.clearTimeout(paginationTimerRef.current);
      }
    };
  }, []);

  const goToPage = (nextPage: number) => {
    if (nextPage === page) return;
    if (nextPage < 1 || nextPage > pageCount) return;

    setIsPaginating(true);
    setPage(nextPage);

    if (paginationTimerRef.current !== null) {
      window.clearTimeout(paginationTimerRef.current);
    }

    paginationTimerRef.current = window.setTimeout(() => {
      setIsPaginating(false);
    }, 3500);
  };

  return (
    <PageContainer>
      <div className='min-h-full w-full bg-white p-4 text-slate-900 sm:p-6 dark:bg-slate-900 dark:text-slate-200'>
        {/* Sticky header */}
        <div className='sticky top-0 z-30 -mx-4 mb-4 border-b border-slate-200/70 bg-white/95 px-4 pt-4 pb-4 backdrop-blur sm:-mx-6 sm:px-6 dark:border-slate-700/70 dark:bg-slate-900/95'>
          <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
            <div className='min-w-0'>
              <h2 className='text-xl font-semibold text-slate-900 sm:text-2xl dark:text-white'>
                Discover Products
              </h2>
              <p className='mt-1 text-sm text-slate-600 dark:text-slate-400'>
                Curated & data-driven — find opportunities fast.
              </p>
            </div>

            <div className='flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto'>
              <div className='flex w-full items-center gap-2 rounded-md border border-slate-100 bg-slate-50 px-3 py-2 sm:w-72 dark:border-slate-700 dark:bg-slate-800'>
                <Search className='h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400' />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder='Search products, categories...'
                  className='h-8 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0'
                />
              </div>

              <Button className='w-full bg-gradient-to-r from-indigo-500 to-teal-400 text-white shadow-md hover:from-indigo-600 hover:to-teal-500 sm:w-auto dark:from-indigo-400 dark:to-cyan-500'>
                <Link href='/dashboard/filtered-product'>Start Research</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-4 md:items-start'>
          {/* Sticky filters on desktop, normal on mobile */}
          <aside className='md:sticky md:top-28 md:col-span-1 md:self-start'>
            <ProductFilters
              query={query}
              onQueryChange={setQuery}
              category={category}
              onCategoryChange={setCategory}
              categories={categories}
              sortBy={sortBy}
              onSortByChange={setSortBy}
              lifecycleFilters={lifecycleFilters}
              onToggleLifecycle={toggleLifecycle}
              onClearLifecycle={clearLifecycleFilters}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onMinPriceChange={setMinPrice}
              onMaxPriceChange={setMaxPrice}
              minQuality={minQuality}
              onMinQualityChange={setMinQuality}
              minScore={minScore}
              onMinScoreChange={setMinScore}
              filteredCount={filtered.length}
              totalProducts={totalProducts}
              avgRating={avgRating}
              onReset={clearFilters}
            />
          </aside>

          <main className='min-w-0 md:col-span-3'>
            <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              <div className='text-sm text-slate-600 dark:text-slate-400'>
                Showing <span className='font-medium'>{filtered.length}</span>{' '}
                results
              </div>

              <ProductPagination
                page={page}
                pageCount={pageCount}
                isLoading={isPaginating}
                onPrev={() => goToPage(Math.max(1, page - 1))}
                onNext={() => goToPage(Math.min(pageCount, page + 1))}
              />
            </div>

            {isPaginating ? (
              <ProductGridSkeleton count={9} />
            ) : (
              <div className='grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 xl:grid-cols-3'>
                {pageItems.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            <div className='mt-6'>
              <ProductPagination
                page={page}
                pageCount={pageCount}
                isLoading={isPaginating}
                onPrev={() => goToPage(Math.max(1, page - 1))}
                onNext={() => goToPage(Math.min(pageCount, page + 1))}
              />
            </div>
          </main>
        </div>

        <div className='mt-6 rounded-md border border-slate-100 bg-gradient-to-r from-white to-slate-50 p-3 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:from-slate-800 dark:to-slate-900 dark:text-slate-300'>
          Tip: Tap <span className='font-medium'>Details</span> to view product
          insights. Use lifecycle filters to focus on Trendy / Evergreen
          opportunities.
        </div>
      </div>
    </PageContainer>
  );
}
