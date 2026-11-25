import { ACCESSORY_IDS, ANIMAL_IDS, AUDIENCE_IDS, COLOUR_IDS, EYES_IDS, FABRIC_IDS, SIZE_IDS, STUFFING_IDS, STYLE_IDS } from './catalog/ids';
import { PRICE_MAX, PRICE_MIN } from './catalog/coefficients';
import { launch } from './market';
import { safetyCheck } from './safety';
import { DEFAULT_DESIGN, type Design, type Trend } from './design';

const PRICES = Array.from({ length: PRICE_MAX - PRICE_MIN + 1 }, (_, i) => PRICE_MIN + i);

const OPTIONS: { [K in Exclude<keyof Design, 'name'>]: readonly Design[K][] } = {
  animal: ANIMAL_IDS,
  style: STYLE_IDS,
  fabric: FABRIC_IDS,
  stuffing: STUFFING_IDS,
  eyes: EYES_IDS,
  size: SIZE_IDS,
  colour: COLOUR_IDS,
  accessory: ACCESSORY_IDS,
  audience: AUDIENCE_IDS,
  price: PRICES,
};

const profitOf = (d: Design, t: Trend) => launch(d, t).profit;

/**
 * The most profitable launchable design a careful player could find, by greedy
 * coordinate ascent from a few starting toys. `fixed` choices are never changed.
 * Used by the balance tests to check that no single trick always wins.
 */
export function bestDesign(t: Trend, fixed: Partial<Design> = {}): Design {
  // Switching aisle alone rarely pays, so greedy steps never find it: search each aisle separately.
  if (fixed.audience === undefined) {
    const each = AUDIENCE_IDS.map((audience) => bestDesign(t, { ...fixed, audience }));
    return each.reduce((a, b) => (profitOf(b, t) > profitOf(a, t) ? b : a));
  }
  const seeds: Partial<Design>[] = [
    {},
    { animal: t.animal, style: t.style, colour: t.colour },
    { fabric: 'minky', size: 'small', price: 20 },
  ];
  const keys = (Object.keys(OPTIONS) as Array<keyof typeof OPTIONS>).filter((k) => !(k in fixed));
  let best: Design | null = null;
  for (const seed of seeds) {
    let d: Design = { ...DEFAULT_DESIGN, ...seed, ...fixed };
    if (!safetyCheck(d).ok) continue;
    let current = profitOf(d, t);
    for (let pass = 0; pass < 6; pass++) {
      let improved = false;
      for (const key of keys) {
        for (const value of OPTIONS[key]) {
          const next = { ...d, [key]: value } as Design;
          if (!safetyCheck(next).ok) continue;
          const p = profitOf(next, t);
          if (p > current) {
            d = next;
            current = p;
            improved = true;
          }
        }
      }
      if (!improved) break;
    }
    if (!best || current > profitOf(best, t)) best = d;
  }
  return best ?? { ...DEFAULT_DESIGN, ...fixed };
}
