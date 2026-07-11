import React from 'react';
import { Sky, Environment, Stars } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';

import { CharacterController } from './CharacterController';
import { BioTree } from '../components/3d/BioTree';
import { EnergyReactor } from '../components/3d/EnergyReactor';

export const VerticalSlice = () => {
  return (
    <>
      {/* Atmosphere */}
      <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <fog attach="fog" args={['#0A0A0A', 10, 50]} />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1.5} color="#FF5F1F" castShadow />

      {/* The 25x25m Playable Slice Floor */}
      <RigidBody type="fixed" colliders="cuboid" position={[0, -0.5, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[25, 1, 25]} />
          <meshStandardMaterial color="#0A0A0A" metalness={0.2} roughness={0.8} />
        </mesh>
      </RigidBody>

      {/* Grid Overlay on the floor to maintain the Blueprint/Engineering feel */}
      <gridHelper args={[25, 25, '#00BCD4', '#FF5F1F']} position={[0, 0.01, 0]} />

      {/* Props */}
      <BioTree position={[-5, 0, -5]} />
      <EnergyReactor position={[5, 0, -5]} />

      {/* Player */}
      <CharacterController />
    </>
  );
};
