import type { Entry, Fans, StyleId } from './ids';

export interface Style extends Entry<StyleId> {
  /** Multiplies the animal's pattern pieces: realistic needs more, round needs fewer. */
  pieceFactor: number;
  /** How the 3D toy is proportioned (head radius vs body, body scale, limb length, ear scale). */
  proportions: { head: number; body: [number, number, number]; limb: number; earScale: number };
  fans: Fans;
}

export const STYLES: Record<StyleId, Style> = {
  classic: {
    id: 'classic', label: 'Classic', emoji: '🎀', kidNote: 'Old-fashioned shape, like a toy your grandparents had.',
    pieceFactor: 1, proportions: { head: 0.8, body: [1, 1.15, 0.9], limb: 1, earScale: 1 },
    fans: { toddlerParents: 0.05, tweens: -0.05, collectors: 0.15 },
  },
  cute: {
    id: 'cute', label: 'Cute', emoji: '🥰', kidNote: 'Big head, tiny body, simple face.',
    pieceFactor: 0.9, proportions: { head: 1.1, body: [0.9, 0.9, 0.85], limb: 0.6, earScale: 1.1 },
    fans: { toddlerParents: 0.1, kids: 0.15, tweens: 0.05, collectors: -0.05 },
  },
  realistic: {
    id: 'realistic', label: 'Realistic', emoji: '🔍', kidNote: 'Looks like the real animal. Lots of pieces to sew.',
    pieceFactor: 1.5, proportions: { head: 0.65, body: [1.1, 1, 1.3], limb: 1.2, earScale: 0.9 },
    fans: { toddlerParents: -0.1, kids: -0.1, collectors: 0.2 },
  },
  round: {
    id: 'round', label: 'Round & squishy', emoji: '🍡', kidNote: 'A soft round blob with tiny ears. Few pieces.',
    pieceFactor: 0.6, proportions: { head: 0.95, body: [1.2, 1.1, 1.1], limb: 0.3, earScale: 0.7 },
    fans: { toddlerParents: 0.1, kids: 0.05, tweens: 0.2, collectors: -0.1 },
  },
};
