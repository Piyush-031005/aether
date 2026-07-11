import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';

interface EnergyReactorProps {
  position: [number, number, number];
}

export const EnergyReactor: React.FC<EnergyReactorProps> = ({ position }) => {
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 2;
      coreRef.current.position.y = 2 + Math.sin(t * 3) * 0.2;
    }
    
    if (ringRef1.current && ringRef2.current) {
      ringRef1.current.rotation.x = t;
      ringRef1.current.rotation.y = t * 1.5;
      
      ringRef2.current.rotation.x = -t * 1.2;
      ringRef2.current.rotation.z = t;
    }
  });

  return (
    <RigidBody type="fixed" colliders="trimesh" position={position}>
      <group>
        {/* Base Platform */}
        <mesh position={[0, 0.25, 0]} receiveShadow>
          <cylinderGeometry args={[2, 2.5, 0.5, 8]} />
          <meshStandardMaterial color="#121820" metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* Outer Containment Rings */}
        <mesh ref={ringRef1} position={[0, 2, 0]}>
          <torusGeometry args={[1.2, 0.05, 16, 100]} />
          <meshStandardMaterial color="#FF5F1F" emissive="#FF5F1F" emissiveIntensity={2} />
        </mesh>
        
        <mesh ref={ringRef2} position={[0, 2, 0]}>
          <torusGeometry args={[1.5, 0.05, 16, 100]} />
          <meshStandardMaterial color="#FFF200" emissive="#FFF200" emissiveIntensity={1.5} />
        </mesh>

        {/* Energy Core */}
        <mesh ref={coreRef} position={[0, 2, 0]} castShadow>
          <octahedronGeometry args={[0.5]} />
          <meshStandardMaterial color="#00BCD4" emissive="#00BCD4" emissiveIntensity={4} />
        </mesh>

        {/* Point light to illuminate surrounding area */}
        <pointLight position={[0, 2, 0]} intensity={20} color="#00BCD4" distance={10} decay={2} />
      </group>
    </RigidBody>
  );
};
