'use client';

import Link from 'next/link';
import { Eye, Heart, Star, ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Product } from '@/types/product';
import { formatCompactNumber } from '@/lib/product-utils';

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  const statusLabel =
    product.score >= 85 ? 'Top Pick' : product.score >= 70 ? 'Good Fit' : 'Watch';

  return (
    <article className='h-full'>
      <Card className='group relative h-full overflow-hidden rounded-[28px] border border-slate-200/80 bg-gradient-to-b from-white to-slate-50 shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(15,23,42,0.10)] dark:border-slate-800 dark:from-slate-950 dark:to-slate-900'>
        {/* soft accent glow */}
        <div
          className='pointer-events-none absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full blur-3xl opacity-60 transition-opacity duration-300 group-hover:opacity-80'
          style={{ background: product.color }}
          aria-hidden
        />

        <CardContent className='relative flex h-full flex-col p-4'>
          <div className='flex gap-3'>
            {/* product visual */}
            <div className='relative h-24 w-24 shrink-0 overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm ring-1 ring-black/5 dark:border-slate-800 dark:bg-slate-950 dark:ring-white/10'>
              <div
                className='h-full w-full'
                style={{ background: product.color }}
                aria-hidden
              />
              <div className='absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10' />
            </div>

            {/* main content */}
            <div className='min-w-0 flex-1'>
              <div className='flex items-start justify-between gap-2'>
                <div className='min-w-0 flex-1'>
                  <div className='flex items-center gap-2'>
                    <span className='inline-flex h-6 items-center rounded-full border border-slate-200 bg-white px-2 text-[10px] font-medium text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300'>
                      {product.category}
                    </span>

                    <span className='inline-flex h-6 items-center rounded-full px-2 text-[10px] font-medium text-slate-500 dark:text-slate-400'>
                      #{product.id}
                    </span>
                  </div>

                  <h3
                    className='mt-2 line-clamp-2 text-[14px] leading-5 font-semibold tracking-tight text-slate-950 dark:text-white'
                    title={product.name}
                  >
                    {product.name}
                  </h3>

                  <p className='mt-1 line-clamp-2 text-[12px] leading-5 text-slate-600 dark:text-slate-400'>
                    Strong candidate for product discovery with clear score and quality signals.
                  </p>
                </div>

                <div className='shrink-0 text-right'>
                  <div className='text-lg font-semibold tracking-tight text-slate-950 tabular-nums dark:text-white'>
                    ${(product.price ?? 0).toFixed(2)}
                  </div>

                  <div className='mt-1 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] whitespace-nowrap text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300'>
                    <Star className='h-3.5 w-3.5 fill-amber-400 text-amber-400' />
                    <span className='font-medium tabular-nums'>
                      {(product.rating ?? 0).toFixed(1)}
                    </span>
                    <span className='text-slate-400'>
                      ({product.reviews ?? 0})
                    </span>
                  </div>
                </div>
              </div>

              {/* metric chips */}
              <div className='mt-3 grid grid-cols-2 gap-2'>
                <Badge className='h-7 justify-start rounded-2xl border border-amber-200 bg-amber-50 px-2.5 text-[11px] font-medium text-amber-800 shadow-sm dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-200'>
                  Score: {product.score}
                </Badge>

                <Badge className='h-7 justify-start rounded-2xl border border-violet-200 bg-violet-50 px-2.5 text-[11px] font-medium text-violet-800 shadow-sm dark:border-violet-900/40 dark:bg-violet-900/20 dark:text-violet-200'>
                  Quality: {product.quality}%
                </Badge>

                <Badge className='h-7 justify-start rounded-2xl border border-indigo-200 bg-indigo-50 px-2.5 text-[11px] font-medium text-indigo-800 shadow-sm dark:border-indigo-900/40 dark:bg-indigo-900/20 dark:text-indigo-200'>
                  {product.lifecycle ?? 'unknown'}
                </Badge>

                <Badge className='h-7 justify-start rounded-2xl border border-emerald-200 bg-emerald-50 px-2.5 text-[11px] font-medium text-emerald-800 shadow-sm dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-200'>
                  Comp: {product.competition}
                </Badge>
              </div>
            </div>
          </div>

          {/* footer */}
          <div className='mt-auto pt-4'>
            <div className='flex items-center justify-between rounded-[22px] border border-slate-200/80 bg-white/80 px-3 py-2 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/70'>
              <div className='text-[12px] text-slate-600 dark:text-slate-400'>
                Demand{' '}
                <span className='font-semibold text-slate-900 tabular-nums dark:text-white'>
                  {formatCompactNumber(product.demand)}
                </span>
              </div>

              <span className='inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-600 dark:bg-slate-900 dark:text-slate-300'>
                {statusLabel}
                <ArrowUpRight className='h-3 w-3' />
              </span>
            </div>

            <div className='mt-3 flex items-center justify-between gap-2'>
              <div className='flex items-center gap-2'>
                <Button
                  size='sm'
                  variant='ghost'
                  className='h-8 rounded-full px-3 text-[12px] font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                  asChild
                >
                  <Link href={`/dashboard/product/${product.id}`}>
                    <span className='inline-flex items-center gap-1.5'>
                      <Eye className='h-3.5 w-3.5' />
                      Details
                    </span>
                  </Link>
                </Button>

                <Button
                  size='sm'
                  variant='outline'
                  aria-label={`save ${product.name}`}
                  className='h-8 w-8 rounded-full border-slate-200 bg-white p-0 text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                >
                  <Heart className='h-3.5 w-3.5' />
                </Button>
              </div>

              <div className='inline-flex h-8 items-center rounded-full border border-slate-200 bg-white px-3 text-[11px] font-medium text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'>
                {product.score >= 85
                  ? 'Premium'
                  : product.score >= 70
                    ? 'Solid'
                    : 'Review'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </article>
  );
}