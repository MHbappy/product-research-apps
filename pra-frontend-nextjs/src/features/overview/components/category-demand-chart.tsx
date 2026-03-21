'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip as ReTooltip,
  Cell,
  YAxis
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import React from 'react';

/* -------------------------
   Types
   ------------------------- */

type RawCategory = {
  category: string;
  value: number;
  delta?: number;
  sampleSize?: number;
};

type ProcessedCategory = {
  category: string;
  percent: number;
  delta: number;
  sampleSize: number;
  rawValue: number;
};

type Props = {
  rawData: RawCategory[];
  top?: number;
};

/* -------------------------
   Helper functions
   ------------------------- */

function processCategoryData(
  rawData: RawCategory[],
  limit: number = 6
): ProcessedCategory[] {
  if (!Array.isArray(rawData) || rawData.length === 0) return [];

  const sorted = [...rawData].sort((a, b) => b.value - a.value);

  const total = sorted.reduce((sum, item) => sum + (item.value || 0), 0) || 1;

  const topItems = sorted.slice(0, limit);
  const restItems = sorted.slice(limit);

  const othersValue = restItems.reduce(
    (sum, item) => sum + (item.value || 0),
    0
  );

  const mapped: ProcessedCategory[] = topItems.map((item) => ({
    category: item.category,
    percent: +((100 * (item.value || 0)) / total).toFixed(1),
    delta: item.delta ?? 0,
    sampleSize: item.sampleSize ?? item.value ?? 0,
    rawValue: item.value ?? 0
  }));

  if (othersValue > 0) {
    mapped.push({
      category: 'Others',
      percent: +((100 * othersValue) / total).toFixed(1),
      delta: 0,
      sampleSize: othersValue,
      rawValue: othersValue
    });
  }

  return mapped;
}

function formatPercent(val: number | null | undefined): string {
  if (val === null || val === undefined) return '-';
  return `${val}%`;
}

/* -------------------------
   Component
   ------------------------- */

export function CategoryDemandChart({ rawData, top = 6 }: Props) {
  const data = processCategoryData(rawData, top);

  const ACCENT = '#4f46e5';
  const ACCENT_UP = '#059669';
  const ACCENT_DOWN = '#ef4444';
  const NEUTRAL = '#94a3b8';

  function handleBarClick(entry: any) {
    console.log('Category clicked:', entry?.category);
  }

  const [axisTextColor, setAxisTextColor] = React.useState('#0f172a');

  React.useEffect(() => {
    const update = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setAxisTextColor(isDark ? '#e2e8f0' : '#0f172a');
    };

    update();

    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  /* -------------------------
     Tooltip
     ------------------------- */
  const CustomBarTooltip = ({
    active,
    payload
  }: {
    active?: boolean;
    payload?: any[];
  }) => {
    if (!active || !payload || payload.length === 0) return null;

    const item = payload[0].payload as ProcessedCategory;

    return (
      <div className='rounded-2xl border border-slate-200/80 bg-white p-3 text-sm shadow-[0_8px_30px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900'>
        <div className='font-semibold text-slate-950 dark:text-white'>
          {item.category}
        </div>

        <div className='mt-1 text-xs text-slate-600 dark:text-slate-400'>
          Share:{' '}
          <span className='font-semibold text-slate-900 dark:text-slate-100'>
            {formatPercent(item.percent)}
          </span>
        </div>

        <div className='text-xs text-slate-500 dark:text-slate-400'>
          Sample: {item.sampleSize}
        </div>

        <div
          className={`mt-1 text-xs ${
            item.delta > 0
              ? 'text-emerald-600 dark:text-emerald-400'
              : item.delta < 0
                ? 'text-red-600 dark:text-red-400'
                : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          {item.delta > 0
            ? `▲ ${item.delta}% vs prev`
            : item.delta < 0
              ? `▼ ${Math.abs(item.delta)}% vs prev`
              : 'No change'}
        </div>
      </div>
    );
  };

  return (
    <Card className='group relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900'>
      {/* Glow effect like MiniStat */}
      <div className='pointer-events-none absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-indigo-500/10 blur-2xl transition-all duration-300 group-hover:bg-indigo-500/20' />

      <CardHeader className='relative flex items-center justify-between'>
        <CardTitle className='flex items-center gap-2 text-sm font-medium text-slate-950 dark:text-white'>
          <span className='inline-flex items-center justify-center rounded-full bg-indigo-600 p-1.5 transition-transform duration-300 group-hover:scale-105'>
            <BarChart3 className='h-4 w-4 text-white' />
          </span>
          Category Demand Snapshot
        </CardTitle>

        <div className='text-xs font-medium text-slate-600 transition-colors duration-300 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-300'>
          Based on views (you can switch to purchases)
        </div>
      </CardHeader>

      <CardContent className='relative'>
        <div className='h-56 w-full md:h-64'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              layout='vertical'
              data={data}
              margin={{ top: 8, right: 12, left: 8, bottom: 8 }}
              barCategoryGap='16%'
            >
              <XAxis
                type='number'
                domain={[0, 100]}
                tickFormatter={(val: number) => `${val}%`}
                axisLine={false}
                tickLine={false}
                tick={{ fill: axisTextColor, fontSize: 12 }}
              />
              <YAxis
                type='category'
                dataKey='category'
                width={120}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 13, fill: axisTextColor }}
              />
              <ReTooltip content={<CustomBarTooltip />} />
              <Bar
                dataKey='percent'
                isAnimationActive
                barSize={14}
                onClick={handleBarClick}
              >
                {data.map((entry, index) => {
                  const color =
                    entry.delta > 0
                      ? ACCENT_UP
                      : entry.delta < 0
                        ? ACCENT_DOWN
                        : ACCENT;

                  const fill = entry.category === 'Others' ? NEUTRAL : color;

                  return <Cell key={`cell-${index}`} fill={fill} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className='mt-3 flex items-center justify-between'>
          <div className='flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400'>
            <div className='flex items-center gap-2'>
              <span className='h-3 w-3 rounded-sm bg-indigo-600' />
              <span>Stable</span>
            </div>

            <div className='flex items-center gap-2'>
              <span className='h-3 w-3 rounded-sm bg-emerald-600' />
              <span>Rising</span>
            </div>

            <div className='flex items-center gap-2'>
              <span className='h-3 w-3 rounded-sm bg-red-600' />
              <span>Falling</span>
            </div>
          </div>

          <div className='text-xs text-slate-500 dark:text-slate-400'>
            <span className='hidden md:inline'>
              Click a bar to filter the dashboard
            </span>
            <span className='md:hidden'>Tap a bar to filter</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
