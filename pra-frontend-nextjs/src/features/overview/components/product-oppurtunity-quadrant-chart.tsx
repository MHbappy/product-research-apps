'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { BarChart3 } from 'lucide-react';

/* Recharts imports */
import {
  ResponsiveContainer,
  XAxis,
  Tooltip as ReTooltip,
  TooltipProps,
  Cell,
  Legend,
  CartesianGrid,
  ScatterChart,
  Scatter,
  YAxis,
  ReferenceLine,
  ReferenceArea
} from 'recharts';

type ProductItem = {
  id?: string | number;
  name: string;
  demand: number;
  competition: number;
  size?: number;
  color?: string;
};

interface ProductOpportunityQuadrantProps {
  rawData?: Array<Partial<ProductItem> & { [k: string]: any }>;
  demandPct?: number;
  competitionPct?: number;
  invertYAxis?: boolean;
}

function percentile(arr: number[], p: number) {
  if (!Array.isArray(arr) || arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  const weight = idx - lo;
  return sorted[lo] * (1 - weight) + sorted[hi] * weight;
}

function getQuadrantLabel(
  demand: number,
  competition: number,
  dThresh: number,
  cThresh: number
) {
  if (demand >= dThresh && competition <= cThresh) return 'Goldmine (Scale)';
  if (demand >= dThresh && competition > cThresh)
    return 'Battlefield (Compete)';
  if (demand < dThresh && competition > cThresh) return 'Dead Zone (Avoid)';
  return 'Niche (Explore)';
}

export function ProductOpportunityQuadrant({
  rawData = [],
  demandPct = 0.6,
  competitionPct = 0.4,
  invertYAxis = false
}: ProductOpportunityQuadrantProps) {
  const data: ProductItem[] = (rawData || []).map((p) => ({
    id: p.id,
    name: (p.name as string) || '—',
    demand: Number((p as any).demand) || 0,
    competition: Number((p as any).competition) || 0,
    size: Number((p as any).size) || 70,
    color: (p as any).color || '#64748b'
  }));

  const demandVals = data.map((d) => d.demand);
  const competitionVals = data.map((d) => d.competition);

  const demandThresh = percentile(demandVals, demandPct);
  const competitionThresh = percentile(competitionVals, competitionPct);

  const minDemand = Math.min(...demandVals, 0);
  const maxDemand = Math.max(...demandVals, 1000);
  const padX = Math.max(1, Math.round((maxDemand - minDemand) * 0.08));

  const minComp = Math.min(...competitionVals, 0);
  const maxComp = Math.max(...competitionVals, 10);
  const padY = Math.max(1, Math.round((maxComp - minComp) * 0.08));

  const goldmineFill = 'rgba(16,185,129,0.08)';
  const battlefieldFill = 'rgba(245,158,11,0.06)';
  const deadFill = 'rgba(239,68,68,0.06)';
  const nicheFill = 'rgba(99,102,241,0.06)';

  const CustomScatterTooltip: React.FC<TooltipProps<any, string>> = (props) => {
    const { active, payload } = props;
    if (!active || !payload || !payload.length) return null;

    const p = payload[0].payload as ProductItem;

    return (
      <div className='rounded-2xl border border-slate-200/80 bg-white p-3 text-sm shadow-[0_8px_30px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900'>
        <div className='font-semibold text-slate-950 dark:text-white'>
          {p.name}
        </div>
        <div className='mt-1 text-xs text-slate-600 dark:text-slate-400'>
          Demand:{' '}
          <span className='font-semibold text-slate-900 dark:text-slate-100'>
            {p.demand}
          </span>
        </div>
        <div className='text-xs text-slate-600 dark:text-slate-400'>
          Competition:{' '}
          <span className='font-semibold text-slate-900 dark:text-slate-100'>
            {p.competition}
          </span>
        </div>
        <div className='mt-1 text-xs text-slate-500 dark:text-slate-400'>
          {getQuadrantLabel(
            p.demand,
            p.competition,
            demandThresh,
            competitionThresh
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className='group relative min-w-0 overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900'>
      {/* Glow effect (MiniStat style) */}
      <div className='pointer-events-none absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-emerald-500/10 blur-2xl transition-all duration-300 group-hover:bg-emerald-500/20' />

      <CardHeader className='relative flex items-center justify-between'>
        <CardTitle className='flex items-center gap-2 text-sm font-medium text-slate-950 dark:text-white'>
          <span className='inline-flex items-center justify-center rounded-full bg-emerald-500 p-1.5 transition-transform duration-300 group-hover:scale-105'>
            <BarChart3 className='h-4 w-4 text-white' />
          </span>
          Product Opportunity Quadrant
        </CardTitle>

        <div className='text-xs text-slate-600 transition-colors duration-300 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-300'>
          Demand → (right) — Competition ↑ (up)
        </div>
      </CardHeader>

      <CardContent className='relative min-w-0'>
        <div
          style={{ width: '100%', height: 360, minWidth: 0 }}
          className='min-w-0'
        >
          <ResponsiveContainer width='100%' height='100%'>
            <ScatterChart margin={{ top: 12, right: 40, bottom: 36, left: 12 }}>
              <CartesianGrid stroke='#e6e9ee' strokeDasharray='3 3' />

              <XAxis
                type='number'
                dataKey='demand'
                name='Demand'
                domain={[Math.max(0, minDemand - padX), maxDemand + padX]}
                tick={{ fontSize: 12, fill: '#0f172a' }}
                tickFormatter={(v) => `${v}`}
                padding={{ left: 12, right: 12 }}
                label={{
                  value: 'Market Demand (volume)',
                  position: 'bottom',
                  offset: 12,
                  style: { fontSize: 12, fill: '#64748b' }
                }}
              />

              <YAxis
                type='number'
                dataKey='competition'
                name='Competition'
                domain={[Math.max(0, minComp - padY), maxComp + padY]}
                tick={{ fontSize: 12, fill: '#0f172a' }}
                width={80}
                label={{
                  value: 'Competitive Difficulty (higher = harder)',
                  angle: -90,
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fontSize: 12, fill: '#64748b' }
                }}
                reversed={invertYAxis}
              />

              <ReferenceLine
                x={demandThresh}
                stroke='#94a3b8'
                strokeDasharray='3 3'
              />
              <ReferenceLine
                y={competitionThresh}
                stroke='#94a3b8'
                strokeDasharray='3 3'
              />

              <ReferenceArea
                x1={Math.max(0, minDemand - padX)}
                x2={demandThresh}
                y1={Math.max(0, minComp - padY)}
                y2={competitionThresh}
                fill={nicheFill}
              />
              <ReferenceArea
                x1={demandThresh}
                x2={maxDemand + padX}
                y1={Math.max(0, minComp - padY)}
                y2={competitionThresh}
                fill={goldmineFill}
              />
              <ReferenceArea
                x1={demandThresh}
                x2={maxDemand + padX}
                y1={competitionThresh}
                y2={maxComp + padY}
                fill={battlefieldFill}
              />
              <ReferenceArea
                x1={Math.max(0, minDemand - padX)}
                x2={demandThresh}
                y1={competitionThresh}
                y2={maxComp + padY}
                fill={deadFill}
              />

              <ReTooltip content={<CustomScatterTooltip />} />

              <Legend
                verticalAlign='top'
                align='right'
                wrapperStyle={{ fontSize: 12 }}
                payload={[
                  {
                    value: 'Goldmine — high demand, low competition',
                    type: 'square',
                    color: '#10b981'
                  },
                  {
                    value: 'Battlefield — high demand, high competition',
                    type: 'square',
                    color: '#f59e0b'
                  },
                  {
                    value: 'Dead Zone — low demand, high competition',
                    type: 'square',
                    color: '#ef4444'
                  },
                  {
                    value: 'Niche — low demand, low competition',
                    type: 'square',
                    color: '#6366f1'
                  }
                ]}
              />

              <Scatter name='products' data={data} fill='#8884d8'>
                {data.map((entry, i) => (
                  <Cell
                    key={`cell-${i}`}
                    {...({
                      r: Math.max(30, Math.min(180, entry.size || 70)),
                      fill: entry.color,
                      stroke: '#fff'
                    } as any)}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        {/* quick legend text */}
        {/*<div className='mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600'>*/}
        {/*  <div>*/}
        {/*    <strong>Demand threshold:</strong> {Math.round(demandThresh)}*/}
        {/*  </div>*/}
        {/*  <div>*/}
        {/*    <strong>Competition threshold:</strong>{' '}*/}
        {/*    {Math.round(competitionThresh)}*/}
        {/*  </div>*/}
        {/*  <div className='col-span-2 mt-1 text-xs text-slate-500'>*/}
        {/*    Tip: hover a bubble to see product details. Bubble size approximates*/}
        {/*    relative opportunity (larger → bigger potential).*/}
        {/*  </div>*/}
        {/*</div>*/}
      </CardContent>
    </Card>
  );
}
