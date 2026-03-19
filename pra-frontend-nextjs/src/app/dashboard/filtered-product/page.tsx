'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Filter,
  Image as ImageIcon,
  Loader2,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Tag,
  Trash2,
  UploadCloud,
  X
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import PageContainer from '@/components/layout/page-container';

type ProductType =
  | 'TRENDY'
  | 'EVERGREEN'
  | 'SEASONAL'
  | 'WINNING'
  | 'FADE'
  | 'DYING';

type Sentiment = 'positive' | 'neutral' | 'negative';

type Product = {
  id: number;
  title: string;
  category: string;
  type: ProductType;
  sentiment: Sentiment;
  price: number;
  rating: number;
  reviews: number;
  score: number;
  visualTags: string[];
  color: string;
};

type Filters = {
  text: string;
  categories: string[];
  types: ProductType[];
  sentiments: Sentiment[];
  minPrice: string;
  maxPrice: string;
  minRating: number;
  imageFile: File | null;
  imagePreview: string | null;
};

const PRODUCTS: Product[] = [
  {
    id: 1,
    title: 'Self Watering Flowerpot Self-Absorbent Automatic Water-Absorbing Basin Green Plant Pot',
    category: 'Home',
    type: 'EVERGREEN',
    sentiment: 'positive',
    price: 49.99,
    rating: 4.6,
    reviews: 124000,
    score: 86,
    visualTags: ['plant', 'pot', 'home', 'garden', 'green'],
    color: '#8b5cf6'
  },
  {
    id: 2,
    title: 'EcoBottle — Reusable Thermal Bottle, 750ml',
    category: 'Outdoors',
    type: 'TRENDY',
    sentiment: 'positive',
    price: 19.9,
    rating: 4.4,
    reviews: 89,
    score: 78,
    visualTags: ['bottle', 'travel', 'drink', 'metal'],
    color: '#06b6d4'
  },
  {
    id: 3,
    title: 'SmartLamp Pro (Touch + App Control)',
    category: 'Electronics',
    type: 'WINNING',
    sentiment: 'positive',
    price: 79,
    rating: 4.8,
    reviews: 230,
    score: 92,
    visualTags: ['lamp', 'desk', 'light', 'smart'],
    color: '#f59e0b'
  },
  {
    id: 4,
    title: 'KitchenPro Pan — Non-stick Series (28cm)',
    category: 'Kitchen',
    type: 'SEASONAL',
    sentiment: 'neutral',
    price: 34.5,
    rating: 4.3,
    reviews: 76,
    score: 70,
    visualTags: ['pan', 'cookware', 'kitchen', 'non-stick'],
    color: '#10b981'
  },
  {
    id: 5,
    title: 'MiniDrone X200 — Foldable Drone with HD Camera',
    category: 'Electronics',
    type: 'FADE',
    sentiment: 'neutral',
    price: 129.99,
    rating: 4.2,
    reviews: 310,
    score: 66,
    visualTags: ['drone', 'camera', 'tech', 'foldable'],
    color: '#ef4444'
  },
  {
    id: 6,
    title: 'YogaMat Plus — Extra Grip, 6mm',
    category: 'Sports',
    type: 'EVERGREEN',
    sentiment: 'positive',
    price: 29,
    rating: 4.5,
    reviews: 101,
    score: 74,
    visualTags: ['mat', 'fitness', 'yoga', 'sports'],
    color: '#7c3aed'
  },
  {
    id: 7,
    title: 'PetGroom Kit — 7-in-1 Grooming Set',
    category: 'Pet',
    type: 'TRENDY',
    sentiment: 'positive',
    price: 24,
    rating: 4.1,
    reviews: 45,
    score: 72,
    visualTags: ['pet', 'grooming', 'animal', 'kit'],
    color: '#fb923c'
  },
  {
    id: 8,
    title: 'GardenLight Solar — Auto On/Off',
    category: 'Outdoor',
    type: 'WINNING',
    sentiment: 'positive',
    price: 22,
    rating: 4.7,
    reviews: 94,
    score: 81,
    visualTags: ['solar', 'light', 'garden', 'outdoor'],
    color: '#06b6d4'
  },
  {
    id: 9,
    title: 'PhoneGrip — 360 Rotating Stand',
    category: 'Accessories',
    type: 'DYING',
    sentiment: 'negative',
    price: 9.99,
    rating: 3.9,
    reviews: 18,
    score: 60,
    visualTags: ['phone', 'stand', 'accessory', 'grip'],
    color: '#4f46e5'
  },
  {
    id: 10,
    title: 'ThermoBottle — Insulated Flask 500ml',
    category: 'Outdoors',
    type: 'EVERGREEN',
    sentiment: 'positive',
    price: 39,
    rating: 4.6,
    reviews: 210,
    score: 88,
    visualTags: ['bottle', 'flask', 'travel', 'drink'],
    color: '#10b981'
  },
  {
    id: 11,
    title: 'BabyToys X — Soft Learning Toys',
    category: 'Toys',
    type: 'SEASONAL',
    sentiment: 'neutral',
    price: 15.5,
    rating: 4.0,
    reviews: 54,
    score: 73,
    visualTags: ['toy', 'baby', 'soft', 'learning'],
    color: '#f59e0b'
  },
  {
    id: 12,
    title: 'OutdoorTarp — Heavy Duty 3x4m',
    category: 'Outdoor',
    type: 'TRENDY',
    sentiment: 'neutral',
    price: 18,
    rating: 4.2,
    reviews: 33,
    score: 68,
    visualTags: ['tarp', 'camping', 'outdoor', 'cover'],
    color: '#7c3aed'
  },
  {
    id: 13,
    title: 'DeskShelf Mini — Adjustable Monitor Stand',
    category: 'Office',
    type: 'WINNING',
    sentiment: 'positive',
    price: 44,
    rating: 4.7,
    reviews: 182,
    score: 90,
    visualTags: ['desk', 'monitor', 'stand', 'office'],
    color: '#0ea5e9'
  },
  {
    id: 14,
    title: 'CordWrap Pro — Cable Organizer Set',
    category: 'Accessories',
    type: 'EVERGREEN',
    sentiment: 'positive',
    price: 12,
    rating: 4.5,
    reviews: 64,
    score: 76,
    visualTags: ['cable', 'organizer', 'desk', 'accessory'],
    color: '#14b8a6'
  },
  {
    id: 15,
    title: 'AromaDiffuser 300 — Mist + Light',
    category: 'Home',
    type: 'TRENDY',
    sentiment: 'positive',
    price: 31,
    rating: 4.4,
    reviews: 96,
    score: 82,
    visualTags: ['diffuser', 'home', 'mist', 'light'],
    color: '#a855f7'
  },
  {
    id: 16,
    title: 'WinterCap Thermal Gloves',
    category: 'Fashion',
    type: 'SEASONAL',
    sentiment: 'neutral',
    price: 17.5,
    rating: 4.1,
    reviews: 28,
    score: 69,
    visualTags: ['gloves', 'winter', 'fashion', 'warm'],
    color: '#f97316'
  },
  {
    id: 17,
    title: 'OldSchool Mouse Pad Deluxe',
    category: 'Office',
    type: 'FADE',
    sentiment: 'negative',
    price: 8,
    rating: 3.8,
    reviews: 12,
    score: 55,
    visualTags: ['mousepad', 'office', 'desktop', 'old'],
    color: '#64748b'
  },
  {
    id: 18,
    title: 'FreshServe Glass Container Set',
    category: 'Kitchen',
    type: 'WINNING',
    sentiment: 'positive',
    price: 27,
    rating: 4.7,
    reviews: 134,
    score: 87,
    visualTags: ['glass', 'container', 'kitchen', 'storage'],
    color: '#22c55e'
  },
  {
    id: 19,
    title: 'QuietBuds Basic Wireless Earbuds',
    category: 'Electronics',
    type: 'FADE',
    sentiment: 'negative',
    price: 22,
    rating: 3.7,
    reviews: 19,
    score: 58,
    visualTags: ['earbuds', 'audio', 'wireless', 'tech'],
    color: '#ef4444'
  },
  {
    id: 20,
    title: 'ComfyChair Cushion Memory Foam',
    category: 'Home',
    type: 'EVERGREEN',
    sentiment: 'positive',
    price: 41,
    rating: 4.6,
    reviews: 88,
    score: 84,
    visualTags: ['chair', 'cushion', 'home', 'comfort'],
    color: '#0f766e'
  },
  {
    id: 21,
    title: 'GardenSpray Nozzle — 8 Pattern',
    category: 'Outdoor',
    type: 'WINNING',
    sentiment: 'positive',
    price: 14,
    rating: 4.8,
    reviews: 211,
    score: 91,
    visualTags: ['garden', 'spray', 'water', 'outdoor'],
    color: '#16a34a'
  },
  {
    id: 22,
    title: 'StorageBox Foldable Fabric Bin',
    category: 'Home',
    type: 'SEASONAL',
    sentiment: 'neutral',
    price: 16,
    rating: 4.2,
    reviews: 39,
    score: 71,
    visualTags: ['box', 'storage', 'home', 'fabric'],
    color: '#c084fc'
  },
  {
    id: 23,
    title: 'RustyTool Multi-Purpose Wrench Set',
    category: 'Tools',
    type: 'DYING',
    sentiment: 'negative',
    price: 25,
    rating: 3.6,
    reviews: 9,
    score: 49,
    visualTags: ['tool', 'wrench', 'metal', 'repair'],
    color: '#94a3b8'
  },
  {
    id: 24,
    title: 'MellowLight Bedroom Night Lamp',
    category: 'Home',
    type: 'WINNING',
    sentiment: 'positive',
    price: 28,
    rating: 4.7,
    reviews: 173,
    score: 89,
    visualTags: ['lamp', 'bedroom', 'light', 'home'],
    color: '#6366f1'
  }
];

const CATEGORY_OPTIONS = Array.from(new Set(PRODUCTS.map((p) => p.category))).sort();
const TYPE_OPTIONS: ProductType[] = ['TRENDY', 'EVERGREEN', 'SEASONAL', 'WINNING', 'FADE', 'DYING'];
const SENTIMENT_OPTIONS: Sentiment[] = ['positive', 'neutral', 'negative'];

const INITIAL_FILTERS: Filters = {
  text: '',
  categories: [],
  types: [],
  sentiments: [],
  minPrice: '',
  maxPrice: '',
  minRating: 0,
  imageFile: null,
  imagePreview: null
};

function toTitle(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function fmtPrice(value: number) {
  return `$${value.toFixed(2)}`;
}

function fmtNumber(v: number) {
  return v >= 1000 ? `${(v / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}k` : `${v}`;
}

function SoftPill({
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
    rose:
      'bg-rose-50 text-rose-700 ring-1 ring-rose-200/70 dark:bg-rose-900/25 dark:text-rose-200 dark:ring-rose-900/40',
    slate:
      'bg-slate-100 text-slate-700 ring-1 ring-slate-200/70 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700'
  };

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${map[tone]}`}>
      {children}
    </span>
  );
}

function SectionCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <Card className={`rounded-[28px] border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950/60 ${className}`}>
      {children}
    </Card>
  );
}

function ToggleChip({
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
  const base = 'inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium transition-all';
  const activeMap: Record<string, string> = {
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/25 dark:text-emerald-200',
    indigo: 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-900/25 dark:text-indigo-200',
    amber: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-900/25 dark:text-amber-200',
    rose: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-900/25 dark:text-rose-200',
    slate: 'border-slate-200 bg-slate-100 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50'
  };
  const inactive = 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-900';

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${active ? activeMap[tone] : inactive} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
    >
      {label}
    </button>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group overflow-hidden rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950/60">
      <div className="flex gap-4">
        <div
          className="relative h-28 w-28 shrink-0 overflow-hidden rounded-3xl"
          style={{
            background: `radial-gradient(circle at 20% 20%, ${product.color}50, transparent 40%), linear-gradient(160deg, ${product.color}dd 0%, #0f172a 100%)`
          }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.18)_0%,transparent_35%,transparent_65%,rgba(255,255,255,0.08)_100%)]" />
          <div className="absolute inset-x-3 bottom-3">
            <SoftPill tone="slate">#{product.id}</SoftPill>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <SoftPill tone="indigo">{product.category}</SoftPill>
            <SoftPill tone={product.type === 'WINNING' ? 'emerald' : product.type === 'DYING' || product.type === 'FADE' ? 'rose' : 'amber'}>
              {product.type}
            </SoftPill>
            <SoftPill tone={product.sentiment === 'positive' ? 'emerald' : product.sentiment === 'neutral' ? 'amber' : 'rose'}>
              {toTitle(product.sentiment)}
            </SoftPill>
          </div>

          <h3 className="mt-3 line-clamp-2 text-lg font-semibold tracking-tight text-slate-950 dark:text-white">
            {product.title}
          </h3>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Price</div>
              <div className="mt-1 text-base font-semibold text-slate-950 dark:text-white">{fmtPrice(product.price)}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Rating</div>
              <div className="mt-1 flex items-center gap-2 text-base font-semibold text-slate-950 dark:text-white">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {product.rating.toFixed(1)} / 5
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <SoftPill tone="slate">{fmtNumber(product.reviews)} reviews</SoftPill>
            <SoftPill tone="indigo">Score {product.score}</SoftPill>
            {product.visualTags.slice(0, 3).map((tag) => (
              <SoftPill key={tag} tone="slate">
                {tag}
              </SoftPill>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function matchImageKeywords(file: File) {
  const name = file.name.toLowerCase().replace(/\.[^.]+$/, '');
  return name
    .split(/[^a-z0-9]+/)
    .map((w) => w.trim())
    .filter(Boolean);
}

function filterProducts(products: Product[], filters: Filters) {
  const minPrice = filters.minPrice === '' ? null : Number(filters.minPrice);
  const maxPrice = filters.maxPrice === '' ? null : Number(filters.maxPrice);

  if (filters.imageFile) {
    const keywords = matchImageKeywords(filters.imageFile);

    const scored = products
      .map((product) => {
        const haystack = [
          product.title.toLowerCase(),
          product.category.toLowerCase(),
          product.type.toLowerCase(),
          ...product.visualTags.map((t) => t.toLowerCase())
        ].join(' ');

        let score = 0;
        for (const keyword of keywords) {
          if (!keyword) continue;
          if (haystack.includes(keyword)) score += 3;
          for (const tag of product.visualTags) {
            if (tag.toLowerCase().includes(keyword) || keyword.includes(tag.toLowerCase())) {
              score += 2;
            }
          }
        }

        if (score === 0) score = product.score / 20;
        return { product, score };
      })
      .sort((a, b) => b.score - a.score);

    return scored.map((item) => item.product);
  }

  return products.filter((product) => {
    if (filters.text) {
      const q = filters.text.toLowerCase().trim();
      const haystack = [product.title, product.category, product.type, ...product.visualTags].join(' ').toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    if (filters.categories.length > 0 && !filters.categories.includes(product.category)) return false;
    if (filters.types.length > 0 && !filters.types.includes(product.type)) return false;
    if (filters.sentiments.length > 0 && !filters.sentiments.includes(product.sentiment)) return false;

    if (minPrice !== null && !Number.isNaN(minPrice) && product.price < minPrice) return false;
    if (maxPrice !== null && !Number.isNaN(maxPrice) && product.price > maxPrice) return false;
    if (product.rating < filters.minRating) return false;

    return true;
  });
}

export default function ProductSearchPage() {
  const [draft, setDraft] = useState<Filters>(INITIAL_FILTERS);
  const [applied, setApplied] = useState<Filters>(INITIAL_FILTERS);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [page, setPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pageSize = 8;

  const isImageMode = Boolean(draft.imageFile);
  const canUseNormalFilters = !isImageMode;

  const results = useMemo(() => {
    if (!hasSubmitted) return [];
    return filterProducts(PRODUCTS, applied);
  }, [applied, hasSubmitted]);

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
        [key]: exists ? current.filter((item) => item !== value) : [...current, value]
      };
    });
  }

  function handleImageChange(file: File | null) {
    setDraft((prev) => {
      if (!file) {
        if (prev.imagePreview) URL.revokeObjectURL(prev.imagePreview);
        return { ...prev, imageFile: null, imagePreview: null };
      }

      if (prev.imagePreview) URL.revokeObjectURL(prev.imagePreview);
      return {
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      };
    });
  }

  function clearAll() {
    if (draft.imagePreview) URL.revokeObjectURL(draft.imagePreview);
    setDraft(INITIAL_FILTERS);
    setApplied(INITIAL_FILTERS);
    setHasSubmitted(false);
    setPage(1);
  }

  function submitSearch(e?: React.FormEvent) {
    e?.preventDefault();
    setIsSubmitting(true);
    window.setTimeout(() => {
      setApplied(draft);
      setHasSubmitted(true);
      setPage(1);
      setIsSubmitting(false);
    }, 150);
  }

  const firstIndex = totalResults === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastIndex = Math.min(page * pageSize, totalResults);

  return (
    <PageContainer>
      <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="pointer-events-none absolute inset-0 opacity-80">
          <div className="absolute left-[-8rem] top-[-8rem] h-[28rem] w-[28rem] rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-500/10" />
          <div className="absolute right-[-8rem] top-[10rem] h-[22rem] w-[22rem] rounded-full bg-emerald-200/20 blur-3xl dark:bg-emerald-500/10" />
        </div>

        <div className="relative mx-auto w-full max-w-[1680px] px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <Button asChild variant="ghost" className="h-9 w-fit px-2 text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white">
                <Link href="/dashboard/product">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Link>
              </Button>

              <div className="flex flex-wrap items-center gap-2">
                <SoftPill tone="indigo">Advanced search</SoftPill>
                <SoftPill tone="slate">Multi-filter</SoftPill>
                <SoftPill tone="emerald">Paginated results</SoftPill>
              </div>

              <h1 className="max-w-5xl text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Product Research Console
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                Search by category, price range, type, title text, sentiment, rating, or image.
                When image search is active, all other filters are locked to keep the interaction clean and predictable.
              </p>
            </div>
          </div>

          <form onSubmit={submitSearch} className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <SectionCard>
              <CardHeader className="pb-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <CardTitle className="text-xl">Search filters</CardTitle>
                    <CardDescription>
                      Build a query first, then submit to show the product list.
                    </CardDescription>
                  </div>
                  <SoftPill tone={isImageMode ? 'amber' : 'indigo'}>
                    {isImageMode ? 'Image search mode' : 'Attribute search mode'}
                  </SoftPill>
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className={`rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50 ${!canUseNormalFilters ? 'opacity-50' : ''}`}>
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                    <Search className="h-4 w-4 text-indigo-500" />
                    Search by title or text
                  </div>
                  <Input
                    value={draft.text}
                    onChange={(e) => setDraft((prev) => ({ ...prev, text: e.target.value }))}
                    placeholder="Type product title, keyword, category, or tag"
                    disabled={!canUseNormalFilters}
                    className="h-11 rounded-2xl"
                  />
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  <div className={`rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50 ${!canUseNormalFilters ? 'opacity-50' : ''}`}>
                    <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                      <Filter className="h-4 w-4 text-indigo-500" />
                      Search by multiple category
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORY_OPTIONS.map((category) => {
                        const active = draft.categories.includes(category);
                        return (
                          <ToggleChip
                            key={category}
                            label={category}
                            active={active}
                            disabled={!canUseNormalFilters}
                            onClick={() => toggleArray(category, 'categories')}
                            tone={active ? 'indigo' : 'slate'}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <div className={`rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50 ${!canUseNormalFilters ? 'opacity-50' : ''}`}>
                    <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                      <Tag className="h-4 w-4 text-indigo-500" />
                      Search by type
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {TYPE_OPTIONS.map((type) => {
                        const active = draft.types.includes(type);
                        const tone = type === 'WINNING' ? 'emerald' : type === 'DYING' || type === 'FADE' ? 'rose' : 'amber';
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

                <div className="grid gap-5 lg:grid-cols-2">
                  <div className={`rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50 ${!canUseNormalFilters ? 'opacity-50' : ''}`}>
                    <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                      <Sparkles className="h-4 w-4 text-indigo-500" />
                      Search by sentiment
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {SENTIMENT_OPTIONS.map((sentiment) => {
                        const active = draft.sentiments.includes(sentiment);
                        const tone = sentiment === 'positive' ? 'emerald' : sentiment === 'neutral' ? 'amber' : 'rose';
                        return (
                          <ToggleChip
                            key={sentiment}
                            label={toTitle(sentiment)}
                            active={active}
                            disabled={!canUseNormalFilters}
                            onClick={() => toggleArray(sentiment, 'sentiments')}
                            tone={tone}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <div className={`rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50 ${!canUseNormalFilters ? 'opacity-50' : ''}`}>
                    <div className="mb-3 flex items-center justify-between gap-3 text-sm font-medium text-slate-900 dark:text-slate-100">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-amber-500" />
                        Search by rating
                      </div>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        {draft.minRating.toFixed(1)}+
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={5}
                      step={0.1}
                      value={draft.minRating}
                      disabled={!canUseNormalFilters}
                      onChange={(e) => setDraft((prev) => ({ ...prev, minRating: Number(e.target.value) }))}
                      className="w-full accent-slate-900 dark:accent-white"
                    />
                    <div className="mt-2 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>0</span>
                      <span>2.5</span>
                      <span>5</span>
                    </div>
                  </div>
                </div>

                <div className={`rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50 ${!canUseNormalFilters ? 'opacity-50' : ''}`}>
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                    <SlidersHorizontal className="h-4 w-4 text-indigo-500" />
                    Search by price range
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Min price</label>
                      <Input
                        type="number"
                        inputMode="decimal"
                        value={draft.minPrice}
                        disabled={!canUseNormalFilters}
                        onChange={(e) => setDraft((prev) => ({ ...prev, minPrice: e.target.value }))}
                        placeholder="0"
                        className="h-11 rounded-2xl"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Max price</label>
                      <Input
                        type="number"
                        inputMode="decimal"
                        value={draft.maxPrice}
                        disabled={!canUseNormalFilters}
                        onChange={(e) => setDraft((prev) => ({ ...prev, maxPrice: e.target.value }))}
                        placeholder="999"
                        className="h-11 rounded-2xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <SoftPill tone="indigo">Categories: {draft.categories.length}</SoftPill>
                  <SoftPill tone="amber">Types: {draft.types.length}</SoftPill>
                  <SoftPill tone="rose">Sentiments: {draft.sentiments.length}</SoftPill>
                  <SoftPill tone="emerald">Rating: {draft.minRating.toFixed(1)}+</SoftPill>
                </div>

                <div className="mt-2 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                      Fill the filters above, then press <span className="font-semibold text-slate-950 dark:text-white">Submit Search</span> to render paginated results.
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" variant="outline" className="gap-2 rounded-2xl" onClick={clearAll}>
                        <Trash2 className="h-4 w-4" />
                        Reset
                      </Button>
                      <Button type="submit" className="gap-2 rounded-2xl bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                        Submit Search
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </SectionCard>

            <SectionCard>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Image search</CardTitle>
                <CardDescription>
                  Upload one image to switch the page into image-only mode.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className="block cursor-pointer">
                  <div className="rounded-[24px] border-2 border-dashed border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 text-center transition-colors hover:border-slate-300 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900 dark:hover:border-slate-700">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                      <UploadCloud className="h-7 w-7" />
                    </div>
                    <div className="mt-4 text-base font-semibold text-slate-950 dark:text-white">Drop image or click to upload</div>
                    <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      When an image is selected, other filters are locked.
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
                    />
                  </div>
                </label>

                {draft.imagePreview ? (
                  <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                        <ImageIcon className="h-4 w-4 text-indigo-500" />
                        Image mode active
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-white"
                        onClick={() => handleImageChange(null)}
                      >
                        <X className="mr-1 h-4 w-4" />
                        Clear
                      </Button>
                    </div>
                    <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={draft.imagePreview} alt="Uploaded preview" className="h-56 w-full object-cover" />
                    </div>
                    <div className="rounded-2xl bg-amber-50 p-3 text-sm leading-6 text-amber-800 ring-1 ring-amber-200/60 dark:bg-amber-900/20 dark:text-amber-200 dark:ring-amber-900/40">
                      In this mode, category, price, type, text, sentiment, and rating filters are disabled.
                      The demo search uses filename keywords to rank products. Replace that branch with your real vision / vector search API.
                    </div>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
                    Uploading an image is optional. For regular search, submit the attribute filters above.
                  </div>
                )}

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50">
                    <div className="text-xs font-medium tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400">
                      Search mode
                    </div>
                    <div className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">
                      {isImageMode ? 'Image only' : 'Attribute based'}
                    </div>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50">
                    <div className="text-xs font-medium tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400">
                      Ready state
                    </div>
                    <div className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">
                      {isImageMode ? 'Locked filters' : 'Editable filters'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </SectionCard>
          </form>

          <SectionCard className="mt-6">
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <CardTitle className="text-xl">Results</CardTitle>
                  <CardDescription>
                    Submitted search results are shown here in a paginated list.
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <SoftPill tone="indigo">Matches {hasSubmitted ? totalResults : 0}</SoftPill>
                  <SoftPill tone="slate">Active filters {hasSubmitted ? activeFilterCount : 0}</SoftPill>
                  <SoftPill tone="emerald">Page {hasSubmitted ? page : 0} / {hasSubmitted ? totalPages : 0}</SoftPill>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {!hasSubmitted ? (
                <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-800 dark:bg-slate-900/60">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                    <Search className="h-6 w-6" />
                  </div>
                  <div className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">No search submitted yet</div>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    Set your filters and click Submit Search to render the product list.
                  </p>
                </div>
              ) : applied.imageFile || activeFilterCount > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {applied.text ? <SoftPill tone="indigo">Text: {applied.text}</SoftPill> : null}
                  {applied.minPrice !== '' || applied.maxPrice !== '' ? (
                    <SoftPill tone="amber">
                      Price: {applied.minPrice || '0'} - {applied.maxPrice || '∞'}
                    </SoftPill>
                  ) : null}
                  {applied.categories.map((item) => (
                    <SoftPill key={item} tone="slate">
                      {item}
                    </SoftPill>
                  ))}
                  {applied.types.map((item) => (
                    <SoftPill key={item} tone={item === 'WINNING' ? 'emerald' : item === 'DYING' || item === 'FADE' ? 'rose' : 'amber'}>
                      {item}
                    </SoftPill>
                  ))}
                  {applied.sentiments.map((item) => (
                    <SoftPill key={item} tone={item === 'positive' ? 'emerald' : item === 'neutral' ? 'amber' : 'rose'}>
                      {toTitle(item)}
                    </SoftPill>
                  ))}
                  {applied.minRating > 0 ? <SoftPill tone="emerald">Rating {applied.minRating.toFixed(1)}+</SoftPill> : null}
                  {applied.imageFile ? <SoftPill tone="indigo">Image: {applied.imageFile.name}</SoftPill> : null}
                </div>
              ) : null}

              {hasSubmitted && totalResults === 0 ? (
                <div className="rounded-[24px] border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-950/60">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                    <Search className="h-6 w-6" />
                  </div>
                  <div className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">No products matched</div>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    Relax one or more filters, or clear the image search mode and try again.
                  </p>
                </div>
              ) : hasSubmitted ? (
                <>
                  <div className="grid gap-4 lg:grid-cols-2">
                    {paginatedResults.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Showing <span className="font-semibold text-slate-950 dark:text-white">{firstIndex}</span> to{' '}
                      <span className="font-semibold text-slate-950 dark:text-white">{lastIndex}</span> of{' '}
                      <span className="font-semibold text-slate-950 dark:text-white">{totalResults}</span> results.
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="gap-2 rounded-2xl"
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Prev
                      </Button>

                      <div className="hidden items-center gap-1 md:flex">
                        {Array.from({ length: totalPages }, (_, idx) => idx + 1)
                          .slice(Math.max(0, page - 2), Math.min(totalPages, page + 1))
                          .map((p) => (
                            <Button
                              key={p}
                              type="button"
                              variant={p === page ? 'default' : 'outline'}
                              className={`h-10 w-10 rounded-2xl ${p === page ? 'bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200' : ''}`}
                              onClick={() => setPage(p)}
                            >
                              {p}
                            </Button>
                          ))}
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        className="gap-2 rounded-2xl"
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : null}
            </CardContent>
          </SectionCard>
        </div>
      </div>
    </PageContainer>
  );
}
