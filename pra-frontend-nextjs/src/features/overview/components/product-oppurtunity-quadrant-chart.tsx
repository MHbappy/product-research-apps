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
  // defensive: ensure numeric fields
  const data: ProductItem[] = (rawData || []).map((p) => ({
    id: p.id,
    name: (p.name as string) || '—',
    demand: Number((p as any).demand) || 0,
    competition: Number((p as any).competition) || 0,
    size: Number((p as any).size) || 70,
    color: (p as any).color || '#64748b'
  }));

  // thresholds derived from percentiles so thresholds adapt to dataset scale
  const demandVals = data.map((d) => d.demand);
  const competitionVals = data.map((d) => d.competition);

  const demandThresh = percentile(demandVals, demandPct);
  const competitionThresh = percentile(competitionVals, competitionPct);

  // chart domain padding
  const minDemand = Math.min(...demandVals, 0);
  const maxDemand = Math.max(...demandVals, 1000);
  const padX = Math.max(1, Math.round((maxDemand - minDemand) * 0.08));

  const minComp = Math.min(...competitionVals, 0);
  const maxComp = Math.max(...competitionVals, 10);
  const padY = Math.max(1, Math.round((maxComp - minComp) * 0.08));

  // quadrant palette (subtle fills)
  const goldmineFill = 'rgba(16,185,129,0.08)'; // light green
  const battlefieldFill = 'rgba(245,158,11,0.06)'; // light amber
  const deadFill = 'rgba(239,68,68,0.06)'; // light red
  const nicheFill = 'rgba(99,102,241,0.06)'; // light indigo

  // ---- Fix: loosen TooltipProps value generic to `any` so TS doesn't complain ----
  const CustomScatterTooltip: React.FC<TooltipProps<any, string>> = (props) => {
    const { active, payload } = props;
    if (!active || !payload || !payload.length) return null;
    const p = payload[0].payload as ProductItem;
    return (
      <div className='rounded-md border border-slate-100 bg-white p-2 text-sm shadow-md'>
        <div className='font-medium text-slate-800'>{p.name}</div>
        <div className='mt-1 text-xs text-slate-600'>
          Demand: <span className='font-semibold'>{p.demand}</span>
        </div>
        <div className='text-xs text-slate-600'>
          Competition: <span className='font-semibold'>{p.competition}</span>
        </div>
        <div className='mt-1 text-xs text-slate-500'>
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
    // add min-w-0 so this card can shrink inside a flex/grid column and not force extra width
    <Card className='min-w-0 overflow-hidden dark:bg-slate-800'>
      <CardHeader className='flex items-center justify-between'>
        <CardTitle className='flex items-center gap-2 text-sm font-medium text-slate-700'>
          <span className='inline-flex items-center justify-center rounded-full bg-emerald-500 p-1.5'>
            <BarChart3 className='h-4 w-4 text-white' />
          </span>
          Product Opportunity Quadrant
        </CardTitle>

        <div className='text-xs text-slate-500'>
          Demand → (right) — Competition ↑ (up)
        </div>
      </CardHeader>

      {/* ensure the card content can shrink (min-w-0) and hide overflow if required */}
      <CardContent className='min-w-0'>
        <div
          // keep exact height, allow width to shrink with minWidth:0
          style={{ width: '100%', height: 360, minWidth: 0 }}
          className='min-w-0'
        >
          {/* ResponsiveContainer will fill the available column width */}
          <ResponsiveContainer width='100%' height='100%'>
            {/* increase right margin and give left margin room so axis labels/ticks don't get clipped */}
            <ScatterChart margin={{ top: 12, right: 40, bottom: 36, left: 12 }}>
              <CartesianGrid stroke='#e6e9ee' strokeDasharray='3 3' />

              {/* X = demand */}
              <XAxis
                type='number'
                dataKey='demand'
                name='Demand'
                domain={[Math.max(0, minDemand - padX), maxDemand + padX]}
                tick={{ fontSize: 12, fill: '#0f172a' }}
                tickFormatter={(v) => `${v}`}
                // add padding to avoid ticks/labels hitting edge; offset label more into visible area
                padding={{ left: 12, right: 12 }}
                label={{
                  value: 'Market Demand (volume)',
                  position: 'bottom',
                  offset: 12,
                  style: { fontSize: 12, fill: '#64748b' }
                }}
              />

              {/* Y = competition difficulty */}
              {/* reserve width so long label fits and doesn't cause horizontal overflow */}
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

              {/* quadrant threshold lines */}
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

              {/* quadrant shading (use ReferenceArea coordinates) */}
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
