'use client';

import React from 'react';
import { UploadCloud, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import { type Filters } from '@/data/product-search-data';
import { ImageIconTitle } from '@/components/product-search/product-search-ui';

export function ImageSearchPanel({
  draft,
  isImageMode,
  handleImageChange
}: {
  draft: Filters;
  isImageMode: boolean;
  handleImageChange: (file: File | null) => void;
}) {
  return (
    <Card className='rounded-[28px] border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950/60'>
      <CardHeader className='px-6 pt-6 pb-4'>
        <CardTitle className='text-xl'>Image search</CardTitle>
        <CardDescription>
          Upload one image to switch the page into image-only mode.
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-4 px-6 pb-6'>
        <label className='block cursor-pointer'>
          <div className='rounded-[24px] border-2 border-dashed border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 text-center transition-colors hover:border-slate-300 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900 dark:hover:border-slate-700'>
            <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200'>
              <UploadCloud className='h-7 w-7' />
            </div>
            <div className='mt-4 text-base font-semibold text-slate-950 dark:text-white'>
              Drop image or click to upload
            </div>
            <div className='mt-1 text-sm text-slate-500 dark:text-slate-400'>
              When an image is selected, other filters are locked.
            </div>
            <input
              type='file'
              accept='image/*'
              className='hidden'
              onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
            />
          </div>
        </label>

        {draft.imagePreview ? (
          <div className='space-y-3 rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50'>
            <div className='flex items-center justify-between gap-3'>
              <div className='flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100'>
                <ImageIconTitle />
                Image mode active
              </div>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='h-8 px-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-white'
                onClick={() => handleImageChange(null)}
              >
                <X className='mr-1 h-4 w-4' />
                Clear
              </Button>
            </div>

            <div className='overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={draft.imagePreview}
                alt='Uploaded preview'
                className='h-56 w-full object-cover'
              />
            </div>

            <div className='rounded-2xl bg-amber-50 p-3 text-sm leading-6 text-amber-800 ring-1 ring-amber-200/60 dark:bg-amber-900/20 dark:text-amber-200 dark:ring-amber-900/40'>
              This demo uses the uploaded file name as a mock signal. Replace
              that branch with your real image-vector or vision search endpoint
              later.
            </div>
          </div>
        ) : (
          <div className='rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400'>
            Uploading an image is optional. For regular search, submit the
            attribute filters above.
          </div>
        )}

        <div className='grid gap-3 sm:grid-cols-2'>
          <div className='rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50'>
            <div className='text-xs font-medium tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400'>
              Search mode
            </div>
            <div className='mt-2 text-lg font-semibold text-slate-950 dark:text-white'>
              {isImageMode ? 'Image only' : 'Attribute based'}
            </div>
          </div>
          <div className='rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50'>
            <div className='text-xs font-medium tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400'>
              Ready state
            </div>
            <div className='mt-2 text-lg font-semibold text-slate-950 dark:text-white'>
              {isImageMode ? 'Locked filters' : 'Editable filters'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
