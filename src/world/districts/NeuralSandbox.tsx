import React, { useMemo, useRef } from 'react';
import { RigidBody } from '@react-three/rapier';
import { InteractionZone } from '../../components/3d/InteractionZone';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// Generate 50 physics cubes
const generateCubes = (count: number) => {
  const cubes = [];
  for (let i = 0; i < count; i++) {
    cubes.push({
      position: [
        (Math.random() - 0.5) * 15,
        2 + Math.random() * 10,
        (Math.random() - 0.5) * 15
      ] as [number, number, number],
      color: Math.random() > 0.5 ? '#00BCD4' : '#FF5F1F',
      scale: 0.5 + Math.random() * 1.5,
    });
  }
  return cubes;
};

export const NeuralSandbox = () => {
  const cubes = useMemo(() => generateCubes(50), []);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (coreRef.current) {
      coreRef.current.rotation.y = state.clock.elapsedTime;
      coreRef.current.rotation.x = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group position={[50, 0, -50]}>
      {/* Sandbox Floor Indicator */}
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[14, 15, 64]} />
        <meshBasicMaterial color="#FF5F1F" transparent opacity={0.3} />
      </mesh>

      {/* Center Holographic Core */}
      <mesh ref={coreRef} position={[0, 10, 0]}>
        <octahedronGeometry args={[2]} />
        <meshStandardMaterial color="#fff" wireframe emissive="#fff" emissiveIntensity={2} />
      </mesh>
      
      <pointLight color="#FF5F1F" position={[0, 5, 0]} intensity={2} distance={20} decay={2} />

      {/* Physics Cubes (Bowling Pins) */}
      {cubes.map((cube, idx) => (
        <RigidBody key={idx} colliders="cuboid" mass={0.5} position={cube.position} restitution={0.8}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[cube.scale, cube.scale, cube.scale]} />
            <meshStandardMaterial color={cube.color} emissive={cube.color} emissiveIntensity={0.2} metalness={0.8} roughness={0.2} />
          </mesh>
        </RigidBody>
      ))}

      {/* Interaction Zone */}
      <InteractionZone id="neural-sandbox" position={[0, 0.25, 0]} radius={15} label="PHYSICS SANDBOX" />
    </group>
  );
};
