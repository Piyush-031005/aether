import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';

// Procedurally generate positions that avoid the spawn (0,0) and the 4 districts
const generateMonoliths = (count: number) => {
  const monoliths = [];
  const minDistance = 20; // Keep away from the center
  const gridSize = 140;

  for (let i = 0; i < count; i++) {
    let x = (Math.random() - 0.5) * gridSize;
    let z = (Math.random() - 0.5) * gridSize;
    
    // Resample if too close to center
    while (Math.sqrt(x*x + z*z) < minDistance) {
      x = (Math.random() - 0.5) * gridSize;
      z = (Math.random() - 0.5) * gridSize;
    }

    const width = 1 + Math.random() * 3;
    const height = 10 + Math.random() * 40;
    const depth = 1 + Math.random() * 3;
    const y = height / 2 - (Math.random() * 5); // Some float higher, some sink

    // Randomize whether it's a wireframe or solid monolith
    const isWireframe = Math.random() > 0.7;
    const color = Math.random() > 0.5 ? '#00BCD4' : '#FF5F1F';

    monoliths.push({
      position: [x, y, z] as [number, number, number],
      args: [width, height, depth] as [number, number, number],
      isWireframe,
      color,
      rotationSpeed: (Math.random() - 0.5) * 0.2
    });
  }
  return monoliths;
};

export const DataMonoliths = () => {
  const monolithData = useMemo(() => generateMonoliths(80), []);
  const groupRef = useRef<THREE.Group>(null);

  // Slowly bob all monoliths up and down
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 2;
    }
  });

  return (
    <group ref={groupRef}>
      {monolithData.map((monolith, idx) => (
        <RigidBody key={idx} type="fixed" colliders={false} position={monolith.position}>
          <CuboidCollider args={[monolith.args[0]/2, monolith.args[1]/2, monolith.args[2]/2]} />
          <mesh>
            <boxGeometry args={monolith.args} />
            {monolith.isWireframe ? (
              <meshStandardMaterial 
                color={monolith.color} 
                emissive={monolith.color} 
                emissiveIntensity={1} 
                wireframe 
                transparent 
                opacity={0.3} 
              />
            ) : (
              <meshStandardMaterial 
                color="#0a0a0a" 
                metalness={0.9} 
                roughness={0.1} 
              />
            )}
          </mesh>
          
          {/* Add a glowing core to the solid monoliths */}
          {!monolith.isWireframe && (
            <mesh position={[0, monolith.args[1]/2 + 0.5, 0]}>
              <boxGeometry args={[monolith.args[0] * 0.8, 0.5, monolith.args[2] * 0.8]} />
              <meshStandardMaterial color={monolith.color} emissive={monolith.color} emissiveIntensity={2} />
            </mesh>
          )}
        </RigidBody>
      ))}
    </group>
  );
};
