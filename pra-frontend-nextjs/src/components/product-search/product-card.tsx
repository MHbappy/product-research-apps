'use client';

import React from 'react';
import { Star } from 'lucide-react';

import {
  type Product,
  fmtNumber,
  fmtPrice,
  toTitle
} from '@/data/product-search-data';
import { SoftPill } from '@/components/product-search/product-search-ui';

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className='group overflow-hidden rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950/60'>
      <div className='flex gap-4'>
        <div
          className='relative h-28 w-28 shrink-0 overflow-hidden rounded-3xl'
          style={{
            background: `radial-gradient(circle at 20% 20%, ${product.color}50, transparent 40%), linear-gradient(160deg, ${product.color}dd 0%, #0f172a 100%)`
          }}
        >
          <div className='absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.18)_0%,transparent_35%,transparent_65%,rgba(255,255,255,0.08)_100%)]' />
          <div className='absolute inset-x-3 bottom-3'>
            <SoftPill tone='slate'>#{product.id}</SoftPill>
          </div>
        </div>

        <div className='min-w-0 flex-1'>
          <div className='flex flex-wrap items-center gap-2'>
            <SoftPill tone='indigo'>{product.category}</SoftPill>
            <SoftPill
              tone={
                product.type === 'WINNING'
                  ? 'emerald'
                  : product.type === 'DYING' || product.type === 'FADE'
                    ? 'rose'
                    : 'amber'
              }
            >
              {product.type}
            </SoftPill>
            <SoftPill
              tone={
                product.sentiment === 'positive'
                  ? 'emerald'
                  : product.sentiment === 'neutral'
                    ? 'amber'
                    : 'rose'
              }
            >
              {toTitle(product.sentiment)}
            </SoftPill>
          </div>

          <h3 className='mt-3 line-clamp-2 text-lg font-semibold tracking-tight text-slate-950 dark:text-white'>
            {product.title}
          </h3>

          <div className='mt-3 grid gap-2 sm:grid-cols-2'>
            <div className='rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50'>
              <div className='text-[11px] tracking-[0.16em] text-slate-500 uppercase dark:text-slate-400'>
                Price
              </div>
              <div className='mt-1 text-base font-semibold text-slate-950 dark:text-white'>
                {fmtPrice(product.price)}
              </div>
            </div>
            <div className='rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50'>
              <div className='text-[11px] tracking-[0.16em] text-slate-500 uppercase dark:text-slate-400'>
                Rating
              </div>
              <div className='mt-1 flex items-center gap-2 text-base font-semibold text-slate-950 dark:text-white'>
                <Star className='h-4 w-4 fill-amber-400 text-amber-400' />
                {product.rating.toFixed(1)} / 5
              </div>
            </div>
          </div>

          <div className='mt-3 flex flex-wrap gap-2'>
            <SoftPill tone='slate'>
              {fmtNumber(product.reviews)} reviews
            </SoftPill>
            <SoftPill tone='indigo'>Score {product.score}</SoftPill>
            {product.visualTags.slice(0, 3).map((tag) => (
              <SoftPill key={tag} tone='slate'>
                {tag}
              </SoftPill>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
