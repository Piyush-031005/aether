import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import gsap from 'gsap';
import * as THREE from 'three';

export const TheArchitectReveal = () => {
  const { scene } = useGLTF('/models/me.glb');
  
  const rootRef = useRef<THREE.Group>(null);
  
  const skullRef = useRef<THREE.Group>(null);
  const skeletonRef = useRef<THREE.Group>(null);
  const eyesRef = useRef<THREE.Group>(null);
  const nerveRef = useRef<THREE.Group>(null);
  const fleshRef = useRef<THREE.Group>(null);
  
  const flashLight = useRef<THREE.PointLight>(null);

  // 1. Nerve Clone (Cyan wireframe - acting as nerves)
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

  // 2. Flesh Clone (Actual materials)
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

    const nerveMats = getMats(nerveMesh);
    const fleshMats = getMats(fleshMesh);

    // Initial Rise
    tl.to(rootRef.current!.position, { y: -1, duration: 2, ease: 'power2.out' }, 0);

    // Stage 1: Skull appears
    tl.to(skullRef.current!.scale, { x: 1, y: 1, z: 1, duration: 1, ease: 'back.out(1.7)' }, 0.5);
    
    // Stage 2: Skeleton body drops in
    tl.to(skeletonRef.current!.scale, { x: 1, y: 1, z: 1, duration: 1, ease: 'bounce.out' }, 2.0);
    
    // Stage 3: Eyes ignite
    tl.to(eyesRef.current!.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: 'power2.inOut' }, 3.5);

    // Stage 4: Nervous System (Wireframe) wraps the skeleton
    tl.to(nerveMats, { opacity: 1, duration: 1.5, ease: 'power2.inOut' }, 4.5);
    tl.to([skullRef.current!.scale, skeletonRef.current!.scale, eyesRef.current!.scale], { x: 0.01, y: 0.01, z: 0.01, duration: 0.5, ease: 'power2.in' }, 5.5);

    // Stage 5: Flesh wraps the nerves
    tl.to(fleshMats, { opacity: 1, duration: 2, ease: 'power2.inOut' }, 6.0);
    tl.to(nerveMats, { opacity: 0, duration: 1, ease: 'power2.inOut' }, 7.0);

    // Stage 6: World Spawn Flash
    tl.to(flashLight.current, { intensity: 50, duration: 0.2, ease: 'expo.in' }, 8.0);
    tl.to(flashLight.current, { intensity: 0, duration: 1.5, ease: 'power2.out' }, 8.2);

  }, [nerveMesh, fleshMesh]);

  useFrame((state) => {
    if (rootRef.current) {
      rootRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.002;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <group ref={rootRef} position={[0, -5, 0]}>
        
        {/* The Skull */}
        <group ref={skullRef} scale={0.01} position={[0, 1.6, 0]}>
          <mesh>
            <sphereGeometry args={[0.12, 32, 32]} />
            <meshStandardMaterial color="#E8E6D9" roughness={0.8} />
          </mesh>
          {/* Eye Sockets */}
          <mesh position={[-0.04, 0.02, 0.1]}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
          <mesh position={[0.04, 0.02, 0.1]}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
        </group>

        {/* The Eyes (Ignite later) */}
        <group ref={eyesRef} scale={0.01} position={[0, 1.6, 0.11]}>
          <mesh position={[-0.04, 0.02, 0]}>
            <sphereGeometry args={[0.015, 16, 16]} />
            <meshBasicMaterial color="#00BCD4" />
          </mesh>
          <mesh position={[0.04, 0.02, 0]}>
            <sphereGeometry args={[0.015, 16, 16]} />
            <meshBasicMaterial color="#00BCD4" />
          </mesh>
        </group>

        {/* The Skeleton (Spine & Ribs) */}
        <group ref={skeletonRef} scale={0.01} position={[0, 0.8, 0]}>
          <mesh>
            <cylinderGeometry args={[0.02, 0.02, 1.2, 8]} />
            <meshStandardMaterial color="#E8E6D9" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.15, 0.015, 8, 24, Math.PI]} />
            <meshStandardMaterial color="#E8E6D9" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.12, 0.015, 8, 24, Math.PI]} />
            <meshStandardMaterial color="#E8E6D9" roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.1, 0.015, 8, 24, Math.PI]} />
            <meshStandardMaterial color="#E8E6D9" roughness={0.8} />
          </mesh>
        </group>

        <group ref={nerveRef}><primitive object={nerveMesh} /></group>
        <group ref={fleshRef}><primitive object={fleshMesh} /></group>
      </group>

      <pointLight ref={flashLight} color="#00BCD4" position={[0, 2, 0]} intensity={0} distance={150} decay={2} />
    </group>
  );
};

useGLTF.preload('/models/me.glb');

useGLTF.preload('/models/me.glb');
