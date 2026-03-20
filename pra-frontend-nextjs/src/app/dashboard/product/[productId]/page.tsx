'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Eye, Heart } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PageContainer from '@/components/layout/page-container';

import {
  PRODUCTS,
  SENTIMENT_TREND,
  STAR_DISTRIBUTION,
  STABILITY_DIAGNOSTIC,
  fmtCompact,
  fmtNumber
} from '@/data/product-details.data';
import type { Product } from '@/types/product-details.types';
import ProductSnapshot from '@/components/product-snapshot';
import QuickInterpretation from '@/components/quick-interpretation';
import SentimentTrendChart from '@/components/sentiment-trend-chart';
import StarDistributionChart from '@/components/star-distribution-chart';
import StabilityDiagnosticChart from '@/components/stability-diagnostic-chart';
import { SoftPill } from '@/shared/product-details.shared';

export default function ProductDetailsPage() {
  const params = useParams<{ id?: string | string[] }>();
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const productId = Number(rawId ?? 1);

  const product = useMemo(() => {
    if (!Number.isFinite(productId)) return undefined;
    return PRODUCTS.find((item) => item.id === productId);
  }, [productId]);

  const sentimentSummary = useMemo(() => {
    const latest = SENTIMENT_TREND[SENTIMENT_TREND.length - 1];
    const total = latest.positive + latest.neutral + latest.negative;

    return {
      latest,
      total,
      positiveShare: (latest.positive / total) * 100,
      neutralShare: (latest.neutral / total) * 100,
      negativeShare: (latest.negative / total) * 100
    };
  }, []);

  const starSummary = useMemo(() => {
    const total = STAR_DISTRIBUTION.reduce((sum, item) => sum + item.count, 0);
    const top =
      STAR_DISTRIBUTION.find((item) => item.star === '5★')?.count ?? 0;

    return {
      total,
      topShare: (top / total) * 100
    };
  }, []);

  const latestStability = STABILITY_DIAGNOSTIC[STABILITY_DIAGNOSTIC.length - 1];

  const stabilityVerdict = useMemo(() => {
    if (latestStability.slope_12 >= 0.1 && latestStability.cv_12 <= 0.12) {
      return {
        label: 'Strong momentum',
        tone: 'emerald' as const,
        description: 'Fast upward movement with controlled volatility.'
      };
    }

    if (latestStability.slope_12 >= 0.06) {
      return {
        label: 'Healthy trend',
        tone: 'indigo' as const,
        description: 'Steady movement with low-to-moderate variation.'
      };
    }

    return {
      label: 'Needs review',
      tone: 'amber' as const,
      description: 'Trend is not yet strong enough for a confident call.'
    };
  }, [latestStability.cv_12, latestStability.slope_12]);

  if (!product) {
    return (
      <div className='min-h-screen overflow-y-auto bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-10 dark:bg-slate-950 dark:text-slate-100'>
        <div className='mx-auto flex min-h-[70vh] max-w-3xl items-center'>
          <Card className='w-full border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900'>
            <CardHeader>
              <CardTitle>Product not found</CardTitle>
              <CardDescription>
                The product id is missing or does not match any product in the
                catalog.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant='outline'>
                <Link href='/dashboard/product'>
                  <ArrowLeft className='mr-2 h-4 w-4' />
                  Back to products
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const totalRisk =
    product.competition >= 25
      ? 'High competition'
      : product.competition >= 10
        ? 'Moderate competition'
        : 'Low competition';

  const opportunity =
    product.score >= 85
      ? 'Top opportunity'
      : product.score >= 70
        ? 'Good opportunity'
        : 'Observe carefully';

  const ratingText = `${fmtCompact(product.rating ?? 0, 1)} / 5`;
  const reviewText = fmtNumber(product.reviews ?? 0);
  const lifecycleText = product.lifecycle
    ? product.lifecycle.charAt(0).toUpperCase() + product.lifecycle.slice(1)
    : 'N/A';

  const momentumDirection =
    latestStability.slope_12 > 0.08
      ? 'Rising'
      : latestStability.slope_12 > 0.05
        ? 'Stable up'
        : 'Flat';

  return (
    <PageContainer>
      <div className='relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100'>
        <div className='pointer-events-none absolute inset-0 opacity-80'>
          <div className='absolute top-[-8rem] left-[-8rem] h-[28rem] w-[28rem] rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-500/10' />
          <div className='absolute top-[10rem] right-[-8rem] h-[22rem] w-[22rem] rounded-full bg-emerald-200/20 blur-3xl dark:bg-emerald-500/10' />
        </div>

        <div className='relative mx-auto w-full max-w-[1680px] px-4 py-6 sm:px-6 lg:px-8'>
          <div className='mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
            <div className='space-y-3'>
              <Button
                asChild
                variant='ghost'
                className='h-9 w-fit px-2 text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white'
              >
                <Link href='/dashboard/product'>
                  <ArrowLeft className='mr-2 h-4 w-4' />
                  Back
                </Link>
              </Button>

              <div className='flex flex-wrap items-center gap-2'>
                <SoftPill tone='indigo'>#{product.id}</SoftPill>
                <SoftPill tone='slate'>{product.category}</SoftPill>
                <SoftPill tone='emerald'>{lifecycleText}</SoftPill>
                <SoftPill tone='amber'>{opportunity}</SoftPill>
              </div>

              <h1 className='max-w-5xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white'>
                {product.name}
              </h1>

              <p className='max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400'>
                A cleaner product intelligence view with stronger hierarchy,
                wider use of space, and metric cards that stay readable instead
                of collapsing on larger screens.
              </p>
            </div>

            <div className='flex flex-wrap gap-2'>
              <Button variant='outline' className='gap-2 rounded-2xl'>
                <Heart className='h-4 w-4' />
                Save
              </Button>
              <Button className='gap-2 rounded-2xl bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200'>
                <Eye className='h-4 w-4' />
                Preview
              </Button>
            </div>
          </div>

          <div className='grid gap-6 xl:grid-cols-[1.08fr_0.92fr]'>
            <ProductSnapshot
              product={product}
              lifecycleText={lifecycleText}
              opportunity={opportunity}
              totalRisk={totalRisk}
              ratingText={ratingText}
              reviewText={reviewText}
            />

            <QuickInterpretation
              sentimentSummary={sentimentSummary}
              starSummary={starSummary}
              latestStability={latestStability}
              stabilityVerdict={stabilityVerdict}
              momentumDirection={momentumDirection}
            />
          </div>

          <SentimentTrendChart
            data={SENTIMENT_TREND}
            sentimentSummary={sentimentSummary}
          />

          <StarDistributionChart
            data={STAR_DISTRIBUTION}
            starSummary={starSummary}
            ratingText={ratingText}
            reviewText={reviewText}
          />

          <StabilityDiagnosticChart
            data={STABILITY_DIAGNOSTIC}
            stabilityVerdict={stabilityVerdict}
            latestStability={latestStability}
          />

          <Card className='mt-6 rounded-[28px] border-slate-200/80 bg-gradient-to-r from-white via-white to-slate-50 shadow-[0_8px_30px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900/90'>
            <CardContent className='p-5'>
              <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
                <div>
                  <div className='text-sm font-semibold text-slate-950 dark:text-white'>
                    Decision summary
                  </div>
                  <div className='mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400'>
                    This product is strongest when score, quality, and demand
                    are kept in balance with competition and sustained
                    sentiment.
                  </div>
                </div>

                <div className='flex flex-wrap gap-2'>
                  <SoftPill tone='emerald'>{opportunity}</SoftPill>
                  <SoftPill tone='indigo'>{lifecycleText}</SoftPill>
                  <SoftPill tone='slate'>ID {product.id}</SoftPill>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
