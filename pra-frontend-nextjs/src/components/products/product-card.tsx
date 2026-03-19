'use client';

import Link from 'next/link';
import { Eye, Heart, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Product } from '@/types/product';
import { formatCompactNumber } from '@/lib/product-utils';

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  return (
    <article className='h-full'>
      <Card className='group h-full overflow-hidden border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800'>
        <CardContent className='flex h-full flex-col p-3'>
          <div className='flex gap-2.5'>
            <div
              className='h-24 w-24 shrink-0 overflow-hidden rounded-xl ring-1 ring-black/5 dark:ring-white/10'
              style={{ background: product.color }}
              aria-hidden
            />

            <div className='min-w-0 flex-1'>
              <div className='flex items-start justify-between gap-2'>
                <div className='min-w-0 flex-1'>
                  <h3
                    className='line-clamp-2 text-[13px] leading-[1.25rem] font-semibold text-slate-900 dark:text-slate-100'
                    title={product.name}
                  >
                    {product.name}
                  </h3>

                  <div className='mt-[2px] truncate text-[11px] text-slate-500 dark:text-slate-400'>
                    {product.category}
                  </div>
                </div>

                <div className='shrink-0 text-right'>
                  <div className='text-sm font-semibold text-slate-900 tabular-nums dark:text-slate-100'>
                    ${(product.price ?? 0).toFixed(2)}
                  </div>

                  <div className='mt-[2px] inline-flex items-center gap-1 text-[11px] whitespace-nowrap text-slate-600 dark:text-slate-300'>
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

              <div className='mt-1 grid grid-cols-2 gap-1'>
                <Badge className='h-5 justify-start rounded-full bg-amber-50 px-2 text-[10px] text-amber-700 dark:bg-amber-900/30 dark:text-amber-200'>
                  Score: {product.score}
                </Badge>

                <Badge className='h-5 justify-start rounded-full bg-violet-50 px-2 text-[10px] text-violet-700 dark:bg-violet-900/30 dark:text-violet-200'>
                  Quality: {product.quality}%
                </Badge>

                <Badge className='h-5 justify-start rounded-full bg-indigo-50 px-2 text-[10px] text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200'>
                  {product.lifecycle ?? 'unknown'}
                </Badge>

                <Badge className='h-5 justify-start rounded-full bg-emerald-50 px-2 text-[10px] text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200'>
                  Comp: {product.competition}
                </Badge>
              </div>
            </div>
          </div>

          <div className='mt-auto pt-2'>
            <div className='text-[11px] text-slate-500 dark:text-slate-400'>
              Demand{' '}
              <span className='font-medium text-slate-700 tabular-nums dark:text-slate-200'>
                {formatCompactNumber(product.demand)}
              </span>
            </div>

            <div className='mt-1.5 flex items-center justify-between'>
              <div className='flex items-center gap-1.5'>
                <Button
                  size='sm'
                  variant='ghost'
                  className='h-7 px-2 text-[12px]'
                  asChild
                >
                  <Link href={`/dashboard/product/${product.id}`}>
                    <span className='inline-flex items-center gap-1'>
                      <Eye className='h-3.5 w-3.5' />
                      Details
                    </span>
                  </Link>
                </Button>

                <Button
                  size='sm'
                  variant='outline'
                  aria-label={`save ${product.name}`}
                  className='h-7 w-7 p-0'
                >
                  <Heart className='h-3.5 w-3.5' />
                </Button>
              </div>

              <div className='inline-flex h-6 items-center rounded-full border border-slate-200 px-2 text-[10px] text-slate-500 dark:border-slate-700 dark:text-slate-300'>
                {product.score >= 85
                  ? 'Top'
                  : product.score >= 70
                    ? 'Good'
                    : 'Observe'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </article>
  );
}
