import React from 'react';
import { BioTree } from '../../components/3d/BioTree';
import { InteractionZone } from '../../components/3d/InteractionZone';

export const VerdantCircuit = () => {
  return (
    <group position={[0, 0, -50]}>
      {/* Floating Holographic Rings over the Data Center */}
      <mesh position={[0, 15, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[12, 0.2, 16, 100]} />
        <meshStandardMaterial color="#00BCD4" emissive="#00BCD4" emissiveIntensity={2} wireframe />
      </mesh>
      
      {/* Glass Data Core Base */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[15, 15, 0.5, 32]} />
        <meshPhysicalMaterial 
          color="#051005" 
          metalness={0.9} 
          roughness={0.1} 
          transmission={0.5} 
          thickness={2} 
        />
      </mesh>
      
      {/* Forest Elements */}
      <BioTree position={[-5, 0.25, -5]} />
      <BioTree position={[8, 0.25, -12]} />
      <BioTree position={[-15, 0.25, 5]} />
      <BioTree position={[10, 0.25, 10]} />
      
      {/* Interaction Zone for Projects */}
      <InteractionZone id="project-1" position={[-5, 0.25, -2]} radius={3} label="ACCESS DATABANK" />
    </group>
  );
};
