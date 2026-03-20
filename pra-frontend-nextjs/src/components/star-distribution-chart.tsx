'use client';

import React from 'react';
import { BarChart3, ShieldCheck, Star } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle
} from '@/components/ui/card';
import type {
  StarDistributionPoint,
  StarSummary
} from '@/types/product-details.types';
import {
  ChartTooltip,
  MiniStat,
  SoftPill
} from '@/shared/product-details.shared';
import { fmtCompact } from '@/data/product-details.data';

type Props = {
  data: StarDistributionPoint[];
  starSummary: StarSummary;
  ratingText: string;
  reviewText: string;
};

export default function StarDistributionChart({
  data,
  starSummary,
  ratingText,
  reviewText
}: Props) {
  return (
    <Card className='mt-6 overflow-hidden rounded-[28px] border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950/60'>
      <CardHeader className='pb-2'>
        <div className='flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between'>
          <div>
            <CardTitle className='text-xl'>Star distribution</CardTitle>
            <CardDescription>
              Horizontal bar chart showing rating density across 1★ to 5★
            </CardDescription>
          </div>
          <SoftPill tone='slate'>Total ratings {starSummary.total}</SoftPill>
        </div>
      </CardHeader>

      <CardContent>
        <div className='grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]'>
          <div className='min-w-0 rounded-[24px] border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900'>
            <div className='h-[350px] w-full'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart
                  data={data}
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
                A large share of 5★ reviews indicates strong user satisfaction,
                while a visible middle band shows the product still has normal
                variance.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
