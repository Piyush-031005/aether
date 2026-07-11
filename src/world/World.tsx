import React from 'react';
import { Sky, Stars } from '@react-three/drei';

import { CharacterController } from './CharacterController';
import { SkyFoundry } from './districts/SkyFoundry';
import { VerdantCircuit } from './districts/VerdantCircuit';
import { ForgeNexus } from './districts/ForgeNexus';
import { MemoryVault } from './districts/MemoryVault';
import { HeliosReactor } from './districts/HeliosReactor';
import { EnergyGrid } from './EnergyGrid';
import { DataMonoliths } from './DataMonoliths';
import { OnePieceEasterEgg } from '../components/3d/OnePieceEasterEgg';

export const World = () => {
  return (
    <>
      <Sky sunPosition={[100, 20, 100]} turbidity={0.1} rayleigh={0.1} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Universal Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={1.5} 
        castShadow 
        shadow-mapSize={[2048, 2048]} 
      />

      {/* The Unified Cyber-Grid Floor */}
      <EnergyGrid />
      
      {/* Procedural World Population */}
      <DataMonoliths />
      
      <SkyFoundry />        {/* Spawn: [0, 0, 0] */}
      <VerdantCircuit />    {/* Projects: [0, 0, -50] */}
      <ForgeNexus />        {/* Skills: [-50, 0, 0] */}
      <MemoryVault />       {/* History: [50, 0, 0] */}
      <HeliosReactor />     {/* Contact: [0, 0, 50] */}

      {/* The Hidden Easter Egg */}
      <OnePieceEasterEgg />

      {/* Player Character */}
      <CharacterController />
    </>
  );
};
