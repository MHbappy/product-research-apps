'use client';

import React from 'react';
import {
  Activity,
  Gauge,
  LineChart as LineChartIcon,
  TrendingUp
} from 'lucide-react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
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
  StabilityDiagnosticPoint,
  StabilityVerdict
} from '@/types/product-details.types';
import {
  ChartTooltip,
  MiniStat,
  SoftPill
} from '@/shared/product-details.shared';
import { fmtMonth, fmtCompact } from '@/data/product-details.data';

type Props = {
  data: StabilityDiagnosticPoint[];
  stabilityVerdict: StabilityVerdict;
  latestStability: StabilityDiagnosticPoint;
};

export default function StabilityDiagnosticChart({
  data,
  stabilityVerdict,
  latestStability
}: Props) {
  return (
    <Card className='mt-6 overflow-hidden rounded-[28px] border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950/60'>
      <CardHeader className='pb-2'>
        <div className='flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between'>
          <div>
            <CardTitle className='text-xl'>
              Stability / momentum diagnostic
            </CardTitle>
            <CardDescription>
              A cleaner diagnostic view with trend, slope, spike, and volatility
              context
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
                  data={data}
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
                    Momentum is trending upward, volatility is low, and the most
                    recent spike is within a healthy range.
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
                This product looks strongest when score, quality, and demand are
                balanced against competition.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
