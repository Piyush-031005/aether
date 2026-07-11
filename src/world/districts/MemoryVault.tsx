import React from 'react';
import { RigidBody } from '@react-three/rapier';

export const MemoryVault = () => {
  return (
    <group position={[50, 0, 0]}>
      <RigidBody type="fixed" colliders="cuboid" position={[0, -0.5, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[30, 1, 50]} />
          <meshStandardMaterial color="#111" metalness={0.3} roughness={0.7} />
        </mesh>
      </RigidBody>
      
      {/* Abstract Memory Monoliths */}
      {[-10, 0, 10].map((z, i) => (
        <RigidBody key={i} type="fixed" colliders="cuboid" position={[0, 5, z]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[2, 10, 4]} />
            <meshStandardMaterial color="#E0E0E0" emissive="#00BCD4" emissiveIntensity={0.1} />
          </mesh>
        </RigidBody>
      ))}

      <RigidBody type="fixed" colliders="cuboid" position={[-17.5, -0.6, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[10, 1, 4]} />
          <meshStandardMaterial color="#E0E0E0" metalness={0.5} />
        </mesh>
      </RigidBody>
    </group>
  );
};
