export type Lifecycle =
  | 'trendy'
  | 'evergreen'
  | 'seasonal'
  | 'fade'
  | 'winning';

export type SortBy = 'relevance' | 'demand' | 'rating';

export type Product = {
  id: number;
  name: string;
  category: string;
  price?: number;
  rating?: number;
  reviews?: number;
  demand: number;
  competition: number;
  score: number;
  quality: number;
  lifecycle?: Lifecycle;
  color?: string;
  imageUrl?: string | null;
};
