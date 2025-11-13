'use client';

import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { ForestMountainScene } from './ForestMountainScene';

const ANIMATION_DURATION = 5;

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function CameraRig({ onComplete }: { onComplete?: () => void }) {
  const { camera } = useThree();
  const completedRef = useRef(false);
  const lookTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
    const eased = easeInOutCubic(progress);

    const radius = THREE.MathUtils.lerp(9, 2, eased);
    const angle = eased * Math.PI * 0.75;

    camera.position.x = Math.sin(angle) * radius * 0.6;
    camera.position.y = THREE.MathUtils.lerp(1.2, 2.8, eased) + Math.sin(elapsed * 0.7) * 0.05;
    camera.position.z = THREE.MathUtils.lerp(10, -3.5, eased);

    lookTarget.set(
      THREE.MathUtils.lerp(0, 0, eased),
      THREE.MathUtils.lerp(0.6, 1.6, eased),
      THREE.MathUtils.lerp(-4, -10, eased)
    );
    camera.lookAt(lookTarget);

    if (progress >= 1 && !completedRef.current) {
      completedRef.current = true;
      onComplete?.();
    }
  });

  return null;
}

interface SceneCanvasProps {
  onAnimationComplete?: () => void;
}

export function SceneCanvas({ onAnimationComplete }: SceneCanvasProps) {
  return (
    <Canvas gl={{ antialias: true, alpha: true }} shadows style={{ width: '100%', height: '100%' }}>
      <Suspense fallback={null}>
        <PerspectiveCamera makeDefault position={[0, 1.2, 10]} fov={55} />
        <CameraRig onComplete={onAnimationComplete} />
        <ForestMountainScene animationDuration={ANIMATION_DURATION} />
      </Suspense>
    </Canvas>
  );
}
