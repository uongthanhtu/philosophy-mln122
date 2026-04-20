import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameState } from '../hooks/useGameState';

const PARTICLE_COUNT = 4000;

/* GPU particle vertex shader */
const vertShader = `
attribute float aLife;
attribute float aSize;
attribute vec3 aVelocity;
attribute float aDelay;
uniform float uTime;
uniform float uSpeed;
uniform int uMode; // 0=idle, 1=flowIn, 2=spiral, 3=burst, 4=celebrate
uniform vec3 uColor;
varying float vAlpha;
varying vec3 vColor;

void main() {
  float t = mod(uTime * uSpeed + aDelay, aLife) / aLife;
  vec3 pos = position;

  if (uMode == 0) {
    // idle: gentle float
    pos += aVelocity * sin(uTime * 0.5 + aDelay) * 0.5;
    pos.y += sin(uTime * 0.3 + aDelay * 3.0) * 0.2;
  } else if (uMode == 1) {
    // flowIn: converge toward center
    vec3 target = vec3(0.0);
    pos = mix(position * 3.0, target, t);
    pos += aVelocity * (1.0 - t) * 0.3;
  } else if (uMode == 2) {
    // spiral: orbit around center
    float angle = uTime * uSpeed * 0.5 + aDelay * 6.28;
    float radius = length(position.xz) * (1.0 + 0.3 * sin(t * 3.14));
    pos.x = cos(angle) * radius;
    pos.z = sin(angle) * radius;
    pos.y = position.y + sin(uTime + aDelay) * 0.5;
  } else if (uMode == 3) {
    // burst: explode outward
    pos = aVelocity * t * 3.0;
    pos.y -= t * t * 1.0;
  } else {
    // celebrate: rise up with sparkle
    float angle = uTime * 0.8 + aDelay * 6.28;
    float radius = 0.5 + t * 2.0;
    pos.x = cos(angle) * radius;
    pos.z = sin(angle) * radius;
    pos.y = t * 4.0 - 2.0;
  }

  vAlpha = (1.0 - t) * 0.8;
  vColor = uColor;

  vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = aSize * (200.0 / -mvPos.z) * (0.5 + 0.5 * (1.0 - t));
  gl_Position = projectionMatrix * mvPos;
}`;

/* GPU particle fragment shader */
const fragShader = `
varying float vAlpha;
varying vec3 vColor;
void main() {
  float d = length(gl_PointCoord - vec2(0.5));
  if (d > 0.5) discard;
  float glow = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(vColor, vAlpha * glow);
}`;

const modeMap = { idle: 0, flowIn: 1, spiral: 2, burst: 3, celebrate: 4 };

export default function ParticleFlow() {
  const pointsRef = useRef();
  const { state } = useGameState();

  const { positions, velocities, lifetimes, sizes, delays } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const vel = new Float32Array(PARTICLE_COUNT * 3);
    const life = new Float32Array(PARTICLE_COUNT);
    const sz = new Float32Array(PARTICLE_COUNT);
    const del = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      // Random sphere distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.5 + Math.random() * 2;
      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = r * Math.cos(phi);

      vel[i3] = (Math.random() - 0.5) * 0.5;
      vel[i3 + 1] = (Math.random() - 0.5) * 0.5;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.5;

      life[i] = 2 + Math.random() * 4;
      sz[i] = 2 + Math.random() * 6;
      del[i] = Math.random() * 6;
    }
    return { positions: pos, velocities: vel, lifetimes: life, sizes: sz, delays: del };
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uSpeed: { value: 0.3 },
    uMode: { value: 0 },
    uColor: { value: new THREE.Color('#4ade80') },
  }), []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    uniforms.uTime.value += delta;
    uniforms.uSpeed.value += (state.beanVisuals.particleSpeed - uniforms.uSpeed.value) * delta * 3;
    uniforms.uMode.value = modeMap[state.beanVisuals.particleMode] ?? 0;
    uniforms.uColor.value.set(state.beanVisuals.particleColor);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={PARTICLE_COUNT} itemSize={3} />
        <bufferAttribute attach="attributes-aVelocity" array={velocities} count={PARTICLE_COUNT} itemSize={3} />
        <bufferAttribute attach="attributes-aLife" array={lifetimes} count={PARTICLE_COUNT} itemSize={1} />
        <bufferAttribute attach="attributes-aSize" array={sizes} count={PARTICLE_COUNT} itemSize={1} />
        <bufferAttribute attach="attributes-aDelay" array={delays} count={PARTICLE_COUNT} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertShader}
        fragmentShader={fragShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
