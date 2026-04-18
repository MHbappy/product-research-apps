import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heading } from '../ui/heading';

function PageSkeleton() {
  return (
    <div className='flex flex-1 animate-pulse flex-col gap-4 p-4 md:px-6'>
      <div className='flex items-center justify-between'>
        <div>
          <div className='bg-muted mb-2 h-8 w-48 rounded' />
          <div className='bg-muted h-4 w-96 rounded' />
        </div>
      </div>
      <div className='bg-muted mt-6 h-40 w-full rounded-lg' />
      <div className='bg-muted h-40 w-full rounded-lg' />
    </div>
  );
}

export default function PageContainer({
  children,
  scrollable = true,
  isloading = false,
  access = true,
  accessFallback,
  pageTitle,
  pageDescription,
  pageHeaderAction
}: {
  children: React.ReactNode;
  scrollable?: boolean;
  isloading?: boolean;
  access?: boolean;
  accessFallback?: React.ReactNode;
  pageTitle?: string;
  pageDescription?: string;
  pageHeaderAction?: React.ReactNode;
}) {
  if (!access) {
    return (
      <div className='flex h-[calc(100dvh-52px)] flex-1 items-center justify-center overflow-hidden p-4 md:px-6'>
        {accessFallback ?? (
          <div className='text-muted-foreground text-center text-lg'>
            You do not have access to this page.
          </div>
        )}
      </div>
    );
  }

  const content = isloading ? <PageSkeleton /> : children;

  if (!scrollable) {
    return (
      <div className='flex h-[calc(100dvh-52px)] w-full flex-col overflow-hidden py-4'>
        <div className='mb-4 flex items-start justify-between px-0'>
          <div>
            <Heading
              title={pageTitle ?? ''}
              description={pageDescription ?? ''}
            />
          </div>
          {pageHeaderAction ? <div>{pageHeaderAction}</div> : null}
        </div>
        <div className='min-h-0 flex-1 overflow-hidden'>{content}</div>
      </div>
    );
  }

  return (
    <div className='flex min-h-full w-full flex-col overflow-x-hidden'>
      <div className='mb-4 flex flex-wrap items-start justify-between gap-3'>
        <div className='min-w-0 flex-1'>
          <Heading
            title={pageTitle ?? ''}
            description={pageDescription ?? ''}
          />
        </div>

        {pageHeaderAction && <div className='shrink-0'>{pageHeaderAction}</div>}
      </div>

      <div className='min-w-0 flex-1 overflow-x-hidden'>{content}</div>
    </div>
  );
}
