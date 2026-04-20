import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameState } from '../hooks/useGameState';

/* Fresnel glow vertex shader */
const glowVertexShader = `
varying vec3 vNormal;
varying vec3 vViewDir;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
  vViewDir = normalize(-mvPos.xyz);
  gl_Position = projectionMatrix * mvPos;
}`;

/* Fresnel glow fragment shader */
const glowFragShader = `
uniform float uIntensity;
uniform vec3 uColor;
uniform float uTime;
varying vec3 vNormal;
varying vec3 vViewDir;
void main() {
  float fresnel = pow(1.0 - dot(vNormal, vViewDir), 3.0);
  float pulse = 1.0 + 0.15 * sin(uTime * 2.0);
  float alpha = fresnel * uIntensity * pulse;
  gl_FragColor = vec4(uColor * fresnel * uIntensity * pulse * 1.5, alpha * 0.85);
}`;

export default function CoffeeBean() {
  const meshRef = useRef();
  const glowRef = useRef();
  const { state } = useGameState();
  const targetColor = useRef(new THREE.Color(state.beanVisuals.color));
  const currentColor = useRef(new THREE.Color(state.beanVisuals.color));
  const targetScale = useRef(state.beanVisuals.scale);
  const currentScale = useRef(state.beanVisuals.scale);

  // Procedural bean geometry using LatheGeometry
  const beanGeo = useMemo(() => {
    const points = [];
    const segments = 30;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const angle = t * Math.PI;
      // Bean profile: wider in middle, tapered at ends
      const r = 0.45 * Math.sin(angle) * (1 + 0.15 * Math.sin(angle * 2));
      const y = (t - 0.5) * 2.0;
      points.push(new THREE.Vector2(Math.max(r, 0.01), y));
    }
    const geo = new THREE.LatheGeometry(points, 32);
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Glow shader material
  const glowUniforms = useMemo(() => ({
    uIntensity: { value: 0 },
    uColor: { value: new THREE.Color('#4ade80') },
    uTime: { value: 0 },
  }), []);

  // Animate every frame
  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Smooth rotation
    meshRef.current.rotation.y += delta * 0.4;
    if (glowRef.current) glowRef.current.rotation.y = meshRef.current.rotation.y;

    // Smooth color transition
    targetColor.current.set(state.beanVisuals.color);
    currentColor.current.lerp(targetColor.current, delta * 2);
    meshRef.current.material.color.copy(currentColor.current);

    // Smooth scale
    targetScale.current = state.beanVisuals.scale;
    currentScale.current += (targetScale.current - currentScale.current) * delta * 2;
    const s = currentScale.current;
    meshRef.current.scale.set(s, s, s * 0.7); // Flatten Z for bean shape
    if (glowRef.current) glowRef.current.scale.set(s * 1.15, s * 1.15, s * 0.8);

    // Glow uniforms
    glowUniforms.uIntensity.value += (state.beanVisuals.glowIntensity - glowUniforms.uIntensity.value) * delta * 3;
    glowUniforms.uColor.value.set(state.beanVisuals.glowColor);
    glowUniforms.uTime.value += delta;
  });

  return (
    <group>
      {/* Main bean mesh */}
      <mesh ref={meshRef} geometry={beanGeo} castShadow>
        <meshStandardMaterial
          color={state.beanVisuals.color}
          roughness={0.4}
          metalness={0.1}
          envMapIntensity={0.8}
        />
      </mesh>
      {/* Glow shell */}
      <mesh ref={glowRef} geometry={beanGeo}>
        <shaderMaterial
          vertexShader={glowVertexShader}
          fragmentShader={glowFragShader}
          uniforms={glowUniforms}
          transparent
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
