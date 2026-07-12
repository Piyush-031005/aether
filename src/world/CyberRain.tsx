import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const CyberRain = () => {
  const count = 2000;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Store velocities and initial positions
  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 200,
        y: Math.random() * 100,
        z: (Math.random() - 0.5) * 200,
        speed: Math.random() * 0.5 + 0.5
      });
    }
    return arr;
  }, [count]);

  useFrame(() => {
    if (!meshRef.current) return;
    
    particles.forEach((p, i) => {
      // Fall down
      p.y -= p.speed;
      
      // Reset at bottom
      if (p.y < -5) {
        p.y = 100;
        p.x = (Math.random() - 0.5) * 200;
        p.z = (Math.random() - 0.5) * 200;
      }
      
      dummy.position.set(p.x, p.y, p.z);
      // Give rain a slight tilt
      dummy.rotation.z = 0.1;
      dummy.scale.set(1, Math.random() * 2 + 1, 1);
      dummy.updateMatrix();
      
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <cylinderGeometry args={[0.02, 0.02, 0.5, 4]} />
      <meshBasicMaterial color="#00BCD4" transparent opacity={0.6} depthWrite={false} />
    </instancedMesh>
  );
};
