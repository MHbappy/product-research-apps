'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  ChevronRight,
  Loader2,
  MapPin,
  PencilLine,
  Plus,
  Search,
  ShieldCheck,
  Store,
  Trash2,
  Users
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import PageContainer from '@/components/layout/page-container';

type Seller = {
  id: number;
  name: string;
  platform: string;
  location: string;
  contact: string;
  verified: boolean;
  trustScore: number;
  activeProducts: number;
  responseTime: string;
};

type SellerForm = {
  name: string;
  platform: string;
  location: string;
  contact: string;
  verified: boolean;
};

const INITIAL_FORM: SellerForm = {
  name: '',
  platform: '',
  location: '',
  contact: '',
  verified: false
};

const INITIAL_SELLERS: Seller[] = [
  {
    id: 1,
    name: 'Nordic Home Lab',
    platform: 'Daraz',
    location: 'Dhaka, Bangladesh',
    contact: 'support@nordichomelab.com',
    verified: true,
    trustScore: 94,
    activeProducts: 128,
    responseTime: '2 hours'
  },
  {
    id: 2,
    name: 'PeakTech Supply',
    platform: 'Facebook Shop',
    location: 'Chattogram, Bangladesh',
    contact: '+880 1700 000 002',
    verified: true,
    trustScore: 91,
    activeProducts: 240,
    responseTime: '30 mins'
  },
  {
    id: 3,
    name: 'KitchenNest Co.',
    platform: 'Daraz',
    location: 'Narayanganj, Bangladesh',
    contact: 'sales@kitchennest.co',
    verified: false,
    trustScore: 76,
    activeProducts: 96,
    responseTime: '1 day'
  },
  {
    id: 4,
    name: 'Urban Pet Works',
    platform: 'Marketplace',
    location: 'Sylhet, Bangladesh',
    contact: '+880 1700 000 004',
    verified: false,
    trustScore: 61,
    activeProducts: 42,
    responseTime: '2 days'
  }
];

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

function Badge({
  children,
  tone = 'slate'
}: {
  children: React.ReactNode;
  tone?: 'slate' | 'emerald' | 'indigo' | 'amber';
}) {
  const map = {
    slate:
      'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700',
    emerald:
      'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-200 dark:ring-emerald-900/40',
    indigo:
      'bg-indigo-50 text-indigo-700 ring-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-200 dark:ring-indigo-900/40',
    amber:
      'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-900/20 dark:text-amber-200 dark:ring-amber-900/40'
  } as const;

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${map[tone]}`}
    >
      {children}
    </span>
  );
}

function StatCard({
  label,
  value,
  hint,
  icon: Icon
}: {
  label: string;
  value: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card className='rounded-[24px] border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950/60'>
      <CardContent className='p-4'>
        <div className='flex items-start justify-between gap-3'>
          <div>
            <div className='text-[11px] font-semibold tracking-[0.16em] text-slate-500 uppercase dark:text-slate-400'>
              {label}
            </div>
            <div className='mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white'>
              {value}
            </div>
            <div className='mt-1 text-sm text-slate-500 dark:text-slate-400'>
              {hint}
            </div>
          </div>
          <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200'>
            <Icon className='h-5 w-5' />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SellerRow({
  seller,
  selected,
  onSelect,
  onEdit,
  onDelete
}: {
  seller: Seller;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={`group rounded-[24px] border p-4 transition-all duration-200 ${
        selected
          ? 'border-slate-950 bg-slate-950 text-white shadow-[0_12px_30px_rgba(15,23,42,0.18)] dark:border-white dark:bg-white dark:text-slate-950'
          : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-slate-700'
      }`}
    >
      <button
        type='button'
        onClick={onSelect}
        className='flex w-full items-start gap-4 text-left'
      >
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl text-sm font-semibold ${selected ? 'bg-white/10 text-white dark:bg-slate-100 dark:text-slate-950' : 'bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200'}`}
        >
          {initials(seller.name)}
        </div>

        <div className='min-w-0 flex-1'>
          <div className='flex flex-wrap items-center gap-2'>
            <div className='truncate text-base font-semibold tracking-tight'>
              {seller.name}
            </div>
            {seller.verified ? (
              <Badge tone='emerald'>Verified</Badge>
            ) : (
              <Badge tone='amber'>Unverified</Badge>
            )}
          </div>

          <div
            className={`mt-2 flex flex-wrap items-center gap-2 text-sm ${selected ? 'text-white/75 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400'}`}
          >
            <span className='inline-flex items-center gap-1.5'>
              <Store className='h-3.5 w-3.5' />
              {seller.platform}
            </span>
            <span>•</span>
            <span className='inline-flex items-center gap-1.5'>
              <MapPin className='h-3.5 w-3.5' />
              {seller.location}
            </span>
          </div>

          <div className='mt-3 grid grid-cols-3 gap-2'>
            <div>
              <div
                className={`text-[11px] tracking-[0.14em] uppercase ${selected ? 'text-white/60 dark:text-slate-500' : 'text-slate-400'}`}
              >
                Trust
              </div>
              <div className='mt-1 text-sm font-semibold'>
                {seller.trustScore}/100
              </div>
            </div>
            <div>
              <div
                className={`text-[11px] tracking-[0.14em] uppercase ${selected ? 'text-white/60 dark:text-slate-500' : 'text-slate-400'}`}
              >
                Products
              </div>
              <div className='mt-1 text-sm font-semibold'>
                {seller.activeProducts}
              </div>
            </div>
            <div>
              <div
                className={`text-[11px] tracking-[0.14em] uppercase ${selected ? 'text-white/60 dark:text-slate-500' : 'text-slate-400'}`}
              >
                Reply
              </div>
              <div className='mt-1 text-sm font-semibold'>
                {seller.responseTime}
              </div>
            </div>
          </div>
        </div>
      </button>

      <div className='mt-4 flex justify-end gap-2 opacity-100 sm:opacity-0 sm:transition sm:group-hover:opacity-100'>
        <Button
          type='button'
          variant='secondary'
          size='sm'
          className='h-8 rounded-xl'
          onClick={onEdit}
        >
          <PencilLine className='mr-1 h-3.5 w-3.5' />
          Edit
        </Button>
        <Button
          type='button'
          variant='outline'
          size='sm'
          className='h-8 rounded-xl'
          onClick={onDelete}
        >
          <Trash2 className='mr-1 h-3.5 w-3.5' />
          Delete
        </Button>
      </div>
    </div>
  );
}

export default function SellerInformationPage() {
  const [sellers, setSellers] = useState<Seller[]>(INITIAL_SELLERS);
  const [selectedId, setSelectedId] = useState<number>(INITIAL_SELLERS[0].id);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<SellerForm>(INITIAL_FORM);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sellers.filter((seller) => {
      if (!q) return true;
      const hay = [
        seller.name,
        seller.platform,
        seller.location,
        seller.contact
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [query, sellers]);

  const selected = useMemo(
    () => sellers.find((seller) => seller.id === selectedId) ?? sellers[0],
    [sellers, selectedId]
  );

  const stats = useMemo(() => {
    const total = sellers.length;
    const verified = sellers.filter((seller) => seller.verified).length;
    const avgTrust = Math.round(
      sellers.reduce((sum, seller) => sum + seller.trustScore, 0) /
        Math.max(1, sellers.length)
    );
    return { total, verified, avgTrust };
  }, [sellers]);

  function resetForm() {
    setEditingId(null);
    setForm(INITIAL_FORM);
  }

  function openCreate() {
    resetForm();
    setOpen(true);
  }

  function openEdit(seller: Seller) {
    setEditingId(seller.id);
    setForm({
      name: seller.name,
      platform: seller.platform,
      location: seller.location,
      contact: seller.contact,
      verified: seller.verified
    });
    setOpen(true);
  }

  function submitForm(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    window.setTimeout(() => {
      const payload: Seller = {
        id: editingId ?? Date.now(),
        name: form.name.trim(),
        platform: form.platform.trim(),
        location: form.location.trim(),
        contact: form.contact.trim(),
        verified: form.verified,
        trustScore: form.verified ? 90 : 68,
        activeProducts: editingId
          ? (sellers.find((seller) => seller.id === editingId)
              ?.activeProducts ?? 0)
          : 0,
        responseTime: editingId
          ? (sellers.find((seller) => seller.id === editingId)?.responseTime ??
            '1 day')
          : '1 day'
      };

      setSellers((prev) =>
        editingId
          ? prev.map((seller) => (seller.id === editingId ? payload : seller))
          : [payload, ...prev]
      );
      setSelectedId(payload.id);
      setSaving(false);
      setOpen(false);
      resetForm();
    }, 180);
  }

  function removeSeller(id: number) {
    setSellers((prev) => prev.filter((seller) => seller.id !== id));
    if (selectedId === id) {
      const next = sellers.find((seller) => seller.id !== id);
      if (next) setSelectedId(next.id);
    }
  }

  const trustColor =
    selected?.trustScore >= 90
      ? 'text-emerald-600'
      : selected?.trustScore >= 75
        ? 'text-indigo-600'
        : 'text-amber-600';

  return (
    <PageContainer>
      <div className='relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100'>
        <div className='pointer-events-none absolute inset-0 opacity-70'>
          <div className='absolute top-[-8rem] left-[-8rem] h-[28rem] w-[28rem] rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-500/10' />
          <div className='absolute top-[8rem] right-[-8rem] h-[24rem] w-[24rem] rounded-full bg-emerald-200/20 blur-3xl dark:bg-emerald-500/10' />
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
                <Badge tone='indigo'>Seller info</Badge>
                <Badge tone='slate'>Compact</Badge>
                <Badge tone='emerald'>Trusted signal</Badge>
              </div>

              <h1 className='max-w-5xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white'>
                Seller Overview
              </h1>
              <p className='max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400'>
                Keep only the key seller details: name, platform, location,
                contact, and verification.
              </p>
            </div>

            <div className='grid gap-3 sm:grid-cols-3'>
              <StatCard
                label='Sellers'
                value={String(stats.total)}
                hint='Total records'
                icon={Users}
              />
              <StatCard
                label='Verified'
                value={String(stats.verified)}
                hint='Trusted sellers'
                icon={BadgeCheck}
              />
              <StatCard
                label='Avg trust'
                value={`${stats.avgTrust}/100`}
                hint='Platform average'
                icon={ShieldCheck}
              />
            </div>
          </div>

          <div className='grid gap-6 xl:grid-cols-[0.95fr_1.05fr]'>
            <Card className='rounded-[28px] border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950/60'>
              <CardHeader className='pb-4'>
                <div className='flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between'>
                  <div>
                    <CardTitle className='text-xl'>Seller list</CardTitle>
                    <CardDescription>
                      Search and manage sellers in one place.
                    </CardDescription>
                  </div>

                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button
                        className='gap-2 rounded-2xl bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200'
                        onClick={openCreate}
                      >
                        <Plus className='h-4 w-4' />
                        Add seller
                      </Button>
                    </DialogTrigger>

                    <DialogContent className='rounded-[28px] border-slate-200 bg-white p-0 dark:border-slate-800 dark:bg-slate-950'>
                      <form onSubmit={submitForm}>
                        <DialogHeader className='border-b border-slate-200 px-6 py-5 dark:border-slate-800'>
                          <DialogTitle className='text-2xl'>
                            {editingId ? 'Edit seller' : 'Add seller'}
                          </DialogTitle>
                          <DialogDescription>
                            Only five fields. Clean, fast, and easy to maintain.
                          </DialogDescription>
                        </DialogHeader>

                        <div className='space-y-5 px-6 py-5'>
                          <div className='grid gap-4 sm:grid-cols-2'>
                            <div className='space-y-2'>
                              <Label>Seller name</Label>
                              <Input
                                required
                                value={form.name}
                                onChange={(e) =>
                                  setForm((prev) => ({
                                    ...prev,
                                    name: e.target.value
                                  }))
                                }
                                className='h-11 rounded-2xl'
                                placeholder='Seller or company name'
                              />
                            </div>
                            <div className='space-y-2'>
                              <Label>Platform</Label>
                              <Input
                                required
                                value={form.platform}
                                onChange={(e) =>
                                  setForm((prev) => ({
                                    ...prev,
                                    platform: e.target.value
                                  }))
                                }
                                className='h-11 rounded-2xl'
                                placeholder='Daraz, Facebook Shop, Website'
                              />
                            </div>
                          </div>

                          <div className='grid gap-4 sm:grid-cols-2'>
                            <div className='space-y-2'>
                              <Label>Location</Label>
                              <Input
                                required
                                value={form.location}
                                onChange={(e) =>
                                  setForm((prev) => ({
                                    ...prev,
                                    location: e.target.value
                                  }))
                                }
                                className='h-11 rounded-2xl'
                                placeholder='City, country'
                              />
                            </div>
                            <div className='space-y-2'>
                              <Label>Contact</Label>
                              <Input
                                required
                                value={form.contact}
                                onChange={(e) =>
                                  setForm((prev) => ({
                                    ...prev,
                                    contact: e.target.value
                                  }))
                                }
                                className='h-11 rounded-2xl'
                                placeholder='Email or phone'
                              />
                            </div>
                          </div>

                          <div className='flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800'>
                            <div>
                              <div className='text-sm font-medium text-slate-950 dark:text-white'>
                                Verified seller
                              </div>
                              <div className='text-xs text-slate-500 dark:text-slate-400'>
                                Use this for trusted accounts only
                              </div>
                            </div>
                            <Switch
                              checked={form.verified}
                              onCheckedChange={(checked) =>
                                setForm((prev) => ({
                                  ...prev,
                                  verified: checked
                                }))
                              }
                            />
                          </div>
                        </div>

                        <DialogFooter className='border-t border-slate-200 px-6 py-5 dark:border-slate-800'>
                          <Button
                            type='button'
                            variant='outline'
                            className='rounded-2xl'
                            onClick={() => setOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type='submit'
                            className='gap-2 rounded-2xl bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200'
                          >
                            {saving ? (
                              <Loader2 className='h-4 w-4 animate-spin' />
                            ) : (
                              <Plus className='h-4 w-4' />
                            )}
                            {editingId ? 'Save changes' : 'Create seller'}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>

              <CardContent className='space-y-4'>
                <div className='relative'>
                  <Search className='pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400' />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder='Search seller, platform, location, or contact'
                    className='h-11 rounded-2xl pl-10'
                  />
                </div>

                <div className='flex flex-wrap gap-2'>
                  <Badge tone='slate'>Simple fields</Badge>
                  <Badge tone='indigo'>Fast create</Badge>
                  <Badge tone='emerald'>Trust first</Badge>
                </div>

                <div className='space-y-3'>
                  {filtered.map((seller) => (
                    <SellerRow
                      key={seller.id}
                      seller={seller}
                      selected={selected?.id === seller.id}
                      onSelect={() => setSelectedId(seller.id)}
                      onEdit={() => openEdit(seller)}
                      onDelete={() => removeSeller(seller.id)}
                    />
                  ))}

                  {filtered.length === 0 ? (
                    <div className='rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-800 dark:bg-slate-900/60'>
                      <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200'>
                        <Search className='h-6 w-6' />
                      </div>
                      <div className='mt-4 text-lg font-semibold text-slate-950 dark:text-white'>
                        No sellers found
                      </div>
                      <p className='mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400'>
                        Try another keyword or clear the search.
                      </p>
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>

            <div className='space-y-6'>
              <Card className='rounded-[28px] border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950/60'>
                <CardHeader className='pb-4'>
                  <CardTitle className='text-xl'>Selected seller</CardTitle>
                  <CardDescription>
                    Compact trust and reach summary.
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-5'>
                  {selected ? (
                    <>
                      <div className='rounded-[26px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50'>
                        <div className='flex items-start gap-4'>
                          <div className='flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-slate-900 text-lg font-semibold text-white dark:bg-white dark:text-slate-950'>
                            {initials(selected.name)}
                          </div>
                          <div className='min-w-0 flex-1'>
                            <div className='flex flex-wrap items-center gap-2'>
                              <h2 className='truncate text-xl font-semibold tracking-tight text-slate-950 dark:text-white'>
                                {selected.name}
                              </h2>
                              {selected.verified ? (
                                <Badge tone='emerald'>Verified</Badge>
                              ) : (
                                <Badge tone='amber'>Unverified</Badge>
                              )}
                            </div>
                            <div className='mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400'>
                              <div className='flex items-center gap-2'>
                                <Building2 className='h-4 w-4 text-indigo-500' />
                                {selected.platform}
                              </div>
                              <div className='flex items-center gap-2'>
                                <MapPin className='h-4 w-4 text-emerald-500' />
                                {selected.location}
                              </div>
                              <div className='flex items-center gap-2'>
                                <ChevronRight className='h-4 w-4 text-amber-500' />
                                {selected.contact}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className='grid gap-3 sm:grid-cols-2'>
                        <StatCard
                          label='Trust score'
                          value={`${selected.trustScore}/100`}
                          hint='Main trust signal'
                          icon={ShieldCheck}
                        />
                        <StatCard
                          label='Active products'
                          value={String(selected.activeProducts)}
                          hint='Current listings'
                          icon={Store}
                        />
                      </div>

                      <div className='rounded-[24px] border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/60'>
                        <div className='text-sm font-semibold text-slate-950 dark:text-white'>
                          Why this seller feels trustworthy
                        </div>
                        <div className='mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400'>
                          <div className='flex items-center gap-2'>
                            <BadgeCheck className='h-4 w-4 text-emerald-500' />
                            Clear seller identity
                          </div>
                          <div className='flex items-center gap-2'>
                            <BadgeCheck className='h-4 w-4 text-emerald-500' />
                            Visible platform and contact
                          </div>
                          <div className='flex items-center gap-2'>
                            <BadgeCheck className='h-4 w-4 text-emerald-500' />
                            Simple verification status
                          </div>
                        </div>
                      </div>

                      <div className='flex flex-wrap gap-2'>
                        <Button
                          type='button'
                          className='gap-2 rounded-2xl bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200'
                          onClick={() => openEdit(selected)}
                        >
                          <PencilLine className='h-4 w-4' />
                          Edit seller
                        </Button>
                        <Button
                          type='button'
                          variant='outline'
                          className='gap-2 rounded-2xl'
                          onClick={() => removeSeller(selected.id)}
                        >
                          <Trash2 className='h-4 w-4' />
                          Delete seller
                        </Button>
                      </div>
                    </>
                  ) : null}
                </CardContent>
              </Card>

              <Card className='rounded-[28px] border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950/60'>
                <CardHeader className='pb-4'>
                  <CardTitle className='text-xl'>Fields to keep</CardTitle>
                  <CardDescription>Small set, high value.</CardDescription>
                </CardHeader>
                <CardContent className='space-y-3 text-sm text-slate-600 dark:text-slate-400'>
                  <div className='flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/50'>
                    <span>Seller name</span>
                    <ChevronRight className='h-4 w-4 text-slate-400' />
                  </div>
                  <div className='flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/50'>
                    <span>Platform / store</span>
                    <ChevronRight className='h-4 w-4 text-slate-400' />
                  </div>
                  <div className='flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/50'>
                    <span>Location</span>
                    <ChevronRight className='h-4 w-4 text-slate-400' />
                  </div>
                  <div className='flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/50'>
                    <span>Contact</span>
                    <ChevronRight className='h-4 w-4 text-slate-400' />
                  </div>
                  <div className='flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/50'>
                    <span>Verified</span>
                    <ChevronRight className='h-4 w-4 text-slate-400' />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
