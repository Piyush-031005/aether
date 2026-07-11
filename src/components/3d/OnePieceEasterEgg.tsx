import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { InteractionZone } from './InteractionZone';
import * as THREE from 'three';

export const OnePieceEasterEgg = () => {
  const poneglyphRef = useRef<THREE.Mesh>(null);
  const hologramRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    // Floating animation for the Poneglyph
    if (poneglyphRef.current) {
      poneglyphRef.current.position.y = Math.sin(t * 1.5) * 0.2 + 1;
    }

    // Slow rotation for the hologram
    if (hologramRef.current) {
      hologramRef.current.rotation.y = t * 0.5;
    }
  });

  return (
    <group position={[0, 0, -100]}> {/* Hidden far in the back of the map */}
      
      {/* The Cyber-Poneglyph */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh ref={poneglyphRef} position={[0, 1, 0]}>
          <boxGeometry args={[3, 4, 3]} />
          {/* A dark, ancient-looking obsidian material */}
          <meshStandardMaterial color="#050505" roughness={0.8} metalness={0.2} />
        </mesh>
        
        {/* Glowing engravings (represented by wireframe overlay) */}
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[3.05, 4.05, 3.05]} />
          <meshStandardMaterial color="#FF003C" emissive="#FF003C" emissiveIntensity={2} wireframe />
        </mesh>
      </RigidBody>

      {/* The Interaction Zone */}
      <InteractionZone id="secret-poneglyph" position={[0, 0, 5]} radius={6} label="READ PONEGLYPH" />

      {/* The Holographic Jolly Roger (Abstract representation using glowing spheres and cylinders) */}
      <group ref={hologramRef} position={[0, 15, 0]}>
        {/* Skull */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[2, 16, 16]} />
          <meshBasicMaterial color="#FF003C" wireframe transparent opacity={0.8} />
        </mesh>
        {/* Crossbones */}
        <mesh position={[0, 0, -1]} rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.2, 0.2, 6, 8]} />
          <meshBasicMaterial color="#FF003C" wireframe transparent opacity={0.6} />
        </mesh>
        <mesh position={[0, 0, -1]} rotation={[0, 0, -Math.PI / 4]}>
          <cylinderGeometry args={[0.2, 0.2, 6, 8]} />
          <meshBasicMaterial color="#FF003C" wireframe transparent opacity={0.6} />
        </mesh>
      </group>
      
      {/* Red ambient glow for the area */}
      <pointLight color="#FF003C" position={[0, 5, 0]} intensity={2} distance={30} decay={2} />
    </group>
  );
};
