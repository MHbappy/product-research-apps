'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Boxes,
  Search,
  Sparkles,
  Upload,
  X,
  Zap
} from 'lucide-react';

import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/product-card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '@/types/product';

type SearchState = 'idle' | 'loading' | 'done';

const DUMMY_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'AeroFit Smart Bottle',
    category: 'Fitness',
    price: 39,
    rating: 4.7,
    reviews: 18420,
    demand: 96,
    competition: 28,
    score: 94,
    quality: 92,
    lifecycle: 'winning',
    color: '#60a5fa',
    imageUrl: null
  },
  {
    id: 2,
    name: 'FoldPro Travel Backpack',
    category: 'Travel',
    price: 59,
    rating: 4.6,
    reviews: 16320,
    demand: 91,
    competition: 31,
    score: 93,
    quality: 90,
    lifecycle: 'winning',
    color: '#94a3b8',
    imageUrl: null
  },
  {
    id: 3,
    name: 'CloudWave Earbuds',
    category: 'Electronics',
    price: 79,
    rating: 4.5,
    reviews: 22110,
    demand: 89,
    competition: 44,
    score: 90,
    quality: 88,
    lifecycle: 'trendy',
    color: '#cbd5e1',
    imageUrl: null
  },
  {
    id: 4,
    name: 'CoolMist Desk Fan',
    category: 'Home',
    price: 34,
    rating: 4.4,
    reviews: 9620,
    demand: 87,
    competition: 22,
    score: 88,
    quality: 86,
    lifecycle: 'seasonal',
    color: '#a5f3fc',
    imageUrl: null
  },
  {
    id: 5,
    name: 'Minimal Ceramic Mug Set',
    category: 'Home',
    price: 27,
    rating: 4.8,
    reviews: 14230,
    demand: 84,
    competition: 35,
    score: 87,
    quality: 93,
    lifecycle: 'evergreen',
    color: '#fde68a',
    imageUrl: null
  },
  {
    id: 6,
    name: 'Warm Knit Beanie',
    category: 'Fashion',
    price: 18,
    rating: 4.3,
    reviews: 5300,
    demand: 80,
    competition: 20,
    score: 82,
    quality: 84,
    lifecycle: 'seasonal',
    color: '#c084fc',
    imageUrl: null
  },
  {
    id: 7,
    name: 'Creator Phone Tripod',
    category: 'Accessories',
    price: 24,
    rating: 4.2,
    reviews: 7800,
    demand: 88,
    competition: 30,
    score: 85,
    quality: 83,
    lifecycle: 'trendy',
    color: '#94a3b8',
    imageUrl: null
  },
  {
    id: 8,
    name: 'Classic Cotton Tee Pack',
    category: 'Fashion',
    price: 22,
    rating: 3.8,
    reviews: 14500,
    demand: 52,
    competition: 61,
    score: 61,
    quality: 60,
    lifecycle: 'fade',
    color: '#fda4af',
    imageUrl: null
  },
  {
    id: 9,
    name: 'Desk Organizer Set',
    category: 'Office',
    price: 31,
    rating: 4.5,
    reviews: 9100,
    demand: 82,
    competition: 26,
    score: 84,
    quality: 87,
    lifecycle: 'evergreen',
    color: '#fdba74',
    imageUrl: null
  },
  {
    id: 10,
    name: 'Smart Night Lamp',
    category: 'Home',
    price: 44,
    rating: 4.6,
    reviews: 12110,
    demand: 90,
    competition: 39,
    score: 91,
    quality: 89,
    lifecycle: 'trendy',
    color: '#fde68a',
    imageUrl: null
  },
  {
    id: 11,
    name: 'Cooling Pillow Cover',
    category: 'Home',
    price: 29,
    rating: 4.1,
    reviews: 6800,
    demand: 76,
    competition: 18,
    score: 79,
    quality: 80,
    lifecycle: 'seasonal',
    color: '#bae6fd',
    imageUrl: null
  },
  {
    id: 12,
    name: 'Leather Cable Pouch',
    category: 'Accessories',
    price: 19,
    rating: 4.4,
    reviews: 4400,
    demand: 77,
    competition: 24,
    score: 78,
    quality: 82,
    lifecycle: 'evergreen',
    color: '#b08968',
    imageUrl: null
  },
  {
    id: 13,
    name: 'Resistance Band Kit',
    category: 'Fitness',
    price: 26,
    rating: 4.7,
    reviews: 15240,
    demand: 93,
    competition: 33,
    score: 93,
    quality: 91,
    lifecycle: 'winning',
    color: '#86efac',
    imageUrl: null
  },
  {
    id: 14,
    name: 'Wireless Charger Dock',
    category: 'Electronics',
    price: 36,
    rating: 4.5,
    reviews: 9980,
    demand: 85,
    competition: 38,
    score: 86,
    quality: 88,
    lifecycle: 'evergreen',
    color: '#a78bfa',
    imageUrl: null
  },
  {
    id: 15,
    name: 'Aroma Reed Diffuser',
    category: 'Home',
    price: 21,
    rating: 4.2,
    reviews: 5600,
    demand: 79,
    competition: 19,
    score: 80,
    quality: 81,
    lifecycle: 'seasonal',
    color: '#fcd34d',
    imageUrl: null
  },
  {
    id: 16,
    name: 'MagSafe Card Wallet',
    category: 'Accessories',
    price: 25,
    rating: 4.6,
    reviews: 8900,
    demand: 88,
    competition: 29,
    score: 88,
    quality: 86,
    lifecycle: 'trendy',
    color: '#d6d3d1',
    imageUrl: null
  },
  {
    id: 17,
    name: 'Premium Bath Towel Set',
    category: 'Home',
    price: 48,
    rating: 4.8,
    reviews: 13200,
    demand: 86,
    competition: 41,
    score: 89,
    quality: 94,
    lifecycle: 'evergreen',
    color: '#f5d0fe',
    imageUrl: null
  },
  {
    id: 18,
    name: 'Portable Blender Cup',
    category: 'Kitchen',
    price: 42,
    rating: 4.3,
    reviews: 7000,
    demand: 83,
    competition: 27,
    score: 84,
    quality: 84,
    lifecycle: 'winning',
    color: '#99f6e4',
    imageUrl: null
  },
  {
    id: 19,
    name: 'Insulated Lunch Box',
    category: 'Kitchen',
    price: 28,
    rating: 4.4,
    reviews: 10400,
    demand: 81,
    competition: 23,
    score: 83,
    quality: 85,
    lifecycle: 'evergreen',
    color: '#cbd5e1',
    imageUrl: null
  },
  {
    id: 20,
    name: 'Desk Foot Rest',
    category: 'Office',
    price: 33,
    rating: 4.1,
    reviews: 6100,
    demand: 74,
    competition: 16,
    score: 77,
    quality: 79,
    lifecycle: 'fade',
    color: '#64748b',
    imageUrl: null
  }
];

function SearchSkeleton() {
  return (
    <div className='overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-900'>
      <div className='p-4 sm:p-5'>
        <div className='flex items-start gap-4'>
          <Skeleton className='h-16 w-16 rounded-3xl' />
          <div className='min-w-0 flex-1 space-y-3'>
            <div className='flex items-center justify-between gap-4'>
              <Skeleton className='h-5 w-44 rounded-full' />
              <Skeleton className='h-5 w-16 rounded-full' />
            </div>
            <Skeleton className='h-4 w-28 rounded-full' />
            <div className='grid grid-cols-2 gap-2 sm:grid-cols-4'>
              <Skeleton className='h-10 rounded-2xl' />
              <Skeleton className='h-10 rounded-2xl' />
              <Skeleton className='h-10 rounded-2xl' />
              <Skeleton className='h-10 rounded-2xl' />
            </div>
            <Skeleton className='h-10 rounded-[22px]' />
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchResultsHeader({ count }: { count: number }) {
  return (
    <div className='mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
      <div className='text-sm text-slate-600 dark:text-slate-400'>
        Showing{' '}
        <span className='font-semibold text-slate-950 dark:text-white'>
          {count}
        </span>{' '}
        results
      </div>
      <Badge variant='secondary' className='w-fit rounded-full px-3 py-1'>
        <Zap className='mr-1 h-3.5 w-3.5' />
        20 items
      </Badge>
    </div>
  );
}

type ComposerProps = {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  hasInput: boolean;
  isLoading: boolean;
  imageFile: File | null;
  imagePreview: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onPickImage: (file?: File) => void;
  onClearImage: () => void;
  onRunSearch: () => void;
  compact?: boolean;
};

function Composer({
  query,
  setQuery,
  hasInput,
  isLoading,
  imageFile,
  imagePreview,
  fileInputRef,
  textareaRef,
  onPickImage,
  onClearImage,
  onRunSearch,
  compact = false
}: ComposerProps) {
  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = '0px';
    const nextHeight = Math.min(Math.max(el.scrollHeight, 104), 260);
    el.style.height = `${nextHeight}px`;
  };

  useLayoutEffect(() => {
    resizeTextarea();
  }, [query]);

  return (
    <div className={compact ? 'w-full max-w-3xl' : 'w-full max-w-4xl'}>
      <div className='mb-5 text-center'>
        <p className='text-xs font-medium tracking-[0.22em] text-slate-500 uppercase dark:text-slate-400'>
          Search with text or image
        </p>
      </div>

      <div className='rounded-[34px] border border-slate-200 bg-white px-4 py-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:px-5 sm:py-5 dark:border-slate-800 dark:bg-slate-900'>
        <div className='relative'>
          <Search className='pointer-events-none absolute top-4 left-4 h-5 w-5 text-slate-400' />
          <textarea
            ref={textareaRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Describe the product you want to find...'
            rows={4}
            className='min-h-[104px] w-full resize-none rounded-[28px] border border-slate-200 bg-slate-50 px-12 py-4 pr-[170px] text-[15px] leading-7 text-slate-950 transition outline-none placeholder:text-slate-400 focus:border-slate-300 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-600 dark:focus:bg-slate-950'
            onInput={() => {
              const el = textareaRef.current;
              if (!el) return;
              el.style.height = '0px';
              el.style.height = `${Math.min(Math.max(el.scrollHeight, 104), 260)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                onRunSearch();
              }
            }}
          />

          <div className='absolute top-3 right-3 hidden items-center gap-2 sm:flex'>
            <Button
              type='button'
              variant='ghost'
              className='h-9 rounded-full px-3 text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className='mr-2 h-4 w-4' />
              Upload
            </Button>

            <Button
              type='button'
              className='h-9 rounded-full px-4'
              onClick={onRunSearch}
              disabled={!hasInput || isLoading}
            >
              {isLoading ? 'Searching' : 'Submit'}
            </Button>
          </div>
        </div>

        <div className='mt-3 flex flex-col gap-3 sm:hidden'>
          <div className='flex gap-2'>
            <Button
              type='button'
              variant='outline'
              className='h-10 flex-1 rounded-full border-slate-200 bg-white px-4 text-slate-700 hover:bg-slate-50 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className='mr-2 h-4 w-4' />
              Upload image
            </Button>

            <Button
              type='button'
              className='h-10 flex-1 rounded-full px-4'
              onClick={onRunSearch}
              disabled={!hasInput || isLoading}
            >
              {isLoading ? 'Searching' : 'Submit'}
            </Button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          className='hidden'
          onChange={(e) => onPickImage(e.target.files?.[0])}
        />

        {imagePreview ? (
          <div className='mt-4 flex items-center gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950'>
            <img
              src={imagePreview}
              alt='Selected preview'
              className='h-14 w-14 rounded-2xl object-cover'
            />
            <div className='min-w-0 flex-1'>
              <p className='truncate text-sm font-medium text-slate-950 dark:text-white'>
                {imageFile?.name}
              </p>
              <p className='text-xs text-slate-500 dark:text-slate-400'>
                Image attached for search
              </p>
            </div>
            <Button
              type='button'
              variant='ghost'
              className='rounded-full px-3 text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              onClick={onClearImage}
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function ProductSearchPage() {
  const [query, setQuery] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<Product[]>(DUMMY_PRODUCTS);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const topRef = useRef<HTMLDivElement | null>(null);

  const isInitial = !hasSearched && !isLoading;
  const hasInput = Boolean(query.trim() || imageFile);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  const onPickImage = (file?: File) => {
    if (!file || !file.type.startsWith('image/')) return;

    setImageFile(file);

    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const nextUrl = URL.createObjectURL(file);
    previewUrlRef.current = nextUrl;
    setImagePreview(nextUrl);
  };

  const clearImage = () => {
    setImageFile(null);
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = null;
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const runSearch = () => {
    if (!hasInput) return;

    setIsLoading(true);
    setHasSearched(true);

    window.setTimeout(() => {
      const q = query.trim().toLowerCase();
      const seed = (imageFile?.name ?? '').toLowerCase();
      let next = [...DUMMY_PRODUCTS];

      if (q) {
        const parts = q.split(' ').filter((part) => part.length > 0);
        next = next
          .filter((product) => {
            const haystack = [
              product.name,
              product.category,
              product.color,
              product.lifecycle,
              String(product.price),
              String(product.score)
            ]
              .filter(Boolean)
              .join(' ')
              .toLowerCase();
            return (
              haystack.includes(q) ||
              parts.some((word) => haystack.includes(word))
            );
          })
          .sort((a, b) => b.score - a.score);
      }

      if (imageFile) {
        if (seed.includes('shoe') || seed.includes('fashion')) {
          next = next.filter(
            (p) => p.category === 'Fashion' || p.category === 'Accessories'
          );
        } else if (
          seed.includes('home') ||
          seed.includes('room') ||
          seed.includes('desk')
        ) {
          next = next.filter((p) =>
            ['Home', 'Kitchen', 'Office'].includes(p.category)
          );
        } else if (
          seed.includes('fit') ||
          seed.includes('gym') ||
          seed.includes('sport')
        ) {
          next = next.filter((p) => p.category === 'Fitness');
        }
      }

      setResults(next.slice(0, 20));
      setIsLoading(false);
      requestAnimationFrame(() => {
        topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }, 1200);
  };

  return (
    <PageContainer scrollable={false}>
      <div className='h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100'>
        <div className='flex h-full min-h-0 flex-col p-3 sm:p-4 lg:p-5'>
          {isInitial ? (
            <div className='flex flex-1 items-center justify-center'>
              <Composer
                query={query}
                setQuery={setQuery}
                hasInput={hasInput}
                isLoading={isLoading}
                imageFile={imageFile}
                imagePreview={imagePreview}
                fileInputRef={fileInputRef}
                textareaRef={textareaRef}
                onPickImage={onPickImage}
                onClearImage={clearImage}
                onRunSearch={runSearch}
              />
            </div>
          ) : (
            <>
              <div ref={topRef} className='flex shrink-0 justify-center'>
                <Composer
                  query={query}
                  setQuery={setQuery}
                  hasInput={hasInput}
                  isLoading={isLoading}
                  imageFile={imageFile}
                  imagePreview={imagePreview}
                  fileInputRef={fileInputRef}
                  textareaRef={textareaRef}
                  onPickImage={onPickImage}
                  onClearImage={clearImage}
                  onRunSearch={runSearch}
                  compact
                />
              </div>

              <div className='mt-4 min-h-0 flex-1 overflow-y-auto px-0 sm:px-1'>
                {isLoading ? (
                  <div>
                    <SearchResultsHeader count={20} />
                    <div className='grid gap-4 md:grid-cols-2 2xl:grid-cols-3'>
                      {Array.from({ length: 20 }).map((_, index) => (
                        <SearchSkeleton key={index} />
                      ))}
                    </div>
                  </div>
                ) : results.length > 0 ? (
                  <div>
                    <SearchResultsHeader count={results.length} />
                    <div className='grid gap-4 md:grid-cols-2 2xl:grid-cols-3'>
                      {results.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className='flex min-h-[40vh] items-center justify-center'>
                    <div className='max-w-md px-6 py-12 text-center'>
                      <div className='mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-white shadow-sm dark:bg-slate-900'>
                        <Boxes className='h-6 w-6 text-slate-500 dark:text-slate-400' />
                      </div>
                      <h3 className='text-lg font-semibold text-slate-950 dark:text-white'>
                        No strong matches yet
                      </h3>
                      <p className='mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400'>
                        Try a broader query or attach a clearer image. The
                        backend can replace this dummy ranking logic later.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
