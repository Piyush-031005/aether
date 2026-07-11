import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RobotBird } from '../../components/3d/RobotBird';
import * as THREE from 'three';

export const SkyFoundry = () => {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Animated Teleportation Ring */}
      <mesh ref={ringRef} position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[10, 0.5, 16, 100]} />
        <meshStandardMaterial color="#FF5F1F" emissive="#FF5F1F" emissiveIntensity={1.5} wireframe />
      </mesh>

      {/* Inner Spawn Circle */}
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[10, 64]} />
        <meshBasicMaterial color="#000" opacity={0.8} transparent />
      </mesh>

      {/* NPC */}
      <RobotBird />
    </group>
  );
};
