import React from 'react';
import { RigidBody } from '@react-three/rapier';
import { EnergyReactor } from '../../components/3d/EnergyReactor';
import { InteractionZone } from '../../components/3d/InteractionZone';

export const HeliosReactor = () => {
  return (
    <group position={[0, 0, 50]}>
      {/* District Base */}
      <RigidBody type="fixed" colliders="cuboid" position={[0, -0.5, 0]}>
        <mesh receiveShadow>
          <cylinderGeometry args={[20, 20, 1, 32]} />
          <meshStandardMaterial color="#100505" metalness={0.8} roughness={0.2} />
        </mesh>
      </RigidBody>
      
      {/* The Reactor Core */}
      <EnergyReactor position={[0, 4, 0]} />
      
      {/* Interaction Zone for Contact */}
      <InteractionZone id="contact-core" position={[0, 0, 10]} radius={5} label="TRANSMIT MESSAGE" />

      {/* Pathway from Spawn */}
      <RigidBody type="fixed" colliders="cuboid" position={[0, -0.6, -25]}>
        <mesh receiveShadow>
          <boxGeometry args={[4, 1, 10]} />
          <meshStandardMaterial color="#FF5F1F" metalness={0.8} />
        </mesh>
      </RigidBody>
    </group>
  );
};
