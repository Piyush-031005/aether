import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import gsap from 'gsap';
import * as THREE from 'three';

export const TheArchitectReveal = () => {
  const { scene: meScene } = useGLTF('/models/me.glb');
  const { scene: skelScene } = useGLTF('/models/skeleton.glb');
  
  const rootRef = useRef<THREE.Group>(null);
  const skeletonSpinRef = useRef<THREE.Group>(null);
  
  const skeletonRef = useRef<THREE.Group>(null);
  const nerveRef = useRef<THREE.Group>(null);
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

  // 2. Fibers/Nerves Clone (Cyan wireframe - acting as fibers)
  const nerveMesh = useMemo(() => {
    const clone = meScene.clone();
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = new THREE.MeshBasicMaterial({ color: '#00BCD4', wireframe: true, transparent: true, opacity: 0 });
      }
    });
    return clone;
  }, [meScene]);

  // 3. Flesh Clone (Actual materials)
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
    const nerveMats = getMats(nerveMesh);
    const fleshMats = getMats(fleshMesh);

    // Initial Rise
    tl.to(rootRef.current!.position, { y: -1, duration: 2, ease: 'power2.out' }, 0);
    tl.to(skelMats, { opacity: 1, duration: 2, ease: 'power2.inOut' }, 0);
    
    // Rotate on axis
    tl.to(skeletonSpinRef.current!.rotation, { y: Math.PI * 2, duration: 3, ease: 'power2.inOut' }, 1.5);
    
    // Front view zooms in (move closer to camera in Z)
    tl.to(rootRef.current!.position, { z: 3, y: -1.5, duration: 2, ease: 'power2.inOut' }, 3);

    // Fibers form around the skeleton
    tl.to(nerveMats, { opacity: 1, duration: 2, ease: 'power2.inOut' }, 4.5);

    // Character arises from inside the skeleton
    // We scale it from slightly smaller so it looks like it grows out
    fleshRef.current!.scale.set(0.8, 0.8, 0.8);
    tl.to(fleshRef.current!.scale, { x: 1, y: 1, z: 1, duration: 2.5, ease: 'power2.out' }, 6);
    tl.to(fleshMats, { opacity: 1, duration: 2.5, ease: 'power2.inOut' }, 6);
    
    // Skeleton fades out as character overtakes it
    tl.to(skelMats, { opacity: 0, duration: 1.5, ease: 'power2.inOut' }, 7);
    tl.to(nerveMats, { opacity: 0, duration: 1.5, ease: 'power2.inOut' }, 7.5);

    // Zoom back out to normal gameplay position
    tl.to(rootRef.current!.position, { z: 0, y: -1, duration: 1.5, ease: 'power2.inOut' }, 8);

    // World Spawn Flash
    tl.to(flashLight.current, { intensity: 50, duration: 0.2, ease: 'expo.in' }, 9.5);
    tl.to(flashLight.current, { intensity: 0, duration: 1.5, ease: 'power2.out' }, 9.7);

  }, [skeletonMesh, nerveMesh, fleshMesh]);

  useFrame((state) => {
    if (rootRef.current) {
      rootRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.002;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <group ref={rootRef} position={[0, -5, 0]}>
        
        <group ref={skeletonSpinRef}>
          {/* SKELETON ALIGNMENT ADJUSTMENT */}
          {/* If the skeleton is upside down or wrongly rotated relative to the character, adjust rotation/position here */}
          <group ref={skeletonRef} rotation={[Math.PI, 0, 0]} position={[0, 0, 0]} scale={[1, 1, 1]}>
            <primitive object={skeletonMesh} />
          </group>

          <group ref={nerveRef}><primitive object={nerveMesh} /></group>
          <group ref={fleshRef}><primitive object={fleshMesh} /></group>
        </group>

      </group>

      <pointLight ref={flashLight} color="#00BCD4" position={[0, 2, 0]} intensity={0} distance={150} decay={2} />
    </group>
  );
};

useGLTF.preload('/models/me.glb');
useGLTF.preload('/models/skeleton.glb');
