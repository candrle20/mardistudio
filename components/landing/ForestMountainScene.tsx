'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ForestMountainSceneProps {
  animationDuration: number;
}

// Simple mountain mesh
function Mountain({ position, scale, color }: { position: [number, number, number]; scale: [number, number, number]; color: string }) {
  return (
    <mesh position={position} scale={scale} castShadow receiveShadow>
      <coneGeometry args={[1, 2, 4]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

// Simple tree mesh
function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.08, 0.6, 8]} />
        <meshStandardMaterial color="#3d2817" />
      </mesh>
      {/* Foliage */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <coneGeometry args={[0.3, 0.6, 8]} />
        <meshStandardMaterial color="#1a5f3e" />
      </mesh>
      <mesh position={[0, 1.1, 0]} castShadow>
        <coneGeometry args={[0.25, 0.5, 8]} />
        <meshStandardMaterial color="#267f4d" />
      </mesh>
    </group>
  );
}

// Ground plane
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#3a5f4a" />
    </mesh>
  );
}

// Animated floating particles
function Particles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 100;
  
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = Math.random() * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#ffffff" transparent opacity={0.6} />
    </points>
  );
}

export function ForestMountainScene({ animationDuration }: ForestMountainSceneProps) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <hemisphereLight args={['#87ceeb', '#3a5f4a', 0.5]} />

      {/* Ground */}
      <Ground />

      {/* Mountains */}
      <Mountain position={[-3, 1, -12]} scale={[3, 4, 3]} color="#4a6b5c" />
      <Mountain position={[2, 1.5, -15]} scale={[4, 5, 4]} color="#3d5a4d" />
      <Mountain position={[5, 1, -10]} scale={[2.5, 3.5, 2.5]} color="#5a7a6b" />
      <Mountain position={[-6, 1.2, -14]} scale={[3.5, 4.5, 3.5]} color="#42655a" />

      {/* Trees - scattered forest */}
      <Tree position={[-2, 0, -4]} />
      <Tree position={[1.5, 0, -3.5]} />
      <Tree position={[-0.5, 0, -5]} />
      <Tree position={[3, 0, -6]} />
      <Tree position={[-3.5, 0, -5.5]} />
      <Tree position={[2, 0, -7]} />
      <Tree position={[-1, 0, -6.5]} />
      <Tree position={[4, 0, -4.5]} />
      <Tree position={[-4, 0, -7]} />
      <Tree position={[0.5, 0, -8]} />

      {/* Floating particles */}
      <Particles />

      {/* Fog for depth */}
      <fog attach="fog" args={['#87ceeb', 8, 25]} />
    </>
  );
}

