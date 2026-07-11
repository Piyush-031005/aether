import React from 'react';
import { EnergyReactor } from '../../components/3d/EnergyReactor';
import { InteractionZone } from '../../components/3d/InteractionZone';

export const HeliosReactor = () => {
  return (
    <group position={[0, 0, 50]}>
      {/* Platform Pedestal */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[12, 14, 1, 64]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.8} />
      </mesh>

      {/* Floating Orbital Rings */}
      <mesh position={[0, 4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[14, 0.2, 16, 100]} />
        <meshStandardMaterial color="#FF5F1F" emissive="#FF5F1F" emissiveIntensity={1} wireframe />
      </mesh>
      
      {/* The Reactor Core */}
      <EnergyReactor position={[0, 4, 0]} />
      
      {/* Interaction Zone for Contact */}
      <InteractionZone id="contact-core" position={[0, 1, 10]} radius={5} label="TRANSMIT MESSAGE" />
    </group>
  );
};
