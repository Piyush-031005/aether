import React from 'react';
import { Sky, Stars } from '@react-three/drei';

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
      <Sky sunPosition={[100, 20, 100]} turbidity={0.1} rayleigh={0.1} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Dynamic Lighting */}
      <ambientLight intensity={0.2} color="#ffffff" />
      <directionalLight position={[10, 20, 10]} intensity={1.5} color="#FF5F1F" castShadow />
      
      {/* Fog for depth and atmosphere */}
      <fog attach="fog" args={['#0A0A0A', 20, 100]} />

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
