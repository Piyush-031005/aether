import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Clone } from '@react-three/drei';
import gsap from 'gsap';
import * as THREE from 'three';

export const TheArchitectReveal = () => {
  const { scene } = useGLTF('/models/me.glb');
  
  const finalGroup = useRef<THREE.Group>(null);
  const energyLight = useRef<THREE.PointLight>(null);
  const flashLight = useRef<THREE.PointLight>(null);

  // Custom materials that we can animate without affecting the cached original model
  const wireMat = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#00BCD4', wireframe: true, transparent: true, opacity: 0, emissive: '#00BCD4', emissiveIntensity: 0.5 
  }), []);
  
  const coreMat = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#121820', metalness: 0.9, roughness: 0.1, transparent: true, opacity: 0 
  }), []);

  // Deep clone the scene to ensure we don't make the actual player character invisible later
  const finalScene = useMemo(() => {
    const cloned = scene.clone();
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = (mesh.material as THREE.Material).clone();
        mesh.material.transparent = true;
        mesh.material.opacity = 0;
      }
    });
    return cloned;
  }, [scene]);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });

    // Stage 1: Nerves / Wireframe forming
    tl.to(wireMat, { opacity: 0.8, duration: 1.5, ease: 'power2.inOut' });
    
    // Stage 2: Skeleton / Metallic Core
    tl.to(coreMat, { opacity: 1, duration: 1.5, ease: 'power1.inOut' }, '+=0.5');
    
    // Stage 3: Final Body
    const finalMats: THREE.Material[] = [];
    finalScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        finalMats.push((child as THREE.Mesh).material as THREE.Material);
      }
    });
    tl.to(finalMats, { opacity: 1, duration: 1.5, ease: 'power2.out' }, '+=0.5');
    
    // Stage 4: Energy Core Ignition (Eyes open / Flash)
    tl.to(energyLight.current, { intensity: 5, duration: 1, ease: 'power2.inOut' }, '-=1');
    
    // Stage 5: Massive Flash before world boot (happens at 5.5 seconds)
    tl.to(flashLight.current, { intensity: 50, duration: 0.5, ease: 'expo.in' }, '+=0.5');

  }, [wireMat, coreMat, finalScene]);

  // Gentle floating animation
  useFrame((state) => {
    if (finalGroup.current) {
      finalGroup.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05 - 1;
    }
  });

  return (
    <group position={[0, -1, 0]}>
      {/* 1. Wireframe "Nerves" */}
      <group>
        <Clone object={scene} inject={wireMat} />
      </group>

      {/* 2. Core Structure "Skeleton" */}
      <group>
        <Clone object={scene} inject={coreMat} />
      </group>

      {/* 3. Outer Armor / Final Body */}
      <group ref={finalGroup}>
        <primitive object={finalScene} />
      </group>

      {/* Ambient glowing core inside the body */}
      <pointLight ref={energyLight} color="#FF5F1F" position={[0, 1, 0]} intensity={0} distance={2} decay={2} />
      
      {/* The blinding flash that transitions to the world */}
      <pointLight ref={flashLight} color="#00BCD4" position={[0, 1, 0]} intensity={0} distance={100} decay={2} />
    </group>
  );
};

useGLTF.preload('/models/me.glb');
