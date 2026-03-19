'use client';

import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
  page: number;
  pageCount: number;
  onPrev: () => void;
  onNext: () => void;
  isLoading?: boolean;
};

export function ProductPagination({
  page,
  pageCount,
  onPrev,
  onNext,
  isLoading = false
}: Props) {
  const disabled = isLoading || pageCount <= 1;

  return (
    <>
      <div className='hidden items-center gap-2 sm:flex'>
        <Button
          size='sm'
          variant='ghost'
          onClick={onPrev}
          disabled={disabled || page === 1}
        >
          {isLoading ? (
            <span className='inline-flex items-center gap-2'>
              <Loader2 className='h-4 w-4 animate-spin' />
              Loading
            </span>
          ) : (
            'Prev'
          )}
        </Button>

        <div
          className={`text-sm ${isLoading ? 'animate-pulse text-slate-400' : 'text-slate-500'}`}
        >
          {isLoading ? 'Loading page...' : `${page} / ${pageCount}`}
        </div>

        <Button
          size='sm'
          onClick={onNext}
          disabled={disabled || page === pageCount}
        >
          {isLoading ? (
            <span className='inline-flex items-center gap-2'>
              <Loader2 className='h-4 w-4 animate-spin' />
              Loading
            </span>
          ) : (
            'Next'
          )}
        </Button>
      </div>

      <div className='mt-6 flex items-center justify-between sm:hidden'>
        <div
          className={`text-sm ${isLoading ? 'animate-pulse text-slate-400' : 'text-slate-500'}`}
        >
          {isLoading ? 'Loading page...' : `Page ${page} of ${pageCount}`}
        </div>

        <div className='flex items-center gap-2'>
          <Button
            size='sm'
            variant='ghost'
            onClick={onPrev}
            disabled={disabled || page === 1}
          >
            {isLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : 'Prev'}
          </Button>

          <Button
            size='sm'
            onClick={onNext}
            disabled={disabled || page === pageCount}
          >
            {isLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : 'Next'}
          </Button>
        </div>
      </div>
    </>
  );
}
