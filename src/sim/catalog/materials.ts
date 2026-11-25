import type { AccessoryId, ColourId, Entry, EyesId, FabricId, Fans, SizeId, StuffingId } from './ids';

export interface Fabric extends Entry<FabricId> {
  /** Dollars per square metre, bought in factory amounts. */
  costPerM2: number;
  /** 0–1: how nice it feels to hug. */
  softness: number;
  /** 0–1: how well it survives being dragged around and washed. */
  durability: number;
  /** Long fibres can come loose — not for babies. */
  sheds: boolean;
  washable: boolean;
  fans: Fans;
  /** How the 3D material looks: roughness and sheen (0–1), fuzz = how furry. */
  look: { roughness: number; sheen: number; fuzz: number };
}

export const FABRICS: Record<FabricId, Fabric> = {
  minky: {
    id: 'minky', label: 'Minky', emoji: '☁️', kidNote: 'Super soft and silky. Costs more.',
    costPerM2: 9, softness: 0.95, durability: 0.6, sheds: false, washable: true,
    fans: { toddlerParents: 0.05, tweens: 0.1 }, look: { roughness: 0.6, sheen: 0.9, fuzz: 0.3 },
  },
  fleece: {
    id: 'fleece', label: 'Fleece', emoji: '🧣', kidNote: 'Soft, cheap and easy to wash.',
    costPerM2: 5, softness: 0.75, durability: 0.7, sheds: false, washable: true,
    fans: {}, look: { roughness: 0.9, sheen: 0.4, fuzz: 0.2 },
  },
  cotton: {
    id: 'cotton', label: 'Cotton', emoji: '🌱', kidNote: 'Tough and washable, but not very cuddly.',
    costPerM2: 4, softness: 0.45, durability: 0.85, sheds: false, washable: true,
    fans: { toddlerParents: 0.05 }, look: { roughness: 1, sheen: 0, fuzz: 0 },
  },
  felt: {
    id: 'felt', label: 'Felt', emoji: '✂️', kidNote: 'Cheapest. Stiff, and it pills and tears.',
    costPerM2: 3, softness: 0.3, durability: 0.4, sheds: false, washable: false,
    fans: { collectors: -0.1 }, look: { roughness: 1, sheen: 0.1, fuzz: 0.05 },
  },
  fauxFur: {
    id: 'fauxFur', label: 'Faux fur', emoji: '🦁', kidNote: 'Fluffy and fancy. Pricey, and it sheds a little.',
    costPerM2: 14, softness: 0.9, durability: 0.55, sheds: true, washable: false,
    fans: { toddlerParents: -0.1, tweens: 0.1, collectors: 0.1 }, look: { roughness: 0.7, sheen: 1, fuzz: 0.9 },
  },
};

export interface Stuffing extends Entry<StuffingId> {
  costPerGram: number;
  fans: Fans;
}

export const STUFFINGS: Record<StuffingId, Stuffing> = {
  fiberfill: { id: 'fiberfill', label: 'Fiberfill', emoji: '☁️', kidNote: 'Normal fluffy stuffing. Cheap and light.', costPerGram: 0.006, fans: {} },
  recycled: {
    id: 'recycled', label: 'Recycled fill', emoji: '♻️', kidNote: 'Made from old bottles. Costs a bit more; parents like it.',
    costPerGram: 0.008, fans: { toddlerParents: 0.1, tweens: 0.05 },
  },
  pellets: {
    id: 'pellets', label: 'Fill + pellets', emoji: '⚖️', kidNote: 'Little beads give a nice weight. Not for babies.',
    costPerGram: 0.012, fans: { tweens: 0.05, collectors: 0.1 },
  },
};

export interface Eyes extends Entry<EyesId> {
  /** Dollars for a pair, fitted. */
  cost: number;
  /** 0–1: how shiny and lively they look. */
  sparkle: number;
  fans: Fans;
}

export const EYES: Record<EyesId, Eyes> = {
  embroidered: {
    id: 'embroidered', label: 'Stitched', emoji: '🪡', kidNote: 'Sewn with thread. Safest for babies, less sparkly.',
    cost: 0.25, sparkle: 0.3, fans: { toddlerParents: 0.1, collectors: -0.05 },
  },
  safety: {
    id: 'safety', label: 'Safety eyes', emoji: '👀', kidNote: 'Shiny plastic eyes that lock on. OK from age 3.',
    cost: 0.15, sparkle: 0.8, fans: { kids: 0.05, tweens: 0.05 },
  },
  buttons: {
    id: 'buttons', label: 'Buttons', emoji: '🔘', kidNote: 'Cheap and old-fashioned, but they can come off.',
    cost: 0.08, sparkle: 0.6, fans: { collectors: 0.15 },
  },
};

export interface Size extends Entry<SizeId> {
  cm: number;
  fans: Fans;
}

export const SIZES: Record<SizeId, Size> = {
  small: { id: 'small', label: 'Small', emoji: '🤏', kidNote: '20 cm. Fits in a backpack.', cm: 20, fans: { kids: -0.05, tweens: 0.1, collectors: 0.1 } },
  medium: { id: 'medium', label: 'Medium', emoji: '🧸', kidNote: '35 cm. A good size to hug.', cm: 35, fans: {} },
  large: { id: 'large', label: 'Large', emoji: '🦣', kidNote: '60 cm. Huge hugs — and lots of fabric.', cm: 60, fans: { kids: 0.15, tweens: -0.05, collectors: -0.1 } },
};

export type Palette = 'natural' | 'pastel' | 'bright';

export interface Colour extends Entry<ColourId> {
  hex: string;
  palette: Palette;
}

export const COLOURS: Record<ColourId, Colour> = {
  honey: { id: 'honey', label: 'Honey', emoji: '🍯', kidNote: 'Warm golden brown.', hex: '#c98f5f', palette: 'natural' },
  chocolate: { id: 'chocolate', label: 'Chocolate', emoji: '🍫', kidNote: 'Dark brown.', hex: '#6b4430', palette: 'natural' },
  cream: { id: 'cream', label: 'Cream', emoji: '🥛', kidNote: 'Soft off-white.', hex: '#efe4d0', palette: 'natural' },
  lavender: { id: 'lavender', label: 'Lavender', emoji: '💜', kidNote: 'Pale purple.', hex: '#b9a3d9', palette: 'pastel' },
  blush: { id: 'blush', label: 'Blush', emoji: '🌸', kidNote: 'Pale pink.', hex: '#f0b4c4', palette: 'pastel' },
  mint: { id: 'mint', label: 'Mint', emoji: '🌿', kidNote: 'Pale green.', hex: '#a8dcc0', palette: 'pastel' },
  sky: { id: 'sky', label: 'Sky blue', emoji: '💙', kidNote: 'Bright blue.', hex: '#4fa3e0', palette: 'bright' },
  sunshine: { id: 'sunshine', label: 'Sunshine', emoji: '🌻', kidNote: 'Bright yellow.', hex: '#f5c542', palette: 'bright' },
};

export interface Accessory extends Entry<AccessoryId> {
  cost: number;
  /** Small enough to swallow if it comes off — not for babies. */
  smallPart: boolean;
  fans: Fans;
}

export const ACCESSORIES: Record<AccessoryId, Accessory> = {
  none: { id: 'none', label: 'Nothing', emoji: '➖', kidNote: 'Keep it simple.', cost: 0, smallPart: false, fans: {} },
  bow: { id: 'bow', label: 'Bow', emoji: '🎀', kidNote: 'Cute, but small enough to swallow.', cost: 0.3, smallPart: true, fans: { kids: 0.1, tweens: 0.05 } },
  scarf: { id: 'scarf', label: 'Scarf', emoji: '🧣', kidNote: 'A cosy sewn-on scarf.', cost: 0.5, smallPart: false, fans: { kids: 0.05, tweens: 0.1, collectors: 0.05 } },
};
