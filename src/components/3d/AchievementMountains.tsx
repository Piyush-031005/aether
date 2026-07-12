import React, { useMemo } from 'react';
import { Text } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { PORTFOLIO_DATA } from '../../data/portfolio';
import * as THREE from 'three';

const LowPolyMountain = ({ achievement, position, rotation }: { achievement: any, position: [number, number, number], rotation: [number, number, number] }) => {
  // Generate procedural low-poly terrain for the mountain
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(30, 30, 16, 16);
    geo.rotateX(-Math.PI / 2); // Lay flat
    
    // Displace vertices to form a peak
    const posAttribute = geo.attributes.position;
    for (let i = 0; i < posAttribute.count; i++) {
      const x = posAttribute.getX(i);
      const z = posAttribute.getZ(i);
      
      // Distance from center
      const dist = Math.sqrt(x*x + z*z);
      // Max height is 15, falls off based on distance
      let y = Math.max(0, 15 - dist * 1.2);
      
      // Add random noise for jagged low-poly look
      if (y > 0) {
        y += (Math.random() - 0.5) * 3;
      }
      
      posAttribute.setY(i, y);
    }
    
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <group position={position} rotation={rotation}>
      <RigidBody type="fixed" colliders="hull">
        <mesh geometry={geometry}>
          <meshStandardMaterial 
            color="#1a252c" // Dark slate stone
            roughness={0.9} 
            metalness={0.1}
            flatShading // The key to the Bruno Simon low-poly look!
          />
          
          {/* Glowing wireframe over mountain */}
          <mesh>
            <primitive object={geometry} />
            <meshBasicMaterial color="#00BCD4" wireframe transparent opacity={0.1} />
          </mesh>

          {/* Achievement Title Text floating above the peak */}
          <group position={[0, 16, 0]}>
            <Text
              fontSize={1.2}
              color="#00BCD4"
              anchorX="center"
              anchorY="middle"
              maxWidth={15}
              textAlign="center"
              outlineWidth={0.03}
              outlineColor="#000"
            >
              {achievement.title.toUpperCase()}
            </Text>
            <Text
              position={[0, -1.5, 0]}
              fontSize={0.6}
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
  // Place them far in the distance forming a mountain range
  const mountainPositions: [number, number, number][] = [
    [-60, 0, -30],
    [60, 0, -30],
    [0, 0, -60]
  ];

  return (
    <group>
      {PORTFOLIO_DATA.achievements.map((ach, index) => (
        <LowPolyMountain 
          key={index} 
          achievement={ach} 
          position={mountainPositions[index % mountainPositions.length]} 
          rotation={[0, Math.random() * Math.PI, 0]}
        />
      ))}
    </group>
  );
};
