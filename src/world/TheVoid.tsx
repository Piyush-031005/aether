import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, Grid } from '@react-three/drei';
import * as THREE from 'three';

export const TheVoid = () => {
  const dustRef = useRef<THREE.Points>(null);

  // Slowly rotate the floating dust for an eerie feeling
  useFrame((state) => {
    if (dustRef.current) {
      dustRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      dustRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <group>
      {/* Background color for the Void */}
      <color attach="background" args={['#0A0A0A']} />

      {/* Atmospheric Fog */}
      <fog attach="fog" args={['#0A0A0A', 5, 20]} />

      {/* Lighting */}
      <ambientLight intensity={0.2} color="#ffffff" />
      <directionalLight position={[0, 10, -5]} intensity={1.5} color="#FF5F1F" />

      {/* Blueprint Floor Grid */}
      <Grid 
        position={[0, -1.5, 0]} 
        args={[50, 50]} 
        cellSize={1} 
        cellThickness={1} 
        cellColor="#00BCD4" 
        sectionSize={5} 
        sectionThickness={1.5} 
        sectionColor="#FF5F1F" 
        fadeDistance={20} 
        fadeStrength={1} 
      />

      {/* Ambient Particle Dust */}
      <Sparkles
        ref={dustRef}
        count={500}
        scale={20}
        size={2}
        speed={0.2}
        opacity={0.5}
        color="#E0E0E0"
      />
    </group>
  );
};
