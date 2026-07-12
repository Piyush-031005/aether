import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export const DeveloperDesk = () => {
  const monitorRef = useRef<THREE.Mesh>(null);

  // Gentle floating animation for the holographic code
  useFrame((state) => {
    if (monitorRef.current) {
      const mat = monitorRef.current.material as THREE.MeshPhysicalMaterial;
      mat.emissiveIntensity = 2 + Math.sin(state.clock.elapsedTime * 5) * 0.5;
    }
  });

  return (
    <group position={[-90, 0, -90]} rotation={[0, Math.PI / 4, 0]}>
      {/* Hidden Cave Area / Developer Nook */}
      <mesh position={[0, 5, -5]}>
        <boxGeometry args={[20, 10, 2]} />
        <meshStandardMaterial color="#050510" />
      </mesh>
      
      <mesh position={[-10, 5, 5]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[20, 10, 2]} />
        <meshStandardMaterial color="#050510" />
      </mesh>

      {/* The Desk */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[6, 0.2, 3]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Desk Legs */}
      <mesh position={[-2.8, 1, -1.3]}><boxGeometry args={[0.2, 2, 0.2]} /><meshStandardMaterial color="#222" /></mesh>
      <mesh position={[2.8, 1, -1.3]}><boxGeometry args={[0.2, 2, 0.2]} /><meshStandardMaterial color="#222" /></mesh>
      <mesh position={[-2.8, 1, 1.3]}><boxGeometry args={[0.2, 2, 0.2]} /><meshStandardMaterial color="#222" /></mesh>
      <mesh position={[2.8, 1, 1.3]}><boxGeometry args={[0.2, 2, 0.2]} /><meshStandardMaterial color="#222" /></mesh>

      {/* CRT Monitor */}
      <mesh position={[0, 3, -0.5]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[2, 1.5, 1]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      
      {/* Monitor Screen (Glowing) */}
      <mesh ref={monitorRef} position={[0, 3, 0.05]} rotation={[-0.1, 0, 0]}>
        <planeGeometry args={[1.8, 1.3]} />
        <meshPhysicalMaterial color="#00BCD4" emissive="#00BCD4" emissiveIntensity={2} />
      </mesh>

      {/* Coffee Mug */}
      <mesh position={[1.5, 2.3, 0.5]}>
        <cylinderGeometry args={[0.2, 0.2, 0.5, 16]} />
        <meshStandardMaterial color="#fff" />
      </mesh>

      {/* Easter Egg Developer Text */}
      <Text
        position={[0, 3, 0.1]}
        rotation={[-0.1, 0, 0]}
        fontSize={0.15}
        color="#ffffff"
        font="/fonts/Inter-Bold.woff"
        maxWidth={1.6}
        textAlign="center"
      >
        {`VERSION 0.1 LOOKED TERRIBLE\nKEEP BUILDING\n- THE ARCHITECT`}
      </Text>

      {/* Subtle desk light */}
      <pointLight position={[0, 4, 1]} color="#00BCD4" intensity={2} distance={10} />
    </group>
  );
};
