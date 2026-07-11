import React from 'react';
import { RigidBody } from '@react-three/rapier';
import { EnergyReactor } from '../../components/3d/EnergyReactor';

export const HeliosReactor = () => {
  return (
    <group position={[0, 0, 50]}>
      {/* District Base */}
      <RigidBody type="fixed" colliders="cuboid" position={[0, -0.5, 0]}>
        <mesh receiveShadow>
          <cylinderGeometry args={[20, 20, 1, 32]} />
          <meshStandardMaterial color="#1A0A05" metalness={0.6} roughness={0.4} />
        </mesh>
      </RigidBody>
      
      {/* Main Energy Core */}
      <EnergyReactor position={[0, 0, 0]} />
      
      {/* Pathway from Spawn */}
      <RigidBody type="fixed" colliders="cuboid" position={[0, -0.6, -25]}>
        <mesh receiveShadow>
          <boxGeometry args={[4, 1, 10]} />
          <meshStandardMaterial color="#FFF200" metalness={0.8} />
        </mesh>
      </RigidBody>
    </group>
  );
};
