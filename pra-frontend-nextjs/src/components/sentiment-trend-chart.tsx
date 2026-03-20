'use client';

import React from 'react';
import { Activity, BadgeInfo, Sparkles, TrendingUp } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
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
  SentimentSummary,
  SentimentTrendPoint
} from '@/types/product-details.types';
import {
  MiniStat,
  SoftPill,
  ChartTooltip
} from '@/shared/product-details.shared';
import { fmtMonth } from '@/data/product-details.data';

type Props = {
  data: SentimentTrendPoint[];
  sentimentSummary: SentimentSummary;
};

export default function SentimentTrendChart({ data, sentimentSummary }: Props) {
  return (
    <Card className='mt-6 overflow-hidden rounded-[28px] border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950/60'>
      <CardHeader className='pb-2'>
        <div className='flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between'>
          <div>
            <CardTitle className='text-xl'>Sentiment trend</CardTitle>
            <CardDescription>
              Stacked area chart showing positive, neutral, and negative signals
              over time
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
                  data={data}
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
  );
}
