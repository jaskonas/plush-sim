import { ACCESSORIES, COLOURS, EYES, FABRICS, SIZES, STUFFINGS } from './catalog/materials';
import { GROUPS } from './catalog/groups';
import { PRICE_MAX, PRICE_MIN } from './catalog/coefficients';
import { launch, type LaunchReport } from './market';
import { safetyCheck } from './safety';
import { formatMoney } from './format';
import type { Design, Trend } from './design';

export interface Tip {
  kind: 'profit' | 'popularity' | 'praise';
  text: string;
  change?: Partial<Design>;
}

/** The parts a tip may suggest swapping. Animal, style and audience are never suggested: they change what the toy is. */
const SWAPPABLE = {
  fabric: FABRICS,
  stuffing: STUFFINGS,
  eyes: EYES,
  size: SIZES,
  colour: COLOURS,
  accessory: ACCESSORIES,
} as const;
type SwapKey = keyof typeof SWAPPABLE;

const PRICE_STEPS = [-5, -2, -1, 1, 2, 5];

/** Every single change a tip could suggest (one part swapped, or the price nudged). */
export function tipCandidates(d: Design): Partial<Design>[] {
  const out: Partial<Design>[] = [];
  for (const key of Object.keys(SWAPPABLE) as SwapKey[]) {
    for (const id of Object.keys(SWAPPABLE[key])) {
      if (id !== d[key]) out.push({ [key]: id } as Partial<Design>);
    }
  }
  for (const step of PRICE_STEPS) {
    const price = d.price + step;
    if (price >= PRICE_MIN && price <= PRICE_MAX) out.push({ price });
  }
  return out;
}

function describe(d: Design, change: Partial<Design>): string {
  if (change.price !== undefined) return `Selling for $${change.price} instead of $${d.price}`;
  const key = Object.keys(change)[0] as SwapKey;
  const table = SWAPPABLE[key] as Record<string, { label: string }>;
  return `${table[change[key] as string].label} instead of ${table[d[key] as string].label}`;
}

export function findTip(d: Design, t: Trend): Tip {
  const now = launch(d, t);
  const options: Array<{ change: Partial<Design>; r: LaunchReport }> = [];
  for (const change of tipCandidates(d)) {
    const next = { ...d, ...change };
    if (!safetyCheck(next).ok) continue;
    const r = launch(next, t);
    if (r.stars < now.stars) continue;
    options.push({ change, r });
  }

  const byProfit = options.filter((o) => o.r.profit > now.profit).sort((a, b) => b.r.profit - a.r.profit);
  if (byProfit.length > 0) {
    const best = byProfit[0];
    return { kind: 'profit', change: best.change, text: `${describe(d, best.change)} would add ${formatMoney(best.r.profit - now.profit)} profit` };
  }

  const byFans = options
    .filter((o) => o.r.profit >= now.profit && (o.r.stars > now.stars || o.r.units > now.units))
    .sort((a, b) => b.r.stars - a.r.stars || b.r.units - a.r.units);
  if (byFans.length > 0) {
    const best = byFans[0];
    return { kind: 'popularity', change: best.change, text: `${describe(d, best.change)} would win more fans` };
  }

  const fave = [...now.groups].sort((a, b) => b.units - a.units)[0];
  return { kind: 'praise', text: `${GROUPS[fave.group].label} loved it — nice work!` };
}
