import React, { useRef } from 'react';
import { useGLTF, Trail } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const TheArchitect = () => {
  // Load the user's GLB model
  const { scene } = useGLTF('/models/me.glb');
  const boardRef = useRef<THREE.Group>(null);
  const exhaustRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (boardRef.current) {
      // Hoverboard subtle procedural bobbing and engine vibration
      boardRef.current.position.y = Math.sin(t * 3) * 0.05 - 0.5;
      
      // Slight tilt forward to imply movement readiness
      boardRef.current.rotation.x = Math.sin(t * 1.5) * 0.02;
    }
    
    if (exhaustRef.current) {
      // Pulsing energy exhaust
      exhaustRef.current.intensity = 2 + Math.sin(t * 15) * 0.5;
    }
  });

  return (
    <group position={[0, -0.5, 0]}>
      {/* The Character Model — upright, no tilt */}
      <primitive 
        object={scene} 
        scale={1}
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
        castShadow 
      />

      {/* Procedural Biomechanical Hoverboard */}
      <group ref={boardRef}>
        {/* Main Board Body */}
        <mesh castShadow receiveShadow position={[0, -0.1, 0]}>
          <boxGeometry args={[0.6, 0.1, 1.8]} />
          <meshStandardMaterial color="#111" metalness={0.9} roughness={0.2} />
        </mesh>
        
        {/* Edge Highlights */}
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[0.62, 0.08, 1.82]} />
          <meshStandardMaterial color="#FFF200" emissive="#FFF200" emissiveIntensity={0.8} wireframe />
        </mesh>

        {/* Underglow so the board is visible in the dark */}
        <pointLight color="#00BCD4" position={[0, -0.5, 0]} intensity={1} distance={3} decay={2} />

        {/* Engine Core (Rear) */}
        <mesh position={[0, -0.1, -0.8]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.2, 16]} />
          <meshStandardMaterial color="#FF5F1F" emissive="#FF5F1F" emissiveIntensity={2} />
        </mesh>

        {/* Energy Exhaust Light */}
        <pointLight ref={exhaustRef} color="#FF5F1F" position={[0, -0.2, -1]} distance={3} decay={2} />

        {/* Wind/Energy Trails for sense of speed */}
        <Trail
          width={0.5}
          length={4}
          color={new THREE.Color('#00BCD4')}
          attenuation={(t) => t * t}
        >
          {/* Invisible tracking mesh for the trail */}
          <mesh visible={false} position={[0, -0.1, -0.9]}>
            <sphereGeometry args={[0.1]} />
          </mesh>
        </Trail>
      </group>
    </group>
  );
};

// Preload the model so it caches immediately
useGLTF.preload('/models/me.glb');
