import React from 'react';
import { RigidBody } from '@react-three/rapier';
import { BioTree } from '../../components/3d/BioTree';

export const VerdantCircuit = () => {
  return (
    <group position={[0, 0, -50]}>
      {/* District Base */}
      <RigidBody type="fixed" colliders="cuboid" position={[0, -0.5, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[40, 1, 40]} />
          <meshStandardMaterial color="#051005" metalness={0.1} roughness={0.9} />
        </mesh>
      </RigidBody>
      
      {/* Forest Elements */}
      <BioTree position={[-5, 0, -5]} />
      <BioTree position={[8, 0, -12]} />
      <BioTree position={[-15, 0, 5]} />
      <BioTree position={[10, 0, 10]} />
      
      {/* Pathway from Spawn */}
      <RigidBody type="fixed" colliders="cuboid" position={[0, -0.6, 25]}>
        <mesh receiveShadow>
          <boxGeometry args={[4, 1, 10]} />
          <meshStandardMaterial color="#FF5F1F" metalness={0.8} />
        </mesh>
      </RigidBody>
    </group>
  );
};
