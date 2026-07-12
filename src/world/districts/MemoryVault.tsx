import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { InteractionZone } from '../../components/3d/InteractionZone';
import * as THREE from 'three';

export const MemoryVault = () => {
  const shardsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (shardsRef.current) {
      // Gentle floating animation for the monoliths
      shardsRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
    }
  });

  return (
    <group position={[50, 0, 0]}>
      {/* Pedestal */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[20, 1, 20]} />
        <meshStandardMaterial color="#000" metalness={1} roughness={0} />
      </mesh>

      {/* Floating Obsidian Shards */}
      <group ref={shardsRef}>
        <mesh castShadow receiveShadow position={[-6, 8, -6]} rotation={[0.1, 0.5, 0.1]}>
          <octahedronGeometry args={[5, 0]} />
          <meshPhysicalMaterial color="#111" transmission={0.9} thickness={5} roughness={0.1} />
        </mesh>
        
        <mesh castShadow receiveShadow position={[8, 12, 4]} rotation={[-0.2, -0.8, -0.1]}>
          <octahedronGeometry args={[8, 0]} />
          <meshPhysicalMaterial color="#050505" transmission={0.9} thickness={8} roughness={0.1} />
        </mesh>

        <mesh castShadow receiveShadow position={[0, 6, 8]} rotation={[0, 0, 0.2]}>
          <octahedronGeometry args={[3, 0]} />
          <meshPhysicalMaterial color="#222" transmission={0.9} thickness={3} roughness={0.1} />
        </mesh>
      </group>
      
      {/* Interaction Zone for About Me & History */}
      <InteractionZone id="about-vault" position={[0, 1, 0]} radius={5} label="ACCESS DATABANKS" />
    </group>
  );
};
