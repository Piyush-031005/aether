import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import gsap from 'gsap';
import * as THREE from 'three';

export const TheArchitectReveal = () => {
  const { scene } = useGLTF('/models/me.glb');
  
  const rootRef = useRef<THREE.Group>(null);
  
  const skeletonRef = useRef<THREE.Group>(null);
  const nerveRef = useRef<THREE.Group>(null);
  const fleshRef = useRef<THREE.Group>(null);
  
  const flashLight = useRef<THREE.PointLight>(null);

  // 1. Skeleton Clone (White glowing silhouette)
  const skeletonMesh = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = new THREE.MeshBasicMaterial({ color: '#FFFFFF', transparent: true, opacity: 0 });
      }
    });
    return clone;
  }, [scene]);

  // 2. Nerve Clone (Cyan wireframe)
  const nerveMesh = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = new THREE.MeshBasicMaterial({ color: '#00BCD4', wireframe: true, transparent: true, opacity: 0 });
      }
    });
    return clone;
  }, [scene]);

  // 3. Flesh Clone (Actual materials)
  const fleshMesh = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const mat = (mesh.material as THREE.Material).clone();
          mat.transparent = true;
          mat.opacity = 0;
          mesh.material = mat;
        }
      }
    });
    return clone;
  }, [scene]);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 1 });

    const getMats = (clone: THREE.Group) => {
      const mats: THREE.Material[] = [];
      clone.traverse((c) => {
        if ((c as THREE.Mesh).isMesh && (c as THREE.Mesh).material) mats.push((c as THREE.Mesh).material as THREE.Material);
      });
      return mats;
    };

    const skelMats = getMats(skeletonMesh);
    const nerveMats = getMats(nerveMesh);
    const fleshMats = getMats(fleshMesh);

    // Initial Rise
    tl.to(rootRef.current!.position, { y: -1, duration: 2, ease: 'power2.out' }, 0);

    // Stage 1: The Skeleton (Bones assemble)
    tl.to(skelMats, { opacity: 1, duration: 1.5, ease: 'power2.inOut' }, 0.5);
    
    // Stage 2: The Nervous System
    tl.to(nerveMats, { opacity: 1, duration: 1.5, ease: 'power2.inOut' }, 2.5);
    tl.to(skelMats, { opacity: 0, duration: 1, ease: 'power2.inOut' }, 3);

    // Stage 3: The Flesh (Skin forms)
    tl.to(fleshMats, { opacity: 1, duration: 2, ease: 'power2.inOut' }, 4.5);
    tl.to(nerveMats, { opacity: 0, duration: 1, ease: 'power2.inOut' }, 5.5);

    // Stage 4: World Spawn Flash
    tl.to(flashLight.current, { intensity: 50, duration: 0.2, ease: 'expo.in' }, 6.5);
    tl.to(flashLight.current, { intensity: 0, duration: 1.5, ease: 'power2.out' }, 6.7);

  }, [skeletonMesh, nerveMesh, fleshMesh]);

  useFrame((state) => {
    if (rootRef.current) {
      rootRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.002;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <group ref={rootRef} position={[0, -5, 0]}>
        <group ref={skeletonRef}><primitive object={skeletonMesh} /></group>
        <group ref={nerveRef}><primitive object={nerveMesh} /></group>
        <group ref={fleshRef}><primitive object={fleshMesh} /></group>
      </group>

      <pointLight ref={flashLight} color="#00BCD4" position={[0, 2, 0]} intensity={0} distance={150} decay={2} />
    </group>
  );
};

useGLTF.preload('/models/me.glb');
