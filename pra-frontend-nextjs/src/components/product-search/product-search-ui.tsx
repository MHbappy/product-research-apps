'use client';

import React from 'react';
import {
  Image as ImageIcon,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Tag
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { getCategoryPathLabelById } from '@/data/product-search-data';

export function SoftPill({
  children,
  tone = 'slate'
}: {
  children: React.ReactNode;
  tone?: 'emerald' | 'indigo' | 'amber' | 'rose' | 'slate';
}) {
  const map: Record<string, string> = {
    emerald:
      'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/70 dark:bg-emerald-900/25 dark:text-emerald-200 dark:ring-emerald-900/40',
    indigo:
      'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200/70 dark:bg-indigo-900/25 dark:text-indigo-200 dark:ring-indigo-900/40',
    amber:
      'bg-amber-50 text-amber-700 ring-1 ring-amber-200/70 dark:bg-amber-900/25 dark:text-amber-200 dark:ring-amber-900/40',
    rose: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200/70 dark:bg-rose-900/25 dark:text-rose-200 dark:ring-rose-900/40',
    slate:
      'bg-slate-100 text-slate-700 ring-1 ring-slate-200/70 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${map[tone]}`}
    >
      {children}
    </span>
  );
}

export function SectionCard({
  children,
  className = ''
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={`rounded-[28px] border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950/60 ${className}`}
    >
      {children}
    </Card>
  );
}

export function SearchIconTitle() {
  return <Search className='h-4 w-4 text-indigo-500' />;
}

export function TypeIconTitle() {
  return <Tag className='h-4 w-4 text-indigo-500' />;
}

export function SentimentIconTitle() {
  return <Sparkles className='h-4 w-4 text-indigo-500' />;
}

export function PriceIconTitle() {
  return <SlidersHorizontal className='h-4 w-4 text-indigo-500' />;
}

export function ImageIconTitle() {
  return <ImageIcon className='h-4 w-4 text-indigo-500' />;
}

export function RatingIconTitle() {
  return <Star className='h-4 w-4 text-amber-500' />;
}

export function CategoryLabelById({ id }: { id: string }) {
  return <>{getCategoryPathLabelById(id)}</>;
}
