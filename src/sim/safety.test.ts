import { safetyCheck } from './safety';
import { DEFAULT_DESIGN, type Design } from './design';

const d = (patch: Partial<Design> = {}): Design => ({ ...DEFAULT_DESIGN, ...patch });

it('buttons fail for babies and kids', () => {
  for (const audience of ['babies', 'kids'] as const) {
    const r = safetyCheck(d({ eyes: 'buttons', audience }));
    expect(r.ok).toBe(false);
    expect(r.problems[0]).toMatch(/button/i);
  }
});

it('buttons pass for collectors', () => {
  expect(safetyCheck(d({ eyes: 'buttons', audience: 'collectors' })).ok).toBe(true);
});

it('a stitched-eye fleece fiberfill toy passes for babies', () => {
  expect(safetyCheck(d({ audience: 'babies' }))).toEqual({ ok: true, problems: [] });
});

it('babies with pellets and a bow get two problems', () => {
  const r = safetyCheck(d({ audience: 'babies', stuffing: 'pellets', accessory: 'bow' }));
  expect(r.ok).toBe(false);
  expect(r.problems).toHaveLength(2);
});

it.each([
  ['eyes', 'safety'],
  ['fabric', 'fauxFur'],
  ['stuffing', 'pellets'],
  ['accessory', 'bow'],
] as const)('babies cannot have %s = %s', (key, value) => {
  expect(safetyCheck(d({ audience: 'babies', [key]: value })).ok).toBe(false);
});

it('kids can have safety eyes, faux fur, pellets and a bow', () => {
  expect(safetyCheck(d({ audience: 'kids', eyes: 'safety', fabric: 'fauxFur', stuffing: 'pellets', accessory: 'bow' })).ok).toBe(true);
});
