import { useEffect, type ReactNode } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Vector3 } from 'three';
import { ContactShadows, OrbitControls } from '@react-three/drei';

const TARGET = new Vector3(0, 0.42, 0);
/** Half the width and height of the space a large toy needs, in scene units. */
const HALF_W = 0.8;
const HALF_H = 0.85;

/** Backs the camera off until the whole toy fits, whatever shape the window is. */
function FitCamera() {
  const camera = useThree((s) => s.camera);
  const { width, height } = useThree((s) => s.size);
  useEffect(() => {
    if (!(camera instanceof PerspectiveCamera) || width === 0 || height === 0) return;
    const vHalf = Math.tan(((camera.fov / 2) * Math.PI) / 180);
    const hHalf = vHalf * (width / height);
    const distance = Math.max(HALF_H / vHalf, HALF_W / hHalf, 2.2);
    const dir = camera.position.clone().sub(TARGET).normalize();
    camera.position.copy(TARGET).addScaledVector(dir, distance);
    camera.updateProjectionMatrix();
  }, [camera, width, height]);
  return null;
}

/** The 3D stage: soft studio lights, a round floor, a contact shadow and an orbit camera. */
export function Stage({ children }: { children: ReactNode }) {
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [1.55, 0.9, 1.55], fov: 35 }}>
      <color attach="background" args={['#fbf4ee']} />
      <hemisphereLight args={['#fff8f0', '#e8d6c8', 0.9]} />
      <directionalLight position={[2, 3, 2.5]} intensity={1.6} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-2.5, 1.5, -1]} intensity={0.5} color="#ffe2ef" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} receiveShadow>
        <circleGeometry args={[1.2, 64]} />
        <meshStandardMaterial color="#f3e3d6" roughness={1} />
      </mesh>
      <ContactShadows position={[0, 0, 0]} opacity={0.45} scale={2.4} blur={2.4} far={1} />
      <FitCamera />
      {children}
      <OrbitControls enablePan={false} minDistance={1.1} maxDistance={7} target={[0, 0.42, 0]} maxPolarAngle={Math.PI / 2 - 0.05} />
    </Canvas>
  );
}
