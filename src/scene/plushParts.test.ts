import { plushParts, type Part } from './plushParts';
import { fabricMaterial } from './fabricMaterial';
import { DEFAULT_DESIGN, type Design } from '../sim/design';
import { ANIMAL_IDS, STYLE_IDS } from '../sim/catalog/ids';

const parts = (patch: Partial<Design> = {}) => plushParts({ ...DEFAULT_DESIGN, ...patch });
const ids = (ps: Part[]) => ps.map((p) => p.id);

const combos = ANIMAL_IDS.flatMap((animal) => STYLE_IDS.map((style) => [animal, style] as const));

describe.each(combos)('%s in %s style', (animal, style) => {
  const ps = parts({ animal, style });

  it('has one head, one body and two eyes', () => {
    expect(ids(ps).filter((i) => i === 'head')).toHaveLength(1);
    expect(ids(ps).filter((i) => i === 'body')).toHaveLength(1);
    expect(ids(ps)).toContain('eye-l');
    expect(ids(ps)).toContain('eye-r');
  });

  it('has sane sizes and stays inside the stage box', () => {
    for (const p of ps) {
      for (const s of p.scale) {
        expect(Number.isFinite(s)).toBe(true);
        expect(s).toBeGreaterThan(0);
      }
      const [x, y, z] = p.position;
      expect(Math.abs(x)).toBeLessThanOrEqual(0.8);
      expect(Math.abs(z)).toBeLessThanOrEqual(0.8);
      expect(y).toBeGreaterThanOrEqual(-0.05);
      expect(y).toBeLessThanOrEqual(1.6);
    }
  });

  it('gives every part a unique id', () => {
    expect(new Set(ids(ps)).size).toBe(ps.length);
  });
});

it('round style has shorter limbs than classic', () => {
  const arm = (style: Design['style']) => parts({ style }).find((p) => p.id === 'arm-l')!.scale[1];
  expect(arm('round')).toBeLessThan(arm('classic'));
});

it('cute style has a bigger head than realistic', () => {
  const head = (style: Design['style']) => parts({ style }).find((p) => p.id === 'head')!.scale[0];
  expect(head('cute')).toBeGreaterThan(head('realistic'));
});

it.each([
  ['unicorn', 'horn'],
  ['elephant', 'trunk'],
  ['dinosaur', 'spike-0'],
  ['penguin', 'beak'],
] as const)('a %s has its %s', (animal, id) => {
  expect(ids(parts({ animal }))).toContain(id);
});

it('earless animals have no ears; others have two', () => {
  expect(ids(parts({ animal: 'penguin' })).some((i) => i.startsWith('ear-'))).toBe(false);
  expect(ids(parts({ animal: 'bunny' })).filter((i) => i.startsWith('ear-'))).toHaveLength(2);
});

it('button eyes get a rim, stitched eyes are flat', () => {
  expect(parts({ eyes: 'buttons' }).some((p) => p.shape === 'torus')).toBe(true);
  expect(parts({ eyes: 'embroidered' }).find((p) => p.id === 'eye-l')!.shape).toBe('disc');
  expect(parts({ eyes: 'safety' }).find((p) => p.id === 'eye-l')!.shape).toBe('sphere');
});

it('a scarf or bow shows up as an accessory part', () => {
  expect(parts({ accessory: 'scarf' }).some((p) => p.role === 'accessory')).toBe(true);
  expect(parts({ accessory: 'bow' }).some((p) => p.role === 'accessory')).toBe(true);
  expect(parts({ accessory: 'none' }).some((p) => p.role === 'accessory')).toBe(false);
});

it('faux fur is shinier than cotton', () => {
  expect(fabricMaterial('fauxFur').sheen).toBeGreaterThan(fabricMaterial('cotton').sheen);
});
