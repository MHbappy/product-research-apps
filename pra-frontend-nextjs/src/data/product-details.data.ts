import type {
  Product,
  SentimentTrendPoint,
  StarDistributionPoint,
  StabilityDiagnosticPoint
} from '@/types/product-details.types';

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Self Watering Flowerpot Self-Absorbent Automatic Water-Absorbing Basin Green Plant Pot',
    category: 'Home',
    price: 49.99,
    rating: 4.6,
    reviews: 124000,
    demand: 5400,
    competition: 12,
    score: 86,
    quality: 88,
    lifecycle: 'evergreen',
    color: '#8b5cf6'
  },
  {
    id: 2,
    name: 'EcoBottle — Reusable Thermal Bottle, 750ml',
    category: 'Outdoors',
    price: 19.9,
    rating: 4.4,
    reviews: 89,
    demand: 4200,
    competition: 6,
    score: 78,
    quality: 74,
    lifecycle: 'trendy',
    color: '#06b6d4'
  },
  {
    id: 3,
    name: 'SmartLamp Pro (Touch + App Control)',
    category: 'Electronics',
    price: 79,
    rating: 4.8,
    reviews: 230,
    demand: 7800,
    competition: 28,
    score: 92,
    quality: 91,
    lifecycle: 'winning',
    color: '#f59e0b'
  },
  {
    id: 4,
    name: 'KitchenPro Pan — Non-stick Series (28cm)',
    category: 'Kitchen',
    price: 34.5,
    rating: 4.3,
    reviews: 76,
    demand: 3000,
    competition: 18,
    score: 70,
    quality: 68,
    lifecycle: 'seasonal',
    color: '#10b981'
  },
  {
    id: 5,
    name: 'MiniDrone X200 — Foldable Drone with HD Camera',
    category: 'Electronics',
    price: 129.99,
    rating: 4.2,
    reviews: 310,
    demand: 9200,
    competition: 45,
    score: 66,
    quality: 62,
    lifecycle: 'fade',
    color: '#ef4444'
  },
  {
    id: 6,
    name: 'YogaMat Plus — Extra Grip, 6mm',
    category: 'Sports',
    price: 29,
    rating: 4.5,
    reviews: 101,
    demand: 2500,
    competition: 8,
    score: 74,
    quality: 79,
    lifecycle: 'evergreen',
    color: '#7c3aed'
  },
  {
    id: 7,
    name: 'PetGroom Kit — 7-in-1 Grooming Set',
    category: 'Pet',
    price: 24,
    rating: 4.1,
    reviews: 45,
    demand: 3800,
    competition: 4,
    score: 72,
    quality: 70,
    lifecycle: 'trendy',
    color: '#fb923c'
  },
  {
    id: 8,
    name: 'GardenLight Solar — Auto On/Off',
    category: 'Outdoor',
    price: 22,
    rating: 4.7,
    reviews: 94,
    demand: 4800,
    competition: 11,
    score: 81,
    quality: 85,
    lifecycle: 'winning',
    color: '#06b6d4'
  },
  {
    id: 9,
    name: 'PhoneGrip — 360 Rotating Stand',
    category: 'Accessories',
    price: 9.99,
    rating: 3.9,
    reviews: 18,
    demand: 1500,
    competition: 30,
    score: 60,
    quality: 58,
    lifecycle: 'fade',
    color: '#4f46e5'
  },
  {
    id: 10,
    name: 'ThermoBottle — Insulated Flask 500ml',
    category: 'Outdoors',
    price: 39,
    rating: 4.6,
    reviews: 210,
    demand: 6600,
    competition: 9,
    score: 88,
    quality: 90,
    lifecycle: 'evergreen',
    color: '#10b981'
  },
  {
    id: 11,
    name: 'BabyToys X — Soft Learning Toys',
    category: 'Toys',
    price: 15.5,
    rating: 4.0,
    reviews: 54,
    demand: 5200,
    competition: 20,
    score: 73,
    quality: 72,
    lifecycle: 'seasonal',
    color: '#f59e0b'
  },
  {
    id: 12,
    name: 'OutdoorTarp — Heavy Duty 3x4m',
    category: 'Outdoor',
    price: 18,
    rating: 4.2,
    reviews: 33,
    demand: 2100,
    competition: 3,
    score: 68,
    quality: 66,
    lifecycle: 'trendy',
    color: '#7c3aed'
  }
];

export const SENTIMENT_TREND: SentimentTrendPoint[] = [
  { month: '2025-01', positive: 42, neutral: 18, negative: 10 },
  { month: '2025-02', positive: 48, neutral: 16, negative: 12 },
  { month: '2025-03', positive: 55, neutral: 14, negative: 9 },
  { month: '2025-04', positive: 50, neutral: 17, negative: 11 },
  { month: '2025-05', positive: 61, neutral: 15, negative: 8 },
  { month: '2025-06', positive: 58, neutral: 19, negative: 13 },
  { month: '2025-07', positive: 67, neutral: 12, negative: 7 },
  { month: '2025-08', positive: 63, neutral: 14, negative: 9 },
  { month: '2025-09', positive: 70, neutral: 13, negative: 6 },
  { month: '2025-10', positive: 74, neutral: 11, negative: 5 },
  { month: '2025-11', positive: 69, neutral: 15, negative: 8 },
  { month: '2025-12', positive: 77, neutral: 10, negative: 6 }
];

export const STAR_DISTRIBUTION: StarDistributionPoint[] = [
  { star: '5★', count: 128 },
  { star: '4★', count: 54 },
  { star: '3★', count: 26 },
  { star: '2★', count: 14 },
  { star: '1★', count: 8 }
];

export const STABILITY_DIAGNOSTIC: StabilityDiagnosticPoint[] = [
  {
    month: '2025-01',
    ewma_6m: 4.12,
    slope_12: 0.04,
    last_spike_z: 0.3,
    cv_12: 0.18
  },
  {
    month: '2025-02',
    ewma_6m: 4.14,
    slope_12: 0.05,
    last_spike_z: 0.1,
    cv_12: 0.17
  },
  {
    month: '2025-03',
    ewma_6m: 4.17,
    slope_12: 0.06,
    last_spike_z: -0.2,
    cv_12: 0.16
  },
  {
    month: '2025-04',
    ewma_6m: 4.15,
    slope_12: 0.03,
    last_spike_z: 0.4,
    cv_12: 0.19
  },
  {
    month: '2025-05',
    ewma_6m: 4.19,
    slope_12: 0.07,
    last_spike_z: 1.1,
    cv_12: 0.15
  },
  {
    month: '2025-06',
    ewma_6m: 4.21,
    slope_12: 0.08,
    last_spike_z: 0.6,
    cv_12: 0.14
  },
  {
    month: '2025-07',
    ewma_6m: 4.24,
    slope_12: 0.09,
    last_spike_z: 0.2,
    cv_12: 0.13
  },
  {
    month: '2025-08',
    ewma_6m: 4.23,
    slope_12: 0.07,
    last_spike_z: -0.1,
    cv_12: 0.14
  },
  {
    month: '2025-09',
    ewma_6m: 4.26,
    slope_12: 0.1,
    last_spike_z: 0.8,
    cv_12: 0.12
  },
  {
    month: '2025-10',
    ewma_6m: 4.28,
    slope_12: 0.11,
    last_spike_z: 1.4,
    cv_12: 0.11
  },
  {
    month: '2025-11',
    ewma_6m: 4.27,
    slope_12: 0.1,
    last_spike_z: 0.5,
    cv_12: 0.12
  },
  {
    month: '2025-12',
    ewma_6m: 4.31,
    slope_12: 0.12,
    last_spike_z: 0.9,
    cv_12: 0.1
  }
];

export function fmtMonth(month: string) {
  const [year, mm] = month.split('-');
  const date = new Date(Number(year), Number(mm) - 1, 1);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric'
  }).format(date);
}

export function fmtNumber(v: number) {
  return v >= 1000
    ? `${(v / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}k`
    : `${v}`;
}

export function fmtCompact(v: number, digits = 2) {
  return Number(v).toFixed(digits);
}
