'use client';

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ArrowRight,
  Boxes,
  Filter,
  Search,
  Sparkles,
  Upload,
  X,
  Zap,
} from 'lucide-react';

import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/product-card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '@/types/product';

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
    imageUrl: null,
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
    imageUrl: null,
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
    imageUrl: null,
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
    imageUrl: null,
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
    imageUrl: null,
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
    imageUrl: null,
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
    imageUrl: null,
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
    imageUrl: null,
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
    imageUrl: null,
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
    imageUrl: null,
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
    imageUrl: null,
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
    imageUrl: null,
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
    imageUrl: null,
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
    imageUrl: null,
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
    imageUrl: null,
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
    imageUrl: null,
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
    imageUrl: null,
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
    imageUrl: null,
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
    imageUrl: null,
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
    imageUrl: null,
  },
];

const TEXTAREA_MIN_HEIGHT = 108;
const TEXTAREA_MAX_HEIGHT = 264;

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

function SearchSkeleton() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-900">
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-4">
          <Skeleton className="h-16 w-16 rounded-3xl" />
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-5 w-44 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-28 rounded-full" />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Skeleton className="h-10 rounded-2xl" />
              <Skeleton className="h-10 rounded-2xl" />
              <Skeleton className="h-10 rounded-2xl" />
              <Skeleton className="h-10 rounded-2xl" />
            </div>
            <Skeleton className="h-10 rounded-[22px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[42vh] items-center justify-center">
      <div className="max-w-lg rounded-[32px] border border-slate-200 bg-white px-6 py-10 text-center shadow-[0_16px_50px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-900 sm:px-8 sm:py-12">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-50 shadow-sm dark:bg-slate-800">
          <Boxes className="h-6 w-6 text-slate-500 dark:text-slate-300" />
        </div>
        <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
          No strong matches yet
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
          Try a broader query or attach a clearer image. The backend ranking logic can replace this
          dummy matcher later.
        </p>
      </div>
    </div>
  );
}

function SearchResultsHeader({
                               count,
                               query,
                               hasImage,
                             }: {
  count: number;
  query: string;
  hasImage: boolean;
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Showing{' '}
          <span className="font-semibold text-slate-950 dark:text-white">{count}</span> results
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-500">
          {query ? `Matched for “${query}”` : 'Sorted by product strength'}
          {hasImage ? ' · image used as a signal' : ''}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="rounded-full px-3 py-1.5">
          <Zap className="mr-1 h-3.5 w-3.5" />
          20 curated items
        </Badge>
        <Badge variant="secondary" className="rounded-full px-3 py-1.5">
          <Filter className="mr-1 h-3.5 w-3.5" />
          Ranked by score
        </Badge>
      </div>
    </div>
  );
}

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
                    compact = false,
                  }: ComposerProps) {
  const resizeTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = 'auto';
    const nextHeight = Math.min(
      Math.max(el.scrollHeight, TEXTAREA_MIN_HEIGHT),
      TEXTAREA_MAX_HEIGHT
    );
    el.style.height = `${nextHeight}px`;
  }, [textareaRef]);

  useLayoutEffect(() => {
    resizeTextarea();
  }, [query, resizeTextarea]);

  useEffect(() => {
    const onResize = () => resizeTextarea();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [resizeTextarea]);

  return (
    <div className={['mx-auto w-full max-w-5xl', compact ? 'pt-0 sm:pt-1' : ''].join(' ')}>
      {!compact ? (
        <div className="mb-5 text-center sm:mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            <Sparkles className="h-3.5 w-3.5 text-slate-500 dark:text-slate-300" />
            Product discovery search
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            Find products with text or image
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
            Describe the product you want, or attach a photo. The interface is designed for fast
            scanning on mobile and clean comparison on desktop.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <Badge variant="secondary" className="rounded-full px-3 py-1.5">
              Fast search
            </Badge>
            <Badge variant="secondary" className="rounded-full px-3 py-1.5">
              Mobile-first layout
            </Badge>
            <Badge variant="secondary" className="rounded-full px-3 py-1.5">
              Responsive results
            </Badge>
          </div>
        </div>
      ) : null}

      <div className="rounded-[34px] border border-slate-200/80 bg-white/95 p-4 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-5 dark:border-slate-800 dark:bg-slate-900/95">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white">
              <Search className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              Smart product search
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Type a keyword, category, use case, or attach an image.
            </p>
          </div>
          <Badge variant="secondary" className="rounded-full px-3 py-1.5">
            Ctrl + Enter
          </Badge>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-4 h-5 w-5 text-slate-400" />
          <textarea
            ref={textareaRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe the product you want to find or search by image..."
            rows={1}
            style={{ height: `${TEXTAREA_MIN_HEIGHT}px` }}
            className="min-h-[108px] w-full resize-none overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50 px-12 py-4 pr-4 text-[15px] leading-7 text-slate-950 outline-none transition-[border-color,background-color,box-shadow] duration-200 placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:shadow-[0_0_0_4px_rgba(148,163,184,0.12)] sm:pr-[208px] dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-600 dark:focus:bg-slate-950"
            onInput={resizeTextarea}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                onRunSearch();
              }
            }}
            aria-label="Search products"
          />

          <div className="absolute right-3 top-3 hidden items-center gap-2 sm:flex">
            <Button
              type="button"
              variant="ghost"
              className="h-10 rounded-full px-4 text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>

            <Button
              type="button"
              className="h-10 rounded-full px-5"
              onClick={onRunSearch}
              disabled={!hasInput || isLoading}
            >
              {isLoading ? 'Searching…' : 'Search'}
              {!isLoading ? <ArrowRight className="ml-2 h-4 w-4" /> : null}
            </Button>
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-3 sm:hidden">
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-full border-slate-200 bg-white px-4 text-slate-700 hover:bg-slate-50 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
            <Button
              type="button"
              className="h-11 rounded-full px-4"
              onClick={onRunSearch}
              disabled={!hasInput || isLoading}
            >
              {isLoading ? 'Searching…' : 'Search'}
            </Button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onPickImage(e.target.files?.[0])}
        />

        {imagePreview ? (
          <div className="mt-4 flex items-center gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
            <img
              src={imagePreview}
              alt="Selected preview"
              className="h-14 w-14 rounded-2xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-950 dark:text-white">
                {imageFile?.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Image attached for search
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              className="rounded-full px-3 text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              onClick={onClearImage}
            >
              <X className="h-4 w-4" />
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
  const searchTimeoutRef = useRef<number | null>(null);

  const isInitial = !hasSearched && !isLoading;
  const hasInput = Boolean(query.trim() || imageFile);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      if (searchTimeoutRef.current !== null) {
        window.clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const onPickImage = useCallback((file?: File) => {
    if (!file || !file.type.startsWith('image/')) return;

    setImageFile(file);

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const nextUrl = URL.createObjectURL(file);
    previewUrlRef.current = nextUrl;
    setImagePreview(nextUrl);
  }, []);

  const clearImage = useCallback(() => {
    setImageFile(null);

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    setImagePreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const runSearch = useCallback(() => {
    if (!hasInput) return;

    if (searchTimeoutRef.current !== null) {
      window.clearTimeout(searchTimeoutRef.current);
    }

    setIsLoading(true);
    setHasSearched(true);

    searchTimeoutRef.current = window.setTimeout(() => {
      const q = query.trim().toLowerCase();
      const seed = (imageFile?.name ?? '').toLowerCase();

      const scored = DUMMY_PRODUCTS.map((product) => {
        const haystack = [
          product.name,
          product.category,
          product.color,
          product.lifecycle,
          String(product.price),
          String(product.score),
          String(product.quality),
          String(product.demand),
          String(product.reviews),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        const queryMatch =
          !q
            ? 0
            : q
              .split(/\s+/)
              .filter(Boolean)
              .reduce((acc, word) => acc + (haystack.includes(word) ? 1 : 0), 0);

        const exactMatch = q && haystack.includes(q) ? 3 : 0;

        let imageBoost = 0;
        if (seed) {
          if (seed.includes('shoe') || seed.includes('fashion')) {
            imageBoost = product.category === 'Fashion' || product.category === 'Accessories' ? 2 : 0;
          } else if (seed.includes('home') || seed.includes('room') || seed.includes('desk')) {
            imageBoost = ['Home', 'Kitchen', 'Office'].includes(product.category) ? 2 : 0;
          } else if (seed.includes('fit') || seed.includes('gym') || seed.includes('sport')) {
            imageBoost = product.category === 'Fitness' ? 2 : 0;
          }
        }

        const businessScore =
          product.score * 0.7 +
          product.quality * 0.15 +
          product.demand * 0.1 -
          product.competition * 0.05;

        return {
          product,
          rank: businessScore + queryMatch * 8 + exactMatch * 10 + imageBoost * 7,
        };
      });

      const next = scored
        .filter(({ product, rank }) => {
          if (!q && !seed) return true;
          if (q && rank > 0) return true;
          if (seed && rank > 0) return true;
          return q ? product.name.toLowerCase().includes(q) || product.category.toLowerCase().includes(q) : true;
        })
        .sort((a, b) => b.rank - a.rank)
        .map(({ product }) => product)
        .slice(0, 20);

      setResults(next);
      setIsLoading(false);

      requestAnimationFrame(() => {
        topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }, 900);
  }, [hasInput, imageFile?.name, query]);

  const summaryStats = useMemo(() => {
    const avgScore =
      results.length > 0
        ? Math.round(results.reduce((sum, item) => sum + item.score, 0) / results.length)
        : 0;

    const winningCount = results.filter((item) => item.lifecycle === 'winning').length;
    const evergreenCount = results.filter((item) => item.lifecycle === 'evergreen').length;

    return { avgScore, winningCount, evergreenCount };
  }, [results]);

  return (
    <PageContainer scrollable={true}>
      <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-3 py-3 sm:px-4 sm:py-4 lg:px-5 lg:py-5">
          {isInitial ? (
            <div className="flex flex-1 items-center justify-center py-4 sm:py-6">
              <div className="w-full">
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

                {/*<div className="mx-auto mt-6 grid max-w-5xl gap-3 sm:mt-8 sm:grid-cols-3">*/}
                {/*  {[*/}
                {/*    { label: 'Fast discovery', value: 'Text or image input' },*/}
                {/*    { label: 'Mobile ready', value: 'Large touch targets' },*/}
                {/*    { label: 'Desktop ready', value: 'Wide result grid' },*/}
                {/*  ].map((item) => (*/}
                {/*    <div*/}
                {/*      key={item.label}*/}
                {/*      className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-900"*/}
                {/*    >*/}
                {/*      <div className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">*/}
                {/*        {item.label}*/}
                {/*      </div>*/}
                {/*      <div className="mt-2 text-sm font-medium text-slate-950 dark:text-white">*/}
                {/*        {item.value}*/}
                {/*      </div>*/}
                {/*    </div>*/}
                {/*  ))}*/}
                {/*</div>*/}
              </div>
            </div>
          ) : (
            <>
              <div
                ref={topRef}
                className="sticky top-0 z-20 -mx-3 mb-4 border-b border-slate-200/70 bg-slate-50/90 px-3 py-3 backdrop-blur md:-mx-4 md:px-4 lg:-mx-5 lg:px-5 dark:border-slate-800/70 dark:bg-slate-950/85"
              >
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

              {/*<div className="mb-4 grid gap-3 sm:grid-cols-3">*/}
              {/*  <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-900">*/}
              {/*    <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">*/}
              {/*      Results*/}
              {/*    </div>*/}
              {/*    <div className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">*/}
              {/*      {results.length}*/}
              {/*    </div>*/}
              {/*    <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">*/}
              {/*      Products ranked from strongest to weakest match.*/}
              {/*    </div>*/}
              {/*  </div>*/}

              {/*  <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-900">*/}
              {/*    <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">*/}
              {/*      Average score*/}
              {/*    </div>*/}
              {/*    <div className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">*/}
              {/*      {summaryStats.avgScore}*/}
              {/*    </div>*/}
              {/*    <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">*/}
              {/*      Higher score means a stronger business candidate.*/}
              {/*    </div>*/}
              {/*  </div>*/}

              {/*  <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-900">*/}
              {/*    <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">*/}
              {/*      Lifecycle mix*/}
              {/*    </div>*/}
              {/*    <div className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">*/}
              {/*      {summaryStats.winningCount}/{summaryStats.evergreenCount}*/}
              {/*    </div>*/}
              {/*    <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">*/}
              {/*      Winning vs evergreen items in current results.*/}
              {/*    </div>*/}
              {/*  </div>*/}
              {/*</div>*/}

              <div className="pb-8">
                {isLoading ? (
                  <div>
                    <SearchResultsHeader count={20} query={query.trim()} hasImage={Boolean(imageFile)} />
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {Array.from({ length: 12 }).map((_, index) => (
                        <SearchSkeleton key={index} />
                      ))}
                    </div>
                  </div>
                ) : results.length > 0 ? (
                  <div>
                    <SearchResultsHeader
                      count={results.length}
                      query={query.trim()}
                      hasImage={Boolean(imageFile)}
                    />
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {results.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <EmptyState />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
