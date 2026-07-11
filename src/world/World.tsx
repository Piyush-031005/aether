import React from 'react';
import { Sky, Stars } from '@react-three/drei';

import { CharacterController } from './CharacterController';
import { SkyFoundry } from './districts/SkyFoundry';
import { VerdantCircuit } from './districts/VerdantCircuit';
import { ForgeNexus } from './districts/ForgeNexus';
import { MemoryVault } from './districts/MemoryVault';
import { HeliosReactor } from './districts/HeliosReactor';

export const World = () => {
  return (
    <>
      {/* Atmosphere & Lighting */}
      <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} />
      <Stars radius={150} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <fog attach="fog" args={['#0A0A0A', 15, 80]} />
      
      <ambientLight intensity={0.4} />
      <directionalLight position={[20, 30, 20]} intensity={1.5} color="#FF5F1F" castShadow />

      {/* The 5 Core Districts */}
      <SkyFoundry />        {/* Spawn: [0, 0, 0] */}
      <VerdantCircuit />    {/* Projects: [0, 0, -50] */}
      <ForgeNexus />        {/* Skills: [-50, 0, 0] */}
      <MemoryVault />       {/* History: [50, 0, 0] */}
      <HeliosReactor />     {/* Core: [0, 0, 50] */}

      {/* Player Character */}
      <CharacterController />
    </>
  );
};
