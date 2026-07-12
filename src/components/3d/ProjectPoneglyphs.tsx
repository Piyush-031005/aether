import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { PORTFOLIO_DATA } from '../../data/portfolio';
import * as THREE from 'three';

const Poneglyph = ({ project, position, rotation }: { project: any, position: [number, number, number], rotation: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current && textRef.current) {
      // Very slow hover effect
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
      
      // Pulse text emission when hovered
      const targetOpacity = hovered ? 1 : 0.5;
      textRef.current.children.forEach(child => {
        if ((child as any).material) {
           (child as any).material.opacity = THREE.MathUtils.lerp((child as any).material.opacity, targetOpacity, 0.1);
        }
      });
    }
  });

  return (
    <group position={position} rotation={rotation}>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh 
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          {/* Massive Cube */}
          <boxGeometry args={[4, 4, 4]} />
          <meshStandardMaterial 
            color="#111" 
            roughness={0.9} 
            metalness={0.1}
          />
          
          {/* Wireframe overlay to look ancient/digital */}
          <mesh>
            <boxGeometry args={[4.01, 4.01, 4.01]} />
            <meshBasicMaterial color="#00BCD4" wireframe transparent opacity={0.1} />
          </mesh>

          {/* Project Title Text - Front */}
          <group ref={textRef} position={[0, 0, 2.05]}>
            <Text
              position={[0, 0.5, 0]}
              fontSize={0.3}
              color="#FF5F1F" // Red/Orange glow like Road Poneglyph
              anchorX="center"
              anchorY="middle"
              maxWidth={3.5}
              textAlign="center"
            >
              {project.title}
              <meshBasicMaterial toneMapped={false} transparent opacity={0.5} />
            </Text>
            
            <Text
              position={[0, -0.5, 0]}
              fontSize={0.15}
              color="#00BCD4"
              anchorX="center"
              anchorY="middle"
              maxWidth={3.5}
              textAlign="center"
            >
              [ INTERACT TO READ ]
              <meshBasicMaterial toneMapped={false} transparent opacity={0.5} />
            </Text>
          </group>

          {/* Glowing Aura when hovered */}
          {hovered && (
            <pointLight position={[0, 0, 3]} intensity={5} distance={10} color="#FF5F1F" />
          )}
        </mesh>
      </RigidBody>
    </group>
  );
};

export const ProjectPoneglyphs = () => {
  // Scatter them around the environment
  const poneglyphPositions: [number, number, number][] = [
    [-30, 2, 20],
    [30, 2, 20],
    [0, 2, -20]
  ];

  const rotations: [number, number, number][] = [
    [0, Math.PI / 4, 0],
    [0, -Math.PI / 4, 0],
    [0, 0, 0]
  ];

  return (
    <group>
      {PORTFOLIO_DATA.projects.map((project, index) => (
        <Poneglyph 
          key={project.id} 
          project={project} 
          position={poneglyphPositions[index % poneglyphPositions.length]} 
          rotation={rotations[index % rotations.length]}
        />
      ))}
    </group>
  );
};
