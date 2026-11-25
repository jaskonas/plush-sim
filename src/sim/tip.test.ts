import { findTip } from './tip';
import { launch } from './market';
import { safetyCheck } from './safety';
import { DEFAULT_DESIGN, type Design } from './design';
import { TRENDS } from './catalog/trends';
import { ANIMAL_IDS, AUDIENCE_IDS, COLOUR_IDS, FABRIC_IDS, SIZE_IDS, STYLE_IDS } from './catalog/ids';

const t = TRENDS[0];

/** 30 deliberately different designs, all launchable. */
const designs: Design[] = Array.from({ length: 40 }, (_, i) => ({
  ...DEFAULT_DESIGN,
  animal: ANIMAL_IDS[i % ANIMAL_IDS.length],
  style: STYLE_IDS[i % STYLE_IDS.length],
  fabric: FABRIC_IDS[i % FABRIC_IDS.length],
  colour: COLOUR_IDS[(i * 3) % COLOUR_IDS.length],
  size: SIZE_IDS[i % SIZE_IDS.length],
  audience: AUDIENCE_IDS[i % AUDIENCE_IDS.length],
  price: 6 + ((i * 7) % 33),
}))
  .filter((d) => safetyCheck(d).ok)
  .slice(0, 30);

it('has 30 test designs', () => expect(designs).toHaveLength(30));

it.each(designs.map((d, i) => [i, d] as const))('design %i: tip keeps the toy what it is', (_i, d) => {
  const tip = findTip(d, t);
  expect(tip.change ?? {}).not.toHaveProperty('animal');
  expect(tip.change ?? {}).not.toHaveProperty('style');
  expect(tip.change ?? {}).not.toHaveProperty('audience');
});

it.each(designs.map((d, i) => [i, d] as const))('design %i: following the tip stays safe, keeps stars, and helps', (_i, d) => {
  const tip = findTip(d, t);
  if (!tip.change) return;
  const after = { ...d, ...tip.change };
  expect(safetyCheck(after).ok).toBe(true);
  const before = launch(d, t);
  const next = launch(after, t);
  expect(next.stars).toBeGreaterThanOrEqual(before.stars);
  if (tip.kind === 'profit') expect(next.profit).toBeGreaterThan(before.profit);
  if (tip.kind === 'popularity') {
    expect(next.profit).toBeGreaterThanOrEqual(before.profit);
    expect(next.stars > before.stars || next.units > before.units).toBe(true);
  }
});

it('tips are not all about price, and not all "raise the price"', () => {
  const tips = designs.map((d) => ({ d, tip: findTip(d, t) }));
  const priceTips = tips.filter(({ tip }) => tip.change && 'price' in tip.change);
  expect(priceTips.length).toBeLessThan(tips.length);
  const raises = priceTips.filter(({ d, tip }) => tip.change!.price! > d.price);
  expect(raises.length).toBeLessThan(tips.length);
  expect(tips.some(({ tip }) => tip.change && !('price' in tip.change))).toBe(true);
});

it('a profit tip names what to swap', () => {
  const tip = findTip({ ...DEFAULT_DESIGN, fabric: 'fauxFur', price: 14 }, t);
  expect(tip.kind).toBe('profit');
  expect(tip.text).toMatch(/instead of/);
});

it('a price tip is phrased as selling for a new price', () => {
  const tip = findTip({ ...DEFAULT_DESIGN, price: 5 }, t);
  expect(tip.change).toHaveProperty('price');
  expect(tip.text).toMatch(/^Selling for \$\d+ instead of \$5/);
});
