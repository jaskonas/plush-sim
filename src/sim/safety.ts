import { ACCESSORIES, FABRICS } from './catalog/materials';
import type { Design } from './design';

export interface SafetyResult {
  ok: boolean;
  /** One short line per problem, kid-readable. */
  problems: string[];
}

/** The safety lab: what each audience's toys are not allowed to have. */
export function safetyCheck(d: Design): SafetyResult {
  const problems: string[] = [];
  if (d.audience === 'collectors') return { ok: true, problems };

  if (d.eyes === 'buttons') problems.push(d.audience === 'babies' ? 'Buttons could come off — not safe for babies' : 'Buttons could come off — not safe for kids');

  if (d.audience === 'babies') {
    if (d.eyes === 'safety') problems.push('Plastic eyes are only OK from age 3 — try stitched eyes');
    if (d.stuffing === 'pellets') problems.push('Pellets could leak out if a seam opens — not for babies');
    if (FABRICS[d.fabric].sheds) problems.push(`${FABRICS[d.fabric].label} sheds fibres — not for babies`);
    if (ACCESSORIES[d.accessory].smallPart) problems.push(`A ${ACCESSORIES[d.accessory].label.toLowerCase()} is small enough to swallow — not for babies`);
  }
  return { ok: problems.length === 0, problems };
}
