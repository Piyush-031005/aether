import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import gsap from 'gsap';
import * as THREE from 'three';

export const TheArchitectReveal = () => {
  const { scene } = useGLTF('/models/me.glb');
  
  const cocoonRef = useRef<THREE.Group>(null);
  const characterRef = useRef<THREE.Group>(null);
  
  const wireMat = useRef<THREE.MeshBasicMaterial>(null);
  const coreMat = useRef<THREE.MeshStandardMaterial>(null);
  const energyLight = useRef<THREE.PointLight>(null);
  const flashLight = useRef<THREE.PointLight>(null);

  // Clone scene deeply so we can fade it without affecting the main game
  const clonedCharacter = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          // @ts-ignore
          mesh.material = mesh.material.clone();
          mesh.material.transparent = true;
          mesh.material.opacity = 0;
        }
      }
    });
    return clone;
  }, [scene]);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });

    // Stage 1: Cocoon forms (Sphere)
    tl.to(wireMat.current, { opacity: 0.8, duration: 1, ease: 'power2.inOut' });
    tl.to(coreMat.current, { opacity: 0.8, duration: 1, ease: 'power1.inOut' }, '+=0.2');
    
    // Stage 2: Character rises from the void
    tl.to(characterRef.current!.position, { y: -1, duration: 2.5, ease: 'power3.out' }, '-=0.5');

    // Stage 3: Character fades in while cocoon fades out
    const charMats: THREE.Material[] = [];
    clonedCharacter.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).material) {
        charMats.push((child as THREE.Mesh).material as THREE.Material);
      }
    });
    
    tl.to(charMats, { opacity: 1, duration: 2, ease: 'power2.inOut' }, '-=2');
    tl.to([wireMat.current, coreMat.current], { opacity: 0, duration: 1, ease: 'power2.inOut' }, '-=1.5');
    
    // Stage 4: Ignition & Flash
    tl.to(energyLight.current, { intensity: 5, duration: 1, ease: 'power2.inOut' }, '-=1');
    tl.to(flashLight.current, { intensity: 50, duration: 0.5, ease: 'expo.in' }, '+=0.5');

  }, [clonedCharacter]);

  useFrame((state) => {
    if (cocoonRef.current) {
      cocoonRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      cocoonRef.current.rotation.x = state.clock.elapsedTime * 0.2;
    }
    if (characterRef.current) {
      // Gentle float once risen
      characterRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.002;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* The Energy Cocoon */}
      <group ref={cocoonRef} position={[0, 0, 0]}>
        <mesh>
          <icosahedronGeometry args={[2, 3]} />
          <meshBasicMaterial ref={wireMat} color="#00BCD4" wireframe transparent opacity={0} />
        </mesh>
        <mesh>
          <octahedronGeometry args={[1.5, 2]} />
          <meshStandardMaterial ref={coreMat} color="#121820" metalness={0.9} roughness={0.1} transparent opacity={0} />
        </mesh>
      </group>

      {/* Rises from y: -5 to y: -1 */}
      <group ref={characterRef} position={[0, -5, 0]}>
        <primitive object={clonedCharacter} />
      </group>

      <pointLight ref={energyLight} color="#FF5F1F" position={[0, 1, 0]} intensity={0} distance={5} decay={2} />
      <pointLight ref={flashLight} color="#00BCD4" position={[0, 1, 0]} intensity={0} distance={100} decay={2} />
    </group>
  );
};

useGLTF.preload('/models/me.glb');
