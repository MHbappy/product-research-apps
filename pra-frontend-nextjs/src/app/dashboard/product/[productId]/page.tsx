'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  BadgeInfo,
  BarChart3,
  Eye,
  Heart,
  Sparkles,
  Star,
  TrendingUp,
  Activity,
  ShieldCheck,
  ArrowUpRight,
  Layers3,
  LineChart as LineChartIcon,
  Gauge
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PageContainer from '@/components/layout/page-container';

type Lifecycle = 'trendy' | 'evergreen' | 'seasonal' | 'fade' | 'winning';
type Tone = 'emerald' | 'indigo' | 'amber' | 'rose' | 'slate';

type Product = {
  id: number;
  name: string;
  category: string;
  price?: number;
  rating?: number;
  reviews?: number;
  demand: number;
  competition: number;
  score: number;
  quality: number;
  lifecycle?: Lifecycle;
  color?: string;
  imageUrl?: string | null;
};

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Self Watering Flowerpot Self-Absorbent Automatic Water-Absorbing Basin Green Plant Pot',
    category: 'Home',
    price: 49.99,
    rating: 4.6,
    reviews: 124000,
    demand: 5400,
    competition: 12,
    score: 86,
    quality: 88,
    lifecycle: 'evergreen',
    color: '#8b5cf6'
  },
  {
    id: 2,
    name: 'EcoBottle — Reusable Thermal Bottle, 750ml',
    category: 'Outdoors',
    price: 19.9,
    rating: 4.4,
    reviews: 89,
    demand: 4200,
    competition: 6,
    score: 78,
    quality: 74,
    lifecycle: 'trendy',
    color: '#06b6d4'
  },
  {
    id: 3,
    name: 'SmartLamp Pro (Touch + App Control)',
    category: 'Electronics',
    price: 79,
    rating: 4.8,
    reviews: 230,
    demand: 7800,
    competition: 28,
    score: 92,
    quality: 91,
    lifecycle: 'winning',
    color: '#f59e0b'
  },
  {
    id: 4,
    name: 'KitchenPro Pan — Non-stick Series (28cm)',
    category: 'Kitchen',
    price: 34.5,
    rating: 4.3,
    reviews: 76,
    demand: 3000,
    competition: 18,
    score: 70,
    quality: 68,
    lifecycle: 'seasonal',
    color: '#10b981'
  },
  {
    id: 5,
    name: 'MiniDrone X200 — Foldable Drone with HD Camera',
    category: 'Electronics',
    price: 129.99,
    rating: 4.2,
    reviews: 310,
    demand: 9200,
    competition: 45,
    score: 66,
    quality: 62,
    lifecycle: 'fade',
    color: '#ef4444'
  },
  {
    id: 6,
    name: 'YogaMat Plus — Extra Grip, 6mm',
    category: 'Sports',
    price: 29,
    rating: 4.5,
    reviews: 101,
    demand: 2500,
    competition: 8,
    score: 74,
    quality: 79,
    lifecycle: 'evergreen',
    color: '#7c3aed'
  },
  {
    id: 7,
    name: 'PetGroom Kit — 7-in-1 Grooming Set',
    category: 'Pet',
    price: 24,
    rating: 4.1,
    reviews: 45,
    demand: 3800,
    competition: 4,
    score: 72,
    quality: 70,
    lifecycle: 'trendy',
    color: '#fb923c'
  },
  {
    id: 8,
    name: 'GardenLight Solar — Auto On/Off',
    category: 'Outdoor',
    price: 22,
    rating: 4.7,
    reviews: 94,
    demand: 4800,
    competition: 11,
    score: 81,
    quality: 85,
    lifecycle: 'winning',
    color: '#06b6d4'
  },
  {
    id: 9,
    name: 'PhoneGrip — 360 Rotating Stand',
    category: 'Accessories',
    price: 9.99,
    rating: 3.9,
    reviews: 18,
    demand: 1500,
    competition: 30,
    score: 60,
    quality: 58,
    lifecycle: 'fade',
    color: '#4f46e5'
  },
  {
    id: 10,
    name: 'ThermoBottle — Insulated Flask 500ml',
    category: 'Outdoors',
    price: 39,
    rating: 4.6,
    reviews: 210,
    demand: 6600,
    competition: 9,
    score: 88,
    quality: 90,
    lifecycle: 'evergreen',
    color: '#10b981'
  },
  {
    id: 11,
    name: 'BabyToys X — Soft Learning Toys',
    category: 'Toys',
    price: 15.5,
    rating: 4.0,
    reviews: 54,
    demand: 5200,
    competition: 20,
    score: 73,
    quality: 72,
    lifecycle: 'seasonal',
    color: '#f59e0b'
  },
  {
    id: 12,
    name: 'OutdoorTarp — Heavy Duty 3x4m',
    category: 'Outdoor',
    price: 18,
    rating: 4.2,
    reviews: 33,
    demand: 2100,
    competition: 3,
    score: 68,
    quality: 66,
    lifecycle: 'trendy',
    color: '#7c3aed'
  }
];

const SENTIMENT_TREND = [
  { month: '2025-01', positive: 42, neutral: 18, negative: 10 },
  { month: '2025-02', positive: 48, neutral: 16, negative: 12 },
  { month: '2025-03', positive: 55, neutral: 14, negative: 9 },
  { month: '2025-04', positive: 50, neutral: 17, negative: 11 },
  { month: '2025-05', positive: 61, neutral: 15, negative: 8 },
  { month: '2025-06', positive: 58, neutral: 19, negative: 13 },
  { month: '2025-07', positive: 67, neutral: 12, negative: 7 },
  { month: '2025-08', positive: 63, neutral: 14, negative: 9 },
  { month: '2025-09', positive: 70, neutral: 13, negative: 6 },
  { month: '2025-10', positive: 74, neutral: 11, negative: 5 },
  { month: '2025-11', positive: 69, neutral: 15, negative: 8 },
  { month: '2025-12', positive: 77, neutral: 10, negative: 6 }
];

const STAR_DISTRIBUTION = [
  { star: '5★', count: 128 },
  { star: '4★', count: 54 },
  { star: '3★', count: 26 },
  { star: '2★', count: 14 },
  { star: '1★', count: 8 }
];

const STABILITY_DIAGNOSTIC = [
  {
    month: '2025-01',
    ewma_6m: 4.12,
    slope_12: 0.04,
    last_spike_z: 0.3,
    cv_12: 0.18
  },
  {
    month: '2025-02',
    ewma_6m: 4.14,
    slope_12: 0.05,
    last_spike_z: 0.1,
    cv_12: 0.17
  },
  {
    month: '2025-03',
    ewma_6m: 4.17,
    slope_12: 0.06,
    last_spike_z: -0.2,
    cv_12: 0.16
  },
  {
    month: '2025-04',
    ewma_6m: 4.15,
    slope_12: 0.03,
    last_spike_z: 0.4,
    cv_12: 0.19
  },
  {
    month: '2025-05',
    ewma_6m: 4.19,
    slope_12: 0.07,
    last_spike_z: 1.1,
    cv_12: 0.15
  },
  {
    month: '2025-06',
    ewma_6m: 4.21,
    slope_12: 0.08,
    last_spike_z: 0.6,
    cv_12: 0.14
  },
  {
    month: '2025-07',
    ewma_6m: 4.24,
    slope_12: 0.09,
    last_spike_z: 0.2,
    cv_12: 0.13
  },
  {
    month: '2025-08',
    ewma_6m: 4.23,
    slope_12: 0.07,
    last_spike_z: -0.1,
    cv_12: 0.14
  },
  {
    month: '2025-09',
    ewma_6m: 4.26,
    slope_12: 0.1,
    last_spike_z: 0.8,
    cv_12: 0.12
  },
  {
    month: '2025-10',
    ewma_6m: 4.28,
    slope_12: 0.11,
    last_spike_z: 1.4,
    cv_12: 0.11
  },
  {
    month: '2025-11',
    ewma_6m: 4.27,
    slope_12: 0.1,
    last_spike_z: 0.5,
    cv_12: 0.12
  },
  {
    month: '2025-12',
    ewma_6m: 4.31,
    slope_12: 0.12,
    last_spike_z: 0.9,
    cv_12: 0.1
  }
];

function fmtMonth(month: string) {
  const [year, mm] = month.split('-');
  const date = new Date(Number(year), Number(mm) - 1, 1);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric'
  }).format(date);
}

function fmtNumber(v: number) {
  return v >= 1000
    ? `${(v / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}k`
    : `${v}`;
}

function fmtCompact(v: number, digits = 2) {
  return Number(v).toFixed(digits);
}

function getToneClass(kind: Tone) {
  const map: Record<Tone, string> = {
    emerald:
      'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/70 dark:bg-emerald-900/25 dark:text-emerald-200 dark:ring-emerald-900/40',
    indigo:
      'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200/70 dark:bg-indigo-900/25 dark:text-indigo-200 dark:ring-indigo-900/40',
    amber:
      'bg-amber-50 text-amber-700 ring-1 ring-amber-200/70 dark:bg-amber-900/25 dark:text-amber-200 dark:ring-amber-900/40',
    rose: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200/70 dark:bg-rose-900/25 dark:text-rose-200 dark:ring-rose-900/40',
    slate:
      'bg-slate-100 text-slate-700 ring-1 ring-slate-200/70 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700'
  };
  return map[kind];
}

function toneAccentClass(accent: Tone) {
  return accent === 'emerald'
    ? 'from-emerald-400 via-emerald-500 to-teal-400'
    : accent === 'amber'
      ? 'from-amber-400 via-orange-400 to-amber-500'
      : accent === 'rose'
        ? 'from-rose-400 via-pink-400 to-rose-500'
        : accent === 'slate'
          ? 'from-slate-400 via-slate-500 to-slate-400'
          : 'from-indigo-400 via-violet-500 to-indigo-400';
}

function toneGlowClass(tone: Tone) {
  return tone === 'emerald'
    ? 'bg-emerald-300/20'
    : tone === 'amber'
      ? 'bg-amber-300/20'
      : tone === 'rose'
        ? 'bg-rose-300/20'
        : tone === 'slate'
          ? 'bg-slate-300/20'
          : 'bg-indigo-300/20';
}

function SoftPill({
  children,
  tone = 'slate'
}: {
  children: React.ReactNode;
  tone?: Tone;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getToneClass(
        tone
      )}`}
    >
      {children}
    </span>
  );
}

function MiniStat({
  label,
  value,
  caption,
  icon,
  tone = 'indigo'
}: {
  label: string;
  value: string;
  caption?: string;
  icon: React.ReactNode;
  tone?: Tone;
}) {
  return (
    <div className='relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4 shadow-sm transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:from-slate-950 dark:to-slate-900'>
      <div
        className={`absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full blur-2xl ${toneGlowClass(
          tone
        )}`}
      />
      <div className='relative'>
        <div className='flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400'>
          <span className='inline-flex h-8 w-8 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200'>
            {icon}
          </span>
          {label}
        </div>

        <div className='mt-3 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white'>
          {value}
        </div>

        {caption ? (
          <div className='mt-1 text-sm leading-5 text-slate-600 dark:text-slate-400'>
            {caption}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  hint,
  accent = 'indigo'
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  hint?: string;
  accent?: Tone;
}) {
  return (
    <div className='group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950/60'>
      <div
        className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${toneAccentClass(accent)}`}
      />
      <div className='flex items-start gap-3'>
        <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'>
          {icon}
        </div>

        <div className='min-w-0'>
          <div className='text-[11px] font-medium tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400'>
            {label}
          </div>
          <div className='mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white'>
            {value}
          </div>
          {hint ? (
            <div className='mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400'>
              {hint}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ChartTooltip({
  active,
  label,
  payload,
  formatter
}: {
  active?: boolean;
  label?: string | number;
  payload?: Array<{ name?: string; value?: number; color?: string }>;
  formatter?: (name: string, value: number) => [string, string?];
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className='rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-950/95'>
      <div className='text-sm font-semibold text-slate-950 dark:text-white'>
        {typeof label === 'string' ? label : ''}
      </div>
      <div className='mt-2 space-y-1'>
        {payload.map((item, idx) => {
          const name = item.name ?? `Series ${idx + 1}`;
          const value = item.value ?? 0;
          const [v, unit] = formatter
            ? formatter(name, value)
            : [String(value), ''];

          return (
            <div
              key={`${name}-${idx}`}
              className='flex items-center justify-between gap-6 text-sm'
            >
              <div className='flex items-center gap-2 text-slate-600 dark:text-slate-400'>
                <span
                  className='h-2.5 w-2.5 rounded-full'
                  style={{ backgroundColor: item.color ?? '#6366f1' }}
                />
                <span>{name}</span>
              </div>
              <div className='font-medium text-slate-950 dark:text-white'>
                {v}
                {unit ? <span className='text-slate-500'> {unit}</span> : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ProductDetailsPage() {
  const params = useParams<{ id?: string | string[] }>();
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const productId = Number(rawId ?? 1);

  const product = useMemo(() => {
    if (!Number.isFinite(productId)) return undefined;
    return PRODUCTS.find((item) => item.id === productId);
  }, [productId]);

  const sentimentSummary = useMemo(() => {
    const latest = SENTIMENT_TREND[SENTIMENT_TREND.length - 1];
    const total = latest.positive + latest.neutral + latest.negative;

    return {
      latest,
      total,
      positiveShare: (latest.positive / total) * 100,
      neutralShare: (latest.neutral / total) * 100,
      negativeShare: (latest.negative / total) * 100
    };
  }, []);

  const starSummary = useMemo(() => {
    const total = STAR_DISTRIBUTION.reduce((sum, item) => sum + item.count, 0);
    const top =
      STAR_DISTRIBUTION.find((item) => item.star === '5★')?.count ?? 0;

    return {
      total,
      topShare: (top / total) * 100
    };
  }, []);

  const latestStability = STABILITY_DIAGNOSTIC[STABILITY_DIAGNOSTIC.length - 1];

  const stabilityVerdict = useMemo(() => {
    if (latestStability.slope_12 >= 0.1 && latestStability.cv_12 <= 0.12) {
      return {
        label: 'Strong momentum',
        tone: 'emerald' as const,
        description: 'Fast upward movement with controlled volatility.'
      };
    }

    if (latestStability.slope_12 >= 0.06) {
      return {
        label: 'Healthy trend',
        tone: 'indigo' as const,
        description: 'Steady movement with low-to-moderate variation.'
      };
    }

    return {
      label: 'Needs review',
      tone: 'amber' as const,
      description: 'Trend is not yet strong enough for a confident call.'
    };
  }, [latestStability.cv_12, latestStability.slope_12]);

  if (!product) {
    return (
      <div className='min-h-screen overflow-y-auto bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-10 dark:bg-slate-950 dark:text-slate-100'>
        <div className='mx-auto flex min-h-[70vh] max-w-3xl items-center'>
          <Card className='w-full border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900'>
            <CardHeader>
              <CardTitle>Product not found</CardTitle>
              <CardDescription>
                The product id is missing or does not match any product in the
                catalog.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant='outline'>
                <Link href='/dashboard/product'>
                  <ArrowLeft className='mr-2 h-4 w-4' />
                  Back to products
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const totalRisk =
    product.competition >= 25
      ? 'High competition'
      : product.competition >= 10
        ? 'Moderate competition'
        : 'Low competition';

  const opportunity =
    product.score >= 85
      ? 'Top opportunity'
      : product.score >= 70
        ? 'Good opportunity'
        : 'Observe carefully';

  const ratingText = `${fmtCompact(product.rating ?? 0, 1)} / 5`;
  const reviewText = fmtNumber(product.reviews ?? 0);
  const lifecycleText = product.lifecycle
    ? product.lifecycle.charAt(0).toUpperCase() + product.lifecycle.slice(1)
    : 'N/A';

  const momentumDirection =
    latestStability.slope_12 > 0.08
      ? 'Rising'
      : latestStability.slope_12 > 0.05
        ? 'Stable up'
        : 'Flat';

  const accent = product.color ?? '#6366f1';

  return (
    <PageContainer>
      <div className='relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100'>
        <div className='pointer-events-none absolute inset-0 opacity-80'>
          <div className='absolute top-[-8rem] left-[-8rem] h-[28rem] w-[28rem] rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-500/10' />
          <div className='absolute top-[10rem] right-[-8rem] h-[22rem] w-[22rem] rounded-full bg-emerald-200/20 blur-3xl dark:bg-emerald-500/10' />
        </div>

        <div className='relative mx-auto w-full max-w-[1680px] px-4 py-6 sm:px-6 lg:px-8'>
          {/* Header */}
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
                <SoftPill tone='indigo'>#{product.id}</SoftPill>
                <SoftPill tone='slate'>{product.category}</SoftPill>
                <SoftPill tone='emerald'>{lifecycleText}</SoftPill>
                <SoftPill tone='amber'>{opportunity}</SoftPill>
              </div>

              <h1 className='max-w-5xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white'>
                {product.name}
              </h1>

              <p className='max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400'>
                A cleaner product intelligence view with stronger hierarchy,
                wider use of space, and metric cards that stay readable instead
                of collapsing on larger screens.
              </p>
            </div>

            <div className='flex flex-wrap gap-2'>
              <Button variant='outline' className='gap-2 rounded-2xl'>
                <Heart className='h-4 w-4' />
                Save
              </Button>
              <Button className='gap-2 rounded-2xl bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200'>
                <Eye className='h-4 w-4' />
                Preview
              </Button>
            </div>
          </div>

          {/* Hero */}
          <div className='grid gap-6 xl:grid-cols-[1.08fr_0.92fr]'>
            <Card className='overflow-hidden rounded-[28px] border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950/60'>
              <CardContent className='p-0'>
                <div className='grid lg:grid-cols-[360px_minmax(0,1fr)]'>
                  {/* Snapshot */}
                  <div className='relative isolate min-h-[360px] overflow-hidden'>
                    <div
                      className='absolute inset-0'
                      style={{
                        background: `
                          radial-gradient(circle at 18% 15%, ${accent}45, transparent 34%),
                          radial-gradient(circle at 85% 20%, rgba(255,255,255,0.18), transparent 22%),
                          linear-gradient(160deg, ${accent}dd 0%, #0f172a 100%)
                        `
                      }}
                      aria-hidden
                    />
                    <div className='absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.16)_0%,transparent_35%,transparent_65%,rgba(255,255,255,0.08)_100%)]' />
                    <div className='relative z-10 flex h-full flex-col justify-between p-6 text-white'>
                      <div className='flex items-center gap-2 text-sm font-medium'>
                        <Sparkles className='h-4 w-4' />
                        Product snapshot
                      </div>

                      <div className='space-y-4'>
                        <div className='inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/12 px-3 py-1.5 text-xs backdrop-blur-md'>
                          <BadgeInfo className='h-3.5 w-3.5' />
                          Dynamic insights by id
                        </div>

                        <div className='space-y-2'>
                          <div className='text-sm text-white/70'>Price</div>
                          <div className='text-4xl font-semibold tracking-tight'>
                            ${(product.price ?? 0).toFixed(2)}
                          </div>
                        </div>

                        <div className='grid grid-cols-2 gap-3 sm:max-w-sm'>
                          <div className='rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-md'>
                            <div className='text-[11px] tracking-[0.14em] text-white/70 uppercase'>
                              Lifecycle
                            </div>
                            <div className='mt-1 text-sm font-semibold'>
                              {lifecycleText}
                            </div>
                          </div>
                          <div className='rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-md'>
                            <div className='text-[11px] tracking-[0.14em] text-white/70 uppercase'>
                              Opportunity
                            </div>
                            <div className='mt-1 text-sm font-semibold'>
                              {opportunity}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className='min-w-0 p-5 sm:p-6'>
                    <div className='grid gap-4 sm:grid-cols-2'>
                      <MetricCard
                        icon={<Star className='h-4 w-4' />}
                        label='Rating'
                        value={ratingText}
                        hint={`${reviewText} reviews`}
                        accent='amber'
                      />
                      <MetricCard
                        icon={<TrendingUp className='h-4 w-4' />}
                        label='Demand'
                        value={fmtNumber(product.demand)}
                        hint='Current demand signal'
                        accent='emerald'
                      />
                      <MetricCard
                        icon={<BarChart3 className='h-4 w-4' />}
                        label='Competition'
                        value={String(product.competition)}
                        hint={totalRisk}
                        accent='rose'
                      />
                      <MetricCard
                        icon={<ShieldCheck className='h-4 w-4' />}
                        label='Quality / Score'
                        value={`${product.quality}% / ${product.score}`}
                        hint='Combined product health'
                        accent='indigo'
                      />
                    </div>

                    <div className='mt-4 grid gap-4 md:grid-cols-3'>
                      <MiniStat
                        label='Lifecycle'
                        value={lifecycleText}
                        caption='Long-term pattern'
                        icon={<Layers3 className='h-4 w-4' />}
                        tone='indigo'
                      />
                      <MiniStat
                        label='Opportunity'
                        value={opportunity}
                        caption='Decision signal'
                        icon={<ArrowUpRight className='h-4 w-4' />}
                        tone='emerald'
                      />
                      <MiniStat
                        label='Market note'
                        value={
                          product.score >= 85
                            ? 'Very strong'
                            : product.score >= 70
                              ? 'Promising'
                              : 'Needs validation'
                        }
                        caption='Competitive context'
                        icon={<Gauge className='h-4 w-4' />}
                        tone='amber'
                      />
                    </div>

                    <div className='mt-4 flex flex-wrap gap-2'>
                      <SoftPill tone='indigo'>Score {product.score}</SoftPill>
                      <SoftPill tone='emerald'>
                        Quality {product.quality}%
                      </SoftPill>
                      <SoftPill tone='slate'>
                        Demand {fmtNumber(product.demand)}
                      </SoftPill>
                      <SoftPill tone='amber'>
                        Competition {product.competition}
                      </SoftPill>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick interpretation */}
            <Card className='rounded-[28px] border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950/60'>
              <CardHeader className='pb-3'>
                <CardTitle className='text-xl'>Quick interpretation</CardTitle>
                <CardDescription>Decision-friendly summary</CardDescription>
              </CardHeader>

              <CardContent className='space-y-4'>
                <div className='rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950'>
                  <div className='text-[11px] font-medium tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400'>
                    Sentiment snapshot
                  </div>

                  <div className='mt-4 flex items-end justify-between gap-4'>
                    <div>
                      <div className='text-4xl font-semibold tracking-tight text-emerald-600 dark:text-emerald-400'>
                        {sentimentSummary.positiveShare.toFixed(1)}%
                      </div>
                      <div className='mt-1 text-sm text-slate-600 dark:text-slate-400'>
                        Positive in latest month
                      </div>
                    </div>
                    <SoftPill tone='emerald'>
                      {fmtMonth(sentimentSummary.latest.month)}
                    </SoftPill>
                  </div>
                </div>

                <div className='grid gap-3 sm:grid-cols-2'>
                  <MiniStat
                    label='Rating share'
                    value={`${starSummary.topShare.toFixed(1)}%`}
                    caption='5★ reviews'
                    icon={<Star className='h-4 w-4' />}
                    tone='amber'
                  />
                  <MiniStat
                    label='Momentum'
                    value={latestStability.slope_12.toFixed(2)}
                    caption={`${momentumDirection} trend`}
                    icon={<Activity className='h-4 w-4' />}
                    tone='indigo'
                  />
                </div>

                <div className='rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950'>
                  <div className='flex items-start justify-between gap-3'>
                    <div>
                      <div className='text-sm font-semibold text-slate-950 dark:text-white'>
                        Stability verdict
                      </div>
                      <div className='mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400'>
                        {stabilityVerdict.description}
                      </div>
                    </div>
                    <SoftPill tone={stabilityVerdict.tone}>
                      {stabilityVerdict.label}
                    </SoftPill>
                  </div>
                </div>

                <div className='rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60'>
                  <div className='flex items-center gap-2 text-sm font-medium text-slate-950 dark:text-white'>
                    <LineChartIcon className='h-4 w-4 text-indigo-500' />
                    Readout
                  </div>
                  <p className='mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400'>
                    Demand and rating signals are healthy while competition is
                    still manageable. This gives the product a strong, but not
                    perfect, discovery profile.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sentiment chart */}
          <Card className='mt-6 overflow-hidden rounded-[28px] border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950/60'>
            <CardHeader className='pb-2'>
              <div className='flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between'>
                <div>
                  <CardTitle className='text-xl'>Sentiment trend</CardTitle>
                  <CardDescription>
                    Stacked area chart showing positive, neutral, and negative
                    signals over time
                  </CardDescription>
                </div>

                <div className='flex flex-wrap gap-2'>
                  <SoftPill tone='emerald'>
                    Positive {sentimentSummary.positiveShare.toFixed(1)}%
                  </SoftPill>
                  <SoftPill tone='amber'>
                    Neutral {sentimentSummary.neutralShare.toFixed(1)}%
                  </SoftPill>
                  <SoftPill tone='rose'>
                    Negative {sentimentSummary.negativeShare.toFixed(1)}%
                  </SoftPill>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className='grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]'>
                <div className='min-w-0 rounded-[24px] border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900'>
                  <div className='h-[360px] w-full'>
                    <ResponsiveContainer width='100%' height='100%'>
                      <AreaChart
                        data={SENTIMENT_TREND}
                        margin={{ top: 12, right: 18, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id='sentPositive'
                            x1='0'
                            y1='0'
                            x2='0'
                            y2='1'
                          >
                            <stop
                              offset='0%'
                              stopColor='#10b981'
                              stopOpacity={0.28}
                            />
                            <stop
                              offset='100%'
                              stopColor='#10b981'
                              stopOpacity={0.04}
                            />
                          </linearGradient>
                          <linearGradient
                            id='sentNeutral'
                            x1='0'
                            y1='0'
                            x2='0'
                            y2='1'
                          >
                            <stop
                              offset='0%'
                              stopColor='#f59e0b'
                              stopOpacity={0.24}
                            />
                            <stop
                              offset='100%'
                              stopColor='#f59e0b'
                              stopOpacity={0.04}
                            />
                          </linearGradient>
                          <linearGradient
                            id='sentNegative'
                            x1='0'
                            y1='0'
                            x2='0'
                            y2='1'
                          >
                            <stop
                              offset='0%'
                              stopColor='#ef4444'
                              stopOpacity={0.18}
                            />
                            <stop
                              offset='100%'
                              stopColor='#ef4444'
                              stopOpacity={0.03}
                            />
                          </linearGradient>
                        </defs>

                        <CartesianGrid
                          strokeDasharray='4 4'
                          vertical={false}
                          stroke='rgba(148,163,184,0.20)'
                        />

                        <XAxis
                          dataKey='month'
                          tickFormatter={fmtMonth}
                          tickLine={false}
                          axisLine={false}
                          minTickGap={20}
                          tick={{ fill: 'currentColor', fontSize: 12 }}
                        />

                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          width={34}
                          tick={{ fill: 'currentColor', fontSize: 12 }}
                        />

                        <Tooltip
                          content={<ChartTooltip />}
                          labelFormatter={(label) => fmtMonth(String(label))}
                        />

                        <Legend
                          verticalAlign='top'
                          height={28}
                          iconType='circle'
                          formatter={(value) => (
                            <span className='text-sm font-medium text-slate-700 dark:text-slate-300'>
                              {value}
                            </span>
                          )}
                        />

                        <Area
                          type='monotone'
                          dataKey='positive'
                          stackId='sentiment'
                          stroke='#10b981'
                          fill='url(#sentPositive)'
                          strokeWidth={2.5}
                          name='Positive'
                          dot={false}
                          activeDot={{ r: 4 }}
                        />
                        <Area
                          type='monotone'
                          dataKey='neutral'
                          stackId='sentiment'
                          stroke='#f59e0b'
                          fill='url(#sentNeutral)'
                          strokeWidth={2.5}
                          name='Neutral'
                          dot={false}
                          activeDot={{ r: 4 }}
                        />
                        <Area
                          type='monotone'
                          dataKey='negative'
                          stackId='sentiment'
                          stroke='#ef4444'
                          fill='url(#sentNegative)'
                          strokeWidth={2.5}
                          name='Negative'
                          dot={false}
                          activeDot={{ r: 4 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className='grid gap-3'>
                  <MiniStat
                    label='Latest month'
                    value={fmtMonth(sentimentSummary.latest.month)}
                    caption='Freshest sentiment read'
                    icon={<Sparkles className='h-4 w-4' />}
                    tone='emerald'
                  />
                  <MiniStat
                    label='Positive share'
                    value={`${sentimentSummary.positiveShare.toFixed(1)}%`}
                    caption='Healthy customer signal'
                    icon={<TrendingUp className='h-4 w-4' />}
                    tone='emerald'
                  />
                  <MiniStat
                    label='Neutral share'
                    value={`${sentimentSummary.neutralShare.toFixed(1)}%`}
                    caption='Holds interpretation space'
                    icon={<BadgeInfo className='h-4 w-4' />}
                    tone='amber'
                  />
                  <MiniStat
                    label='Negative share'
                    value={`${sentimentSummary.negativeShare.toFixed(1)}%`}
                    caption='Watch for spikes'
                    icon={<Activity className='h-4 w-4' />}
                    tone='rose'
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Star distribution */}
          <Card className='mt-6 overflow-hidden rounded-[28px] border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950/60'>
            <CardHeader className='pb-2'>
              <div className='flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between'>
                <div>
                  <CardTitle className='text-xl'>Star distribution</CardTitle>
                  <CardDescription>
                    Horizontal bar chart showing rating density across 1★ to 5★
                  </CardDescription>
                </div>
                <SoftPill tone='slate'>
                  Total ratings {starSummary.total}
                </SoftPill>
              </div>
            </CardHeader>

            <CardContent>
              <div className='grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]'>
                <div className='min-w-0 rounded-[24px] border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900'>
                  <div className='h-[350px] w-full'>
                    <ResponsiveContainer width='100%' height='100%'>
                      <BarChart
                        data={STAR_DISTRIBUTION}
                        layout='vertical'
                        margin={{ top: 8, right: 28, left: 8, bottom: 8 }}
                        barCategoryGap={18}
                      >
                        <CartesianGrid
                          strokeDasharray='4 4'
                          horizontal={false}
                          stroke='rgba(148,163,184,0.18)'
                        />
                        <XAxis
                          type='number'
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: 'currentColor', fontSize: 12 }}
                        />
                        <YAxis
                          type='category'
                          dataKey='star'
                          tickLine={false}
                          axisLine={false}
                          width={42}
                          tick={{
                            fill: 'currentColor',
                            fontSize: 12,
                            fontWeight: 600
                          }}
                        />
                        <Tooltip
                          content={<ChartTooltip />}
                          formatter={(name, value) => [`${value}`, 'Count']}
                        />
                        <Bar
                          dataKey='count'
                          radius={[0, 14, 14, 0]}
                          fill='#6366f1'
                          barSize={22}
                        >
                          <LabelList
                            dataKey='count'
                            position='right'
                            className='fill-slate-600 dark:fill-slate-300'
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className='grid gap-3'>
                  <MiniStat
                    label='5★ concentration'
                    value={`${starSummary.topShare.toFixed(1)}%`}
                    caption='Top ratings density'
                    icon={<Star className='h-4 w-4' />}
                    tone='amber'
                  />
                  <MiniStat
                    label='Average rating'
                    value={ratingText}
                    caption='Aggregate review score'
                    icon={<ShieldCheck className='h-4 w-4' />}
                    tone='indigo'
                  />
                  <MiniStat
                    label='Review volume'
                    value={reviewText}
                    caption='Signal strength'
                    icon={<BarChart3 className='h-4 w-4' />}
                    tone='emerald'
                  />

                  <div className='rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60'>
                    <div className='text-sm font-medium text-slate-950 dark:text-white'>
                      Why this looks strong
                    </div>
                    <p className='mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400'>
                      A large share of 5★ reviews indicates strong user
                      satisfaction, while a visible middle band shows the
                      product still has normal variance.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stability diagnostic */}
          <Card className='mt-6 overflow-hidden rounded-[28px] border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950/60'>
            <CardHeader className='pb-2'>
              <div className='flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between'>
                <div>
                  <CardTitle className='text-xl'>
                    Stability / momentum diagnostic
                  </CardTitle>
                  <CardDescription>
                    A cleaner diagnostic view with trend, slope, spike, and
                    volatility context
                  </CardDescription>
                </div>
                <SoftPill tone={stabilityVerdict.tone}>
                  {stabilityVerdict.label}
                </SoftPill>
              </div>
            </CardHeader>

            <CardContent>
              <div className='grid gap-5 xl:grid-cols-[1.25fr_0.75fr]'>
                <div className='min-w-0 rounded-[24px] border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900'>
                  <div className='h-[340px] w-full'>
                    <ResponsiveContainer width='100%' height='100%'>
                      <LineChart
                        data={STABILITY_DIAGNOSTIC}
                        margin={{ top: 16, right: 20, bottom: 0, left: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray='4 4'
                          vertical={false}
                          stroke='rgba(148,163,184,0.18)'
                        />
                        <XAxis
                          dataKey='month'
                          tickFormatter={fmtMonth}
                          tickLine={false}
                          axisLine={false}
                          minTickGap={20}
                          tick={{ fill: 'currentColor', fontSize: 12 }}
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          width={42}
                          domain={[4.05, 4.35]}
                          tick={{ fill: 'currentColor', fontSize: 12 }}
                        />
                        <Tooltip
                          content={<ChartTooltip />}
                          labelFormatter={(label) => fmtMonth(String(label))}
                          formatter={(name: any, value: any) => {
                            const labelMap: Record<string, string> = {
                              ewma_6m: 'EWMA 6m',
                              slope_12: '12m slope',
                              last_spike_z: 'Last spike z',
                              cv_12: 'CV 12m'
                            };
                            return [fmtCompact(value), labelMap[name] ?? name];
                          }}
                        />
                        <Legend
                          verticalAlign='top'
                          height={28}
                          iconType='circle'
                          formatter={(value) => (
                            <span className='text-sm font-medium text-slate-700 dark:text-slate-300'>
                              {value}
                            </span>
                          )}
                        />
                        <ReferenceLine
                          y={4.2}
                          stroke='rgba(148,163,184,0.55)'
                          strokeDasharray='5 5'
                        />
                        <Line
                          type='monotone'
                          dataKey='ewma_6m'
                          stroke='#0f172a'
                          strokeWidth={3}
                          dot={false}
                          activeDot={{ r: 4 }}
                          name='EWMA 6m'
                        />
                        <Line
                          type='monotone'
                          dataKey='slope_12'
                          stroke='#6366f1'
                          strokeWidth={2.5}
                          dot={false}
                          activeDot={{ r: 4 }}
                          name='12m slope'
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className='grid gap-3'>
                  <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-2'>
                    <MiniStat
                      label='EWMA 6m'
                      value={latestStability.ewma_6m.toFixed(2)}
                      icon={<LineChartIcon className='h-4 w-4' />}
                      tone='slate'
                    />
                    <MiniStat
                      label='12m slope'
                      value={latestStability.slope_12.toFixed(2)}
                      icon={<TrendingUp className='h-4 w-4' />}
                      tone='indigo'
                    />
                    <MiniStat
                      label='Last spike z'
                      value={latestStability.last_spike_z.toFixed(2)}
                      icon={<Activity className='h-4 w-4' />}
                      tone='amber'
                    />
                    <MiniStat
                      label='CV 12m'
                      value={latestStability.cv_12.toFixed(2)}
                      icon={<Gauge className='h-4 w-4' />}
                      tone='emerald'
                    />
                  </div>

                  <div className='rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60'>
                    <div className='flex items-start gap-3'>
                      <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300'>
                        <Activity className='h-4 w-4' />
                      </div>
                      <div>
                        <div className='text-sm font-semibold text-slate-950 dark:text-white'>
                          Diagnostic readout
                        </div>
                        <p className='mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400'>
                          Momentum is trending upward, volatility is low, and
                          the most recent spike is within a healthy range.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/70'>
                    <div className='text-xs font-medium tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400'>
                      Decision support
                    </div>
                    <div className='mt-2 text-lg font-semibold text-slate-950 dark:text-white'>
                      Stronger when signal and competition stay balanced
                    </div>
                    <p className='mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400'>
                      This product looks strongest when score, quality, and
                      demand are balanced against competition.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer summary */}
          <Card className='mt-6 rounded-[28px] border-slate-200/80 bg-gradient-to-r from-white via-white to-slate-50 shadow-[0_8px_30px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900/90'>
            <CardContent className='p-5'>
              <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
                <div>
                  <div className='text-sm font-semibold text-slate-950 dark:text-white'>
                    Decision summary
                  </div>
                  <div className='mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400'>
                    This product is strongest when score, quality, and demand
                    are kept in balance with competition and sustained
                    sentiment.
                  </div>
                </div>

                <div className='flex flex-wrap gap-2'>
                  <SoftPill tone='emerald'>{opportunity}</SoftPill>
                  <SoftPill tone='indigo'>{lifecycleText}</SoftPill>
                  <SoftPill tone='slate'>ID {product.id}</SoftPill>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
