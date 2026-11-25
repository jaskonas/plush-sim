import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, type Group } from 'three';
import { plushParts, type Part } from './plushParts';
import { fabricMaterial } from './fabricMaterial';
import { COLOURS } from '../sim/catalog/materials';
import type { Design } from '../sim/design';

/** How big each size looks on the stage (true scale would make small toys tiny). */
export const VIEW_SCALE = { small: 0.72, medium: 1, large: 1.3 } as const;

const ACCESSORY_COLOUR = '#d6456b';

function Geometry({ shape }: { shape: Part['shape'] }) {
  switch (shape) {
    case 'sphere':
      return <sphereGeometry args={[1, 32, 24]} />;
    case 'capsule':
      // Unit-radius capsule whose straight part is 1 long; scaled per part.
      return <capsuleGeometry args={[1, 1, 8, 16]} />;
    case 'cone':
      return <coneGeometry args={[1, 1, 20]} />;
    case 'disc':
      return <cylinderGeometry args={[1, 1, 1, 24]} />;
    case 'torus':
      return <torusGeometry args={[1, 0.22, 10, 32]} />;
  }
}

export interface PlushProps {
  design: Design;
  /** Hide the eyes (used while it's being sewn). */
  hideEyes?: boolean;
  /** Flatten and spread parts like cut-out pattern pieces: 1 = fully flat, 0 = sewn. */
  flatten?: number;
  /** Overall puffiness while stuffing: 0.6 = limp, 1 = stuffed. */
  puff?: number;
}

export function Plush({ design, hideEyes = false, flatten = 0, puff = 1 }: PlushProps) {
  const group = useRef<Group>(null);
  const squishAt = useRef(-10);

  const parts = useMemo(
    () => plushParts(design),
    [design.animal, design.style, design.eyes, design.accessory], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const mat = fabricMaterial(design.fabric);
  const main = COLOURS[design.colour].hex;
  const accent = useMemo(() => '#' + new Color(main).lerp(new Color('#ffffff'), 0.45).getHexString(), [main]);
  const dark = useMemo(() => '#' + new Color(main).lerp(new Color('#000000'), 0.35).getHexString(), [main]);
  const sheenColour = useMemo(() => '#' + new Color(main).lerp(new Color('#ffffff'), 0.6).getHexString(), [main]);

  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    const t = clock.elapsedTime;
    if (squishAt.current === Number.POSITIVE_INFINITY) squishAt.current = t; // tapped since last frame
    const since = t - squishAt.current;
    const squish = since < 0.6 ? 0.16 * Math.exp(-since * 6) * Math.cos(since * 18) : 0;
    const base = VIEW_SCALE[design.size] * puff;
    g.scale.set(base * (1 + squish * 0.6), base * (1 - squish), base * (1 + squish * 0.6));
    g.position.y = Math.sin(t * 1.6) * 0.008;
  });

  const colourFor = (role: Part['role']) => {
    switch (role) {
      case 'main':
        return main;
      case 'accent':
        return accent;
      case 'dark':
        return dark;
      case 'eye':
        return '#1b1414';
      case 'nose':
        return '#3a2418';
      case 'accessory':
        return ACCESSORY_COLOUR;
      case 'horn':
        return '#e8c45a';
    }
  };

  return (
    <group
      ref={group}
      onPointerDown={(e) => {
        e.stopPropagation();
        squishAt.current = Number.POSITIVE_INFINITY; // the frame loop turns this into a start time
      }}
    >
      {parts.map((p, i) => {
        if (hideEyes && p.role === 'eye') return null;
        const fabricLike = p.role === 'main' || p.role === 'accent' || p.role === 'dark' || p.role === 'accessory';
        const spread = flatten * (i % 2 === 0 ? 1 : -1) * 0.25;
        const position: [number, number, number] = [p.position[0] + spread, p.position[1] * (1 - flatten * 0.6), p.position[2]];
        const scale: [number, number, number] = [p.scale[0], p.scale[1], p.scale[2] * (1 - flatten * 0.9)];
        return (
          <mesh key={p.id} position={position} rotation={p.rotation} scale={scale} castShadow receiveShadow>
            <Geometry shape={p.shape} />
            {fabricLike ? (
              <meshPhysicalMaterial
                color={colourFor(p.role)}
                roughness={mat.roughness}
                sheen={mat.sheen}
                sheenRoughness={mat.sheenRoughness}
                sheenColor={sheenColour}
              />
            ) : (
              <meshPhysicalMaterial
                color={colourFor(p.role)}
                roughness={p.role === 'eye' && design.eyes === 'safety' ? 0.08 : p.role === 'eye' && design.eyes === 'embroidered' ? 0.9 : 0.35}
                clearcoat={p.role === 'eye' && design.eyes === 'safety' ? 1 : 0}
              />
            )}
          </mesh>
        );
      })}
    </group>
  );
}
