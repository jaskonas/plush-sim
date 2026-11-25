import type { AnimalId, Entry, Fans } from './ids';

export type EarKind = 'round' | 'long' | 'pointy' | 'floppy' | 'flap' | 'none';
export type TailKind = 'none' | 'pom' | 'long' | 'stub' | 'spiky';
export type Extra = 'trunk' | 'horn' | 'mane' | 'spikes' | 'beak' | 'wings' | 'bellyPatch';

export interface AnimalShape {
  ears: { kind: EarKind; size: number };
  /** 0 = flat face; 0.5 = long muzzle. */
  snout: number;
  tail: TailKind;
  extras: Extra[];
}

export interface Animal extends Entry<AnimalId> {
  /** Pattern pieces for the classic style. More pieces = more sewing. */
  basePieces: number;
  /** Fabric area in m² for a 35 cm toy, before waste. */
  surface: number;
  shape: AnimalShape;
  fans: Fans;
}

export const ANIMALS: Record<AnimalId, Animal> = {
  bear: {
    id: 'bear', label: 'Teddy bear', emoji: '🧸', kidNote: 'The classic. Everyone knows a teddy.',
    basePieces: 14, surface: 0.22, fans: { toddlerParents: 0.1, kids: 0.05, collectors: 0.15 },
    shape: { ears: { kind: 'round', size: 0.3 }, snout: 0.35, tail: 'stub', extras: [] },
  },
  bunny: {
    id: 'bunny', label: 'Bunny', emoji: '🐰', kidNote: 'Long ears are fun to hold, but need a strong seam.',
    basePieces: 12, surface: 0.2, fans: { toddlerParents: 0.1, kids: 0.1, tweens: 0.05 },
    shape: { ears: { kind: 'long', size: 0.7 }, snout: 0.15, tail: 'pom', extras: [] },
  },
  cat: {
    id: 'cat', label: 'Cat', emoji: '🐱', kidNote: 'Pointy ears and a long, fiddly tail.',
    basePieces: 13, surface: 0.21, fans: { kids: 0.05, tweens: 0.1 },
    shape: { ears: { kind: 'pointy', size: 0.3 }, snout: 0.1, tail: 'long', extras: [] },
  },
  puppy: {
    id: 'puppy', label: 'Puppy', emoji: '🐶', kidNote: 'Floppy ears and a long snout (an extra piece).',
    basePieces: 15, surface: 0.23, fans: { toddlerParents: 0.05, kids: 0.1 },
    shape: { ears: { kind: 'floppy', size: 0.45 }, snout: 0.5, tail: 'stub', extras: [] },
  },
  elephant: {
    id: 'elephant', label: 'Elephant', emoji: '🐘', kidNote: 'Big ears and a trunk use lots of fabric.',
    basePieces: 16, surface: 0.27, fans: { toddlerParents: 0.05, collectors: 0.05 },
    shape: { ears: { kind: 'flap', size: 0.6 }, snout: 0, tail: 'long', extras: ['trunk'] },
  },
  dinosaur: {
    id: 'dinosaur', label: 'Dinosaur', emoji: '🦕', kidNote: 'Spikes down the back. Kids go wild for dinos.',
    basePieces: 16, surface: 0.26, fans: { kids: 0.15, tweens: 0.05 },
    shape: { ears: { kind: 'none', size: 0 }, snout: 0.3, tail: 'spiky', extras: ['spikes'] },
  },
  unicorn: {
    id: 'unicorn', label: 'Unicorn', emoji: '🦄', kidNote: 'A horn and a mane — magic, but more pieces to sew.',
    basePieces: 17, surface: 0.25, fans: { kids: 0.15, tweens: 0.1, collectors: -0.05 },
    shape: { ears: { kind: 'pointy', size: 0.25 }, snout: 0.4, tail: 'long', extras: ['horn', 'mane'] },
  },
  penguin: {
    id: 'penguin', label: 'Penguin', emoji: '🐧', kidNote: 'Simple shape, few pieces, a cheerful belly.',
    basePieces: 10, surface: 0.19, fans: { toddlerParents: 0.05, tweens: 0.05, collectors: 0.05 },
    shape: { ears: { kind: 'none', size: 0 }, snout: 0, tail: 'stub', extras: ['beak', 'wings', 'bellyPatch'] },
  },
  fox: {
    id: 'fox', label: 'Fox', emoji: '🦊', kidNote: 'A bushy tail and a pointed face. A bit grown-up.',
    basePieces: 14, surface: 0.22, fans: { tweens: 0.1, collectors: 0.1 },
    shape: { ears: { kind: 'pointy', size: 0.35 }, snout: 0.4, tail: 'long', extras: ['bellyPatch'] },
  },
};
