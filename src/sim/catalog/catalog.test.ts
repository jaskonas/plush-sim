import { ANIMALS } from './animals';
import { STYLES } from './styles';
import { ACCESSORIES, COLOURS, EYES, FABRICS, SIZES, STUFFINGS } from './materials';
import { AUDIENCES, GROUPS } from './groups';
import { TRENDS } from './trends';
import {
  ACCESSORY_IDS, ANIMAL_IDS, AUDIENCE_IDS, COLOUR_IDS, EYES_IDS, FABRIC_IDS, GROUP_IDS, SIZE_IDS, STUFFING_IDS, STYLE_IDS,
} from './ids';
import { DEFAULT_DESIGN } from '../design';

const tables: Array<[string, readonly string[], Record<string, { id: string; label: string; emoji: string; kidNote: string }>]> = [
  ['animals', ANIMAL_IDS, ANIMALS],
  ['styles', STYLE_IDS, STYLES],
  ['fabrics', FABRIC_IDS, FABRICS],
  ['stuffings', STUFFING_IDS, STUFFINGS],
  ['eyes', EYES_IDS, EYES],
  ['sizes', SIZE_IDS, SIZES],
  ['colours', COLOUR_IDS, COLOURS],
  ['accessories', ACCESSORY_IDS, ACCESSORIES],
  ['audiences', AUDIENCE_IDS, AUDIENCES],
  ['groups', GROUP_IDS, GROUPS],
];

describe.each(tables)('%s catalog', (_name, ids, table) => {
  it.each([...ids])('%s has a matching, kid-readable entry', (id) => {
    const entry = table[id];
    expect(entry.id).toBe(id);
    expect(entry.label.length).toBeGreaterThan(0);
    expect(entry.emoji.length).toBeGreaterThan(0);
    expect(entry.kidNote.length).toBeGreaterThan(0);
    expect(entry.kidNote.length).toBeLessThanOrEqual(90);
  });
});

it('offers nine animals and four styles', () => {
  expect(ANIMAL_IDS).toHaveLength(9);
  expect(STYLE_IDS).toEqual(['classic', 'cute', 'realistic', 'round']);
});

it('sizes are 20, 35 and 60 cm', () => {
  expect([SIZES.small.cm, SIZES.medium.cm, SIZES.large.cm]).toEqual([20, 35, 60]);
});

it('realistic takes the most sewing and round the least', () => {
  expect(STYLES.realistic.pieceFactor).toBeGreaterThan(STYLES.classic.pieceFactor);
  expect(STYLES.classic.pieceFactor).toBeGreaterThan(STYLES.round.pieceFactor);
});

it('every trend uses real ids, and there are at least six', () => {
  expect(TRENDS.length).toBeGreaterThanOrEqual(6);
  for (const t of TRENDS) {
    expect(ANIMAL_IDS).toContain(t.animal);
    expect(STYLE_IDS).toContain(t.style);
    expect(COLOUR_IDS).toContain(t.colour);
  }
});

it('the default design is a medium classic fleece bear for kids at a legal price', () => {
  expect(DEFAULT_DESIGN).toMatchObject({ animal: 'bear', style: 'classic', fabric: 'fleece', size: 'medium', audience: 'kids' });
  expect(DEFAULT_DESIGN.price).toBeGreaterThanOrEqual(5);
  expect(DEFAULT_DESIGN.price).toBeLessThanOrEqual(40);
});

it('colours are hex codes', () => {
  for (const c of Object.values(COLOURS)) expect(c.hex).toMatch(/^#[0-9a-f]{6}$/i);
});
