// Every choice in the game is one of these ids. Add an id here, then its entry in the
// matching catalog file; the Record types make a missing entry a type error.

export const ANIMAL_IDS = ['bear', 'bunny', 'cat', 'puppy', 'elephant', 'dinosaur', 'unicorn', 'penguin', 'fox'] as const;
export type AnimalId = (typeof ANIMAL_IDS)[number];

export const STYLE_IDS = ['classic', 'cute', 'realistic', 'round'] as const;
export type StyleId = (typeof STYLE_IDS)[number];

export const FABRIC_IDS = ['minky', 'fleece', 'cotton', 'felt', 'fauxFur'] as const;
export type FabricId = (typeof FABRIC_IDS)[number];

export const STUFFING_IDS = ['fiberfill', 'recycled', 'pellets'] as const;
export type StuffingId = (typeof STUFFING_IDS)[number];

export const EYES_IDS = ['embroidered', 'safety', 'buttons'] as const;
export type EyesId = (typeof EYES_IDS)[number];

export const SIZE_IDS = ['small', 'medium', 'large'] as const;
export type SizeId = (typeof SIZE_IDS)[number];

export const COLOUR_IDS = ['honey', 'chocolate', 'cream', 'lavender', 'blush', 'mint', 'sky', 'sunshine'] as const;
export type ColourId = (typeof COLOUR_IDS)[number];

export const ACCESSORY_IDS = ['none', 'bow', 'scarf'] as const;
export type AccessoryId = (typeof ACCESSORY_IDS)[number];

export const AUDIENCE_IDS = ['babies', 'kids', 'collectors'] as const;
export type AudienceId = (typeof AUDIENCE_IDS)[number];

export const GROUP_IDS = ['toddlerParents', 'kids', 'tweens', 'collectors'] as const;
export type GroupId = (typeof GROUP_IDS)[number];

/** Fields every catalog entry carries, so the sidebar can draw any of them. */
export interface Entry<Id extends string> {
  id: Id;
  label: string;
  emoji: string;
  /** One short sentence a 10-year-old can read. */
  kidNote: string;
}

/** How much each shopper group likes this choice: about −0.2 (dislike) to +0.2 (love). Missing = 0. */
export type Fans = Partial<Record<GroupId, number>>;
