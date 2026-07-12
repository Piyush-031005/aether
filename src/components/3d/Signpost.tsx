import React from 'react';
import { Text } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';

export const Signpost = ({ position, rotation, label, color = "#FF5F1F" }: { position: [number, number, number], rotation: [number, number, number], label: string, color?: string }) => {
  return (
    <group position={position} rotation={rotation}>
      <RigidBody type="fixed" colliders="cuboid">
        {/* The Pole */}
        <mesh position={[0, 1.5, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 3]} />
          <meshStandardMaterial color="#555" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* The Sign Board */}
        <mesh position={[0, 2.8, 0.1]}>
          <boxGeometry args={[4, 1, 0.1]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        
        {/* Glowing Text */}
        <Text
          position={[0, 2.8, 0.16]}
          fontSize={0.4}
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      </RigidBody>
    </group>
  );
};
