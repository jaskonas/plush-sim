import { ANIMALS } from './catalog/animals';
import type { Design } from './design';

const WORDS = [
  'Biscuit', 'Pickle', 'Maple', 'Waffles', 'Pudding', 'Clover', 'Pepper', 'Noodle',
  'Sprout', 'Mochi', 'Toffee', 'Bean', 'Juniper', 'Marshmallow', 'Pippin', 'Sunny',
];

/** The animal's short name for "X the Bunny" ideas: the last word of its label. */
const shortName = (d: Pick<Design, 'animal'>) => {
  const words = ANIMALS[d.animal].label.split(' ');
  const last = words[words.length - 1];
  return last[0].toUpperCase() + last.slice(1);
};

/** Small, stable hash so the same toy always gets the same ideas. */
const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

/** Four name ideas, e.g. "Biscuit the Bunny". */
export function nameIdeas(d: Pick<Design, 'animal' | 'colour' | 'style'>): string[] {
  const start = hash(d.animal + d.colour + d.style);
  const step = 5; // co-prime with WORDS.length, so four picks never repeat
  return [0, 1, 2, 3].map((i) => `${WORDS[(start + i * step) % WORDS.length]} the ${shortName(d)}`);
}

/** The toy's name for titles: what she typed, or "Your Teddy bear". */
export function displayName(d: Pick<Design, 'name' | 'animal'>): string {
  const name = d.name.trim();
  return name || `Your ${ANIMALS[d.animal].label}`;
}
