import type { Palette } from './materials';
import type { AudienceId, Entry, GroupId } from './ids';

export interface Group extends Entry<GroupId> {
  /** Most toys this group could buy if they all loved it. */
  size: number;
  /** Price they pay without thinking twice. */
  comfyPrice: number;
  /** How fast they stop buying above the comfy price (bigger = pickier). */
  sensitivity: number;
  /** How much softness / toughness of the fabric matters to them (0–0.3). */
  softnessWeight: number;
  durabilityWeight: number;
  /** How much they chase this season's trend (multiplies the trend bonus). */
  trendWeight: number;
  /** Extra appeal for each colour family. */
  palettes: Record<Palette, number>;
}

export const GROUPS: Record<GroupId, Group> = {
  toddlerParents: {
    id: 'toddlerParents', label: 'Toddler parents', emoji: '👶', kidNote: 'Want it safe, soft and washable.',
    size: 40000, comfyPrice: 16, sensitivity: 1.2, softnessWeight: 0.3, durabilityWeight: 0.2, trendWeight: 0.5,
    palettes: { natural: 0.05, pastel: 0.1, bright: 0 },
  },
  kids: {
    id: 'kids', label: 'Kids 6–9', emoji: '🧒', kidNote: 'Love fun animals, bright colours and big toys. Parents pay!',
    size: 40000, comfyPrice: 12, sensitivity: 2, softnessWeight: 0.15, durabilityWeight: 0.05, trendWeight: 1,
    palettes: { natural: -0.05, pastel: 0.05, bright: 0.1 },
  },
  tweens: {
    id: 'tweens', label: 'Tweens', emoji: '🧑', kidNote: 'Want what is trendy: pastel, squishy, small.',
    size: 20000, comfyPrice: 16, sensitivity: 1.6, softnessWeight: 0.2, durabilityWeight: 0, trendWeight: 1.5,
    palettes: { natural: -0.05, pastel: 0.1, bright: 0 },
  },
  collectors: {
    id: 'collectors', label: 'Collectors', emoji: '🏆', kidNote: 'Grown-ups who pay a lot for quality.',
    size: 10000, comfyPrice: 35, sensitivity: 0.3, softnessWeight: 0.1, durabilityWeight: 0.15, trendWeight: 0.3,
    palettes: { natural: 0.15, pastel: -0.05, bright: -0.1 },
  },
};

export type Audience = Entry<AudienceId>;

export const AUDIENCES: Record<AudienceId, Audience> = {
  babies: { id: 'babies', label: 'Babies (0–2)', emoji: '👶', kidNote: 'Strictest safety rules. Sold in the baby aisle.' },
  kids: { id: 'kids', label: 'Kids (3+)', emoji: '🧒', kidNote: 'The big toy aisle. Lots of shoppers.' },
  collectors: { id: 'collectors', label: 'Collectors (14+)', emoji: '🏆', kidNote: 'Gift shops and fan sites. Few shoppers, deep pockets.' },
};
