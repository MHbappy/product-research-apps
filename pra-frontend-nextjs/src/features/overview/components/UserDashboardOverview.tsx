'use client';

import Link from 'next/link';
import { useUser } from '@/hooks/use-user';
import { CategoryDemandChart } from './category-demand-chart';

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

/* Recharts imports */
import { MarketShareChart } from '@/features/overview/components/market-share-chart';
import { TimeSeriesChart } from '@/features/overview/components/time-series-chart';
import { ProductOpportunityQuadrant } from '@/features/overview/components/product-oppurtunity-quadrant-chart';

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
    { id: 1, name: 'FlexiChair', demand: 5400, competition: 12, size: 110, color: '#4f46e5' },
    { id: 2, name: 'EcoBottle', demand: 4200, competition: 6, size: 90, color: '#06b6d4' },
    { id: 3, name: 'SmartLamp', demand: 7800, competition: 28, size: 140, color: '#f59e0b' },
    { id: 4, name: 'KitchenPro Pan', demand: 3000, competition: 18, size: 70, color: '#10b981' },
    { id: 5, name: 'MiniDrone', demand: 9200, competition: 45, size: 170, color: '#ef4444' },
    { id: 6, name: 'YogaMat Plus', demand: 2500, competition: 8, size: 60, color: '#8b5cf6' },
    { id: 7, name: 'PetGroom Kit', demand: 3800, competition: 4, size: 80, color: '#f97316' },
    { id: 8, name: 'GardenLight', demand: 4800, competition: 11, size: 95, color: '#06b6d4' },
    { id: 9, name: 'PhoneGrip', demand: 1500, competition: 30, size: 40, color: '#4f46e5' },
    { id: 10, name: 'ThermoBottle', demand: 6600, competition: 9, size: 125, color: '#10b981' },
    { id: 11, name: 'BabyToys X', demand: 5200, competition: 20, size: 105, color: '#f59e0b' },
    { id: 12, name: 'OutdoorTarp', demand: 2100, competition: 3, size: 50, color: '#8b5cf6' }
  ];

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between gap-4'>
        <div>
          <h2 className='text-2xl font-semibold text-slate-900'>
            Welcome back,{' '}
            <span className='text-indigo-600'>{user?.fullName || 'User'}</span>
          </h2>
          <p className='text-sm text-slate-600'>
            Product intelligence overview — actionable insights & trending
            signals
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <Button className='bg-gradient-to-r from-indigo-500 to-teal-400 text-white shadow-md hover:from-indigo-600 hover:to-teal-500'>
            <Link href='/dashboard/products'>Explore Products</Link>
          </Button>
          <Button
            variant='ghost'
            className='border border-slate-200 bg-white/60 hover:bg-white'
          >
            New Insight
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {/* Trending Products */}
        <Card className='overflow-hidden'>
          <div className='pointer-events-none absolute -top-6 -left-6 h-32 w-32 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 opacity-60' />
          <CardHeader className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2 text-sm font-medium text-slate-700'>
              <span className='inline-flex items-center justify-center rounded-full bg-indigo-600 p-1.5'>
                <TrendingUp className='h-4 w-4 text-white' />
              </span>
              Trending Products
            </CardTitle>
            <div className='text-xs font-medium text-indigo-600'>+18%</div>
          </CardHeader>

          <CardContent>
            <div className='text-2xl font-bold text-slate-900'>124</div>
            <p className='mt-1 text-xs text-slate-500'>
              Products with rising demand this week
            </p>
          </CardContent>
        </Card>

        {/* Products Tracked */}
        <Card className='overflow-hidden'>
          <div className='pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-gradient-to-tr from-teal-100 to-emerald-50 opacity-60' />
          <CardHeader className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2 text-sm font-medium text-slate-700'>
              <span className='inline-flex items-center justify-center rounded-full bg-teal-600 p-1.5'>
                <Package className='h-4 w-4 text-white' />
              </span>
              Products Tracked
            </CardTitle>
            <div className='text-xs font-medium text-teal-600'>
              All marketplaces
            </div>
          </CardHeader>

          <CardContent>
            <div className='text-2xl font-bold text-slate-900'>2,431</div>
            <p className='mt-1 text-xs text-slate-500'>
              Active SKUs across sources
            </p>
          </CardContent>
        </Card>

        {/* Market Insights */}
        <Card className='overflow-hidden'>
          <div className='pointer-events-none absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-gradient-to-br from-amber-100 to-rose-50 opacity-60' />
          <CardHeader className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2 text-sm font-medium text-slate-700'>
              <span className='inline-flex items-center justify-center rounded-full bg-amber-500 p-1.5'>
                <BarChart3 className='h-4 w-4 text-white' />
              </span>
              Market Insights
            </CardTitle>
            <div className='text-xs font-medium text-amber-600'>This week</div>
          </CardHeader>

          <CardContent>
            <div className='text-2xl font-bold text-slate-900'>58</div>
            <p className='mt-1 text-xs text-slate-500'>
              Signals generated by AI
            </p>
          </CardContent>
        </Card>

        {/* Opportunities */}
        <Card className='overflow-hidden'>
          <div className='pointer-events-none absolute -top-6 -right-6 h-32 w-32 rounded-full bg-gradient-to-bl from-pink-100 to-red-50 opacity-60' />
          <CardHeader className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2 text-sm font-medium text-slate-700'>
              <span className='inline-flex items-center justify-center rounded-full bg-pink-600 p-1.5'>
                <Lightbulb className='h-4 w-4 text-white' />
              </span>
              Opportunities
            </CardTitle>
            <div className='text-xs font-medium text-pink-600'>
              High priority
            </div>
          </CardHeader>

          <CardContent>
            <div className='text-2xl font-bold text-slate-900'>16</div>
            <p className='mt-1 text-xs text-slate-500'>
              Niches with rising demand
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Two-chart row */}
      <div className='grid gap-4 md:grid-cols-2'>
        <div>
          <CategoryDemandChart rawData={categoryDemandRaw} top={6} />
        </div>

        <div>
          <MarketShareChart rawData={marketShareRaw} />
        </div>
      </div>

      {/* Time series */}

      <div className='grid gap-4 md:grid-cols-2'>
        <div>
          <TimeSeriesChart rawData={timeSeriesRaw} />
        </div>
        <div>
          <ProductOpportunityQuadrant rawData={dummyProducts} invertYAxis={true} />
        </div>
      </div>

      {/* Research Tools */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <Card>
          <CardHeader>
            <CardTitle className='text-slate-800'>Product Research</CardTitle>
            <CardDescription>
              Discover trending products across marketplaces
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Button className='flex w-full items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-cyan-400 text-white shadow-md hover:from-indigo-600 hover:to-cyan-500'>
              <Search className='h-4 w-4' />
              <Link href='/dashboard/research'>Start Research</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-slate-800'>Market Trends</CardTitle>
            <CardDescription>
              Analyze demand patterns and competition
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Button variant='outline' className='w-full border-slate-200'>
              <Link href='/dashboard/trends'>View Trends</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-slate-800'>Account Status</CardTitle>
            <CardDescription>Your account & billing</CardDescription>
          </CardHeader>

          <CardContent className='flex items-center justify-between'>
            <Badge variant='secondary' className='bg-indigo-50 text-indigo-700'>
              {user?.status || 'Active'}
            </Badge>

            <Button
              asChild
              size='sm'
              className='border border-slate-200 bg-white shadow-sm'
            >
              <Link href='/dashboard/billing'>Manage Plan</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer tip */}
      <div className='rounded-md border border-slate-100 bg-linear-to-r from-white to-slate-50 p-3 text-sm text-slate-600 shadow-sm'>
        Tip: Use our color-coded KPI cards to quickly scan performance —
        gradients and soft shadows improve visual hierarchy.
      </div>
    </div>
  );
}
