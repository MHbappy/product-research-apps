import React from 'react';
import type { Tone } from '@/types/product-details.types';

export function getToneClass(kind: Tone) {
  const map: Record<Tone, string> = {
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
  return map[kind];
}

export function toneAccentClass(accent: Tone) {
  return accent === 'emerald'
    ? 'from-emerald-400 via-emerald-500 to-teal-400'
    : accent === 'amber'
      ? 'from-amber-400 via-orange-400 to-amber-500'
      : accent === 'rose'
        ? 'from-rose-400 via-pink-400 to-rose-500'
        : accent === 'slate'
          ? 'from-slate-400 via-slate-500 to-slate-400'
          : 'from-indigo-400 via-violet-500 to-indigo-400';
}

export function toneGlowClass(tone: Tone) {
  return tone === 'emerald'
    ? 'bg-emerald-300/20'
    : tone === 'amber'
      ? 'bg-amber-300/20'
      : tone === 'rose'
        ? 'bg-rose-300/20'
        : tone === 'slate'
          ? 'bg-slate-300/20'
          : 'bg-indigo-300/20';
}

export function SoftPill({
  children,
  tone = 'slate'
}: {
  children: React.ReactNode;
  tone?: Tone;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getToneClass(
        tone
      )}`}
    >
      {children}
    </span>
  );
}

export function MiniStat({
  label,
  value,
  caption,
  icon,
  tone = 'indigo'
}: {
  label: string;
  value: string;
  caption?: string;
  icon: React.ReactNode;
  tone?: Tone;
}) {
  return (
    <div className='relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4 shadow-sm transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:from-slate-950 dark:to-slate-900'>
      <div
        className={`absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full blur-2xl ${toneGlowClass(
          tone
        )}`}
      />
      <div className='relative'>
        <div className='flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400'>
          <span className='inline-flex h-8 w-8 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200'>
            {icon}
          </span>
          {label}
        </div>

        <div className='mt-3 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white'>
          {value}
        </div>

        {caption ? (
          <div className='mt-1 text-sm leading-5 text-slate-600 dark:text-slate-400'>
            {caption}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function MetricCard({
  icon,
  label,
  value,
  hint,
  accent = 'indigo'
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  hint?: string;
  accent?: Tone;
}) {
  return (
    <div className='group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950/60'>
      <div
        className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${toneAccentClass(accent)}`}
      />
      <div className='flex items-start gap-3'>
        <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'>
          {icon}
        </div>

        <div className='min-w-0'>
          <div className='text-[11px] font-medium tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400'>
            {label}
          </div>
          <div className='mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white'>
            {value}
          </div>
          {hint ? (
            <div className='mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400'>
              {hint}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function ChartTooltip({
  active,
  label,
  payload,
  formatter
}: {
  active?: boolean;
  label?: string | number;
  payload?: Array<{ name?: string; value?: number; color?: string }>;
  formatter?: (name: string, value: number) => [string, string?];
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className='rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-950/95'>
      <div className='text-sm font-semibold text-slate-950 dark:text-white'>
        {typeof label === 'string' ? label : ''}
      </div>
      <div className='mt-2 space-y-1'>
        {payload.map((item, idx) => {
          const name = item.name ?? `Series ${idx + 1}`;
          const value = item.value ?? 0;
          const [v, unit] = formatter
            ? formatter(name, value)
            : [String(value), ''];

          return (
            <div
              key={`${name}-${idx}`}
              className='flex items-center justify-between gap-6 text-sm'
            >
              <div className='flex items-center gap-2 text-slate-600 dark:text-slate-400'>
                <span
                  className='h-2.5 w-2.5 rounded-full'
                  style={{ backgroundColor: item.color ?? '#6366f1' }}
                />
                <span>{name}</span>
              </div>
              <div className='font-medium text-slate-950 dark:text-white'>
                {v}
                {unit ? <span className='text-slate-500'> {unit}</span> : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
