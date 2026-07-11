import React from 'react';
import { RigidBody } from '@react-three/rapier';

export const ForgeNexus = () => {
  return (
    <group position={[-50, 0, 0]}>
      <RigidBody type="fixed" colliders="cuboid" position={[0, -0.5, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[35, 1, 35]} />
          <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
        </mesh>
      </RigidBody>
      
      {/* Abstract Forge Elements */}
      <mesh position={[0, 2, 0]} castShadow>
        <boxGeometry args={[4, 4, 4]} />
        <meshStandardMaterial color="#FF5F1F" wireframe />
      </mesh>
      
      <RigidBody type="fixed" colliders="cuboid" position={[20, -0.6, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[10, 1, 4]} />
          <meshStandardMaterial color="#00BCD4" metalness={0.5} />
        </mesh>
      </RigidBody>
    </group>
  );
};
