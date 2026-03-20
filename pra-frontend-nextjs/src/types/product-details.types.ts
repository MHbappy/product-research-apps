export type Lifecycle =
  | 'trendy'
  | 'evergreen'
  | 'seasonal'
  | 'fade'
  | 'winning';
export type Tone = 'emerald' | 'indigo' | 'amber' | 'rose' | 'slate';

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

export type SentimentTrendPoint = {
  month: string;
  positive: number;
  neutral: number;
  negative: number;
};

export type StarDistributionPoint = {
  star: string;
  count: number;
};

export type StabilityDiagnosticPoint = {
  month: string;
  ewma_6m: number;
  slope_12: number;
  last_spike_z: number;
  cv_12: number;
};

export type StabilityVerdict = {
  label: string;
  tone: Tone;
  description: string;
};

export type SentimentSummary = {
  latest: SentimentTrendPoint;
  total: number;
  positiveShare: number;
  neutralShare: number;
  negativeShare: number;
};

export type StarSummary = {
  total: number;
  topShare: number;
};
