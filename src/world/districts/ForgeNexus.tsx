import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { InteractionZone } from '../../components/3d/InteractionZone';
import * as THREE from 'three';

export const ForgeNexus = () => {
  const gyroRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (gyroRef.current) {
      gyroRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      gyroRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      gyroRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group position={[-50, 0, 0]}>
      {/* Abstract Forge Elements - Animated Gyroscope */}
      <group ref={gyroRef} position={[0, 8, 0]}>
        <mesh castShadow>
          <torusGeometry args={[8, 0.4, 16, 100]} />
          <meshStandardMaterial color="#FF5F1F" wireframe emissive="#FF5F1F" emissiveIntensity={0.5} />
        </mesh>
        <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[6, 0.6, 16, 100]} />
          <meshStandardMaterial color="#00BCD4" wireframe emissive="#00BCD4" emissiveIntensity={0.5} />
        </mesh>
        <mesh castShadow rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[4, 4, 4]} />
          <meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
      
      {/* Platform Pedestal */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[10, 12, 1, 32]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.8} />
      </mesh>

      {/* Interaction Zone for Skills */}
      <InteractionZone id="skills-forge" position={[0, 1.5, 6]} radius={4} label="FORGE SKILLS" />
    </group>
  );
};
