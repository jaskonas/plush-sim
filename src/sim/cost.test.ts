import { costToMake, profitPerToy, yourShare } from './cost';
import { DEFAULT_DESIGN, type Design } from './design';

const d = (patch: Partial<Design> = {}): Design => ({ ...DEFAULT_DESIGN, ...patch });

it('a medium classic fleece bear costs $3–4 to make', () => {
  const c = costToMake(d()).total;
  expect(c).toBeGreaterThanOrEqual(3);
  expect(c).toBeLessThanOrEqual(4);
});

it('a large realistic faux-fur elephant costs at least $12', () => {
  expect(costToMake(d({ animal: 'elephant', style: 'realistic', fabric: 'fauxFur', size: 'large' })).total).toBeGreaterThanOrEqual(12);
});

it('round style is cheaper to sew than realistic', () => {
  expect(costToMake(d({ style: 'round' })).sewing).toBeLessThan(costToMake(d({ style: 'realistic' })).sewing);
});

it('bigger toys cost more', () => {
  const [s, m, l] = (['small', 'medium', 'large'] as const).map((size) => costToMake(d({ size })).total);
  expect(s).toBeLessThan(m);
  expect(m).toBeLessThan(l);
});

it('total is the sum of the parts', () => {
  const c = costToMake(d({ accessory: 'scarf' }));
  expect(c.total).toBeCloseTo(c.fabric + c.stuffing + c.eyes + c.accessory + c.sewing + c.tag, 2);
});

it('the shop keeps half the price', () => {
  expect(yourShare(d({ price: 20 }))).toBe(10);
});

it('profit per toy is your share minus cost to make', () => {
  expect(profitPerToy(d({ price: 20 }))).toBeCloseTo(10 - costToMake(d()).total, 2);
});
