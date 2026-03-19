'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  FileText,
  Globe2,
  ImageIcon,
  Layers3,
  MessageSquareQuote,
  PlayCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import PageContainer from '@/components/layout/page-container';

type Review = {
  id: number;
  name: string;
  role: string;
  rating: number;
  message: string;
};

type FAQ = {
  q: string;
  a: string;
};

const FEATURES = [
  {
    title: 'Dashboard insights',
    desc: 'Charts, score cards, and fast overview for product decisions.',
    icon: BarChart3
  },
  {
    title: 'Product discovery',
    desc: 'Find trendy, seasonal, evergreen, and winning products quickly.',
    icon: TrendingUp
  },
  {
    title: 'Smart filtering',
    desc: 'Use many inputs to narrow results with more confidence.',
    icon: Search
  },
  {
    title: 'Image research',
    desc: 'Search by image and explore similar product ideas.',
    icon: ImageIcon
  },
  {
    title: 'Category overview',
    desc: 'See parent, child, and sub-category structure clearly.',
    icon: Layers3
  },
  {
    title: 'Seller intelligence',
    desc: 'Track seller trust, reach, and basic reliability signals.',
    icon: ShieldCheck
  },
  {
    title: 'Billing & access',
    desc: 'Simple plans and access control for different user levels.',
    icon: FileText
  }
] as const;

const BENEFITS = [
  'Fast product research flow',
  'Clean and easy to understand',
  'Built for trust and clarity',
  'Works for beginners and advanced users'
];

const FAQS: FAQ[] = [
  {
    q: 'What is this platform for?',
    a: 'It helps users research products, sellers, categories, and market opportunities in one place.'
  },
  {
    q: 'Can I search products by image?',
    a: 'Yes. The research tool supports image-based search and similar product discovery.'
  },
  {
    q: 'What kind of insights are shown?',
    a: 'Dashboard charts, product scores, category data, seller details, and filtered product lists.'
  },
  {
    q: 'Is there a free plan?',
    a: 'Yes. You can control access by plan and keep some insights limited for free users.'
  },
  {
    q: 'Can users send reviews or feedback?',
    a: 'Yes. The landing page includes a review and feedback section so visitors can share their opinion.'
  }
];

const REVIEWS: Review[] = [
  {
    id: 1,
    name: 'Rafi',
    role: 'E-commerce founder',
    rating: 5,
    message:
      'The layout feels sharp and the product insights are easy to explore.'
  },
  {
    id: 2,
    name: 'Maya',
    role: 'Product researcher',
    rating: 5,
    message:
      'The image search and category overview make research feel much faster.'
  },
  {
    id: 3,
    name: 'Tanvir',
    role: 'Marketplace seller',
    rating: 4,
    message:
      'I like the seller information and trust signals. It feels useful and clean.'
  }
];

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className='inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-200'>
      {children}
    </span>
  );
}

function SectionTitle({
  eyebrow,
  title,
  desc
}: {
  eyebrow: string;
  title: string;
  desc: string;
}) {
  return (
    <div className='max-w-3xl'>
      <div className='text-xs font-semibold tracking-[0.22em] text-indigo-600 uppercase dark:text-indigo-400'>
        {eyebrow}
      </div>
      <h2 className='mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl dark:text-white'>
        {title}
      </h2>
      <p className='mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400'>
        {desc}
      </p>
    </div>
  );
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className='flex items-center gap-1'>
      {Array.from({ length: 5 }, (_, idx) => idx + 1).map((n) => (
        <Star
          key={n}
          className={`h-4 w-4 ${n <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'}`}
        />
      ))}
    </div>
  );
}

export default function LandingPageProductIntelligence() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');

  const trustScore = useMemo(() => 92, []);

  return (
    <PageContainer>
      <div className='relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100'>
        <div className='pointer-events-none absolute inset-0 opacity-70'>
          <div className='absolute top-[-8rem] left-[-8rem] h-[30rem] w-[30rem] rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-500/10' />
          <div className='absolute top-[8rem] right-[-8rem] h-[24rem] w-[24rem] rounded-full bg-emerald-200/20 blur-3xl dark:bg-emerald-500/10' />
        </div>

        <div className='relative mx-auto w-full max-w-[1680px] px-4 py-6 sm:px-6 lg:px-8'>
          <header className='mb-8 flex items-center justify-between gap-4 rounded-[28px] border border-slate-200 bg-white/80 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70'>
            <div className='flex items-center gap-3'>
              <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950'>
                <Sparkles className='h-5 w-5' />
              </div>
              <div>
                <div className='text-sm font-semibold text-slate-950 dark:text-white'>
                  Product Intelligence
                </div>
                <div className='text-xs text-slate-500 dark:text-slate-400'>
                  Discover. Compare. Research.
                </div>
              </div>
            </div>

            <div className='hidden items-center gap-2 md:flex'>
              <Pill>Dashboard</Pill>
              <Pill>Products</Pill>
              <Pill>Categories</Pill>
              <Pill>Sellers</Pill>
            </div>

            <div className='flex items-center gap-2'>
              <Button asChild variant='ghost' className='rounded-2xl'>
                <Link href='/dashboard/product'>Explore</Link>
              </Button>
              <Button
                asChild
                className='rounded-2xl bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200'
              >
                <Link href='/dashboard/product/research-product'>
                  Start research
                </Link>
              </Button>
            </div>
          </header>

          <section className='grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-center'>
            <div className='space-y-6'>
              <div className='flex flex-wrap gap-2'>
                <Pill>Market insight</Pill>
                <Pill>Fast filters</Pill>
                <Pill>Image research</Pill>
                <Pill>Seller trust</Pill>
              </div>

              <div className='space-y-4'>
                <h1 className='max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl dark:text-white'>
                  Find better products before everyone else does.
                </h1>
                <p className='max-w-2xl text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-400'>
                  A clean product intelligence platform for dashboard insights,
                  product discovery, image research, category overview, seller
                  information, and billing access.
                </p>
              </div>

              <div className='flex flex-wrap gap-3'>
                <Button
                  asChild
                  size='lg'
                  className='h-12 rounded-2xl bg-slate-950 px-5 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200'
                >
                  <Link href='/dashboard/product'>
                    Open dashboard
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </Link>
                </Button>
                <Button
                  asChild
                  size='lg'
                  variant='outline'
                  className='h-12 rounded-2xl px-5'
                >
                  <Link href='/dashboard/product/research-product'>
                    <PlayCircle className='mr-2 h-4 w-4' />
                    See research tool
                  </Link>
                </Button>
              </div>

              <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
                {BENEFITS.map((item) => (
                  <div
                    key={item}
                    className='flex items-start gap-2 rounded-[20px] border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950/60'
                  >
                    <CheckCircle2 className='mt-0.5 h-4 w-4 text-emerald-500' />
                    <div className='text-sm font-medium text-slate-700 dark:text-slate-200'>
                      {item}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className='grid gap-4'>
              <Card className='rounded-[30px] border-slate-200/80 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-950/70'>
                <CardHeader className='pb-3'>
                  <div className='flex items-center gap-2 text-sm font-semibold text-slate-950 dark:text-white'>
                    <TrendingUp className='h-4 w-4 text-indigo-500' />
                    Insight preview
                  </div>
                  <CardTitle className='text-2xl'>
                    Professional and easy to explore
                  </CardTitle>
                  <CardDescription>
                    Users quickly see where to go next.
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid gap-3 sm:grid-cols-2'>
                    <div className='rounded-[22px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50'>
                      <div className='text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400'>
                        Trust score
                      </div>
                      <div className='mt-2 text-3xl font-semibold text-slate-950 dark:text-white'>
                        {trustScore}%
                      </div>
                      <Progress
                        value={trustScore}
                        className='mt-3 h-2.5 rounded-full'
                      />
                    </div>
                    <div className='rounded-[22px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50'>
                      <div className='text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400'>
                        Modules
                      </div>
                      <div className='mt-2 text-3xl font-semibold text-slate-950 dark:text-white'>
                        7+
                      </div>
                      <div className='mt-2 text-sm text-slate-600 dark:text-slate-400'>
                        Core insight pages
                      </div>
                    </div>
                  </div>

                  <div className='space-y-3 rounded-[22px] border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/60'>
                    <div className='flex items-center justify-between text-sm font-medium text-slate-950 dark:text-white'>
                      <span>Trend finder</span>
                      <span className='text-indigo-600 dark:text-indigo-400'>
                        92%
                      </span>
                    </div>
                    <Progress value={92} className='h-2.5 rounded-full' />
                    <div className='flex items-center justify-between text-sm font-medium text-slate-950 dark:text-white'>
                      <span>Seller trust</span>
                      <span className='text-emerald-600 dark:text-emerald-400'>
                        88%
                      </span>
                    </div>
                    <Progress value={88} className='h-2.5 rounded-full' />
                  </div>

                  <div className='grid gap-3 sm:grid-cols-3'>
                    <div className='rounded-[20px] border border-slate-200 bg-slate-50 p-3 text-center dark:border-slate-800 dark:bg-slate-900/50'>
                      <div className='text-2xl font-semibold text-slate-950 dark:text-white'>
                        300+
                      </div>
                      <div className='text-xs text-slate-500 dark:text-slate-400'>
                        Products
                      </div>
                    </div>
                    <div className='rounded-[20px] border border-slate-200 bg-slate-50 p-3 text-center dark:border-slate-800 dark:bg-slate-900/50'>
                      <div className='text-2xl font-semibold text-slate-950 dark:text-white'>
                        50
                      </div>
                      <div className='text-xs text-slate-500 dark:text-slate-400'>
                        Trendy
                      </div>
                    </div>
                    <div className='rounded-[20px] border border-slate-200 bg-slate-50 p-3 text-center dark:border-slate-800 dark:bg-slate-900/50'>
                      <div className='text-2xl font-semibold text-slate-950 dark:text-white'>
                        1
                      </div>
                      <div className='text-xs text-slate-500 dark:text-slate-400'>
                        Platform
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className='grid gap-4 sm:grid-cols-2'>
                <Card className='rounded-[28px] border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950/60'>
                  <CardContent className='p-4'>
                    <div className='flex items-center gap-2 text-sm font-semibold text-slate-950 dark:text-white'>
                      <ImageIcon className='h-4 w-4 text-indigo-500' />
                      Search by image
                    </div>
                    <div className='mt-2 text-sm text-slate-600 dark:text-slate-400'>
                      Find similar products from uploaded photos.
                    </div>
                  </CardContent>
                </Card>
                <Card className='rounded-[28px] border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950/60'>
                  <CardContent className='p-4'>
                    <div className='flex items-center gap-2 text-sm font-semibold text-slate-950 dark:text-white'>
                      <ShieldCheck className='h-4 w-4 text-emerald-500' />
                      Seller trust
                    </div>
                    <div className='mt-2 text-sm text-slate-600 dark:text-slate-400'>
                      See basic trust and reach signals at a glance.
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          <section className='mt-16'>
            <SectionTitle
              eyebrow='What the platform does'
              title='Everything in one clean workflow'
              desc='Show users the value fast, then guide them toward deeper insights.'
            />

            <div className='mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
              {FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={feature.title}
                    className='rounded-[28px] border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-transform hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-950/60'
                  >
                    <CardContent className='p-5'>
                      <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200'>
                        <Icon className='h-5 w-5' />
                      </div>
                      <h3 className='mt-4 text-lg font-semibold text-slate-950 dark:text-white'>
                        {feature.title}
                      </h3>
                      <p className='mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400'>
                        {feature.desc}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          <section className='mt-16 grid gap-6 xl:grid-cols-[1fr_0.95fr]'>
            <Card className='rounded-[30px] border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950/60'>
              <CardHeader>
                <CardTitle className='text-2xl'>
                  Why users will stay curious
                </CardTitle>
                <CardDescription>
                  Show the next best step without making the page feel heavy.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                {[
                  'Dashboard gives a quick market pulse.',
                  'Explore page helps find new product ideas.',
                  'Research tool supports image and filters.',
                  'Category and seller pages add deeper context.',
                  'Billing keeps access clear and simple.'
                ].map((item, idx) => (
                  <div
                    key={item}
                    className='flex items-start gap-3 rounded-[20px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50'
                  >
                    <div className='flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white dark:bg-white dark:text-slate-950'>
                      {idx + 1}
                    </div>
                    <div className='text-sm leading-6 text-slate-700 dark:text-slate-200'>
                      {item}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className='rounded-[30px] border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950/60'>
              <CardHeader>
                <CardTitle className='text-2xl'>
                  User review / feedback
                </CardTitle>
                <CardDescription>
                  Let visitors leave a quick review or message.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-5'>
                <div className='grid gap-4 sm:grid-cols-3'>
                  {REVIEWS.map((review) => (
                    <div
                      key={review.id}
                      className='rounded-[22px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50'
                    >
                      <StarRow rating={review.rating} />
                      <div className='mt-3 text-sm font-semibold text-slate-950 dark:text-white'>
                        {review.name}
                      </div>
                      <div className='text-xs text-slate-500 dark:text-slate-400'>
                        {review.role}
                      </div>
                      <p className='mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400'>
                        {review.message}
                      </p>
                    </div>
                  ))}
                </div>

                <div className='rounded-[24px] border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/60'>
                  <div className='mb-4 flex items-center gap-2 text-sm font-semibold text-slate-950 dark:text-white'>
                    <MessageSquareQuote className='h-4 w-4 text-indigo-500' />
                    Leave your review
                  </div>
                  <div className='grid gap-4 sm:grid-cols-2'>
                    <div className='space-y-2'>
                      <Label>Name</Label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='h-11 rounded-2xl'
                        placeholder='Your name'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label>Email</Label>
                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='h-11 rounded-2xl'
                        placeholder='Your email'
                      />
                    </div>
                  </div>

                  <div className='mt-4 space-y-2'>
                    <Label>Rating</Label>
                    <div className='flex items-center gap-2'>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type='button'
                          onClick={() => setRating(n)}
                          className='rounded-full p-1'
                          aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
                        >
                          <Star
                            className={`h-5 w-5 ${n <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className='mt-4 space-y-2'>
                    <Label>Message</Label>
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className='min-h-[110px] rounded-2xl'
                      placeholder='Share your feedback'
                    />
                  </div>

                  <div className='mt-4 flex items-center justify-between gap-3'>
                    <div className='text-sm text-slate-500 dark:text-slate-400'>
                      Your feedback helps improve the product.
                    </div>
                    <Button
                      type='button'
                      className='rounded-2xl bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200'
                    >
                      Send review
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className='mt-16'>
            <SectionTitle
              eyebrow='FAQ'
              title='Common questions'
              desc='Keep answers short, clear, and easy to scan.'
            />

            <div className='mt-6 grid gap-4 lg:grid-cols-2'>
              {FAQS.map((item) => (
                <Card
                  key={item.q}
                  className='rounded-[24px] border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950/60'
                >
                  <CardContent className='p-5'>
                    <div className='flex items-start gap-3'>
                      <div className='mt-0.5 flex h-8 w-8 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200'>
                        <ChevronRight className='h-4 w-4' />
                      </div>
                      <div>
                        <h3 className='text-base font-semibold text-slate-950 dark:text-white'>
                          {item.q}
                        </h3>
                        <p className='mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400'>
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className='mt-16 rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)] sm:p-8 dark:border-slate-800 dark:bg-slate-950/70'>
            <div className='grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center'>
              <div>
                <div className='text-xs font-semibold tracking-[0.22em] text-indigo-600 uppercase dark:text-indigo-400'>
                  Ready to explore
                </div>
                <h2 className='mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl dark:text-white'>
                  Make users curious enough to open the insights.
                </h2>
                <p className='mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400'>
                  The landing page should feel premium, explain the value
                  quickly, and guide visitors into product research.
                </p>
              </div>

              <div className='flex flex-wrap gap-3'>
                <Button
                  asChild
                  size='lg'
                  className='h-12 rounded-2xl bg-slate-950 px-5 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200'
                >
                  <Link href='/dashboard/product'>
                    Go to dashboard
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </Link>
                </Button>
                <Button
                  asChild
                  size='lg'
                  variant='outline'
                  className='h-12 rounded-2xl px-5'
                >
                  <Link href='/dashboard/product/research-product'>
                    <Globe2 className='mr-2 h-4 w-4' />
                    Try research
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageContainer>
  );
}
