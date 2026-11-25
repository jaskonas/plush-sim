import { displayName, nameIdeas } from './names';
import { DEFAULT_DESIGN } from './design';
import { ANIMAL_IDS } from './catalog/ids';

it.each([...ANIMAL_IDS])('gives four different short name ideas for a %s', (animal) => {
  const ideas = nameIdeas({ ...DEFAULT_DESIGN, animal });
  expect(ideas).toHaveLength(4);
  expect(new Set(ideas).size).toBe(4);
  for (const n of ideas) {
    expect(n.trim().length).toBeGreaterThan(0);
    expect(n.length).toBeLessThanOrEqual(30);
  }
});

it('name ideas are the same every time for the same toy', () => {
  expect(nameIdeas(DEFAULT_DESIGN)).toEqual(nameIdeas(DEFAULT_DESIGN));
});

it('a blank name becomes "Your <animal>"', () => {
  expect(displayName({ ...DEFAULT_DESIGN, name: '   ' })).toBe('Your Teddy bear');
});

it('a real name is trimmed and used', () => {
  expect(displayName({ ...DEFAULT_DESIGN, name: '  Biscuit 🐻 ' })).toBe('Biscuit 🐻');
});
