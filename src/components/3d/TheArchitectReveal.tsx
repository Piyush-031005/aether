import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import gsap from 'gsap';
import * as THREE from 'three';

export const TheArchitectReveal = () => {
  const { scene: meScene } = useGLTF('/models/me.glb');
  const { scene: skelScene } = useGLTF('/models/skeleton.glb');
  
  const rootRef = useRef<THREE.Group>(null);
  const skeletonSpinRef = useRef<THREE.Group>(null);
  
  const skeletonRef = useRef<THREE.Group>(null);
  const nerveRedRef = useRef<THREE.Group>(null);
  const nerveBlueRef = useRef<THREE.Group>(null);
  const fleshRef = useRef<THREE.Group>(null);
  
  const flashLight = useRef<THREE.PointLight>(null);

  // 1. Skeleton Clone
  const skeletonMesh = useMemo(() => {
    const clone = skelScene.clone();
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
  }, [skelScene]);

  // 2. Red Fibers Clone
  const nerveRedMesh = useMemo(() => {
    const clone = meScene.clone();
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = new THREE.MeshBasicMaterial({ color: '#FF003C', wireframe: true, transparent: true, opacity: 0 });
      }
    });
    return clone;
  }, [meScene]);

  // 3. Blue Fibers Clone
  const nerveBlueMesh = useMemo(() => {
    const clone = meScene.clone();
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = new THREE.MeshBasicMaterial({ color: '#00BCD4', wireframe: true, transparent: true, opacity: 0 });
      }
    });
    return clone;
  }, [meScene]);

  // 4. Flesh Clone (Actual materials)
  const fleshMesh = useMemo(() => {
    const clone = meScene.clone();
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
  }, [meScene]);

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
    const nerveRedMats = getMats(nerveRedMesh);
    const nerveBlueMats = getMats(nerveBlueMesh);
    const fleshMats = getMats(fleshMesh);

    // Initial Rise
    tl.to(rootRef.current!.position, { y: -1, duration: 2, ease: 'power2.out' }, 0);
    tl.to(skelMats, { opacity: 1, duration: 2, ease: 'power2.inOut' }, 0);
    
    // Rotate on axis
    tl.to(skeletonSpinRef.current!.rotation, { y: Math.PI * 2, duration: 3, ease: 'power2.inOut' }, 1.5);
    
    // Front view zooms in (move closer to camera in Z)
    tl.to(rootRef.current!.position, { z: 3, y: -1.5, duration: 2, ease: 'power2.inOut' }, 3);

    // Red and Blue Fibers form around the skeleton
    tl.to(nerveRedMats, { opacity: 0.8, duration: 2, ease: 'power2.inOut' }, 4.5);
    tl.to(nerveBlueMats, { opacity: 0.8, duration: 2, ease: 'power2.inOut' }, 4.8);

    // Skeleton flows DOWN and disappears
    tl.to(skeletonRef.current!.position, { y: -5, duration: 2, ease: 'power2.in' }, 6.5);
    tl.to(skelMats, { opacity: 0, duration: 1.5, ease: 'power2.in' }, 6.8);
    tl.to(nerveRedMats, { opacity: 0, duration: 1.5, ease: 'power2.in' }, 7.0);
    tl.to(nerveBlueMats, { opacity: 0, duration: 1.5, ease: 'power2.in' }, 7.0);

    // Zoom back out to normal gameplay position as character forms
    tl.to(rootRef.current!.position, { z: 0, y: -1, duration: 2, ease: 'power2.inOut' }, 7.5);

    // Character arises
    tl.to(fleshMats, { opacity: 1, duration: 2, ease: 'power2.out' }, 8.0);
    
    // World Spawn Flash
    tl.to(flashLight.current, { intensity: 50, duration: 0.2, ease: 'expo.in' }, 9.5);
    tl.to(flashLight.current, { intensity: 0, duration: 1.5, ease: 'power2.out' }, 9.7);

  }, [skeletonMesh, nerveRedMesh, nerveBlueMesh, fleshMesh]);

  useFrame((state) => {
    if (rootRef.current) {
      rootRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.002;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <group ref={rootRef} position={[0, -5, 0]}>
        
        <group ref={skeletonSpinRef}>
          {/* Skeleton doubled in size and flipped back to normal rotation */}
          <group ref={skeletonRef} rotation={[0, 0, 0]} position={[0, 0, 0]} scale={[2, 2, 2]}>
            <primitive object={skeletonMesh} />
          </group>

          {/* Red & Blue Nerves/Fibers */}
          <group ref={nerveRedRef}><primitive object={nerveRedMesh} /></group>
          <group ref={nerveBlueRef} scale={[1.01, 1.01, 1.01]}><primitive object={nerveBlueMesh} /></group>
          
          {/* Final Character */}
          <group ref={fleshRef}><primitive object={fleshMesh} /></group>
        </group>

      </group>

      <pointLight ref={flashLight} color="#00BCD4" position={[0, 2, 0]} intensity={0} distance={150} decay={2} />
    </group>
  );
};

useGLTF.preload('/models/me.glb');
useGLTF.preload('/models/skeleton.glb');
