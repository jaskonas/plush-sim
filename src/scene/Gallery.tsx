// Dev page: every animal in every style, side by side. Open the game with ?gallery.
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Plush } from './Plush';
import { ANIMAL_IDS, COLOUR_IDS, STYLE_IDS } from '../sim/catalog/ids';
import { DEFAULT_DESIGN } from '../sim/design';

export function Gallery() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 3.4, 10.5], fov: 40 }}>
        <color attach="background" args={['#fbf4ee']} />
        <hemisphereLight args={['#fff8f0', '#e8d6c8', 1]} />
        <directionalLight position={[3, 5, 6]} intensity={1.5} />
        {ANIMAL_IDS.map((animal, i) =>
          STYLE_IDS.map((style, j) => (
            <group key={`${animal}-${style}`} position={[(i - 4) * 1.1, (1.5 - j) * 1.3, 0]}>
              <Plush
                design={{
                  ...DEFAULT_DESIGN,
                  animal,
                  style,
                  colour: COLOUR_IDS[i % COLOUR_IDS.length],
                  eyes: j === 2 ? 'buttons' : j === 1 ? 'safety' : 'embroidered',
                  accessory: j === 3 ? 'scarf' : j === 1 ? 'bow' : 'none',
                }}
              />
            </group>
          )),
        )}
        <OrbitControls target={[0, 0.4, 0]} />
      </Canvas>
    </div>
  );
}
