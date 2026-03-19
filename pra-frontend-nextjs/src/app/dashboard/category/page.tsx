'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BarChart3,
  ChevronDown,
  ChevronRight,
  CircleDot,
  Filter,
  FolderTree,
  Layers3,
  Search,
  Sparkles,
  SquarePen,
  Tag,
  TreePine
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
import PageContainer from '@/components/layout/page-container';

type CategoryNode = {
  id: number;
  name: string;
  slug: string;
  level: number;
  isActive: boolean;
  parentId: number | null;
  children: CategoryNode[];
};

type FlatCategory = Omit<CategoryNode, 'children'>;

type TreeState = {
  expanded: Record<number, boolean>;
  selectedId: number | null;
  query: string;
  showInactive: boolean;
};

const CATEGORY_TREE: CategoryNode[] = [
  {
    id: 1,
    name: 'Home & Living',
    slug: 'home-living',
    level: 1,
    isActive: true,
    parentId: null,
    children: [
      {
        id: 11,
        name: 'Storage & Organization',
        slug: 'storage-organization',
        level: 2,
        isActive: true,
        parentId: 1,
        children: [
          {
            id: 111,
            name: 'Foldable Storage Bins',
            slug: 'foldable-storage-bins',
            level: 3,
            isActive: true,
            parentId: 11,
            children: []
          },
          {
            id: 112,
            name: 'Closet Organizers',
            slug: 'closet-organizers',
            level: 3,
            isActive: true,
            parentId: 11,
            children: []
          }
        ]
      },
      {
        id: 12,
        name: 'Lighting',
        slug: 'lighting',
        level: 2,
        isActive: true,
        parentId: 1,
        children: [
          {
            id: 121,
            name: 'Bedroom Lamps',
            slug: 'bedroom-lamps',
            level: 3,
            isActive: true,
            parentId: 12,
            children: []
          },
          {
            id: 122,
            name: 'Decorative Light Strips',
            slug: 'decorative-light-strips',
            level: 3,
            isActive: false,
            parentId: 12,
            children: []
          }
        ]
      },
      {
        id: 13,
        name: 'Air Care',
        slug: 'air-care',
        level: 2,
        isActive: true,
        parentId: 1,
        children: []
      }
    ]
  },
  {
    id: 2,
    name: 'Electronics',
    slug: 'electronics',
    level: 1,
    isActive: true,
    parentId: null,
    children: [
      {
        id: 21,
        name: 'Audio',
        slug: 'audio',
        level: 2,
        isActive: true,
        parentId: 2,
        children: [
          {
            id: 211,
            name: 'Wireless Earbuds',
            slug: 'wireless-earbuds',
            level: 3,
            isActive: true,
            parentId: 21,
            children: []
          },
          {
            id: 212,
            name: 'Bluetooth Speakers',
            slug: 'bluetooth-speakers',
            level: 3,
            isActive: true,
            parentId: 21,
            children: []
          }
        ]
      },
      {
        id: 22,
        name: 'Accessories',
        slug: 'electronics-accessories',
        level: 2,
        isActive: true,
        parentId: 2,
        children: [
          {
            id: 221,
            name: 'Phone Stands',
            slug: 'phone-stands',
            level: 3,
            isActive: true,
            parentId: 22,
            children: []
          },
          {
            id: 222,
            name: 'Cable Organizers',
            slug: 'cable-organizers',
            level: 3,
            isActive: true,
            parentId: 22,
            children: []
          }
        ]
      }
    ]
  },
  {
    id: 3,
    name: 'Kitchen',
    slug: 'kitchen',
    level: 1,
    isActive: true,
    parentId: null,
    children: [
      {
        id: 31,
        name: 'Cookware',
        slug: 'cookware',
        level: 2,
        isActive: true,
        parentId: 3,
        children: [
          {
            id: 311,
            name: 'Non-stick Pans',
            slug: 'non-stick-pans',
            level: 3,
            isActive: true,
            parentId: 31,
            children: []
          }
        ]
      },
      {
        id: 32,
        name: 'Storage',
        slug: 'kitchen-storage',
        level: 2,
        isActive: true,
        parentId: 3,
        children: []
      }
    ]
  },
  {
    id: 4,
    name: 'Outdoor',
    slug: 'outdoor',
    level: 1,
    isActive: true,
    parentId: null,
    children: [
      {
        id: 41,
        name: 'Garden Tools',
        slug: 'garden-tools',
        level: 2,
        isActive: true,
        parentId: 4,
        children: [
          {
            id: 411,
            name: 'Sprayers',
            slug: 'sprayers',
            level: 3,
            isActive: true,
            parentId: 41,
            children: []
          }
        ]
      },
      {
        id: 42,
        name: 'Camping',
        slug: 'camping',
        level: 2,
        isActive: false,
        parentId: 4,
        children: []
      }
    ]
  }
];

const CATEGORY_METRICS: Record<
  number,
  { products: number; demand: number; competition: number; growth: number }
> = {
  1: { products: 1280, demand: 82, competition: 63, growth: 18 },
  2: { products: 1960, demand: 91, competition: 74, growth: 24 },
  3: { products: 740, demand: 71, competition: 49, growth: 12 },
  4: { products: 420, demand: 64, competition: 37, growth: 9 },
  11: { products: 210, demand: 67, competition: 28, growth: 10 },
  12: { products: 180, demand: 74, competition: 41, growth: 14 },
  13: { products: 64, demand: 52, competition: 19, growth: 6 },
  21: { products: 330, demand: 86, competition: 55, growth: 19 },
  22: { products: 290, demand: 79, competition: 48, growth: 16 },
  31: { products: 250, demand: 69, competition: 35, growth: 11 },
  32: { products: 89, demand: 58, competition: 22, growth: 7 },
  41: { products: 110, demand: 61, competition: 24, growth: 8 },
  42: { products: 60, demand: 49, competition: 20, growth: 4 }
};

function flattenTree(nodes: CategoryNode[]): FlatCategory[] {
  const result: FlatCategory[] = [];

  const walk = (node: CategoryNode) => {
    const { children, ...flat } = node;
    result.push(flat);
    children.forEach(walk);
  };

  nodes.forEach(walk);
  return result;
}

function findNodeById(
  nodes: CategoryNode[],
  id: number | null
): CategoryNode | null {
  if (id == null) return null;

  for (const node of nodes) {
    if (node.id === id) return node;
    const found = findNodeById(node.children, id);
    if (found) return found;
  }

  return null;
}

function collectPath(nodes: CategoryNode[], id: number | null): CategoryNode[] {
  if (id == null) return [];

  const path: CategoryNode[] = [];

  const dfs = (
    items: CategoryNode[],
    current: CategoryNode[] = []
  ): boolean => {
    for (const item of items) {
      const next = [...current, item];
      if (item.id === id) {
        path.push(...next);
        return true;
      }
      if (dfs(item.children, next)) return true;
    }
    return false;
  };

  dfs(nodes);
  return path;
}

function matchesQuery(node: CategoryNode, query: string) {
  if (!query) return true;
  const haystack = `${node.name} ${node.slug} ${node.level}`.toLowerCase();
  return haystack.includes(query.toLowerCase());
}

// @ts-ignore
function hasMatchingDescendant(node: CategoryNode, query: string) {
  if (matchesQuery(node, query)) return true;
  // @ts-ignore
  return node.children.some((child) => hasMatchingDescendant(child, query));
}

function filterTree(nodes: CategoryNode[], state: TreeState): CategoryNode[] {
  const query = state.query.trim();

  return nodes
    .filter((node) => state.showInactive || node.isActive)
    .map((node) => {
      const filteredChildren = filterTree(node.children, state);
      const selfMatches = matchesQuery(node, query);
      const descendantMatches = query
        ? hasMatchingDescendant(node, query)
        : true;

      if (query && !selfMatches && !descendantMatches) return null;
      if (
        !state.showInactive &&
        !node.isActive &&
        filteredChildren.length === 0
      )
        return null;

      return {
        ...node,
        children: filteredChildren
      };
    })
    .filter(Boolean) as CategoryNode[];
}

function countTree(nodes: CategoryNode[]) {
  const stats = { total: 0, active: 0, leaf: 0, roots: 0, maxDepth: 0 };

  const walk = (node: CategoryNode) => {
    stats.total += 1;
    if (node.isActive) stats.active += 1;
    if (node.children.length === 0) stats.leaf += 1;
    stats.maxDepth = Math.max(stats.maxDepth, node.level);
    node.children.forEach(walk);
  };

  stats.roots = nodes.length;
  nodes.forEach(walk);
  return stats;
}

function ensureExpansionForQuery(
  nodes: CategoryNode[],
  query: string,
  expanded: Record<number, boolean>
) {
  if (!query.trim()) return expanded;

  const next = { ...expanded };
  const walk = (node: CategoryNode) => {
    if (hasMatchingDescendant(node, query) && node.children.length > 0) {
      next[node.id] = true;
    }
    node.children.forEach(walk);
  };

  nodes.forEach(walk);
  return next;
}

function LevelBadge({ level }: { level: number }) {
  const tone = level === 1 ? 'indigo' : level === 2 ? 'emerald' : 'amber';
  const map: Record<string, string> = {
    indigo:
      'bg-indigo-50 text-indigo-700 ring-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-200 dark:ring-indigo-900/40',
    emerald:
      'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-200 dark:ring-emerald-900/40',
    amber:
      'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-900/20 dark:text-amber-200 dark:ring-amber-900/40'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${map[tone]}`}
    >
      L{level}
    </span>
  );
}

function StatePill({
  active,
  children
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${
        active
          ? 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-200 dark:ring-emerald-900/40'
          : 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-900/20 dark:text-rose-200 dark:ring-rose-900/40'
      }`}
    >
      {children}
    </span>
  );
}

function MetricCard({
  label,
  value,
  sub
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className='rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/60'>
      <div className='text-[11px] font-semibold tracking-[0.16em] text-slate-500 uppercase dark:text-slate-400'>
        {label}
      </div>
      <div className='mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white'>
        {value}
      </div>
      <div className='mt-1 text-sm text-slate-500 dark:text-slate-400'>
        {sub}
      </div>
    </div>
  );
}

function CategoryTreeNode({
  node,
  level,
  expanded,
  selectedId,
  onToggle,
  onSelect
}: {
  node: CategoryNode;
  level: number;
  expanded: Record<number, boolean>;
  selectedId: number | null;
  onToggle: (id: number) => void;
  onSelect: (id: number) => void;
}) {
  const isExpanded = expanded[node.id] ?? false;
  const isSelected = selectedId === node.id;
  const metric = CATEGORY_METRICS[node.id];

  return (
    <div className='select-none'>
      <div
        className={`group flex items-center justify-between gap-3 rounded-2xl border p-3 transition-all ${
          isSelected
            ? 'border-slate-950 bg-slate-950 text-white shadow-lg dark:border-white dark:bg-white dark:text-slate-950'
            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-slate-700 dark:hover:bg-slate-900/60'
        }`}
        style={{ marginLeft: `${Math.max(0, level - 1) * 18}px` }}
      >
        <button
          type='button'
          onClick={() => onToggle(node.id)}
          className={`flex h-8 w-8 items-center justify-center rounded-xl border transition ${
            isSelected
              ? 'border-white/20 bg-white/10 text-white dark:border-slate-200 dark:bg-slate-100 dark:text-slate-950'
              : 'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'
          } ${node.children.length === 0 ? 'opacity-40' : ''}`}
          aria-label={isExpanded ? 'Collapse category' : 'Expand category'}
          disabled={node.children.length === 0}
        >
          {node.children.length === 0 ? (
            <CircleDot className='h-4 w-4' />
          ) : isExpanded ? (
            <ChevronDown className='h-4 w-4' />
          ) : (
            <ChevronRight className='h-4 w-4' />
          )}
        </button>

        <button
          type='button'
          onClick={() => onSelect(node.id)}
          className='min-w-0 flex-1 text-left'
        >
          <div className='flex flex-wrap items-center gap-2'>
            <span className='truncate text-sm font-semibold tracking-tight'>
              {node.name}
            </span>
            <LevelBadge level={node.level} />
            <StatePill active={node.isActive}>
              {node.isActive ? 'Active' : 'Inactive'}
            </StatePill>
          </div>
          <div
            className={`mt-1 flex flex-wrap items-center gap-2 text-xs ${isSelected ? 'text-white/75 dark:text-slate-700' : 'text-slate-500 dark:text-slate-400'}`}
          >
            <span>/{node.slug}</span>
            <span>•</span>
            <span>
              {node.children.length} child
              {node.children.length === 1 ? '' : 'ren'}
            </span>
          </div>
        </button>

        {metric ? (
          <div className='hidden min-w-[140px] text-right sm:block'>
            <div
              className={`text-xs tracking-[0.16em] uppercase ${isSelected ? 'text-white/65 dark:text-slate-600' : 'text-slate-400'}`}
            >
              Products
            </div>
            <div className='mt-1 text-sm font-semibold'>{metric.products}</div>
          </div>
        ) : null}
      </div>

      {node.children.length > 0 && isExpanded ? (
        <div className='mt-3 space-y-3'>
          {node.children.map((child) => (
            <CategoryTreeNode
              key={child.id}
              node={child}
              level={level + 1}
              expanded={expanded}
              selectedId={selectedId}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function CategoryOverviewPage() {
  const [state, setState] = useState<TreeState>({
    expanded: { 1: true, 2: true, 3: true, 4: true },
    selectedId: 2,
    query: '',
    showInactive: true
  });

  const filteredTree = useMemo(() => filterTree(CATEGORY_TREE, state), [state]);
  const flat = useMemo(() => flattenTree(CATEGORY_TREE), []);
  const stats = useMemo(() => countTree(CATEGORY_TREE), []);

  const selected = useMemo(
    () => findNodeById(CATEGORY_TREE, state.selectedId) ?? CATEGORY_TREE[0],
    [state.selectedId]
  );
  const selectedPath = useMemo(
    () => collectPath(CATEGORY_TREE, selected?.id ?? null),
    [selected]
  );
  const selectedMetric = selected ? CATEGORY_METRICS[selected.id] : undefined;

  const visibleCount = useMemo(() => {
    let count = 0;
    const walk = (node: CategoryNode) => {
      count += 1;
      node.children.forEach(walk);
    };
    filteredTree.forEach(walk);
    return count;
  }, [filteredTree]);

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      expanded: ensureExpansionForQuery(
        CATEGORY_TREE,
        prev.query,
        prev.expanded
      )
    }));
  }, [state.query]);

  useEffect(() => {
    if (!state.selectedId) return;
    const path = collectPath(CATEGORY_TREE, state.selectedId);
    if (path.length === 0) return;

    setState((prev) => {
      const next = { ...prev.expanded };
      path.forEach((node) => {
        if (node.children.length > 0) next[node.id] = true;
      });
      return { ...prev, expanded: next };
    });
  }, [state.selectedId]);

  const rootTree = filteredTree;

  return (
    <PageContainer>
      <div className='relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100'>
        <div className='pointer-events-none absolute inset-0 opacity-70'>
          <div className='absolute top-[-8rem] left-[-7rem] h-[26rem] w-[26rem] rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-500/10' />
          <div className='absolute top-[7rem] right-[-8rem] h-[22rem] w-[22rem] rounded-full bg-emerald-200/25 blur-3xl dark:bg-emerald-500/10' />
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
                <span className='inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-200 dark:ring-indigo-900/40'>
                  Category Overview
                </span>
                <span className='inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700'>
                  Nested tree
                </span>
                <span className='inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-200 dark:ring-emerald-900/40'>
                  Clean analytics
                </span>
              </div>

              <h1 className='max-w-5xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white'>
                Category Overview
              </h1>
              <p className='max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400'>
                Browse parent categories, child categories, and optional
                sub-categories in one clear tree view.
              </p>
            </div>

            <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
              <MetricCard
                label='Total categories'
                value={String(stats.total)}
                sub='All levels together'
              />
              <MetricCard
                label='Active categories'
                value={String(stats.active)}
                sub='Currently enabled'
              />
              <MetricCard
                label='Leaf nodes'
                value={String(stats.leaf)}
                sub='No deeper child'
              />
              <MetricCard
                label='Deepest level'
                value={`L${stats.maxDepth}`}
                sub='Tree depth'
              />
            </div>
          </div>

          <div className='grid gap-6 xl:grid-cols-[1.3fr_0.7fr]'>
            <Card className='rounded-[28px] border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950/60'>
              <CardHeader className='pb-4'>
                <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
                  <div>
                    <CardTitle className='text-xl'>Category tree</CardTitle>
                    <CardDescription>
                      Search categories, expand nodes, and select any branch.
                    </CardDescription>
                  </div>
                  <div className='flex flex-wrap gap-2'>
                    <span className='inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700'>
                      Visible {visibleCount}
                    </span>
                    <span className='inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-200 dark:ring-indigo-900/40'>
                      Roots {rootTree.length}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className='space-y-4'>
                <div className='grid gap-3 lg:grid-cols-[1fr_auto]'>
                  <div className='relative'>
                    <Search className='pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400' />
                    <Input
                      value={state.query}
                      onChange={(e) =>
                        setState((prev) => ({ ...prev, query: e.target.value }))
                      }
                      placeholder='Search category name or slug'
                      className='h-11 rounded-2xl pl-10'
                    />
                  </div>

                  <Button
                    type='button'
                    variant='outline'
                    className='h-11 gap-2 rounded-2xl'
                    onClick={() =>
                      setState((prev) => ({
                        ...prev,
                        showInactive: !prev.showInactive
                      }))
                    }
                  >
                    <Filter className='h-4 w-4' />
                    {state.showInactive ? 'Hide inactive' : 'Show inactive'}
                  </Button>
                </div>

                <div className='rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400'>
                  Tip: parent categories stay at level 1, child categories at
                  level 2, and sub-child categories at level 3.
                </div>

                <div className='space-y-3'>
                  {rootTree.length === 0 ? (
                    <div className='rounded-[24px] border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-950/60'>
                      <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200'>
                        <Search className='h-6 w-6' />
                      </div>
                      <div className='mt-4 text-lg font-semibold text-slate-950 dark:text-white'>
                        No categories found
                      </div>
                      <p className='mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400'>
                        Try a different search term or show inactive categories.
                      </p>
                    </div>
                  ) : (
                    rootTree.map((node) => (
                      <CategoryTreeNode
                        key={node.id}
                        node={node}
                        level={1}
                        expanded={state.expanded}
                        selectedId={state.selectedId}
                        onToggle={(id) =>
                          setState((prev) => ({
                            ...prev,
                            expanded: {
                              ...prev.expanded,
                              [id]: !prev.expanded[id]
                            }
                          }))
                        }
                        onSelect={(id) =>
                          setState((prev) => ({ ...prev, selectedId: id }))
                        }
                      />
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <div className='space-y-6'>
              <Card className='rounded-[28px] border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950/60'>
                <CardHeader className='pb-4'>
                  <CardTitle className='text-xl'>Selected category</CardTitle>
                  <CardDescription>
                    Quick view of the current node.
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {selected ? (
                    <>
                      <div className='rounded-[24px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50'>
                        <div className='flex flex-wrap items-center gap-2'>
                          <span className='inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-200 dark:ring-indigo-900/40'>
                            {selected.name}
                          </span>
                          <LevelBadge level={selected.level} />
                          <StatePill active={selected.isActive}>
                            {selected.isActive ? 'Active' : 'Inactive'}
                          </StatePill>
                        </div>
                        <div className='mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400'>
                          <div className='flex items-center gap-2'>
                            <TreePine className='h-4 w-4 text-emerald-500' />
                            <span>
                              Slug:{' '}
                              <span className='font-medium text-slate-900 dark:text-white'>
                                {selected.slug}
                              </span>
                            </span>
                          </div>
                          <div className='mt-2 flex items-center gap-2'>
                            <FolderTree className='h-4 w-4 text-indigo-500' />
                            <span>
                              Parent:{' '}
                              <span className='font-medium text-slate-900 dark:text-white'>
                                {selected.parentId ?? 'Root'}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className='grid gap-3 sm:grid-cols-2'>
                        <MetricCard
                          label='Products'
                          value={String(selectedMetric?.products ?? 0)}
                          sub='Linked items'
                        />
                        <MetricCard
                          label='Demand'
                          value={`${selectedMetric?.demand ?? 0}%`}
                          sub='Estimated market demand'
                        />
                        <MetricCard
                          label='Competition'
                          value={`${selectedMetric?.competition ?? 0}%`}
                          sub='Market pressure'
                        />
                        <MetricCard
                          label='Growth'
                          value={`${selectedMetric?.growth ?? 0}%`}
                          sub='Recent trend'
                        />
                      </div>

                      <div className='rounded-[24px] border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/60'>
                        <div className='flex items-center gap-2 text-sm font-semibold text-slate-950 dark:text-white'>
                          <Layers3 className='h-4 w-4 text-indigo-500' />
                          Category path
                        </div>
                        <div className='mt-3 flex flex-wrap gap-2'>
                          {selectedPath.map((node, idx) => (
                            <React.Fragment key={node.id}>
                              <span className='inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700'>
                                {node.name}
                              </span>
                              {idx < selectedPath.length - 1 ? (
                                <span className='self-center text-slate-400'>
                                  /
                                </span>
                              ) : null}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>

                      <div className='rounded-[24px] border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/60'>
                        <div className='flex items-center gap-2 text-sm font-semibold text-slate-950 dark:text-white'>
                          <Sparkles className='h-4 w-4 text-amber-500' />
                          Child categories
                        </div>
                        <div className='mt-3 space-y-2'>
                          {selected.children.length > 0 ? (
                            selected.children.map((child) => (
                              <div
                                key={child.id}
                                className='flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900/50'
                              >
                                <div className='min-w-0'>
                                  <div className='truncate text-sm font-medium text-slate-950 dark:text-white'>
                                    {child.name}
                                  </div>
                                  <div className='text-xs text-slate-500 dark:text-slate-400'>
                                    /{child.slug}
                                  </div>
                                </div>
                                <div className='flex items-center gap-2'>
                                  <LevelBadge level={child.level} />
                                  <StatePill active={child.isActive}>
                                    {child.isActive ? 'On' : 'Off'}
                                  </StatePill>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className='rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400'>
                              No child category available.
                            </div>
                          )}
                        </div>
                      </div>

                      <div className='flex gap-2'>
                        <Button
                          asChild
                          className='flex-1 gap-2 rounded-2xl bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200'
                        >
                          <Link
                            href={`/dashboard/product/category/${selected.slug ?? selected.id}`}
                          >
                            <SquarePen className='h-4 w-4' />
                            Open details
                          </Link>
                        </Button>
                      </div>
                    </>
                  ) : null}
                </CardContent>
              </Card>

              <Card className='rounded-[28px] border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950/60'>
                <CardHeader className='pb-4'>
                  <CardTitle className='text-xl'>Structure summary</CardTitle>
                  <CardDescription>
                    Useful for product and category planning.
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-3 text-sm text-slate-600 dark:text-slate-400'>
                  <div className='flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/50'>
                    <span>Root categories</span>
                    <span className='font-semibold text-slate-950 dark:text-white'>
                      {stats.roots}
                    </span>
                  </div>
                  <div className='flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/50'>
                    <span>Total nodes shown</span>
                    <span className='font-semibold text-slate-950 dark:text-white'>
                      {visibleCount}
                    </span>
                  </div>
                  <div className='flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/50'>
                    <span>Inactive categories</span>
                    <span className='font-semibold text-slate-950 dark:text-white'>
                      {stats.total - stats.active}
                    </span>
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
