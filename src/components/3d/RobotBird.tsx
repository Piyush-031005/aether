import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';

export const RobotBird = () => {
  const birdRef = useRef<THREE.Group>(null);
  const wingsRef = useRef<THREE.Mesh>(null);
  const { hasVisitedBefore, markVisited } = useGameStore();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    if (hasVisitedBefore) {
      setGreeting('Welcome back, Engineer.');
    } else {
      setGreeting('Welcome, Engineer. Follow me.');
      markVisited();
    }
  }, [hasVisitedBefore, markVisited]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (birdRef.current) {
      // Bobbing up and down
      birdRef.current.position.y = 1.5 + Math.sin(t * 2) * 0.2;
      // Slight rotation
      birdRef.current.rotation.y = Math.sin(t * 0.5) * 0.5;
    }

    if (wingsRef.current) {
      // Flapping wings
      wingsRef.current.rotation.z = Math.sin(t * 15) * 0.5;
    }
  });

  return (
    <group ref={birdRef} position={[2, 0, -5]}>
      {/* Bird Body (Core) */}
      <mesh castShadow>
        <octahedronGeometry args={[0.2]} />
        <meshStandardMaterial color="#00BCD4" emissive="#00BCD4" emissiveIntensity={2} />
      </mesh>
      
      {/* Wings */}
      <mesh ref={wingsRef} position={[0, 0.1, 0]}>
        <boxGeometry args={[0.8, 0.02, 0.2]} />
        <meshStandardMaterial color="#E0E0E0" metalness={0.8} />
      </mesh>

      {/* Greeting Bubble */}
      <Html position={[0, 0.5, 0]} center distanceFactor={10} zIndexRange={[100, 0]}>
        <div style={{
          background: 'rgba(10, 10, 10, 0.8)',
          border: '1px solid var(--color-primary)',
          padding: '8px 12px',
          color: 'var(--color-text-main)',
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          whiteSpace: 'nowrap',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          pointerEvents: 'none'
        }}>
          {greeting}
        </div>
      </Html>
    </group>
  );
};
