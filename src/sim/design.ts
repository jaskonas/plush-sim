import type { AccessoryId, AnimalId, AudienceId, ColourId, EyesId, FabricId, SizeId, StuffingId, StyleId } from './catalog/ids';

/** Everything the player decides about one toy. */
export interface Design {
  animal: AnimalId;
  style: StyleId;
  fabric: FabricId;
  stuffing: StuffingId;
  eyes: EyesId;
  size: SizeId;
  colour: ColourId;
  accessory: AccessoryId;
  audience: AudienceId;
  /** Shop price in whole dollars, 5–40. */
  price: number;
  name: string;
}

/** This season's hot animal, style and colour. */
export interface Trend {
  animal: AnimalId;
  style: StyleId;
  colour: ColourId;
}

export const DEFAULT_DESIGN: Design = {
  animal: 'bear',
  style: 'classic',
  fabric: 'fleece',
  stuffing: 'fiberfill',
  eyes: 'embroidered',
  size: 'medium',
  colour: 'honey',
  accessory: 'none',
  audience: 'kids',
  price: 14,
  name: '',
};
