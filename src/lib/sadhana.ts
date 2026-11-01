// Hanuman 40-din saadhana ke plans — old app (src/lib/sadhanas.ts, 'hanuman-40') jaise hi.
// Dono sites ek hi database share karti hain, isliye plan ids / prices / rules wahan se
// match rehne chahiye. Price badalna ho to dono jagah badlo.

export const PRODUCT = 'hanuman-40';
export const PRODUCT_NAME = 'हनुमान स्तुति साधना';

export type PlanId = 'trial' | 'full' | 'yearly' | 'lifetime';

export interface Plan {
  id: PlanId;
  label: string;
  tagline: string;
  pricePaise: number;
  // Strike-through "asli keemat" shown next to the price, if any.
  mrpRupees?: number;
  // Days after purchase until access lapses. null = never expires.
  durationDays: number | null;
}

export const PLANS: Record<PlanId, Plan> = {
  // Retired — kept so existing trial users still rank correctly.
  trial: { id: 'trial', label: '3-दिन ट्रायल', tagline: 'पहले 3 दिन आज़माएं', pricePaise: 1100, durationDays: null },
  full: { id: 'full', label: '40-दिन साधना', tagline: 'पूरी 40 दिन की साधना, एक बार', pricePaise: 19900, durationDays: null },
  yearly: { id: 'yearly', label: '1 साल एक्सेस', tagline: '1 साल तक पूरी साधना का उपयोग करें', pricePaise: 34900, durationDays: 365 },
  lifetime: { id: 'lifetime', label: 'Lifetime', tagline: 'जीवनभर पहुंच + जितनी बार चाहें दोहराएं', pricePaise: 49900, durationDays: null },
};

// Purchasable plans, lowest to highest rank.
export const PLAN_ORDER: PlanId[] = ['full', 'yearly', 'lifetime'];
export const DEFAULT_PLAN: PlanId = 'yearly';

export interface Subscription {
  plan: PlanId;
  expires_at: string | null;
}

export function isValidPlan(id: unknown): id is PlanId {
  return typeof id === 'string' && Object.prototype.hasOwnProperty.call(PLANS, id);
}

export function planRank(id: PlanId | null | undefined): number {
  return id ? PLAN_ORDER.indexOf(id) : -1;
}

export function isPlanExpired(expiresAt: string | Date | null | undefined): boolean {
  return !!expiresAt && new Date(expiresAt).getTime() < Date.now();
}

// Higher-ranked plans are upgrades; the same plan is a renewal only once expired.
// 'full' → 'yearly' is blocked: full never expires, so it would trade permanent access for 365 days.
export function canPurchase(target: PlanId, sub: Subscription | null): boolean {
  if (!PLAN_ORDER.includes(target)) return false;
  if (sub?.plan === 'full' && target === 'yearly') return false;
  return planRank(target) > planRank(sub?.plan) || (target === sub?.plan && isPlanExpired(sub.expires_at));
}

// Upgrade credit (the current plan's price) only applies while the current plan is still active.
export function purchasePricePaise(target: PlanId, sub: Subscription | null): number {
  const price = PLANS[target].pricePaise;
  if (!sub || isPlanExpired(sub.expires_at)) return price;
  return price - (PLANS[sub.plan]?.pricePaise ?? 0);
}

// `CASE column WHEN 'id' THEN rank ... END` — retired plans map to -1 instead of SQL NULL.
export function planRankSqlCase(column: string): string {
  const whens = (Object.keys(PLANS) as PlanId[]).map((id) => `WHEN '${id}' THEN ${planRank(id)}`).join(' ');
  return `(CASE ${column} ${whens} ELSE -1 END)`;
}
