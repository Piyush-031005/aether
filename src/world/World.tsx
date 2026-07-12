import React from 'react';
import { Sky, Stars } from '@react-three/drei';

import { SkySystem } from '../components/3d/SkySystem';
import { CharacterController } from './CharacterController';
import { SkyFoundry } from './districts/SkyFoundry';
import { VerdantCircuit } from './districts/VerdantCircuit';
import { ForgeNexus } from './districts/ForgeNexus';
import { MemoryVault } from './districts/MemoryVault';
import { HeliosReactor } from './districts/HeliosReactor';
import { NeuralSandbox } from './districts/NeuralSandbox';
import { EnergyGrid } from './EnergyGrid';
import { BiotechEnvironment } from './BiotechEnvironment';
import { OnePieceEasterEgg } from '../components/3d/OnePieceEasterEgg';

export const World = () => {
  return (
    <group>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Dynamic Time of Day System */}
      <SkySystem />
      
      {/* Fog for depth and atmosphere (controlled dynamically by SkySystem) */}
      <fogExp2 attach="fog" args={['#050510', 0.01]} />

      {/* The 150x150 Unified Cyber-Grid Floor */}
      <EnergyGrid />
      
      {/* The Biotech City Environment */}
      <BiotechEnvironment />
      
      <SkyFoundry />        {/* Spawn: [0, 0, 0] */}
      <VerdantCircuit />    {/* Projects: [0, 0, -50] */}
      <ForgeNexus />        {/* Skills: [-50, 0, 0] */}
      <MemoryVault />       {/* History: [50, 0, 0] */}
      <HeliosReactor />     {/* Contact: [0, 0, 50] */}
      <NeuralSandbox />     {/* Sandbox: [50, 0, -50] */}

      {/* The Hidden Easter Egg */}
      <OnePieceEasterEgg />

      {/* Player Character */}
      <CharacterController />
    </group>
  );
};
