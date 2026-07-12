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
  
  // Cocoon Refs
  const cocoonRef = useRef<THREE.Group>(null);
  const wireMat = useRef<THREE.MeshBasicMaterial>(null);
  const coreMat = useRef<THREE.MeshStandardMaterial>(null);
  
  const flashLight = useRef<THREE.PointLight>(null);

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
    // Slower Timeline
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
    tl.to(rootRef.current!.position, { y: -1, duration: 4, ease: 'power2.out' }, 0);
    tl.to(skelMats, { opacity: 1, duration: 3, ease: 'power2.inOut' }, 0);
    
    // Rotate on axis (slowly)
    tl.to(skeletonSpinRef.current!.rotation, { y: Math.PI * 2, duration: 5, ease: 'power2.inOut' }, 2);
    
    // Front view zooms in (move closer to camera in Z)
    tl.to(rootRef.current!.position, { z: 2.5, y: -1.2, duration: 4, ease: 'power2.inOut' }, 3);

    // Red and Blue Fibers form AROUND the skeleton
    tl.to(nerveRedMats, { opacity: 0.8, duration: 3, ease: 'power2.inOut' }, 6);
    tl.to(nerveBlueMats, { opacity: 0.8, duration: 3, ease: 'power2.inOut' }, 6.5);

    // Character (flesh) arises FROM INSIDE the skeleton (scaling up slowly)
    fleshRef.current!.scale.set(0.95, 0.95, 0.95);
    tl.to(fleshRef.current!.scale, { x: 1, y: 1, z: 1, duration: 4, ease: 'power2.out' }, 9);
    tl.to(fleshMats, { opacity: 1, duration: 4, ease: 'power2.inOut' }, 9);
    
    // Skeleton and Nerves fade out AFTER character is formed
    tl.to(skelMats, { opacity: 0, duration: 2, ease: 'power2.inOut' }, 11);
    tl.to(nerveRedMats, { opacity: 0, duration: 2, ease: 'power2.inOut' }, 11.5);
    tl.to(nerveBlueMats, { opacity: 0, duration: 2, ease: 'power2.inOut' }, 11.5);

    // Zoom back out
    tl.to(rootRef.current!.position, { z: 0, y: -1, duration: 3, ease: 'power2.inOut' }, 13);

    // Wrap the character in the Cocoon Ball
    tl.to(wireMat.current, { opacity: 0.8, duration: 1.5, ease: 'power2.inOut' }, 14);
    tl.to(coreMat.current, { opacity: 0.9, duration: 1.5, ease: 'power1.inOut' }, 14.5);

    // Cocoon shrinks and implodes into the flash
    tl.to(cocoonRef.current!.scale, { x: 0.1, y: 0.1, z: 0.1, duration: 1, ease: 'power2.in' }, 16);
    tl.to([wireMat.current, coreMat.current], { opacity: 0, duration: 0.5, ease: 'power2.in' }, 16.5);

    // World Spawn Flash
    tl.to(flashLight.current, { intensity: 50, duration: 0.2, ease: 'expo.in' }, 16.8);
    tl.to(flashLight.current, { intensity: 0, duration: 2, ease: 'power2.out' }, 17.0);

  }, [skeletonMesh, nerveRedMesh, nerveBlueMesh, fleshMesh]);

  useFrame((state) => {
    if (rootRef.current) {
      rootRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.002;
    }
    if (cocoonRef.current) {
      cocoonRef.current.rotation.y = state.clock.elapsedTime * 1.5;
      cocoonRef.current.rotation.x = state.clock.elapsedTime * 0.8;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      
      {/* Cocoon wrappers (centered around the character's core) */}
      <group ref={cocoonRef} position={[0, 0, 0]}>
        <mesh>
          <icosahedronGeometry args={[2.5, 3]} />
          <meshBasicMaterial ref={wireMat} color="#00BCD4" wireframe transparent opacity={0} />
        </mesh>
        <mesh>
          <octahedronGeometry args={[2.2, 2]} />
          <meshStandardMaterial ref={coreMat} color="#121820" metalness={0.9} roughness={0.1} transparent opacity={0} />
        </mesh>
      </group>

      <group ref={rootRef} position={[0, -5, 0]}>
        <group ref={skeletonSpinRef}>
          {/* Skeleton doubled in size */}
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
