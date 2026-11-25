// Guards the spec's anti-goal: no dominant strategy. Cheap tricks must lose to good
// design, and every audience must be able to produce a winning toy.
import { bestDesign } from './search';
import { launch } from './market';
import { DEFAULT_DESIGN, type Design } from './design';
import { TRENDS } from './catalog/trends';
import { AUDIENCE_IDS } from './catalog/ids';

/** Cheapest parts that still pass the safety lab for kids. */
const cheapest: Design = {
  ...DEFAULT_DESIGN,
  animal: 'penguin',
  style: 'round',
  fabric: 'felt',
  stuffing: 'fiberfill',
  eyes: 'safety',
  size: 'small',
  accessory: 'none',
  audience: 'kids',
};

describe.each(TRENDS.map((t) => [`${t.colour} ${t.style} ${t.animal}`, t] as const))('trend: %s', (_name, t) => {
  const overall = launch(bestDesign(t), t);
  const perAudience = Object.fromEntries(AUDIENCE_IDS.map((a) => [a, launch(bestDesign(t, { audience: a }), t)]));

  it('cheapest parts at $40 earn well under the best design', () => {
    expect(launch({ ...cheapest, price: 40 }, t).profit).toBeLessThan(overall.profit * 0.6);
  });

  it('cheapest parts at $5 barely earn anything', () => {
    const p = launch({ ...cheapest, price: 5 }, t).profit;
    expect(p < 0 || p < overall.profit * 0.3).toBe(true);
  });

  it.each([...AUDIENCE_IDS])('a toy for %s can compete with the best', (a) => {
    expect(perAudience[a].profit).toBeGreaterThanOrEqual(overall.profit * 0.6);
  });

  it('kids toys win on volume, collector toys on profit per toy', () => {
    expect(perAudience.kids.units).toBeGreaterThan(perAudience.collectors.units);
    expect(perAudience.collectors.profitPerToy).toBeGreaterThan(perAudience.kids.profitPerToy);
  });

  it('the best collector toy is a premium toy: $25+ and about double the profit per toy', () => {
    expect(perAudience.collectors.price).toBeGreaterThanOrEqual(25);
    expect(perAudience.collectors.profitPerToy).toBeGreaterThanOrEqual(perAudience.kids.profitPerToy * 1.8);
  });
});

const bests = TRENDS.flatMap((t) => AUDIENCE_IDS.map((audience) => ({ t, d: bestDesign(t, { audience }) })));

it('the best toys are not all the same animal or style', () => {
  expect(new Set(bests.map(({ d }) => d.animal)).size).toBeGreaterThanOrEqual(3);
  expect(new Set(bests.map(({ d }) => d.style)).size).toBeGreaterThanOrEqual(2);
});

it('the season trend matters: most best toys use the hot animal or style', () => {
  const onTrend = bests.filter(({ t, d }) => d.animal === t.animal || d.style === t.style);
  expect(onTrend.length).toBeGreaterThanOrEqual(bests.length / 2);
});

it('no one size or fabric is always best', () => {
  expect(new Set(bests.map(({ d }) => d.size)).size).toBeGreaterThanOrEqual(2);
  expect(new Set(bests.map(({ d }) => d.fabric)).size).toBeGreaterThanOrEqual(2);
});
