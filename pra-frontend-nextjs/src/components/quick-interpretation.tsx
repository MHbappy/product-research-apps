'use client';

import React from 'react';
import {
  Activity,
  BadgeInfo,
  LineChart as LineChartIcon,
  Sparkles,
  Star,
  TrendingUp
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import type {
  SentimentSummary,
  StarSummary,
  StabilityDiagnosticPoint,
  StabilityVerdict
} from '@/types/product-details.types';
import { MiniStat, SoftPill } from '@/shared/product-details.shared';
import { fmtMonth } from '@/data/product-details.data';

type Props = {
  sentimentSummary: SentimentSummary;
  starSummary: StarSummary;
  latestStability: StabilityDiagnosticPoint;
  stabilityVerdict: StabilityVerdict;
  momentumDirection: string;
};

export default function QuickInterpretation({
  sentimentSummary,
  starSummary,
  latestStability,
  stabilityVerdict,
  momentumDirection
}: Props) {
  return (
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
            Demand and rating signals are healthy while competition is still
            manageable. This gives the product a strong, but not perfect,
            discovery profile.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
