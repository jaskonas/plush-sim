// The "sewing it up" animation as plain numbers: which step we're on, and how the toy looks.

export const SEWING_STAGES = ['pieces', 'stitch', 'stuff', 'eyes', 'tag', 'done'] as const;
export type SewingStage = (typeof SEWING_STAGES)[number];

export const SEWING_SECONDS = 9;
const STEP = SEWING_SECONDS / 5;

export function sewingStage(t: number): SewingStage {
  if (t >= SEWING_SECONDS) return 'done';
  return SEWING_STAGES[Math.max(0, Math.floor(t / STEP))];
}

const CAPTIONS: Record<SewingStage, string> = {
  pieces: '✂️ Cutting the pieces',
  stitch: '🧵 Stitching them together',
  stuff: '☁️ Stuffing',
  eyes: '👀 Adding the eyes',
  tag: '🏷️ Sewing in the safety tag',
  done: '🎉 Ready!',
};

export function sewingCaption(s: SewingStage): string {
  return CAPTIONS[s];
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** How the Plush should look at time t (seconds): flat pieces → stitched → stuffed → eyes on. */
export function sewingLook(t: number): { flatten: number; puff: number; hideEyes: boolean } {
  const flatten = t < STEP ? 1 : 1 - clamp01((t - STEP) / STEP);
  const puff = 0.6 + 0.4 * clamp01((t - 2 * STEP) / STEP);
  return { flatten, puff, hideEyes: t < 3 * STEP };
}
