'use client';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  Legend
} from 'recharts';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import React from 'react';

/* -------------------------
   Types
   ------------------------- */

type RawTimeSeries = {
  date: string; // YYYY-MM-DD
  views: number;
  conversions: number;
};

type ProcessedTimeSeries = RawTimeSeries & {
  label: string;
};

type Props = {
  rawData: RawTimeSeries[];
};

/* -------------------------
   Helpers
   ------------------------- */

function formatDateLabelISO(isoDateStr: string): string {
  if (!isoDateStr) return '';

  const parts = isoDateStr.split('-');
  if (parts.length < 3) return isoDateStr;

  const year = Number(parts[0]);
  const month = Number(parts[1]) - 1;
  const day = Number(parts[2]);

  const d = new Date(Date.UTC(year, month, day));

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];

  return `${d.getUTCDate()} ${monthNames[d.getUTCMonth()]}`;
}

function processTimeSeriesData(raw: RawTimeSeries[]): ProcessedTimeSeries[] {
  if (!Array.isArray(raw)) return [];

  const sorted = [...raw].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return sorted.map((item) => ({
    ...item,
    label: formatDateLabelISO(item.date)
  }));
}

/* -------------------------
   Tooltip
   ------------------------- */

function CustomTimeTooltip({
  active,
  payload
}: {
  active?: boolean;
  payload?: any[];
}) {
  if (!active || !payload || payload.length === 0) return null;

  const item = payload[0].payload as ProcessedTimeSeries;

  const conversionRate = (item.conversions / Math.max(1, item.views)) * 100;

  return (
    <div className='rounded-md border border-slate-100 bg-white p-2 text-sm shadow-md'>
      <div className='font-medium text-slate-800'>{item.label}</div>

      <div className='mt-1 text-xs text-slate-600'>
        Views: <span className='font-semibold'>{item.views}</span>
      </div>

      <div className='text-xs text-slate-600'>
        Conversions: <span className='font-semibold'>{item.conversions}</span>
      </div>

      <div className='mt-1 text-xs text-slate-500'>
        Conv Rate:{' '}
        <span className='font-semibold'>{conversionRate.toFixed(2)}%</span>
      </div>
    </div>
  );
}

/* -------------------------
   Component
   ------------------------- */

export function TimeSeriesChart({ rawData }: Props) {
  const data = processTimeSeriesData(rawData);

  const viewsColor = '#4f46e5';
  const convColor = '#06b6d4';

  const [axisTextColor, setAxisTextColor] = React.useState('#0f172a');

  React.useEffect(() => {
    const update = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setAxisTextColor(isDark ? '#e5e7eb' : '#0f172a');
    };

    update();

    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  return (
    <Card className='overflow-hidden dark:bg-slate-800'>
      <CardHeader className='flex items-center justify-between'>
        <div>
          <CardTitle className='text-sm font-medium text-slate-700'>
            Performance Over Time
          </CardTitle>
          <CardDescription>Views vs Conversions (last 30 days)</CardDescription>
        </div>

        <div className='text-xs font-medium text-slate-500'>Last 30 days</div>
      </CardHeader>

      <CardContent>
        <div className='h-64 w-full md:h-80'>
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart
              data={data}
              margin={{ top: 8, right: 20, left: 0, bottom: 8 }}
            >
              {/* Gradients */}
              <defs>
                <linearGradient id='gradViews' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor={viewsColor} stopOpacity={0.12} />
                  <stop offset='95%' stopColor={viewsColor} stopOpacity={0} />
                </linearGradient>

                <linearGradient id='gradConv' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor={convColor} stopOpacity={0.12} />
                  <stop offset='95%' stopColor={convColor} stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray='3 3'
                stroke='#e6e9ee'
                vertical={false}
              />

              <XAxis
                dataKey='label'
                tick={{ fontSize: 12, fill: axisTextColor }}
              />

              <YAxis
                yAxisId='left'
                tick={{ fontSize: 12, fill: axisTextColor }}
              />

              <ReTooltip content={<CustomTimeTooltip />} />

              {/* Views */}
              <Area
                yAxisId='left'
                type='monotone'
                dataKey='views'
                stroke={viewsColor}
                fill='url(#gradViews)'
                strokeWidth={2}
              />

              <Line
                yAxisId='left'
                type='monotone'
                dataKey='views'
                stroke={viewsColor}
                dot={false}
                strokeWidth={2}
              />

              {/* Conversions */}
              <Line
                yAxisId='left'
                type='monotone'
                dataKey='conversions'
                stroke={convColor}
                dot={{ r: 3 }}
                strokeWidth={2}
              />

              <Legend
                verticalAlign='top'
                height={36}
                wrapperStyle={{ fontSize: 12 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className='mt-3 text-xs text-slate-600'>
          Area shading shows volume; lines show trend. Hover for exact numbers.
        </div>
      </CardContent>
    </Card>
  );
}
