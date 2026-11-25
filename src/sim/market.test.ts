import { launch, REACH, type GroupResult, type LaunchReport } from './market';
import { profitPerToy } from './cost';
import { DEFAULT_DESIGN, type Design } from './design';
import { TRENDS } from './catalog/trends';
import type { GroupId } from './catalog/ids';
import { SETUP_COST } from './catalog/coefficients';

const t = TRENDS[0];
const d = (patch: Partial<Design> = {}): Design => ({ ...DEFAULT_DESIGN, ...patch });
const group = (r: LaunchReport, id: GroupId): GroupResult => r.groups.find((g) => g.group === id)!;

it('is deterministic', () => {
  expect(launch(d(), t)).toEqual(launch(d(), t));
});

it('reports all four shopper groups', () => {
  expect(launch(d(), t).groups.map((g) => g.group)).toEqual(['toddlerParents', 'kids', 'tweens', 'collectors']);
});

it('uses the agreed aisle reach table', () => {
  expect(REACH.babies).toEqual({ toddlerParents: 1, kids: 0.3 });
  expect(REACH.kids).toEqual({ kids: 1, tweens: 1, toddlerParents: 0.3, collectors: 0.3 });
  expect(REACH.collectors).toEqual({ collectors: 1, tweens: 1, kids: 0.3 });
});

it('toddler parents buy nothing from a toy that is not baby-safe', () => {
  expect(group(launch(d({ eyes: 'safety', audience: 'kids' }), t), 'toddlerParents').units).toBe(0);
});

it('the collectors aisle does not reach toddler parents', () => {
  const g = group(launch(d({ audience: 'collectors' }), t), 'toddlerParents');
  expect(g.face).toBe('—');
  expect(g.line).toBe('Not aimed at us');
});

it('raising the price never raises sales', () => {
  expect(launch(d({ price: 30 }), t).units).toBeLessThanOrEqual(launch(d({ price: 10 }), t).units);
});

it('stars do not depend on price', () => {
  expect(launch(d({ price: 8 }), t).stars).toBe(launch(d({ price: 38 }), t).stars);
});

it('matching the trend sells more', () => {
  const bearTrend = TRENDS.find((x) => x.animal === 'bear')!;
  expect(launch(d(), bearTrend).units).toBeGreaterThan(launch(d(), t).units);
});

it('profit is units × profit per toy minus set-up', () => {
  const r = launch(d(), t);
  expect(r.setupCost).toBe(SETUP_COST);
  expect(r.profitPerToy).toBe(profitPerToy(d()));
  expect(r.profit).toBeCloseTo(r.units * r.profitPerToy - SETUP_COST, 2);
});

it('sales are rounded to a friendly hundred', () => {
  expect(launch(d(), t).units % 100).toBe(0);
});

it('a much-too-high price shows up in the reaction line', () => {
  expect(group(launch(d({ price: 40 }), t), 'kids').line).toMatch(/\$40/);
});

it.each([5, 40])('price $%i gives finite numbers and no negative sales', (price) => {
  const r = launch(d({ price }), t);
  expect(Number.isFinite(r.profit)).toBe(true);
  expect(r.units).toBeGreaterThanOrEqual(0);
  for (const g of r.groups) expect(g.units).toBeGreaterThanOrEqual(0);
  expect(r.stars).toBeGreaterThanOrEqual(1);
  expect(r.stars).toBeLessThanOrEqual(5);
});
