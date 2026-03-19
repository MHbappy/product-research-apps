'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Lifecycle, Product, SortBy } from '@/types/product';
import { average, getBounds } from '@/lib/product-utils';

export function useProductFilters(products: Product[], pageSize = 9) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState<SortBy>('relevance');
  const [lifecycleFilters, setLifecycleFilters] = useState<Set<Lifecycle>>(
    () => new Set()
  );
  const [page, setPage] = useState(1);

  const priceBounds = useMemo(
    () => getBounds(products.map((p) => p.price ?? 0)),
    [products]
  );
  const qualityBounds = useMemo(
    () => getBounds(products.map((p) => p.quality ?? 0)),
    [products]
  );
  const scoreBounds = useMemo(
    () => getBounds(products.map((p) => p.score ?? 0)),
    [products]
  );

  const [minPrice, setMinPrice] = useState(priceBounds.min);
  const [maxPrice, setMaxPrice] = useState(priceBounds.max);
  const [minQuality, setMinQuality] = useState(qualityBounds.min);
  const [minScore, setMinScore] = useState(scoreBounds.min);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ['All', ...Array.from(set)];
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = products.filter((p) =>
      category === 'All' ? true : p.category === category
    );

    if (q) {
      list = list.filter((p) =>
        `${p.name} ${p.category}`.toLowerCase().includes(q)
      );
    }

    if (lifecycleFilters.size > 0) {
      list = list.filter(
        (p) => p.lifecycle && lifecycleFilters.has(p.lifecycle)
      );
    }

    list = list.filter((p) => {
      const price = p.price ?? 0;
      return (
        price >= Math.min(minPrice, maxPrice) &&
        price <= Math.max(minPrice, maxPrice)
      );
    });

    list = list.filter(
      (p) => (p.quality ?? 0) >= minQuality && (p.score ?? 0) >= minScore
    );

    list = [...list];

    switch (sortBy) {
      case 'demand':
        list.sort((a, b) => b.demand - a.demand);
        break;
      case 'rating':
        list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      default:
        list.sort((a, b) => {
          const va = a.score * 0.5 + (a.demand / 1000) * 0.3 + a.quality * 0.2;
          const vb = b.score * 0.5 + (b.demand / 1000) * 0.3 + b.quality * 0.2;
          return vb - va;
        });
    }

    return list;
  }, [
    products,
    query,
    category,
    sortBy,
    lifecycleFilters,
    minPrice,
    maxPrice,
    minQuality,
    minScore
  ]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [
    query,
    category,
    sortBy,
    lifecycleFilters,
    minPrice,
    maxPrice,
    minQuality,
    minScore
  ]);

  useEffect(() => {
    setPage((p) => Math.min(p, pageCount));
  }, [pageCount]);

  const toggleLifecycle = (l: Lifecycle) => {
    setLifecycleFilters((prev) => {
      const next = new Set(prev);
      if (next.has(l)) next.delete(l);
      else next.add(l);
      return next;
    });
  };

  const clearLifecycleFilters = () => {
    setLifecycleFilters(new Set());
  };

  const clearFilters = () => {
    setQuery('');
    setCategory('All');
    setSortBy('relevance');
    setLifecycleFilters(new Set());
    setMinPrice(priceBounds.min);
    setMaxPrice(priceBounds.max);
    setMinQuality(qualityBounds.min);
    setMinScore(scoreBounds.min);
    setPage(1);
  };

  const avgRating = useMemo(
    () => average(products.map((p) => p.rating ?? 0)),
    [products]
  );

  return {
    query,
    setQuery,
    category,
    setCategory,
    sortBy,
    setSortBy,
    lifecycleFilters,
    toggleLifecycle,
    clearLifecycleFilters,
    clearFilters,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    minQuality,
    setMinQuality,
    minScore,
    setMinScore,
    categories,
    filtered,
    page,
    setPage,
    pageCount,
    pageItems,
    priceBounds,
    qualityBounds,
    scoreBounds,
    avgRating,
    totalProducts: products.length
  };
}
