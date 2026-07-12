import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const FloatingAI = () => {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current || !coreRef.current || !ringRef.current) return;
    
    // Float gently
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.2 + 1.5;
    
    // Orbit around character
    groupRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 2;
    groupRef.current.position.z = Math.cos(state.clock.elapsedTime * 0.5) * 2;

    // Spin core and ring
    coreRef.current.rotation.y += 0.05;
    ringRef.current.rotation.x += 0.02;
    ringRef.current.rotation.z += 0.02;
  });

  return (
    <group ref={groupRef}>
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial color="#00FFFF" emissive="#00FFFF" emissiveIntensity={2} wireframe />
      </mesh>
      
      <mesh ref={ringRef}>
        <torusGeometry args={[0.4, 0.02, 16, 100]} />
        <meshStandardMaterial color="#FF5F1F" emissive="#FF5F1F" emissiveIntensity={1} />
      </mesh>
      
      <pointLight color="#00FFFF" intensity={0.5} distance={10} decay={2} />
    </group>
  );
};
