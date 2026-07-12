import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { PORTFOLIO_DATA } from '../../data/portfolio';
import * as THREE from 'three';

const AchievementMountain = ({ achievement, position, rotation }: { achievement: any, position: [number, number, number], rotation: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <group position={position} rotation={rotation}>
      <RigidBody type="fixed" colliders="hull">
        <mesh ref={meshRef}>
          {/* Massive Mountain / Tetrahedron */}
          <tetrahedronGeometry args={[20, 1]} />
          <meshStandardMaterial 
            color="#051015" 
            roughness={0.8} 
            metalness={0.2}
          />
          
          {/* Glowing wireframe over mountain */}
          <mesh>
            <tetrahedronGeometry args={[20.1, 1]} />
            <meshBasicMaterial color="#00FF7F" wireframe transparent opacity={0.15} />
          </mesh>

          {/* Achievement Title Text floating above or on the side */}
          <group position={[0, 10, 8]} rotation={[-0.2, 0, 0]}>
            <Text
              fontSize={1.5}
              color="#00FF7F"
              anchorX="center"
              anchorY="middle"
              maxWidth={15}
              textAlign="center"
              outlineWidth={0.05}
              outlineColor="#000"
            >
              {achievement.title.toUpperCase()}
              <meshBasicMaterial toneMapped={false} />
            </Text>
            <Text
              position={[0, -2, 0]}
              fontSize={0.8}
              color="#fff"
              anchorX="center"
              anchorY="middle"
              maxWidth={15}
              textAlign="center"
            >
              {achievement.description}
            </Text>
          </group>
        </mesh>
      </RigidBody>
    </group>
  );
};

export const AchievementMountains = () => {
  // Place them far in the distance along the east/west borders
  const mountainPositions: [number, number, number][] = [
    [-60, 5, -20],
    [60, 5, 0],
    [-50, 5, 40]
  ];

  return (
    <group>
      {PORTFOLIO_DATA.achievements.map((ach, index) => (
        <AchievementMountain 
          key={index} 
          achievement={ach} 
          position={mountainPositions[index % mountainPositions.length]} 
          rotation={[0, Math.random() * Math.PI, 0]}
        />
      ))}
    </group>
  );
};
