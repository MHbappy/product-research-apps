'use client';

import React from 'react';
import {
  BadgeInfo,
  ArrowUpRight,
  Gauge,
  Heart,
  Sparkles,
  Star,
  TrendingUp,
  BarChart3,
  ShieldCheck,
  Layers3
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Product } from '@/types/product-details.types';
import {
  SoftPill,
  MiniStat,
  MetricCard
} from '@/shared/product-details.shared';
import { fmtNumber } from '@/data/product-details.data';

type Props = {
  product: Product;
  lifecycleText: string;
  opportunity: string;
  totalRisk: string;
  ratingText: string;
  reviewText: string;
};

export default function ProductSnapshot({
  product,
  lifecycleText,
  opportunity,
  totalRisk,
  ratingText,
  reviewText
}: Props) {
  const accent = product.color ?? '#6366f1';

  return (
    <Card className='overflow-hidden rounded-[28px] border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950/60'>
      <CardContent className='p-0'>
        <div className='grid lg:grid-cols-[360px_minmax(0,1fr)]'>
          <div className='relative isolate min-h-[360px] overflow-hidden'>
            <div
              className='absolute inset-0'
              style={{
                background: `
                  radial-gradient(circle at 18% 15%, ${accent}45, transparent 34%),
                  radial-gradient(circle at 85% 20%, rgba(255,255,255,0.18), transparent 22%),
                  linear-gradient(160deg, ${accent}dd 0%, #0f172a 100%)
                `
              }}
              aria-hidden
            />
            <div className='absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.16)_0%,transparent_35%,transparent_65%,rgba(255,255,255,0.08)_100%)]' />
            <div className='relative z-10 flex h-full flex-col justify-between p-6 text-white'>
              <div className='flex items-center gap-2 text-sm font-medium'>
                <Sparkles className='h-4 w-4' />
                Product snapshot
              </div>

              <div className='space-y-4'>
                <div className='inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/12 px-3 py-1.5 text-xs backdrop-blur-md'>
                  <BadgeInfo className='h-3.5 w-3.5' />
                  Dynamic insights by id
                </div>

                <div className='space-y-2'>
                  <div className='text-sm text-white/70'>Price</div>
                  <div className='text-4xl font-semibold tracking-tight'>
                    ${(product.price ?? 0).toFixed(2)}
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-3 sm:max-w-sm'>
                  <div className='rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-md'>
                    <div className='text-[11px] tracking-[0.14em] text-white/70 uppercase'>
                      Lifecycle
                    </div>
                    <div className='mt-1 text-sm font-semibold'>
                      {lifecycleText}
                    </div>
                  </div>
                  <div className='rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-md'>
                    <div className='text-[11px] tracking-[0.14em] text-white/70 uppercase'>
                      Opportunity
                    </div>
                    <div className='mt-1 text-sm font-semibold'>
                      {opportunity}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='min-w-0 p-5 sm:p-6'>
            <div className='grid gap-4 sm:grid-cols-2'>
              <MetricCard
                icon={<Star className='h-4 w-4' />}
                label='Rating'
                value={ratingText}
                hint={`${reviewText} reviews`}
                accent='amber'
              />
              <MetricCard
                icon={<TrendingUp className='h-4 w-4' />}
                label='Demand'
                value={fmtNumber(product.demand)}
                hint='Current demand signal'
                accent='emerald'
              />
              <MetricCard
                icon={<BarChart3 className='h-4 w-4' />}
                label='Competition'
                value={String(product.competition)}
                hint={totalRisk}
                accent='rose'
              />
              <MetricCard
                icon={<ShieldCheck className='h-4 w-4' />}
                label='Quality / Score'
                value={`${product.quality}% / ${product.score}`}
                hint='Combined product health'
                accent='indigo'
              />
            </div>

            <div className='mt-4 grid gap-4 md:grid-cols-3'>
              <MiniStat
                label='Lifecycle'
                value={lifecycleText}
                caption='Long-term pattern'
                icon={<Layers3 className='h-4 w-4' />}
                tone='indigo'
              />
              <MiniStat
                label='Opportunity'
                value={opportunity}
                caption='Decision signal'
                icon={<ArrowUpRight className='h-4 w-4' />}
                tone='emerald'
              />
              <MiniStat
                label='Market note'
                value={
                  product.score >= 85
                    ? 'Very strong'
                    : product.score >= 70
                      ? 'Promising'
                      : 'Needs validation'
                }
                caption='Competitive context'
                icon={<Gauge className='h-4 w-4' />}
                tone='amber'
              />
            </div>

            <div className='mt-4 flex flex-wrap gap-2'>
              <SoftPill tone='indigo'>Score {product.score}</SoftPill>
              <SoftPill tone='emerald'>Quality {product.quality}%</SoftPill>
              <SoftPill tone='slate'>
                Demand {fmtNumber(product.demand)}
              </SoftPill>
              <SoftPill tone='amber'>
                Competition {product.competition}
              </SoftPill>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
