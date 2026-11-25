import { FABRICS } from '../sim/catalog/materials';
import type { FabricId } from '../sim/catalog/ids';

/** Physical material settings for a fabric: rough and matte for felt, glossy sheen for minky and faux fur. */
export function fabricMaterial(f: FabricId): { roughness: number; sheen: number; sheenRoughness: number } {
  const look = FABRICS[f].look;
  return { roughness: look.roughness, sheen: look.sheen, sheenRoughness: 1 - look.fuzz * 0.6 };
}
