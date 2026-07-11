import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import * as THREE from 'three';

export const TheArchitectReveal = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Materials that we will animate
  const wireframeMat = useRef<THREE.MeshStandardMaterial>(null);
  const coreMat = useRef<THREE.MeshStandardMaterial>(null);
  const armorMat = useRef<THREE.MeshStandardMaterial>(null);
  const energyLight = useRef<THREE.PointLight>(null);

  useEffect(() => {
    // Initial states (invisible)
    if (wireframeMat.current) wireframeMat.current.opacity = 0;
    if (coreMat.current) coreMat.current.opacity = 0;
    if (armorMat.current) armorMat.current.opacity = 0;
    if (energyLight.current) energyLight.current.intensity = 0;

    // The Reveal Sequence Timeline
    const tl = gsap.timeline({ delay: 0.5 });

    // Stage 1: Blueprint / Wireframe Skull
    tl.to(wireframeMat.current, { opacity: 0.8, duration: 1, ease: 'power2.inOut' });
    
    // Stage 2: Skeleton / Core structure
    tl.to(coreMat.current, { opacity: 0.5, duration: 1, ease: 'power1.inOut' }, '+=0.5');
    
    // Stage 3: Armor / Skin layers
    tl.to(armorMat.current, { opacity: 1, duration: 1, ease: 'power2.out' }, '+=0.5');
    
    // Stage 4: Energy Core Ignition (Eyes open)
    tl.to(energyLight.current, { intensity: 5, duration: 0.5, ease: 'expo.in' }, '+=0.2');

  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, 1.5, 0]}>
      
      {/* 1. Wireframe "Skull" */}
      <mesh>
        <icosahedronGeometry args={[1, 2]} />
        <meshStandardMaterial 
          ref={wireframeMat} 
          color="#00BCD4" 
          wireframe 
          transparent 
        />
      </mesh>

      {/* 2. Core Structure "Skeleton" */}
      <mesh>
        <octahedronGeometry args={[0.8, 1]} />
        <meshStandardMaterial 
          ref={coreMat} 
          color="#121820" 
          transparent 
          metalness={0.9} 
          roughness={0.1} 
        />
      </mesh>

      {/* 3. Outer Armor "Skin" */}
      <mesh>
        <torusGeometry args={[1.2, 0.1, 16, 50]} />
        <meshStandardMaterial 
          ref={armorMat} 
          color="#FF5F1F" 
          transparent 
          metalness={0.5} 
        />
      </mesh>
      
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.1, 16, 50]} />
        <meshStandardMaterial 
          ref={armorMat} 
          color="#FF5F1F" 
          transparent 
          metalness={0.5} 
        />
      </mesh>

      {/* 4. Energy Core "Eyes" */}
      <pointLight ref={energyLight} color="#FFF200" distance={5} decay={2} />
      
    </group>
  );
};
