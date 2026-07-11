import React from 'react';
import { RigidBody } from '@react-three/rapier';

export const SkyFoundry = () => {
  return (
    <group position={[0, 0, 0]}>
      <RigidBody type="fixed" colliders="cuboid" position={[0, -0.5, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[30, 1, 30]} />
          <meshStandardMaterial color="#0A0A0A" metalness={0.5} roughness={0.5} />
        </mesh>
      </RigidBody>
      
      {/* Spawn Ring */}
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2, 2.2, 32]} />
        <meshBasicMaterial color="#FF5F1F" />
      </mesh>
      
      <gridHelper args={[30, 30, '#00BCD4', '#0A0A0A']} position={[0, 0.01, 0]} />
    </group>
  );
};
