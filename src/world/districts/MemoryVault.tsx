import React from 'react';
import { RigidBody } from '@react-three/rapier';
import { InteractionZone } from '../../components/3d/InteractionZone';

export const MemoryVault = () => {
  return (
    <group position={[50, 0, 0]}>
      <RigidBody type="fixed" colliders="cuboid" position={[0, -0.5, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[45, 1, 45]} />
          <meshStandardMaterial color="#000510" metalness={0.9} roughness={0.1} />
        </mesh>
      </RigidBody>
      
      {/* Monoliths */}
      <RigidBody type="fixed" position={[-10, 5, -10]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4, 10, 4]} />
          <meshStandardMaterial color="#222" emissive="#00BCD4" emissiveIntensity={0.2} />
        </mesh>
      </RigidBody>
      
      <RigidBody type="fixed" position={[10, 7, 5]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[6, 14, 6]} />
          <meshStandardMaterial color="#111" emissive="#00BCD4" emissiveIntensity={0.1} />
        </mesh>
      </RigidBody>
      
      {/* Interaction Zone for History */}
      <InteractionZone id="history-vault" position={[0, 0, 0]} radius={5} label="READ TIMELINE" />

      <RigidBody type="fixed" colliders="cuboid" position={[-25, -0.6, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[10, 1, 4]} />
          <meshStandardMaterial color="#00BCD4" metalness={0.5} />
        </mesh>
      </RigidBody>
    </group>
  );
};
