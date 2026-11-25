import type { ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, OrbitControls } from '@react-three/drei';

/** The 3D stage: soft studio lights, a round floor, a contact shadow and an orbit camera. */
export function Stage({ children }: { children: ReactNode }) {
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [0.9, 0.85, 2.1], fov: 35 }}>
      <color attach="background" args={['#fbf4ee']} />
      <hemisphereLight args={['#fff8f0', '#e8d6c8', 0.9]} />
      <directionalLight position={[2, 3, 2.5]} intensity={1.6} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-2.5, 1.5, -1]} intensity={0.5} color="#ffe2ef" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} receiveShadow>
        <circleGeometry args={[1.2, 64]} />
        <meshStandardMaterial color="#f3e3d6" roughness={1} />
      </mesh>
      <ContactShadows position={[0, 0, 0]} opacity={0.45} scale={2.4} blur={2.4} far={1} />
      {children}
      <OrbitControls enablePan={false} minDistance={1.1} maxDistance={4} target={[0, 0.42, 0]} maxPolarAngle={Math.PI / 2 - 0.05} />
    </Canvas>
  );
}
