'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeftRight,
  ArrowRight,
  BarChart3,
  BadgePercent,
  Bot,
  ChevronRight,
  CircleHelp,
  Flame,
  MessageCircle,
  Radar,
  ShoppingBag,
  Sparkles,
  Star,
  SunMedium,
  TrendingUp,
  Wand2,
  Zap,
  ShieldCheck
} from 'lucide-react';

import PageContainer from '@/components/layout/page-container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

type Intent =
  | 'chat'
  | 'winning'
  | 'trendy'
  | 'seasonal'
  | 'dying'
  | 'compare'
  | 'product';

type Product = {
  id: number;
  title: string;
  category: string;
  price: number;
  ratingAvg: number;
  ratingCount: number;
  lifecycle: 'winning' | 'trendy' | 'seasonal' | 'dying' | 'evergreen';
  score: number;
  summary: string;
  imageLabel: string;
  reviewInsight: string;
  tags: string[];
};

type AssistantMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  intent?: Intent;
  products?: Product[];
  followUps?: string[];
};

const formatPrice = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);

const MODE_LABELS: Record<Intent, string> = {
  chat: 'Chat',
  winning: 'Winning',
  trendy: 'Trendy',
  seasonal: 'Seasonal',
  dying: 'Dying',
  compare: 'Compare',
  product: 'Search'
};

const INTENTS: Array<{
  id: Intent;
  label: string;
  icon: React.ReactNode;
  hint: string;
}> = [
  {
    id: 'winning',
    label: 'Winning',
    icon: <Zap className='h-4 w-4' />,
    hint: 'Top conversion'
  },
  {
    id: 'trendy',
    label: 'Trendy',
    icon: <TrendingUp className='h-4 w-4' />,
    hint: 'Rising fast'
  },
  {
    id: 'seasonal',
    label: 'Seasonal',
    icon: <SunMedium className='h-4 w-4' />,
    hint: 'Right now'
  },
  {
    id: 'compare',
    label: 'Compare',
    icon: <ArrowLeftRight className='h-4 w-4' />,
    hint: 'Side by side'
  },
  {
    id: 'dying',
    label: 'Dying',
    icon: <Flame className='h-4 w-4' />,
    hint: 'Slow demand'
  },
  {
    id: 'chat',
    label: 'Chat',
    icon: <MessageCircle className='h-4 w-4' />,
    hint: 'General help'
  }
];

const SUGGESTED_PROMPTS = [
  'Show winning products under $50',
  'What trendy products are growing?',
  'Find seasonal products for this month',
  'Which products are dying and should be avoided?',
  'I need a good product for gifting',
  'Compare product A and B'
];

const MOBILE_QUICK_PROMPTS: Array<{
  label: string;
  prompt: string;
  mode: Intent;
  hint: string;
  icon: React.ReactNode;
}> = [
  {
    label: 'Winning',
    prompt: 'Show winning products under $50',
    mode: 'winning',
    hint: 'High conversion',
    icon: <Zap className='h-4 w-4' />
  },
  {
    label: 'Trendy',
    prompt: 'What trendy products are growing?',
    mode: 'trendy',
    hint: 'Fast rising',
    icon: <TrendingUp className='h-4 w-4' />
  },
  {
    label: 'Compare',
    prompt: 'Compare product A and B',
    mode: 'compare',
    hint: 'Decision mode',
    icon: <ArrowLeftRight className='h-4 w-4' />
  },
  {
    label: 'Chat',
    prompt: 'Recommend a product for me',
    mode: 'chat',
    hint: 'Ask naturally',
    icon: <MessageCircle className='h-4 w-4' />
  }
];

const CATALOG: Product[] = [
  {
    id: 1,
    title: 'UltraFold Smart Backpack',
    category: 'Travel',
    price: 49,
    ratingAvg: 4.7,
    ratingCount: 18420,
    lifecycle: 'winning',
    score: 96,
    summary: 'Strong ratings, repeat purchases, and low complaint volume.',
    imageLabel: 'Backpack',
    reviewInsight:
      'Buyers praise durability, storage layout, and daily commute comfort.',
    tags: ['high-converting', 'giftable', 'daily use']
  },
  {
    id: 2,
    title: 'AeroBuds Pro Wireless Earbuds',
    category: 'Electronics',
    price: 79,
    ratingAvg: 4.5,
    ratingCount: 22110,
    lifecycle: 'trendy',
    score: 93,
    summary: 'Rising demand with strong review growth over the last 30 days.',
    imageLabel: 'Earbuds',
    reviewInsight:
      'Users mention bass quality, quick pairing, and good battery life.',
    tags: ['trending', 'audio', 'fast growth']
  },
  {
    id: 3,
    title: 'CoolMist Desk Fan',
    category: 'Home',
    price: 34,
    ratingAvg: 4.4,
    ratingCount: 9620,
    lifecycle: 'seasonal',
    score: 89,
    summary: 'Best fit for hot-weather buying spikes and office desks.',
    imageLabel: 'Fan',
    reviewInsight:
      'Buyers highlight silent mode, compact size, and strong airflow.',
    tags: ['summer', 'home office', 'fast need']
  },
  {
    id: 4,
    title: 'Classic Cotton T-Shirt Pack',
    category: 'Fashion',
    price: 22,
    ratingAvg: 3.8,
    ratingCount: 14500,
    lifecycle: 'dying',
    score: 61,
    summary: 'Demand is flattening and review velocity is dropping.',
    imageLabel: 'T-Shirt',
    reviewInsight:
      'Complaints are about fit inconsistency and shrinking after wash.',
    tags: ['low momentum', 'watch closely', 'clearance']
  },
  {
    id: 5,
    title: 'Smart Water Bottle',
    category: 'Fitness',
    price: 39,
    ratingAvg: 4.6,
    ratingCount: 11800,
    lifecycle: 'winning',
    score: 94,
    summary:
      'High intent product with healthy margin and consistent repeat buys.',
    imageLabel: 'Bottle',
    reviewInsight:
      'Customers praise reminder lights, leak resistance, and premium feel.',
    tags: ['winner', 'health', 'upsell']
  },
  {
    id: 6,
    title: 'Warm Knit Beanie',
    category: 'Fashion',
    price: 18,
    ratingAvg: 4.3,
    ratingCount: 5300,
    lifecycle: 'seasonal',
    score: 86,
    summary: 'Strong for cold-weather demand and easy gifting.',
    imageLabel: 'Beanie',
    reviewInsight: 'People like softness, warmth, and simple styling.',
    tags: ['winter', 'giftable', 'low price']
  },
  {
    id: 7,
    title: 'Minimal Ceramic Mug Set',
    category: 'Home',
    price: 27,
    ratingAvg: 4.8,
    ratingCount: 14230,
    lifecycle: 'evergreen',
    score: 91,
    summary: 'Stable demand, high ratings, and broad audience appeal.',
    imageLabel: 'Mug',
    reviewInsight:
      'Buyers praise packaging quality, finish, and everyday utility.',
    tags: ['evergreen', 'gift', 'broad appeal']
  },
  {
    id: 8,
    title: 'Phone Tripod Stand',
    category: 'Accessories',
    price: 24,
    ratingAvg: 4.2,
    ratingCount: 7800,
    lifecycle: 'trendy',
    score: 88,
    summary: 'Rising with creator and short-video use cases.',
    imageLabel: 'Tripod',
    reviewInsight: 'Users mention stability, adjustability, and easy setup.',
    tags: ['creator', 'content', 'fast rising']
  }
];

function detectIntent(query: string, selectedMode: Intent): Intent {
  const q = query.toLowerCase();

  if (selectedMode !== 'chat') return selectedMode;

  if (q.includes('winning')) return 'winning';
  if (q.includes('trendy') || q.includes('trend')) return 'trendy';
  if (q.includes('seasonal') || q.includes('summer') || q.includes('winter'))
    return 'seasonal';
  if (q.includes('dying') || q.includes('avoid') || q.includes('clearance'))
    return 'dying';
  if (q.includes('compare') || q.includes('vs')) return 'compare';
  if (
    q.includes('product') ||
    q.includes('find') ||
    q.includes('show me') ||
    q.includes('need') ||
    q.includes('recommend')
  )
    return 'product';

  return 'chat';
}

function pickProducts(intent: Intent, query: string): Product[] {
  const q = query.toLowerCase();
  let filtered = CATALOG;

  if (intent === 'winning') {
    filtered = CATALOG.filter((p) => p.lifecycle === 'winning');
  } else if (intent === 'trendy') {
    filtered = CATALOG.filter((p) => p.lifecycle === 'trendy');
  } else if (intent === 'seasonal') {
    filtered = CATALOG.filter((p) => p.lifecycle === 'seasonal');
  } else if (intent === 'dying') {
    filtered = CATALOG.filter((p) => p.lifecycle === 'dying');
  } else if (intent === 'product') {
    const words = q.split(' ').filter((word) => word.length > 2);
    filtered = CATALOG.filter((p) => {
      const haystack = [p.title, p.category, ...p.tags].join(' ').toLowerCase();
      return words.some((word) => haystack.includes(word));
    });
  } else if (intent === 'compare') {
    filtered = CATALOG.slice(0, 2);
  }

  return [...filtered]
    .sort((a, b) => b.score - a.score)
    .slice(0, intent === 'compare' ? 2 : 4);
}

function buildReply(query: string, intent: Intent) {
  const products = intent === 'chat' ? [] : pickProducts(intent, query);

  switch (intent) {
    case 'winning':
      return {
        content:
          'I pulled the strongest winning products from your catalog. This view is optimized for fast scanning, confidence, and conversion-focused decisions.',
        products,
        followUps: [
          'Show cheaper winners',
          'Only high rated',
          'Explain why these win'
        ]
      };
    case 'trendy':
      return {
        content:
          'These are the products with current upward momentum. In the product UI, the key is to show why they are rising, not just that they are rising.',
        products,
        followUps: [
          'Show faster growers',
          'Compare to winning',
          'Only electronics'
        ]
      };
    case 'seasonal':
      return {
        content:
          'These products fit a seasonal buying pattern. The response should stay concise and pair the explanation with a clean set of evidence cards.',
        products,
        followUps: [
          'Show summer items',
          'Show winter items',
          'Best seasonal margin'
        ]
      };
    case 'dying':
      return {
        content:
          'I marked these as lower momentum products. The interface should make it obvious why the assistant is warning the user and what to do next.',
        products,
        followUps: [
          'Show all low momentum items',
          'Which should I clear first?',
          'Why is demand dropping?'
        ]
      };
    case 'compare':
      return {
        content:
          'Comparison mode is best used as a side-by-side decision state. Keep it visual, short, and focused on price, rating, lifecycle, and reviews.',
        products: products.length ? products.slice(0, 2) : CATALOG.slice(0, 2),
        followUps: [
          'Compare price',
          'Compare ratings',
          'Compare review sentiment'
        ]
      };
    case 'product':
      return {
        content:
          'I found the closest product matches. This should feel like smart search with a helpful explanation, not a generic chatbot response.',
        products,
        followUps: ['Find similar items', 'Only under $50', 'Show higher rated']
      };
    default:
      return {
        content:
          'Hello. Ask naturally, and I will behave like a smart shopping assistant. For product queries, I will retrieve matched items and explain the result clearly.',
        followUps: [
          'Show winning products',
          'What is trendy today?',
          'Recommend a product for me'
        ]
      };
  }
}

function MetricCard({
  label,
  value,
  icon
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className='rounded-3xl border border-white/70 bg-white/80 p-4 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/80'>
      <div className='flex items-center justify-between gap-3'>
        <p className='text-[10px] font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400'>
          {label}
        </p>
        <div className='text-slate-400'>{icon}</div>
      </div>
      <p className='mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white'>
        {value}
      </p>
    </div>
  );
}

function ConsoleIntentButton({
  item,
  selected,
  onClick
}: {
  item: {
    id: Intent;
    label: string;
    icon: React.ReactNode;
    hint: string;
  };
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type='button'
      variant={selected ? 'default' : 'outline'}
      onClick={onClick}
      className='rounded-full px-4'
    >
      {item.icon}
      <span className='ml-2'>{item.label}</span>
      <span className='ml-2 hidden text-xs opacity-70 sm:inline'>
        {item.hint}
      </span>
    </Button>
  );
}

export default function SmartProductAssistantPage() {
  const [selectedMode, setSelectedMode] = useState<Intent>('chat');
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Welcome. You can ask in natural language, tap an intent chip, or use a suggested prompt to see products, chat-only answers, or compare mode.'
    }
  ]);
  const [activeProducts, setActiveProducts] = useState<Product[]>(
    CATALOG.slice(0, 4)
  );
  const [selectedProductId, setSelectedProductId] = useState<number>(
    CATALOG[0].id
  );

  const endRef = useRef<HTMLDivElement | null>(null);

  const selectedProduct = useMemo(
    () =>
      activeProducts.find((p) => p.id === selectedProductId) ??
      activeProducts[0] ??
      CATALOG[0],
    [activeProducts, selectedProductId]
  );

  const currentIntentLabel = MODE_LABELS[selectedMode] ?? 'Chat';

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    endRef.current?.scrollIntoView({ behavior, block: 'end' });
  };

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages.length, isThinking, activeProducts.length]);

  const submitQuery = (query: string, mode: Intent) => {
    const trimmed = query.trim();
    if (!trimmed || isThinking) return;

    const intent = detectIntent(trimmed, mode);
    const reply = buildReply(trimmed, intent);
    const stamp = Date.now();

    setSelectedMode(mode);
    setIsThinking(true);

    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: `${stamp}-user`, role: 'user', content: trimmed },
        {
          id: `${stamp}-assistant`,
          role: 'assistant',
          content: reply.content,
          intent,
          products: reply.products,
          followUps: reply.followUps
        }
      ]);

      if (reply.products?.length) {
        setActiveProducts(reply.products);
        setSelectedProductId(reply.products[0].id);
      }

      setInput('');
      setIsThinking(false);
    }, 3000);
  };

  const sendMessage = () => {
    submitQuery(input, selectedMode);
  };

  const runPrompt = (prompt: string, mode: Intent = 'chat') => {
    submitQuery(prompt, mode);
  };

  return (
    <PageContainer scrollable={false}>
      <div className='flex h-full min-h-0 flex-col overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100'>
        <div className='mx-auto flex h-full min-h-0 w-full max-w-none flex-col gap-3 px-3 py-3 sm:px-4 sm:py-4 lg:px-5'>
          <header className='hidden shrink-0 rounded-[28px] border border-slate-200/80 bg-gradient-to-br from-white via-white to-slate-50 px-4 py-3 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur sm:px-5 sm:py-4 md:block dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950'>
            <div className='flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between'>
              <div className='min-w-0'>
                <h1 className='text-xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white'>
                  Smart Product Assistant
                </h1>
                <p className='mt-1 max-w-3xl text-sm leading-6 text-slate-600 sm:mt-2 sm:text-base dark:text-slate-400'>
                  Search, chat, compare, and inspect products in one full-page
                  experience.
                </p>
              </div>

              <div className='hidden grid-cols-2 gap-3 sm:grid-cols-4 md:grid xl:w-[520px]'>
                <MetricCard
                  label='Catalog'
                  value='1M'
                  icon={<ShoppingBag className='h-4 w-4' />}
                />
                <MetricCard
                  label='Reviews'
                  value='3M'
                  icon={<BarChart3 className='h-4 w-4' />}
                />
                <MetricCard
                  label='Mode'
                  value={currentIntentLabel}
                  icon={<Radar className='h-4 w-4' />}
                />
                <MetricCard
                  label='UX'
                  value='Live'
                  icon={<Sparkles className='h-4 w-4' />}
                />
              </div>
            </div>

            <div className='mt-4 flex flex-wrap gap-2'>
              {INTENTS.map((item) => (
                <ConsoleIntentButton
                  key={item.id}
                  item={item}
                  selected={selectedMode === item.id}
                  onClick={() => setSelectedMode(item.id)}
                />
              ))}
            </div>
          </header>

          <div className='grid min-h-0 flex-1 gap-3 xl:grid-cols-[320px_minmax(0,1fr)_360px]'>
            <aside className='hidden min-h-0 space-y-3 xl:block'>
              <Card className='rounded-[28px] border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-900'>
                <CardHeader className='pb-3'>
                  <CardTitle className='flex items-center gap-2 text-base text-slate-950 dark:text-white'>
                    <BadgePercent className='h-4 w-4' />
                    Suggested prompts
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-2'>
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type='button'
                      onClick={() =>
                        runPrompt(prompt, detectIntent(prompt, 'chat'))
                      }
                      className='flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-left text-sm text-slate-700 transition hover:-translate-y-0.5 hover:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900'
                    >
                      <Sparkles className='h-4 w-4 shrink-0 text-slate-400' />
                      <span className='min-w-0 flex-1'>{prompt}</span>
                      <ArrowRight className='h-4 w-4 shrink-0 text-slate-400' />
                    </button>
                  ))}
                </CardContent>
              </Card>
            </aside>

            <main className='min-h-0 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-900'>
              <div className='flex h-full min-h-0 flex-col overflow-hidden'>
                <div className='flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto px-4 py-4 sm:px-6'>
                  <div className='space-y-4'>
                    <div className='px-1 pt-1 md:hidden'>
                      <div className='flex items-start justify-between gap-3'>
                        <div className='min-w-0'>
                          <p className='text-[10px] font-semibold tracking-[0.22em] text-slate-500 uppercase dark:text-slate-400'>
                            Product console
                          </p>
                          <h2 className='mt-1 text-lg font-semibold tracking-tight text-slate-950 dark:text-white'>
                            Smart Product Assistant
                          </h2>
                          <p className='mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400'>
                            Tap a mode or launch a quick prompt.
                          </p>
                        </div>

                        <Badge className='rounded-full px-3 py-1 capitalize'>
                          {currentIntentLabel}
                        </Badge>
                      </div>

                      <div className='mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
                        {INTENTS.map((item) => (
                          <button
                            key={item.id}
                            type='button'
                            onClick={() => setSelectedMode(item.id)}
                            className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                              selectedMode === item.id
                                ? 'border-slate-950 bg-slate-950 text-white dark:border-white dark:bg-white dark:text-slate-950'
                                : 'border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900'
                            }`}
                          >
                            {item.icon}
                            <span>{item.label}</span>
                          </button>
                        ))}
                      </div>

                      <div className='mt-4 grid grid-cols-2 gap-2'>
                        {MOBILE_QUICK_PROMPTS.map((item) => (
                          <button
                            key={item.label}
                            type='button'
                            onClick={() => runPrompt(item.prompt, item.mode)}
                            className='group min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900'
                          >
                            <div className='flex items-start justify-between gap-3'>
                              <div className='min-w-0 flex-1'>
                                <div className='flex items-center gap-2'>
                                  <div className='rounded-xl bg-white p-2 text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300'>
                                    {item.icon}
                                  </div>
                                  <p className='min-w-0 text-sm font-semibold text-slate-950 dark:text-white'>
                                    {item.label}
                                  </p>
                                </div>
                                <p className='mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400'>
                                  {item.hint}
                                </p>
                              </div>
                              <ChevronRight className='mt-1 h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5' />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex min-w-0 ${
                          message.role === 'user'
                            ? 'justify-end'
                            : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[94%] min-w-0 rounded-[24px] px-4 py-4 text-sm leading-6 shadow-sm sm:max-w-[82%] md:max-w-[82%] ${
                            message.role === 'user'
                              ? 'border border-slate-950 bg-slate-950 text-white dark:border-white dark:bg-white dark:text-slate-950'
                              : 'border border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200'
                          }`}
                        >
                          <div className='flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase opacity-70'>
                            {message.role === 'user' ? (
                              <MessageCircle className='h-3.5 w-3.5' />
                            ) : (
                              <Bot className='h-3.5 w-3.5' />
                            )}
                            {message.role === 'user' ? 'You' : 'Assistant'}
                            {message.intent ? (
                              <span className='rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase'>
                                {message.intent}
                              </span>
                            ) : null}
                          </div>

                          <p className='mt-2 break-words'>{message.content}</p>

                          {message.followUps?.length ? (
                            <div className='mt-3 flex flex-wrap gap-2'>
                              {message.followUps.map((item) => (
                                <button
                                  key={item}
                                  type='button'
                                  onClick={() =>
                                    runPrompt(item, detectIntent(item, 'chat'))
                                  }
                                  className='rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 transition hover:border-slate-300 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                                >
                                  {item}
                                </button>
                              ))}
                            </div>
                          ) : null}

                          {message.products?.length ? (
                            <div className='mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2'>
                              {message.products.map((product) => (
                                <button
                                  key={product.id}
                                  type='button'
                                  onClick={() => {
                                    setActiveProducts(message.products ?? []);
                                    setSelectedProductId(product.id);
                                    scrollToBottom('smooth');
                                  }}
                                  className='group min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 text-left transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900'
                                >
                                  <div className='flex items-start gap-3'>
                                    <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-xs font-semibold text-slate-700 dark:from-slate-800 dark:to-slate-700 dark:text-slate-200'>
                                      {product.imageLabel}
                                    </div>

                                    <div className='min-w-0 flex-1'>
                                      <div className='flex items-start justify-between gap-3'>
                                        <div className='min-w-0 flex-1'>
                                          <p className='truncate text-sm font-semibold text-slate-950 dark:text-white'>
                                            {product.title}
                                          </p>
                                          <p className='mt-0.5 text-xs leading-5 break-words text-slate-500 dark:text-slate-400'>
                                            {product.summary}
                                          </p>
                                        </div>

                                        <ChevronRight className='mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5' />
                                      </div>

                                      <div className='mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-400'>
                                        <span className='font-semibold text-slate-950 dark:text-white'>
                                          {formatPrice(product.price)}
                                        </span>
                                        <span className='inline-flex items-center gap-1'>
                                          <Star className='h-3.5 w-3.5 fill-current text-amber-500' />
                                          {product.ratingAvg.toFixed(1)}
                                        </span>
                                        <Badge
                                          variant='secondary'
                                          className='rounded-full capitalize'
                                        >
                                          {product.lifecycle}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ))}

                    {isThinking ? (
                      <div className='flex justify-start'>
                        <div className='flex items-center gap-3 rounded-[28px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400'>
                          <span className='leading-none'>Analyzing</span>
                          <div className='flex items-center gap-1'>
                            <span className='h-1.5 w-1.5 animate-[pulse_1.2s_ease-in-out_infinite] rounded-full bg-slate-400' />
                            <span className='h-1.5 w-1.5 animate-[pulse_1.2s_ease-in-out_infinite] rounded-full bg-slate-400 [animation-delay:0.2s]' />
                            <span className='h-1.5 w-1.5 animate-[pulse_1.2s_ease-in-out_infinite] rounded-full bg-slate-400 [animation-delay:0.4s]' />
                          </div>
                        </div>
                      </div>
                    ) : null}

                    <div ref={endRef} />
                  </div>
                </div>

                <div className='shrink-0 border-t border-slate-200/80 bg-white p-4 sm:p-6 dark:border-slate-800 dark:bg-slate-900'>
                  <div className='flex flex-col gap-3 lg:flex-row lg:items-end'>
                    <div className='relative min-w-0 flex-1'>
                      <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder='Example: show me winning products under $50'
                        rows={1}
                        className='max-h-[120px] min-h-[48px] resize-none rounded-3xl border-slate-200 bg-white px-3 py-2 pr-12 text-sm leading-5 text-slate-950 placeholder:text-slate-400 focus-visible:ring-slate-400 sm:min-h-[96px] sm:px-4 sm:py-3 sm:pr-4 dark:border-slate-800 dark:bg-slate-950 dark:text-white'
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                      />

                      <Button
                        type='button'
                        className='absolute right-2 bottom-2 h-8 w-8 rounded-full p-0 md:hidden'
                        onClick={sendMessage}
                        disabled={!input.trim() || isThinking}
                      >
                        <Wand2 className='h-4 w-4' />
                      </Button>
                    </div>

                    <div className='hidden grid-cols-2 gap-2 md:grid lg:w-[190px] lg:grid-cols-1'>
                      <Button
                        type='button'
                        variant='outline'
                        className='rounded-2xl'
                        onClick={() => setInput('')}
                      >
                        Clear
                      </Button>
                      <Button
                        type='button'
                        className='rounded-2xl'
                        onClick={sendMessage}
                        disabled={!input.trim() || isThinking}
                      >
                        <Wand2 className='mr-2 h-4 w-4' />
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </main>

            <aside className='hidden min-h-0 space-y-3 xl:block'>
              <Card className='rounded-[28px] border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-900'>
                <CardHeader className='pb-3'>
                  <CardTitle className='flex items-center gap-2 text-base text-slate-950 dark:text-white'>
                    <CircleHelp className='h-4 w-4' />
                    Why this is selected
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950'>
                    <div className='flex items-center justify-between gap-3'>
                      <div>
                        <p className='text-xs tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400'>
                          Focused product
                        </p>
                        <p className='mt-1 text-base font-semibold text-slate-950 dark:text-white'>
                          {selectedProduct.title}
                        </p>
                      </div>
                      <Badge className='rounded-full capitalize'>
                        {selectedProduct.lifecycle}
                      </Badge>
                    </div>

                    <div className='mt-4 grid grid-cols-2 gap-2'>
                      <div className='rounded-2xl bg-white p-3 dark:bg-slate-900'>
                        <p className='text-[11px] text-slate-500 dark:text-slate-400'>
                          Price
                        </p>
                        <p className='mt-1 text-sm font-semibold text-slate-950 dark:text-white'>
                          {formatPrice(selectedProduct.price)}
                        </p>
                      </div>
                      <div className='rounded-2xl bg-white p-3 dark:bg-slate-900'>
                        <p className='text-[11px] text-slate-500 dark:text-slate-400'>
                          Score
                        </p>
                        <p className='mt-1 text-sm font-semibold text-slate-950 dark:text-white'>
                          {selectedProduct.score}/100
                        </p>
                      </div>
                      <div className='rounded-2xl bg-white p-3 dark:bg-slate-900'>
                        <p className='text-[11px] text-slate-500 dark:text-slate-400'>
                          Rating
                        </p>
                        <p className='mt-1 text-sm font-semibold text-slate-950 dark:text-white'>
                          {selectedProduct.ratingAvg.toFixed(1)}
                        </p>
                      </div>
                      <div className='rounded-2xl bg-white p-3 dark:bg-slate-900'>
                        <p className='text-[11px] text-slate-500 dark:text-slate-400'>
                          Reviews
                        </p>
                        <p className='mt-1 text-sm font-semibold text-slate-950 dark:text-white'>
                          {selectedProduct.ratingCount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <p className='text-sm font-semibold text-slate-950 dark:text-white'>
                      Evidence
                    </p>
                    <p className='text-sm leading-6 text-slate-600 dark:text-slate-300'>
                      {selectedProduct.summary}
                    </p>
                    <div className='flex items-start gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300'>
                      <ShieldCheck className='mt-0.5 h-4 w-4 shrink-0 text-slate-400' />
                      <span>{selectedProduct.reviewInsight}</span>
                    </div>
                  </div>

                  <div>
                    <p className='mb-2 text-sm font-semibold text-slate-950 dark:text-white'>
                      Tags
                    </p>
                    <div className='flex flex-wrap gap-2'>
                      {selectedProduct.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant='secondary'
                          className='rounded-full px-3 py-1'
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
