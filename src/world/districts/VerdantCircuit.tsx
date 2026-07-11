import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { BioTree } from '../../components/3d/BioTree';
import { InteractionZone } from '../../components/3d/InteractionZone';
import * as THREE from 'three';

export const VerdantCircuit = () => {
  const aetherRef = useRef<THREE.Mesh>(null);
  const specimenRef = useRef<THREE.Mesh>(null);
  const limboRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (aetherRef.current) {
      aetherRef.current.rotation.x = t * 0.5;
      aetherRef.current.rotation.y = t * 0.3;
      aetherRef.current.position.y = 5 + Math.sin(t * 2) * 0.5;
    }
    
    if (specimenRef.current) {
      specimenRef.current.rotation.z = t * 0.8;
      specimenRef.current.rotation.x = t * 0.4;
      specimenRef.current.position.y = 6 + Math.cos(t * 1.5) * 0.5;
    }

    if (limboRef.current) {
      limboRef.current.rotation.y = t * 0.2;
      limboRef.current.position.y = 4 + Math.sin(t * 1.8) * 0.5;
    }
  });

  return (
    <group position={[0, 0, -50]}>
      {/* Floating Holographic Rings over the Data Center */}
      <mesh position={[0, 15, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[12, 0.2, 16, 100]} />
        <meshStandardMaterial color="#00BCD4" emissive="#00BCD4" emissiveIntensity={2} wireframe />
      </mesh>
      
      {/* Glass Data Core Base */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[15, 15, 0.5, 32]} />
        <meshPhysicalMaterial 
          color="#051005" 
          metalness={0.9} 
          roughness={0.1} 
          transmission={0.5} 
          thickness={2} 
        />
      </mesh>
      
      {/* --- The Project Architectures --- */}
      {/* AETHER: The Creator Protocol (Wireframe Sphere representing the world core) */}
      <mesh ref={aetherRef} position={[-6, 5, -6]}>
        <icosahedronGeometry args={[2, 1]} />
        <meshStandardMaterial color="#00BCD4" emissive="#00BCD4" emissiveIntensity={1} wireframe />
      </mesh>

      {/* SPECIMEN (Biomechanical Torus Knot) */}
      <mesh ref={specimenRef} position={[6, 6, -4]}>
        <torusKnotGeometry args={[1.5, 0.4, 64, 16]} />
        <meshStandardMaterial color="#FF5F1F" emissive="#FF5F1F" emissiveIntensity={0.5} wireframe />
      </mesh>

      {/* LIMBO (Shattered / Disjointed Cubes) */}
      <group ref={limboRef} position={[0, 4, -8]}>
        <mesh position={[-1, 1, 0]}>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <meshPhysicalMaterial color="#fff" transmission={0.9} roughness={0} thickness={1} />
        </mesh>
        <mesh position={[1, -1, 0]}>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <meshPhysicalMaterial color="#fff" transmission={0.9} roughness={0} thickness={1} />
        </mesh>
        <pointLight color="#fff" intensity={2} distance={10} decay={2} />
      </group>

      {/* Forest Elements */}
      <BioTree position={[-10, 0.25, 2]} />
      <BioTree position={[10, 0.25, 5]} />
      <BioTree position={[-2, 0.25, 10]} />
      <BioTree position={[5, 0.25, 12]} />
      
      {/* Interaction Zone for Projects */}
      <InteractionZone id="project-1" position={[0, 0.25, 0]} radius={15} label="ACCESS DATABANK" />
    </group>
  );
};
