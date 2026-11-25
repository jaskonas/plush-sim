import { ANIMALS } from './catalog/animals';
import { STYLES } from './catalog/styles';
import { ACCESSORIES, COLOURS, EYES, FABRICS, SIZES, STUFFINGS } from './catalog/materials';
import { GROUPS } from './catalog/groups';
import { GROUP_IDS, type AudienceId, type Fans, type GroupId, type SizeId } from './catalog/ids';
import { BASE_APPEAL, SETUP_COST, TREND_BONUS } from './catalog/coefficients';
import { costToMake, profitPerToy } from './cost';
import { safetyCheck } from './safety';
import type { Design, Trend } from './design';

/** Which shopper groups find the toy, by the aisle it is sold in. Missing = they never see it. */
export const REACH: Record<AudienceId, Partial<Record<GroupId, number>>> = {
  babies: { toddlerParents: 1, kids: 0.3 },
  kids: { kids: 1, tweens: 1, toddlerParents: 0.3, collectors: 0.3 },
  collectors: { collectors: 1, tweens: 1, kids: 0.3 },
};

export type Face = '😍' | '🙂' | '😐' | '🙁' | '—';

export interface GroupResult {
  group: GroupId;
  reach: number;
  appeal: number;
  priceFactor: number;
  units: number;
  face: Face;
  line: string;
}

export interface LaunchReport {
  design: Design;
  trend: Trend;
  stars: 1 | 2 | 3 | 4 | 5;
  units: number;
  cost: number;
  price: number;
  profitPerToy: number;
  setupCost: number;
  profit: number;
  groups: GroupResult[];
}

interface Factor {
  value: number;
  good: string;
  bad: string;
}

const fan = (fans: Fans, g: GroupId) => fans[g] ?? 0;
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** Would this toy pass the safety lab if it were sold for babies? */
export function isBabySafe(d: Design): boolean {
  return safetyCheck({ ...d, audience: 'babies' }).ok;
}

/** Everything that pushes one group's appeal up or down, with what they'd say about it. */
function factors(g: GroupId, d: Design, t: Trend): Factor[] {
  const group = GROUPS[g];
  const animal = ANIMALS[d.animal];
  const style = STYLES[d.style];
  const fabric = FABRICS[d.fabric];
  const colour = COLOURS[d.colour];
  const size = SIZES[d.size];
  const acc = ACCESSORIES[d.accessory];
  const trendHits = [d.animal === t.animal, d.style === t.style, d.colour === t.colour].filter(Boolean).length;
  return [
    { value: fan(animal.fans, g), good: `We love a ${animal.label.toLowerCase()}!`, bad: `Not really into ${animal.label.toLowerCase()}s` },
    { value: fan(style.fans, g), good: `${style.label} style is perfect`, bad: `${style.label} style isn't for us` },
    {
      value:
        fan(fabric.fans, g) +
        group.softnessWeight * (fabric.softness - 0.5) * 2 +
        group.durabilityWeight * (fabric.durability - 0.5) * 2,
      good: `${fabric.label} feels lovely`,
      bad: `${fabric.label} doesn't feel right`,
    },
    { value: fan(STUFFINGS[d.stuffing].fans, g), good: `${STUFFINGS[d.stuffing].label} is a nice touch`, bad: `Don't love the stuffing` },
    { value: fan(EYES[d.eyes].fans, g), good: `Those ${EYES[d.eyes].label.toLowerCase()} eyes!`, bad: 'The eyes look off to us' },
    { value: fan(size.fans, g), good: `${size.label} is just the right size`, bad: `${size.label} is the wrong size for us` },
    { value: group.palettes[colour.palette], good: `${colour.label} is such a good colour`, bad: `${colour.label} isn't our colour` },
    { value: fan(acc.fans, g), good: `Love the ${acc.label.toLowerCase()}!`, bad: `Skip the ${acc.label.toLowerCase()}` },
    { value: group.trendWeight * TREND_BONUS * trendHits, good: "It's so on-trend this year!", bad: '' },
  ];
}

/** 0–1: how much one shopper group likes the toy, before price. */
export function appealFor(g: GroupId, d: Design, t: Trend): number {
  if (g === 'toddlerParents' && !isBabySafe(d)) return 0;
  const sum = factors(g, d, t).reduce((s, f) => s + f.value, 0);
  return clamp(BASE_APPEAL + sum, 0, 1);
}

/** 1 at or below the group's comfy price for a toy this size, falling away above it. */
export function priceFactor(g: GroupId, price: number, size: SizeId = 'medium'): number {
  const { sensitivity } = GROUPS[g];
  const comfy = GROUPS[g].comfyPrice * SIZES[size].priceExpect;
  return price <= comfy ? 1 : Math.exp((-sensitivity * (price - comfy)) / comfy);
}

function faceFor(appeal: number): Exclude<Face, '—'> {
  if (appeal >= 0.75) return '😍';
  if (appeal >= 0.55) return '🙂';
  if (appeal >= 0.35) return '😐';
  return '🙁';
}

function lineFor(g: GroupId, d: Design, t: Trend, appeal: number, pf: number): string {
  if (g === 'toddlerParents' && !isBabySafe(d)) return 'Not safe for our little ones';
  if (pf < 0.5) return appeal >= 0.55 ? `Love it, but $${d.price} is a lot` : `Not worth $${d.price} to us`;
  const fs = factors(g, d, t);
  if (appeal >= 0.55) {
    const best = fs.reduce((a, b) => (b.value > a.value ? b : a));
    return best.value > 0 ? best.good : 'Really nice toy!';
  }
  const worst = fs.filter((f) => f.bad).reduce((a, b) => (b.value < a.value ? b : a));
  return worst.value < 0 ? worst.bad : "It's nice, but nothing special";
}

export function launch(d: Design, t: Trend): LaunchReport {
  const groups: GroupResult[] = GROUP_IDS.map((g) => {
    const reach = REACH[d.audience][g] ?? 0;
    const appeal = appealFor(g, d, t);
    const pf = priceFactor(g, d.price, d.size);
    if (reach === 0) return { group: g, reach, appeal, priceFactor: pf, units: 0, face: '—', line: 'Not aimed at us' };
    const units = Math.round((GROUPS[g].size * appeal * reach * pf) / 100) * 100;
    // A loved toy that's priced out of reach looks less happy on the report.
    const face = faceFor(appeal * (pf < 0.5 ? 0.6 : 1));
    return { group: g, reach, appeal, priceFactor: pf, units, face, line: lineFor(g, d, t, appeal, pf) };
  });

  let weighted = 0;
  let total = 0;
  for (const r of groups) {
    weighted += GROUPS[r.group].size * r.appeal * r.reach;
    total += GROUPS[r.group].size * r.reach;
  }
  const stars = clamp(Math.ceil((weighted / total) * 5), 1, 5) as LaunchReport['stars'];
  const units = groups.reduce((s, r) => s + r.units, 0);
  const ppt = profitPerToy(d);
  return {
    design: d,
    trend: t,
    stars,
    units,
    cost: costToMake(d).total,
    price: d.price,
    profitPerToy: ppt,
    setupCost: SETUP_COST,
    profit: Math.round((units * ppt - SETUP_COST) * 100) / 100,
    groups,
  };
}
