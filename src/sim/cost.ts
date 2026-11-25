import { ANIMALS } from './catalog/animals';
import { STYLES } from './catalog/styles';
import { ACCESSORIES, EYES, FABRICS, SIZES, STUFFINGS } from './catalog/materials';
import {
  FACTORY_RATE_PER_MIN, MINUTES_PER_PIECE, SHOP_SHARE, STUFFING_GRAMS_AT_35, TAG_COST, WASTE,
} from './catalog/coefficients';
import type { Design } from './design';

/** Dollars per toy, rounded to cents. */
export interface CostBreakdown {
  fabric: number;
  stuffing: number;
  eyes: number;
  accessory: number;
  sewing: number;
  tag: number;
  total: number;
}

const cents = (n: number) => Math.round(n * 100) / 100;

/** Number of pattern pieces once the style is applied. */
export function patternPieces(d: Pick<Design, 'animal' | 'style'>): number {
  return Math.round(ANIMALS[d.animal].basePieces * STYLES[d.style].pieceFactor);
}

export function costToMake(d: Design): CostBreakdown {
  const scale = SIZES[d.size].cm / 35;
  const fabric = cents(ANIMALS[d.animal].surface * scale ** 2 * WASTE * FABRICS[d.fabric].costPerM2);
  const stuffing = cents(STUFFING_GRAMS_AT_35 * scale ** 3 * STUFFINGS[d.stuffing].costPerGram);
  const eyes = EYES[d.eyes].cost;
  const accessory = ACCESSORIES[d.accessory].cost;
  const sewing = cents(patternPieces(d) * MINUTES_PER_PIECE * FACTORY_RATE_PER_MIN);
  const tag = TAG_COST;
  return { fabric, stuffing, eyes, accessory, sewing, tag, total: cents(fabric + stuffing + eyes + accessory + sewing + tag) };
}

/** What the toy maker gets per toy after the shop takes its half. */
export function yourShare(d: Design): number {
  return cents(d.price * SHOP_SHARE);
}

export function profitPerToy(d: Design): number {
  return cents(yourShare(d) - costToMake(d).total);
}
