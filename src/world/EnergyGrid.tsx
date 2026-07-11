import React from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { Grid } from '@react-three/drei';

export const EnergyGrid = () => {
  return (
    <group>
      {/* 
        The massive unified physics floor. 
        Size: 150x150 to cover all districts 
      */}
      <RigidBody type="fixed" colliders="cuboid" position={[0, -0.6, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[150, 1.2, 150]} />
          {/* Dark obsidian/glass base material */}
          <meshStandardMaterial color="#020202" metalness={0.9} roughness={0.1} />
        </mesh>
      </RigidBody>

      {/* 
        The glowing Tron-style grid overlay 
        Placed slightly above the physics floor so it doesn't z-fight
      */}
      <Grid 
        position={[0, 0.01, 0]} 
        args={[150, 150]} 
        cellSize={2} 
        cellThickness={1} 
        cellColor="#00BCD4" 
        sectionSize={10} 
        sectionThickness={1.5} 
        sectionColor="#FF5F1F" 
        fadeDistance={50} 
        fadeStrength={1} 
      />

      {/* 
        Invisible Bounding Walls to prevent falling off the map
        Each wall is a fixed CuboidCollider
      */}
      <RigidBody type="fixed" colliders={false}>
        {/* North Wall */}
        <CuboidCollider args={[75, 50, 1]} position={[0, 25, -75]} />
        {/* South Wall */}
        <CuboidCollider args={[75, 50, 1]} position={[0, 25, 75]} />
        {/* East Wall */}
        <CuboidCollider args={[1, 50, 75]} position={[75, 25, 0]} />
        {/* West Wall */}
        <CuboidCollider args={[1, 50, 75]} position={[-75, 25, 0]} />
      </RigidBody>
    </group>
  );
};
