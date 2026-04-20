import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';
import CoffeeBean from './CoffeeBean';
import ParticleFlow from './ParticleFlow';
import { useGameState } from '../hooks/useGameState';

function CameraRig() {
  const { state } = useGameState();
  const currentDist = useRef(6);
  const currentY = useRef(0);

  useFrame(({ camera }, delta) => {
    const target = state.cameraTarget;
    currentDist.current += (target.distance - currentDist.current) * delta * 1.5;
    currentY.current += (target.y - currentY.current) * delta * 1.5;

    const time = Date.now() * 0.0001;
    const x = Math.sin(time) * currentDist.current * 0.3;
    const z = Math.cos(time) * currentDist.current;
    camera.position.set(x, currentY.current + 1, z);
    camera.lookAt(0, currentY.current, 0);
  });

  return null;
}

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.3} color="#fef3c7" />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#fff7ed" castShadow />
      <pointLight position={[-3, 2, -3]} intensity={0.5} color="#f59e0b" />
      <pointLight position={[3, -2, 3]} intensity={0.3} color="#4ade80" />
    </>
  );
}

export default function CoffeeScene() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 1, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#0a0a0a']} />
        <fog attach="fog" args={['#0a0a0a', 8, 20]} />
        <CameraRig />
        <SceneLights />
        <CoffeeBean />
        <ParticleFlow />
        <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={0.5} />
        <Environment preset="sunset" environmentIntensity={0.2} />
      </Canvas>
    </div>
  );
}
