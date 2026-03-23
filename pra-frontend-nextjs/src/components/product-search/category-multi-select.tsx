'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronRight, Filter, Search, X } from 'lucide-react';

import type { CategoryOption } from '@/data/product-search-data';
import { CATEGORY_OPTIONS } from '@/data/product-search-data';

export function CategoryMultiSelect({
  value,
  onChange,
  disabled = false,
  resetSeed = 0
}: {
  value: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
  resetSeed?: number;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setQuery('');
    setOpen(false);
  }, [resetSeed]);

  const selectedItems = useMemo(() => {
    return value
      .map((id) => CATEGORY_OPTIONS.find((item) => item.id === id))
      .filter(Boolean) as CategoryOption[];
  }, [value]);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return CATEGORY_OPTIONS.filter((item) => !value.includes(item.id))
      .filter((item) => item.searchText.includes(q))
      .map((item) => {
        let score = 0;
        const name = item.name.toLowerCase();
        const path = item.path.toLowerCase();

        if (name === q) score += 100;
        if (path === q) score += 90;
        if (name.includes(q)) score += 60;
        if (path.includes(q)) score += 50;
        score += Math.max(0, 10 - item.depth);

        return { item, score };
      })
      .sort(
        (a, b) => b.score - a.score || a.item.path.localeCompare(b.item.path)
      )
      .slice(0, 8)
      .map((entry) => entry.item);
  }, [query, value]);

  function addCategory(id: string) {
    if (disabled || value.includes(id)) return;
    onChange([...value, id]);
    setQuery('');
    setOpen(false);
    inputRef.current?.focus();
  }

  function removeCategory(id: string) {
    onChange(value.filter((item) => item !== id));
  }

  function clearAll() {
    onChange([]);
    setQuery('');
    setOpen(false);
    inputRef.current?.focus();
  }

  return (
    <div
      className={`rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50 ${
        disabled ? 'opacity-50' : ''
      }`}
    >
      <div className='mb-3 flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100'>
        <Filter className='h-4 w-4 text-indigo-500' />
        Search by category tree
      </div>

      <div className='relative'>
        <div className='flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 transition-colors focus-within:border-indigo-300 dark:border-slate-800 dark:bg-slate-950 dark:focus-within:border-indigo-700'>
          <Search className='h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500' />
          <input
            ref={inputRef}
            type='text'
            value={query}
            disabled={disabled}
            onFocus={() => setOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onBlur={() => {
              window.setTimeout(() => setOpen(false), 120);
            }}
            placeholder='Type parent or child category'
            className='min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400 dark:text-slate-300 dark:placeholder:text-slate-500'
          />
          {query ? (
            <button
              type='button'
              disabled={disabled}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setQuery('');
                setOpen(true);
              }}
              className='rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-200'
            >
              <X className='h-4 w-4' />
            </button>
          ) : null}
        </div>

        {open && !disabled && query.trim() && suggestions.length > 0 ? (
          <div className='absolute z-30 mt-2 w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/30'>
            <div className='max-h-80 overflow-auto p-2'>
              {suggestions.map((item) => (
                <button
                  key={item.id}
                  type='button'
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => addCategory(item.id)}
                  className='flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-900'
                  style={{ paddingLeft: 12 + item.depth * 12 }}
                >
                  <div className='mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400'>
                    <ChevronRight className='h-3 w-3' />
                  </div>

                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center gap-2'>
                      <span className='truncate text-sm font-medium text-slate-950 dark:text-white'>
                        {item.name}
                      </span>
                      {value.includes(item.id) ? (
                        <span className='inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-900/25 dark:text-emerald-200'>
                          <Check className='h-3 w-3' />
                          Selected
                        </span>
                      ) : null}
                    </div>
                    <div className='mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400'>
                      {item.path}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {selectedItems.length > 0 ? (
        <div className='mt-3 flex flex-wrap gap-2'>
          {selectedItems.map((item) => (
            <span
              key={item.id}
              className='inline-flex max-w-full items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-200/70 dark:bg-indigo-900/25 dark:text-indigo-200 dark:ring-indigo-900/40'
            >
              <span className='max-w-[240px] truncate'>{item.path}</span>
              <button
                type='button'
                onClick={() => removeCategory(item.id)}
                className='rounded-full p-0.5 hover:bg-indigo-100 dark:hover:bg-indigo-900/50'
                aria-label={`Remove ${item.path}`}
              >
                <X className='h-3.5 w-3.5' />
              </button>
            </span>
          ))}

          <button
            type='button'
            onClick={clearAll}
            className='inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
          >
            Clear all
          </button>
        </div>
      ) : null}

      <div className='mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400'>
        Type to search any parent or child category. Multiple selections are
        allowed.
      </div>
    </div>
  );
}
