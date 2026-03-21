'use client';

import Link from 'next/link';
import { useUser } from '@/hooks/use-user';
import { MarketShareChart } from '@/features/overview/components/market-share-chart';
import { TimeSeriesChart } from '@/features/overview/components/time-series-chart';
import { ProductOpportunityQuadrant } from '@/features/overview/components/product-oppurtunity-quadrant-chart';
import { CategoryDemandChart } from '@/features/overview/components/category-demand-chart';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import {
  TrendingUp,
  Package,
  BarChart3,
  Search,
  Lightbulb
} from 'lucide-react';
import PageContainer from '@/components/layout/page-container';

/**
 * Dark-mode optimized dashboard overview
 * - Keeps the existing layout intact.
 * - Updates the palette to match the product details page styling:
 *   slate-based backgrounds, stronger hierarchy, softer shadows, and
 *   consistent light/dark contrast.
 */
export function UserDashboardOverview() {
  const { user } = useUser();

  const categoryDemandRaw = [
    { category: 'Men', value: 3200, delta: 5, sampleSize: 3200 },
    { category: 'Women', value: 2800, delta: -2, sampleSize: 2800 },
    { category: 'Kitchen', value: 1800, delta: 12, sampleSize: 1800 },
    { category: 'Toys', value: 1000, delta: 3, sampleSize: 1000 },
    { category: 'Electronics', value: 900, delta: -1, sampleSize: 900 },
    { category: 'Beauty', value: 600, delta: 0, sampleSize: 600 },
    { category: 'Outdoor', value: 200, delta: 8, sampleSize: 200 }
  ];

  const marketShareRaw = [
    {
      category: 'Men',
      value: 3200,
      brands: [
        { name: 'Brand A', value: 1200 },
        { name: 'Brand B', value: 900 },
        { name: 'Brand C', value: 600 },
        { name: 'Other Brands', value: 500 }
      ]
    },
    {
      category: 'Women',
      value: 2800,
      brands: [
        { name: 'Brand X', value: 1100 },
        { name: 'Brand Y', value: 900 },
        { name: 'Brand Z', value: 400 },
        { name: 'Other Brands', value: 400 }
      ]
    },
    {
      category: 'Kitchen',
      value: 1800,
      brands: [
        { name: 'KitchenPro', value: 700 },
        { name: 'Cookwell', value: 500 },
        { name: 'Other', value: 600 }
      ]
    },
    {
      category: 'Toys',
      value: 1000,
      brands: [
        { name: 'ToyCo', value: 500 },
        { name: 'PlayLabs', value: 300 },
        { name: 'Other', value: 200 }
      ]
    }
  ];

  // time series sample (last 14 days)
  const timeSeriesRaw = [
    { date: '2026-03-04', views: 1200, conversions: 24 },
    { date: '2026-03-05', views: 1350, conversions: 30 },
    { date: '2026-03-06', views: 1100, conversions: 22 },
    { date: '2026-03-07', views: 1450, conversions: 36 },
    { date: '2026-03-08', views: 1600, conversions: 40 },
    { date: '2026-03-09', views: 1700, conversions: 44 },
    { date: '2026-03-10', views: 1650, conversions: 42 },
    { date: '2026-03-11', views: 1800, conversions: 48 },
    { date: '2026-03-12', views: 1750, conversions: 46 },
    { date: '2026-03-13', views: 1900, conversions: 52 },
    { date: '2026-03-14', views: 2000, conversions: 58 },
    { date: '2026-03-15', views: 2100, conversions: 62 },
    { date: '2026-03-16', views: 2200, conversions: 66 },
    { date: '2026-03-17', views: 2300, conversions: 70 }
  ];

  const dummyProducts = [
    {
      id: 1,
      name: 'FlexiChair',
      demand: 5400,
      competition: 12,
      size: 110,
      color: '#8b5cf6'
    },
    {
      id: 2,
      name: 'EcoBottle',
      demand: 4200,
      competition: 6,
      size: 90,
      color: '#06b6d4'
    },
    {
      id: 3,
      name: 'SmartLamp',
      demand: 7800,
      competition: 28,
      size: 140,
      color: '#f59e0b'
    },
    {
      id: 4,
      name: 'KitchenPro Pan',
      demand: 3000,
      competition: 18,
      size: 70,
      color: '#10b981'
    },
    {
      id: 5,
      name: 'MiniDrone',
      demand: 9200,
      competition: 45,
      size: 170,
      color: '#ef4444'
    },
    {
      id: 6,
      name: 'YogaMat Plus',
      demand: 2500,
      competition: 8,
      size: 60,
      color: '#7c3aed'
    },
    {
      id: 7,
      name: 'PetGroom Kit',
      demand: 3800,
      competition: 4,
      size: 80,
      color: '#fb923c'
    },
    {
      id: 8,
      name: 'GardenLight',
      demand: 4800,
      competition: 11,
      size: 95,
      color: '#06b6d4'
    },
    {
      id: 9,
      name: 'PhoneGrip',
      demand: 1500,
      competition: 30,
      size: 40,
      color: '#4f46e5'
    },
    {
      id: 10,
      name: 'ThermoBottle',
      demand: 6600,
      competition: 9,
      size: 125,
      color: '#10b981'
    },
    {
      id: 11,
      name: 'BabyToys X',
      demand: 5200,
      competition: 20,
      size: 105,
      color: '#f59e0b'
    },
    {
      id: 12,
      name: 'OutdoorTarp',
      demand: 2100,
      competition: 3,
      size: 50,
      color: '#7c3aed'
    }
  ];

  return (
    <PageContainer>
      <div className='min-h-full w-full space-y-6 bg-slate-50 p-4 text-slate-900 sm:p-6 dark:bg-slate-950 dark:text-slate-100'>
        {/* Header */}
        <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
          <div className='min-w-0'>
            <h2 className='text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl dark:text-white'>
              Welcome back,{' '}
              <span className='text-indigo-600 dark:text-indigo-300'>
                {user?.fullName || 'User'}
              </span>
            </h2>
            <p className='mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400'>
              Product intelligence overview — actionable insights & trending
              signals
            </p>
          </div>

          <div className='flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto'>
            <Button
              asChild
              className='w-full rounded-2xl bg-slate-950 text-white shadow-sm hover:bg-slate-800 sm:w-auto dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200'
            >
              <Link href='/dashboard/product'>Explore Products</Link>
            </Button>

            <Button
              variant='ghost'
              className='w-full rounded-2xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-950 sm:w-auto dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
            >
              New Insight
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {/* Trending Products */}
          <Card className='group relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900'>
            <div className='pointer-events-none absolute -top-6 -left-6 h-32 w-32 rounded-full bg-indigo-200/30 opacity-60 blur-3xl transition-all duration-300 group-hover:bg-indigo-200/40 dark:bg-indigo-500/10 dark:group-hover:bg-indigo-500/15' />
            <CardHeader className='flex items-center justify-between gap-3'>
              <CardTitle className='flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                <span className='inline-flex items-center justify-center rounded-full bg-indigo-600 p-1.5 transition-transform duration-300 group-hover:scale-105'>
                  <TrendingUp className='h-4 w-4 text-white' />
                </span>
                Trending Products
              </CardTitle>
              <div className='shrink-0 text-xs font-medium text-indigo-600 dark:text-indigo-300'>
                +18%
              </div>
            </CardHeader>

            <CardContent>
              <div className='text-2xl font-bold text-slate-950 dark:text-white'>
                124
              </div>
              <p className='mt-1 text-xs text-slate-600 dark:text-slate-400'>
                Products with rising demand this week
              </p>
            </CardContent>
          </Card>

          {/* Products Tracked */}
          <Card className='group relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900'>
            <div className='pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-emerald-200/20 opacity-60 blur-3xl transition-all duration-300 group-hover:bg-emerald-200/30 dark:bg-emerald-500/10 dark:group-hover:bg-emerald-500/15' />
            <CardHeader className='flex items-center justify-between gap-3'>
              <CardTitle className='flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                <span className='inline-flex items-center justify-center rounded-full bg-emerald-600 p-1.5 transition-transform duration-300 group-hover:scale-105'>
                  <Package className='h-4 w-4 text-white' />
                </span>
                Products Tracked
              </CardTitle>
              <div className='shrink-0 text-xs font-medium text-emerald-600 dark:text-emerald-300'>
                All marketplaces
              </div>
            </CardHeader>

            <CardContent>
              <div className='text-2xl font-bold text-slate-950 dark:text-white'>
                2,431
              </div>
              <p className='mt-1 text-xs text-slate-600 dark:text-slate-400'>
                Active SKUs across sources
              </p>
            </CardContent>
          </Card>

          {/* Market Insights */}
          <Card className='group relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900'>
            <div className='pointer-events-none absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-amber-200/25 opacity-60 blur-3xl transition-all duration-300 group-hover:bg-amber-200/35 dark:bg-amber-500/10 dark:group-hover:bg-amber-500/15' />
            <CardHeader className='flex items-center justify-between gap-3'>
              <CardTitle className='flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                <span className='inline-flex items-center justify-center rounded-full bg-amber-500 p-1.5 transition-transform duration-300 group-hover:scale-105'>
                  <BarChart3 className='h-4 w-4 text-white' />
                </span>
                Market Insights
              </CardTitle>
              <div className='shrink-0 text-xs font-medium text-amber-600 dark:text-amber-300'>
                This week
              </div>
            </CardHeader>

            <CardContent>
              <div className='text-2xl font-bold text-slate-950 dark:text-white'>
                58
              </div>
              <p className='mt-1 text-xs text-slate-600 dark:text-slate-400'>
                Signals generated by AI
              </p>
            </CardContent>
          </Card>

          {/* Opportunities */}
          <Card className='group relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900'>
            <div className='pointer-events-none absolute -top-6 -right-6 h-32 w-32 rounded-full bg-pink-200/30 opacity-60 blur-3xl transition-all duration-300 group-hover:bg-pink-200/40 dark:bg-pink-500/10 dark:group-hover:bg-pink-500/15' />
            <CardHeader className='flex items-center justify-between gap-3'>
              <CardTitle className='flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200'>
                <span className='inline-flex items-center justify-center rounded-full bg-pink-600 p-1.5 transition-transform duration-300 group-hover:scale-105'>
                  <Lightbulb className='h-4 w-4 text-white' />
                </span>
                Opportunities
              </CardTitle>
              <div className='shrink-0 text-xs font-medium text-pink-600 dark:text-pink-300'>
                High priority
              </div>
            </CardHeader>

            <CardContent>
              <div className='text-2xl font-bold text-slate-950 dark:text-white'>
                16
              </div>
              <p className='mt-1 text-xs text-slate-600 dark:text-slate-400'>
                Niches with rising demand
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Two-chart row */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div className='min-w-0'>
            <CategoryDemandChart rawData={categoryDemandRaw} top={6} />
          </div>

          <div className='min-w-0'>
            <MarketShareChart rawData={marketShareRaw} />
          </div>
        </div>

        {/* Time series */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div className='min-w-0'>
            <TimeSeriesChart rawData={timeSeriesRaw} />
          </div>
          <div className='min-w-0'>
            <ProductOpportunityQuadrant
              rawData={dummyProducts}
              invertYAxis={true}
            />
          </div>
        </div>

        {/* Research Tools */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          <Card className='group relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900'>
            <div className='pointer-events-none absolute -top-6 -left-6 h-28 w-28 rounded-full bg-slate-200/30 opacity-60 blur-3xl transition-all duration-300 group-hover:bg-slate-200/40 dark:bg-slate-500/10 dark:group-hover:bg-slate-500/15' />
            <CardHeader>
              <CardTitle className='text-slate-950 dark:text-white'>
                Product Research
              </CardTitle>
              <CardDescription className='text-slate-600 dark:text-slate-400'>
                Discover trending products across marketplaces
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Button
                asChild
                className='flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 text-white shadow-sm hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200'
              >
                <Link href='/dashboard/research'>
                  <Search className='h-4 w-4' />
                  <span>Start Research</span>
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className='group relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900'>
            <div className='pointer-events-none absolute -top-6 -right-6 h-28 w-28 rounded-full bg-slate-200/30 opacity-60 blur-3xl transition-all duration-300 group-hover:bg-slate-200/40 dark:bg-slate-500/10 dark:group-hover:bg-slate-500/15' />
            <CardHeader>
              <CardTitle className='text-slate-950 dark:text-white'>
                Market Trends
              </CardTitle>
              <CardDescription className='text-slate-600 dark:text-slate-400'>
                Analyze demand patterns and competition
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Button
                asChild
                variant='outline'
                className='w-full rounded-2xl border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              >
                <Link href='/dashboard/trends'>View Trends</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className='group relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900'>
            <div className='pointer-events-none absolute -top-6 -right-6 h-28 w-28 rounded-full bg-slate-200/30 opacity-60 blur-3xl transition-all duration-300 group-hover:bg-slate-200/40 dark:bg-slate-500/10 dark:group-hover:bg-slate-500/15' />
            <CardHeader>
              <CardTitle className='text-slate-950 dark:text-white'>
                Account Status
              </CardTitle>
              <CardDescription className='text-slate-600 dark:text-slate-400'>
                Your account & billing
              </CardDescription>
            </CardHeader>

            <CardContent className='flex items-center justify-between gap-3'>
              <Badge
                variant='secondary'
                className='border border-slate-200 bg-white text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
              >
                {user?.status || 'Active'}
              </Badge>

              <Button
                asChild
                size='sm'
                className='rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              >
                <Link href='/dashboard/billing'>Manage Plan</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer tip */}
        <div className='rounded-[28px] border border-slate-200/80 bg-gradient-to-r from-white via-white to-slate-50 p-3 text-sm leading-6 text-slate-600 shadow-[0_8px_30px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900/90 dark:text-slate-400'>
          Tip: Use our color-coded KPI cards to quickly scan performance —
          gradients and soft shadows improve visual hierarchy. In dark mode
          cards use deeper backgrounds with subtle glows to keep contrast
          comfortable.
        </div>
      </div>
    </PageContainer>
  );
}
