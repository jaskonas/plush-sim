// Turns a design into a list of soft 3D parts. Pure data, so it can be tested without WebGL.
// Axes: y is up, z points at the camera (the toy's front). A medium toy is about 1 unit tall;
// size is applied by the scene as a whole-toy scale, not here.
import { ANIMALS } from '../sim/catalog/animals';
import { STYLES } from '../sim/catalog/styles';
import type { Design } from '../sim/design';

export type Vec3 = [number, number, number];

export interface Part {
  id: string;
  shape: 'sphere' | 'capsule' | 'cone' | 'disc' | 'torus';
  position: Vec3;
  /** Sphere: radii. Capsule: [radius, length, radius]. Cone: [radius, height, radius]. Disc: [radius, thickness, radius]. Torus: [radius, radius, tube]. */
  scale: Vec3;
  rotation?: Vec3;
  role: 'main' | 'accent' | 'dark' | 'eye' | 'nose' | 'accessory' | 'horn';
}

type Input = Pick<Design, 'animal' | 'style' | 'eyes' | 'accessory'>;

/** Adds a left/right pair, mirrored across x. */
function pair(out: Part[], base: string, p: Omit<Part, 'id'>) {
  const [x, y, z] = p.position;
  const rot = p.rotation;
  out.push({ ...p, id: `${base}-l`, position: [-x, y, z], rotation: rot ? [rot[0], -rot[1], -rot[2]] : undefined });
  out.push({ ...p, id: `${base}-r`, position: [x, y, z], rotation: rot });
}

export function plushParts(d: Input): Part[] {
  const animal = ANIMALS[d.animal];
  const style = STYLES[d.style];
  const shape = animal.shape;
  const P = style.proportions;
  const out: Part[] = [];

  // Body: sits on the floor.
  const body: Vec3 = [0.28 * P.body[0], 0.28 * P.body[1], 0.26 * P.body[2]];
  const bodyY = body[1];
  out.push({ id: 'body', shape: 'sphere', position: [0, bodyY, 0], scale: body, role: 'main' });

  // Head: on top, overlapping the body a little (round style tucks it right in).
  const r = 0.24 * P.head;
  const headY = bodyY * 2 + r * (d.style === 'round' ? 0.35 : 0.7);
  out.push({ id: 'head', shape: 'sphere', position: [0, headY, 0.02], scale: [r, r * 0.95, r * 0.92], role: 'main' });
  const face = 0.02 + r * 0.9; // z of the face surface

  // Eyes.
  const eyeR = r * (d.style === 'cute' ? 0.16 : 0.11);
  const eyeY = headY + r * (d.style === 'cute' ? -0.02 : 0.12);
  const eyeX = r * (d.style === 'cute' ? 0.42 : 0.36);
  if (d.eyes === 'safety') {
    pair(out, 'eye', { shape: 'sphere', position: [eyeX, eyeY, face - eyeR * 0.3], scale: [eyeR, eyeR, eyeR * 0.7], role: 'eye' });
  } else {
    pair(out, 'eye', { shape: 'disc', position: [eyeX, eyeY, face + 0.004], scale: [eyeR, 0.01, eyeR], rotation: [Math.PI / 2, 0, 0], role: 'eye' });
    if (d.eyes === 'buttons') {
      pair(out, 'eyeRim', { shape: 'torus', position: [eyeX, eyeY, face + 0.012], scale: [eyeR, eyeR, eyeR], role: 'eye' });
    }
  }

  // Snout and nose.
  const beak = shape.extras.includes('beak');
  if (shape.snout > 0 && !beak) {
    const len = r * (0.25 + shape.snout * 0.6);
    out.push({ id: 'snout', shape: 'sphere', position: [0, headY - r * 0.25, face - r * 0.15 + len * 0.5], scale: [r * 0.42, r * 0.32, len], role: 'accent' });
    if (!shape.extras.includes('spikes')) {
      out.push({ id: 'nose', shape: 'sphere', position: [0, headY - r * 0.12, face - r * 0.15 + len * 1.4], scale: [r * 0.13, r * 0.09, r * 0.08], role: 'nose' });
    }
  } else if (!beak && !shape.extras.includes('trunk')) {
    out.push({ id: 'nose', shape: 'sphere', position: [0, headY - r * 0.15, face + 0.01], scale: [r * 0.1, r * 0.07, r * 0.06], role: 'nose' });
  }
  if (beak) {
    out.push({ id: 'beak', shape: 'cone', position: [0, headY - r * 0.2, face + r * 0.15], scale: [r * 0.2, r * 0.45, r * 0.2], rotation: [Math.PI / 2, 0, 0], role: 'horn' });
  }

  // Ears.
  const es = shape.ears.size * P.earScale;
  switch (shape.ears.kind) {
    case 'round':
      pair(out, 'ear', { shape: 'sphere', position: [r * 0.7, headY + r * 0.75, 0], scale: [r * es, r * es, r * es * 0.45], role: 'main' });
      break;
    case 'long':
      pair(out, 'ear', { shape: 'capsule', position: [r * 0.35, headY + r * (0.9 + es * 0.9), -r * 0.1], scale: [r * 0.2, r * es * 1.3, r * 0.09], rotation: [0, 0, -0.15], role: 'main' });
      break;
    case 'pointy':
      pair(out, 'ear', { shape: 'cone', position: [r * 0.6, headY + r * (0.85 + es * 0.5), 0], scale: [r * es * 0.85, r * es * 1.6, r * es * 0.4], rotation: [0, 0, -0.35], role: 'main' });
      break;
    case 'floppy':
      pair(out, 'ear', { shape: 'capsule', position: [r * 0.95, headY - r * 0.05, 0], scale: [r * 0.22, r * es * 1.2, r * 0.1], rotation: [0, 0, 0.25], role: 'main' });
      break;
    case 'flap':
      pair(out, 'ear', { shape: 'sphere', position: [r * 1.05, headY, -r * 0.1], scale: [r * es * 0.35, r * es * 1.2, r * es], rotation: [0, 0.5, 0], role: 'main' });
      break;
    case 'none':
      break;
  }

  // Arms (or wings) and legs.
  const limb = 0.12 * P.limb + 0.03;
  if (shape.extras.includes('wings')) {
    pair(out, 'arm', { shape: 'sphere', position: [body[0] * 0.95, bodyY * 1.05, 0], scale: [0.04, limb * 1.2, 0.1], rotation: [0, 0, 0.2], role: 'main' });
  } else {
    pair(out, 'arm', { shape: 'capsule', position: [body[0] * 0.9, bodyY * 1.15, body[2] * 0.25], scale: [0.065, limb, 0.065], rotation: [0.3, 0, 0.6], role: 'main' });
  }
  pair(out, 'leg', { shape: 'capsule', position: [body[0] * 0.5, 0.07, body[2] * 0.7], scale: [0.075, limb, 0.075], rotation: [Math.PI / 2 - 0.2, 0, 0], role: 'main' });

  // Tail.
  const back = -body[2];
  switch (shape.tail) {
    case 'pom':
      out.push({ id: 'tail', shape: 'sphere', position: [0, bodyY * 0.6, back - 0.03], scale: [0.08, 0.08, 0.08], role: 'accent' });
      break;
    case 'stub':
      out.push({ id: 'tail', shape: 'sphere', position: [0, bodyY * 0.5, back], scale: [0.05, 0.05, 0.05], role: 'main' });
      break;
    case 'long':
      out.push({ id: 'tail', shape: 'capsule', position: [0.05, bodyY * 0.7, back - 0.1], scale: [0.045, 0.16 * (d.animal === 'fox' ? 1.4 : 1), 0.045], rotation: [-0.9, 0, 0.3], role: 'main' });
      break;
    case 'spiky':
      out.push({ id: 'tail', shape: 'cone', position: [0, bodyY * 0.4, back - 0.12], scale: [0.09, 0.26, 0.09], rotation: [-Math.PI / 2 + 0.3, 0, 0], role: 'main' });
      break;
    case 'none':
      break;
  }

  // Extras.
  if (shape.extras.includes('trunk')) {
    out.push({ id: 'trunk', shape: 'capsule', position: [0, headY - r * 0.55, face + r * 0.05], scale: [r * 0.17, r * 0.7, r * 0.17], rotation: [0.5, 0, 0], role: 'main' });
  }
  if (shape.extras.includes('horn')) {
    out.push({ id: 'horn', shape: 'cone', position: [0, headY + r * 1.2, r * 0.3], scale: [r * 0.2, r * 0.95, r * 0.2], rotation: [0.3, 0, 0], role: 'horn' });
  }
  if (shape.extras.includes('mane')) {
    for (let i = 0; i < 4; i++) {
      out.push({ id: `mane-${i}`, shape: 'sphere', position: [0, headY + r * (0.8 - i * 0.45), -r * (0.55 + i * 0.12)], scale: [r * 0.22, r * 0.22, r * 0.22], role: 'accent' });
    }
  }
  if (shape.extras.includes('spikes')) {
    // A ridge of spikes from the top of the head down the back, so it reads from the front too.
    const ridge: Array<[number, number, number]> = [
      [headY + r * 0.95, r * 0.1, 0.2],
      [headY + r * 0.55, -r * 0.65, -0.5],
      [bodyY * 1.75, back * 0.75, -0.9],
      [bodyY * 1.25, back * 1.02, -1.3],
    ];
    ridge.forEach(([y, z, tilt], i) => {
      out.push({ id: `spike-${i}`, shape: 'cone', position: [0, y, z], scale: [0.075, 0.17, 0.05], rotation: [tilt, 0, 0], role: 'dark' });
    });
  }
  if (shape.extras.includes('bellyPatch')) {
    out.push({ id: 'belly', shape: 'sphere', position: [0, bodyY * 0.95, body[2] * 0.55], scale: [body[0] * 0.7, body[1] * 0.75, body[2] * 0.5], role: 'accent' });
  }

  // Accessory.
  if (d.accessory === 'scarf') {
    out.push({ id: 'scarf', shape: 'torus', position: [0, bodyY * 1.85, 0], scale: [body[0] * 0.75, body[0] * 0.75, body[0] * 0.75], rotation: [Math.PI / 2, 0, 0], role: 'accessory' });
    out.push({ id: 'scarfTail', shape: 'capsule', position: [body[0] * 0.35, bodyY * 1.45, body[2] * 0.85], scale: [0.04, 0.09, 0.015], rotation: [0.2, 0, 0.2], role: 'accessory' });
  }
  if (d.accessory === 'bow') {
    const bx = r * 0.55;
    const by = headY + r * 0.8;
    pair(out, 'bowLoop', { shape: 'sphere', position: [bx + r * 0.16, by, r * 0.3], scale: [r * 0.18, r * 0.12, r * 0.08], role: 'accessory' });
    // Mirror trick: pair() mirrors around x=0, so shift the right loop back next to the knot.
    const loops = out.slice(-2);
    loops[0].position = [bx - r * 0.16, by, r * 0.3];
    out.push({ id: 'bowKnot', shape: 'sphere', position: [bx, by, r * 0.32], scale: [r * 0.07, r * 0.07, r * 0.07], role: 'accessory' });
  }

  return out;
}
