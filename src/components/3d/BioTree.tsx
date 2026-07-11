import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';

interface BioTreeProps {
  position: [number, number, number];
}

export const BioTree: React.FC<BioTreeProps> = ({ position }) => {
  const leavesRef = useRef<THREE.Mesh>(null);

  // Subtle breathing/energy animation for the leaves
  useFrame((state) => {
    if (leavesRef.current) {
      leavesRef.current.position.y = 2.5 + Math.sin(state.clock.elapsedTime) * 0.1;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
      leavesRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <RigidBody type="fixed" colliders="hull" position={position}>
      <group>
        {/* Mechanical Trunk */}
        <mesh position={[0, 1, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.2, 0.4, 2]} />
          <meshStandardMaterial color="#121820" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Glowing Energy Veins on Trunk */}
        <mesh position={[0, 1.01, 0]}>
          <cylinderGeometry args={[0.21, 0.41, 2]} />
          <meshStandardMaterial color="#00BCD4" emissive="#00BCD4" emissiveIntensity={2} wireframe />
        </mesh>

        {/* Floating Cybernetic Leaves */}
        <mesh ref={leavesRef} position={[0, 2.5, 0]} castShadow>
          <icosahedronGeometry args={[1.5, 1]} />
          <meshStandardMaterial 
            color="#FF5F1F" 
            emissive="#FF5F1F" 
            emissiveIntensity={0.5} 
            transparent 
            opacity={0.8} 
            wireframe 
          />
        </mesh>
      </group>
    </RigidBody>
  );
};
