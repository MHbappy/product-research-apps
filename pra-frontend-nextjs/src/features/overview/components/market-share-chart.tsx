'use client';

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  Legend
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { BarChart3 } from 'lucide-react';

/* -------------------------
   Types
   ------------------------- */

type Brand = {
  name: string;
  value: number;
};

type RawMarket = {
  category: string;
  value: number;
  brands?: Brand[];
};

type CategoryData = {
  name: string;
  value: number;
  percent: number;
};

type BrandData = {
  name: string;
  value: number;
  percent: number;
  parent: string;
};

type ProcessedMarket = {
  categories: CategoryData[];
  brands: BrandData[];
  total: number;
};

type Props = {
  rawData: RawMarket[];
};

/* -------------------------
   Helper function
   ------------------------- */

function processMarketShareData(raw: RawMarket[]): ProcessedMarket {
  if (!Array.isArray(raw)) {
    return { categories: [], brands: [], total: 0 };
  }

  const categories = raw.map((c) => ({
    name: c.category,
    value: c.value
  }));

  const brands: BrandData[] = [];

  raw.forEach((c) => {
    if (Array.isArray(c.brands)) {
      c.brands.forEach((b) => {
        brands.push({
          name: b.name,
          value: b.value,
          parent: c.category,
          percent: 0
        });
      });
    }
  });

  const total = raw.reduce((sum, c) => sum + (c.value || 0), 0) || 1;

  const categoriesPct: CategoryData[] = categories.map((c) => ({
    ...c,
    percent: +((100 * c.value) / total).toFixed(1)
  }));

  const brandsPct: BrandData[] = brands.map((b) => ({
    ...b,
    percent: +((100 * b.value) / total).toFixed(1)
  }));

  return {
    categories: categoriesPct,
    brands: brandsPct,
    total
  };
}

/* -------------------------
   Component
   ------------------------- */

export function MarketShareChart({ rawData }: Props) {
  const { categories, brands } = processMarketShareData(rawData);

  const palette = [
    '#4f46e5',
    '#06b6d4',
    '#f59e0b',
    '#ef4444',
    '#10b981',
    '#8b5cf6',
    '#f97316'
  ];

  const categoryColorMap: Record<string, string> = {};
  categories.forEach((c, idx) => {
    categoryColorMap[c.name] = palette[idx % palette.length];
  });

  /* -------------------------
     Tooltip
     ------------------------- */

  const CustomPieTooltip = ({
                              active,
                              payload
                            }: {
    active?: boolean;
    payload?: any[];
  }) => {
    if (!active || !payload || payload.length === 0) return null;

    const item = payload[0].payload as CategoryData & Partial<BrandData>;

    if (item.parent) {
      return (
        <div className='rounded-2xl border border-slate-200/80 bg-white p-3 text-sm shadow-[0_8px_30px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900'>
          <div className='font-semibold text-slate-950 dark:text-white'>
            {item.name}
          </div>
          <div className='text-xs text-slate-600 dark:text-slate-400'>
            Brand of {item.parent}
          </div>
          <div className='mt-1 text-xs text-slate-700 dark:text-slate-300'>
            {item.percent}% of market
          </div>
        </div>
      );
    }

    return (
      <div className='rounded-2xl border border-slate-200/80 bg-white p-3 text-sm shadow-[0_8px_30px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900'>
        <div className='font-semibold text-slate-950 dark:text-white'>
          {item.name}
        </div>
        <div className='mt-1 text-xs text-slate-700 dark:text-slate-300'>
          {item.percent}% of market
        </div>
      </div>
    );
  };

  return (
    <Card className='group relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900'>
      {/* soft hover glow, similar to your MiniStat cards */}
      <div className='pointer-events-none absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-indigo-500/10 blur-2xl transition-opacity duration-300 group-hover:bg-indigo-500/15' />

      <CardHeader className='relative flex items-center justify-between'>
        <CardTitle className='flex items-center gap-2 text-sm font-medium text-slate-950 dark:text-white'>
          <span className='inline-flex items-center justify-center rounded-full bg-amber-500 p-1.5 transition-transform duration-300 group-hover:scale-105'>
            <BarChart3 className='h-4 w-4 text-white' />
          </span>
          Market Share (Sunburst)
        </CardTitle>

        <div className='text-xs font-medium text-slate-600 transition-colors duration-300 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-300'>
          Top categories & brands
        </div>
      </CardHeader>

      <CardContent className='relative'>
        <div className='h-56 w-full md:h-64'>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              {/* Outer ring (categories) */}
              <Pie
                data={categories}
                dataKey='percent'
                nameKey='name'
                cx='50%'
                cy='50%'
                outerRadius='80%'
                innerRadius='48%'
                paddingAngle={2}
                label={({ name }: { name: string }) => name}
                labelLine={false}
              >
                {categories.map((entry, index) => (
                  <Cell
                    key={`cat-${index}`}
                    fill={
                      categoryColorMap[entry.name] ||
                      palette[index % palette.length]
                    }
                  />
                ))}
              </Pie>

              {/* Inner ring (brands) */}
              <Pie
                data={brands}
                dataKey='percent'
                nameKey='name'
                cx='50%'
                cy='50%'
                outerRadius='44%'
                innerRadius='20%'
                paddingAngle={1}
                labelLine={false}
              >
                {brands.map((entry, index) => {
                  const base =
                    categoryColorMap[entry.parent] ||
                    palette[index % palette.length];

                  return <Cell key={`brand-${index}`} fill={base} />;
                })}
              </Pie>

              <ReTooltip content={<CustomPieTooltip />} />

              <Legend
                verticalAlign='bottom'
                height={36}
                wrapperStyle={{ fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className='mt-3 text-xs text-slate-600 dark:text-slate-400'>
          Donut rings: outer = categories, inner = brands. Hover slices for
          exact %.
        </div>
      </CardContent>
    </Card>
  );
}
