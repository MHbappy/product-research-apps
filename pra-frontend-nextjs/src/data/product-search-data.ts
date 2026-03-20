export type ProductType =
  | 'TRENDY'
  | 'EVERGREEN'
  | 'SEASONAL'
  | 'WINNING'
  | 'FADE'
  | 'DYING';
export type Sentiment = 'positive' | 'neutral' | 'negative';

export type Product = {
  id: number;
  title: string;
  category: string;
  type: ProductType;
  sentiment: Sentiment;
  price: number;
  rating: number;
  reviews: number;
  score: number;
  visualTags: string[];
  color: string;
};

export type Filters = {
  text: string;
  categories: string[];
  types: ProductType[];
  sentiments: Sentiment[];
  minPrice: string;
  maxPrice: string;
  minRating: number;
  imageFile: File | null;
  imagePreview: string | null;
};

export const PRODUCTS: Product[] = [
  {
    id: 1,
    title:
      'Self Watering Flowerpot Self-Absorbent Automatic Water-Absorbing Basin Green Plant Pot',
    category: 'Home',
    type: 'EVERGREEN',
    sentiment: 'positive',
    price: 49.99,
    rating: 4.6,
    reviews: 124000,
    score: 86,
    visualTags: ['plant', 'pot', 'home', 'garden', 'green'],
    color: '#8b5cf6'
  },
  {
    id: 2,
    title: 'EcoBottle — Reusable Thermal Bottle, 750ml',
    category: 'Outdoors',
    type: 'TRENDY',
    sentiment: 'positive',
    price: 19.9,
    rating: 4.4,
    reviews: 89,
    score: 78,
    visualTags: ['bottle', 'travel', 'drink', 'metal'],
    color: '#06b6d4'
  },
  {
    id: 3,
    title: 'SmartLamp Pro (Touch + App Control)',
    category: 'Electronics',
    type: 'WINNING',
    sentiment: 'positive',
    price: 79,
    rating: 4.8,
    reviews: 230,
    score: 92,
    visualTags: ['lamp', 'desk', 'light', 'smart'],
    color: '#f59e0b'
  },
  {
    id: 4,
    title: 'KitchenPro Pan — Non-stick Series (28cm)',
    category: 'Kitchen',
    type: 'SEASONAL',
    sentiment: 'neutral',
    price: 34.5,
    rating: 4.3,
    reviews: 76,
    score: 70,
    visualTags: ['pan', 'cookware', 'kitchen', 'non-stick'],
    color: '#10b981'
  },
  {
    id: 5,
    title: 'MiniDrone X200 — Foldable Drone with HD Camera',
    category: 'Electronics',
    type: 'FADE',
    sentiment: 'neutral',
    price: 129.99,
    rating: 4.2,
    reviews: 310,
    score: 66,
    visualTags: ['drone', 'camera', 'tech', 'foldable'],
    color: '#ef4444'
  },
  {
    id: 6,
    title: 'YogaMat Plus — Extra Grip, 6mm',
    category: 'Sports',
    type: 'EVERGREEN',
    sentiment: 'positive',
    price: 29,
    rating: 4.5,
    reviews: 101,
    score: 74,
    visualTags: ['mat', 'fitness', 'yoga', 'sports'],
    color: '#7c3aed'
  },
  {
    id: 7,
    title: 'PetGroom Kit — 7-in-1 Grooming Set',
    category: 'Pet',
    type: 'TRENDY',
    sentiment: 'positive',
    price: 24,
    rating: 4.1,
    reviews: 45,
    score: 72,
    visualTags: ['pet', 'grooming', 'animal', 'kit'],
    color: '#fb923c'
  },
  {
    id: 8,
    title: 'GardenLight Solar — Auto On/Off',
    category: 'Outdoor',
    type: 'WINNING',
    sentiment: 'positive',
    price: 22,
    rating: 4.7,
    reviews: 94,
    score: 81,
    visualTags: ['solar', 'light', 'garden', 'outdoor'],
    color: '#06b6d4'
  },
  {
    id: 9,
    title: 'PhoneGrip — 360 Rotating Stand',
    category: 'Accessories',
    type: 'DYING',
    sentiment: 'negative',
    price: 9.99,
    rating: 3.9,
    reviews: 18,
    score: 60,
    visualTags: ['phone', 'stand', 'accessory', 'grip'],
    color: '#4f46e5'
  },
  {
    id: 10,
    title: 'ThermoBottle — Insulated Flask 500ml',
    category: 'Outdoors',
    type: 'EVERGREEN',
    sentiment: 'positive',
    price: 39,
    rating: 4.6,
    reviews: 210,
    score: 88,
    visualTags: ['bottle', 'flask', 'travel', 'drink'],
    color: '#10b981'
  },
  {
    id: 11,
    title: 'BabyToys X — Soft Learning Toys',
    category: 'Toys',
    type: 'SEASONAL',
    sentiment: 'neutral',
    price: 15.5,
    rating: 4.0,
    reviews: 54,
    score: 73,
    visualTags: ['toy', 'baby', 'soft', 'learning'],
    color: '#f59e0b'
  },
  {
    id: 12,
    title: 'OutdoorTarp — Heavy Duty 3x4m',
    category: 'Outdoor',
    type: 'TRENDY',
    sentiment: 'neutral',
    price: 18,
    rating: 4.2,
    reviews: 33,
    score: 68,
    visualTags: ['tarp', 'camping', 'outdoor', 'cover'],
    color: '#7c3aed'
  },
  {
    id: 13,
    title: 'DeskShelf Mini — Adjustable Monitor Stand',
    category: 'Office',
    type: 'WINNING',
    sentiment: 'positive',
    price: 44,
    rating: 4.7,
    reviews: 182,
    score: 90,
    visualTags: ['desk', 'monitor', 'stand', 'office'],
    color: '#0ea5e9'
  },
  {
    id: 14,
    title: 'CordWrap Pro — Cable Organizer Set',
    category: 'Accessories',
    type: 'EVERGREEN',
    sentiment: 'positive',
    price: 12,
    rating: 4.5,
    reviews: 64,
    score: 76,
    visualTags: ['cable', 'organizer', 'desk', 'accessory'],
    color: '#14b8a6'
  },
  {
    id: 15,
    title: 'AromaDiffuser 300 — Mist + Light',
    category: 'Home',
    type: 'TRENDY',
    sentiment: 'positive',
    price: 31,
    rating: 4.4,
    reviews: 96,
    score: 82,
    visualTags: ['diffuser', 'home', 'mist', 'light'],
    color: '#a855f7'
  },
  {
    id: 16,
    title: 'WinterCap Thermal Gloves',
    category: 'Fashion',
    type: 'SEASONAL',
    sentiment: 'neutral',
    price: 17.5,
    rating: 4.1,
    reviews: 28,
    score: 69,
    visualTags: ['gloves', 'winter', 'fashion', 'warm'],
    color: '#f97316'
  },
  {
    id: 17,
    title: 'OldSchool Mouse Pad Deluxe',
    category: 'Office',
    type: 'FADE',
    sentiment: 'negative',
    price: 8,
    rating: 3.8,
    reviews: 12,
    score: 55,
    visualTags: ['mousepad', 'office', 'desktop', 'old'],
    color: '#64748b'
  },
  {
    id: 18,
    title: 'FreshServe Glass Container Set',
    category: 'Kitchen',
    type: 'WINNING',
    sentiment: 'positive',
    price: 27,
    rating: 4.7,
    reviews: 134,
    score: 87,
    visualTags: ['glass', 'container', 'kitchen', 'storage'],
    color: '#22c55e'
  },
  {
    id: 19,
    title: 'QuietBuds Basic Wireless Earbuds',
    category: 'Electronics',
    type: 'FADE',
    sentiment: 'negative',
    price: 22,
    rating: 3.7,
    reviews: 19,
    score: 58,
    visualTags: ['earbuds', 'audio', 'wireless', 'tech'],
    color: '#ef4444'
  },
  {
    id: 20,
    title: 'ComfyChair Cushion Memory Foam',
    category: 'Home',
    type: 'EVERGREEN',
    sentiment: 'positive',
    price: 41,
    rating: 4.6,
    reviews: 88,
    score: 84,
    visualTags: ['chair', 'cushion', 'home', 'comfort'],
    color: '#0f766e'
  },
  {
    id: 21,
    title: 'GardenSpray Nozzle — 8 Pattern',
    category: 'Outdoor',
    type: 'WINNING',
    sentiment: 'positive',
    price: 14,
    rating: 4.8,
    reviews: 211,
    score: 91,
    visualTags: ['garden', 'spray', 'water', 'outdoor'],
    color: '#16a34a'
  },
  {
    id: 22,
    title: 'StorageBox Foldable Fabric Bin',
    category: 'Home',
    type: 'SEASONAL',
    sentiment: 'neutral',
    price: 16,
    rating: 4.2,
    reviews: 39,
    score: 71,
    visualTags: ['box', 'storage', 'home', 'fabric'],
    color: '#c084fc'
  },
  {
    id: 23,
    title: 'RustyTool Multi-Purpose Wrench Set',
    category: 'Tools',
    type: 'DYING',
    sentiment: 'negative',
    price: 25,
    rating: 3.6,
    reviews: 9,
    score: 49,
    visualTags: ['tool', 'wrench', 'metal', 'repair'],
    color: '#94a3b8'
  },
  {
    id: 24,
    title: 'MellowLight Bedroom Night Lamp',
    category: 'Home',
    type: 'WINNING',
    sentiment: 'positive',
    price: 28,
    rating: 4.7,
    reviews: 173,
    score: 89,
    visualTags: ['lamp', 'bedroom', 'light', 'home'],
    color: '#6366f1'
  }
];

export const CATEGORY_OPTIONS = Array.from(
  new Set(PRODUCTS.map((p) => p.category))
).sort();
export const TYPE_OPTIONS: ProductType[] = [
  'TRENDY',
  'EVERGREEN',
  'SEASONAL',
  'WINNING',
  'FADE',
  'DYING'
];
export const SENTIMENT_OPTIONS: Sentiment[] = [
  'positive',
  'neutral',
  'negative'
];

export const INITIAL_FILTERS: Filters = {
  text: '',
  categories: [],
  types: [],
  sentiments: [],
  minPrice: '',
  maxPrice: '',
  minRating: 0,
  imageFile: null,
  imagePreview: null
};

export function toTitle(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function fmtPrice(value: number) {
  return `$${value.toFixed(2)}`;
}

export function fmtNumber(v: number) {
  return v >= 1000
    ? `${(v / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}k`
    : `${v}`;
}

export function matchImageKeywords(file: File) {
  const name = file.name.toLowerCase().replace(/\.[^.]+$/, '');
  return name
    .split(/[^a-z0-9]+/)
    .map((w) => w.trim())
    .filter(Boolean);
}

export function filterProducts(products: Product[], filters: Filters) {
  const minPrice = filters.minPrice === '' ? null : Number(filters.minPrice);
  const maxPrice = filters.maxPrice === '' ? null : Number(filters.maxPrice);

  if (filters.imageFile) {
    const keywords = matchImageKeywords(filters.imageFile);

    const scored = products
      .map((product) => {
        const haystack = [
          product.title.toLowerCase(),
          product.category.toLowerCase(),
          product.type.toLowerCase(),
          ...product.visualTags.map((t) => t.toLowerCase())
        ].join(' ');

        let score = 0;
        for (const keyword of keywords) {
          if (!keyword) continue;
          if (haystack.includes(keyword)) score += 3;
          for (const tag of product.visualTags) {
            if (
              tag.toLowerCase().includes(keyword) ||
              keyword.includes(tag.toLowerCase())
            ) {
              score += 2;
            }
          }
        }

        if (score === 0) score = product.score / 20;
        return { product, score };
      })
      .sort((a, b) => b.score - a.score);

    return scored.map((item) => item.product);
  }

  return products.filter((product) => {
    if (filters.text) {
      const q = filters.text.toLowerCase().trim();
      const haystack = [
        product.title,
        product.category,
        product.type,
        ...product.visualTags
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(product.category)
    )
      return false;
    if (filters.types.length > 0 && !filters.types.includes(product.type))
      return false;
    if (
      filters.sentiments.length > 0 &&
      !filters.sentiments.includes(product.sentiment)
    )
      return false;

    if (
      minPrice !== null &&
      !Number.isNaN(minPrice) &&
      product.price < minPrice
    )
      return false;
    if (
      maxPrice !== null &&
      !Number.isNaN(maxPrice) &&
      product.price > maxPrice
    )
      return false;
    if (product.rating < filters.minRating) return false;

    return true;
  });
}
