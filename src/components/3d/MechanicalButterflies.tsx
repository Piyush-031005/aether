import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { playerPositionStore } from '../../components/ui/MiniMap';

export const MechanicalButterflies = ({ count = 20, center = new THREE.Vector3(15, 5, 15), radius = 15 }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  // Create dummy object for calculating instance matrices
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate initial random positions, velocities, and wingspans for the butterflies
  const butterflies = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      position: new THREE.Vector3(
        center.x + (Math.random() - 0.5) * radius * 2,
        center.y + (Math.random() - 0.5) * radius,
        center.z + (Math.random() - 0.5) * radius * 2
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 1,
        (Math.random() - 0.5) * 2
      ),
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 0.5
    }));
  }, [count, center, radius]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    
    // Get player position to scatter butterflies
    const playerPos = playerPositionStore.current;

    butterflies.forEach((butterfly, i) => {
      // 1. Natural Flight Pattern (Sine wave fluttering)
      butterfly.phase += delta * 15 * butterfly.speed;
      
      // Wander randomly
      butterfly.velocity.x += (Math.random() - 0.5) * delta;
      butterfly.velocity.y += (Math.random() - 0.5) * delta * 0.5;
      butterfly.velocity.z += (Math.random() - 0.5) * delta;

      // Restrict to bounds (Bioluminescent forest area)
      const distFromCenter = butterfly.position.distanceTo(center);
      if (distFromCenter > radius) {
        const toCenter = center.clone().sub(butterfly.position).normalize();
        butterfly.velocity.add(toCenter.multiplyScalar(delta * 2));
      }

      // Avoid ground
      if (butterfly.position.y < 2) butterfly.velocity.y += delta * 2;
      if (butterfly.position.y > 15) butterfly.velocity.y -= delta * 2;

      // 2. React to Player (Flee if player gets too close)
      if (playerPos) {
        // Convert plain object {x, z} to Vector3 for math. Assume y is roughly 5.
        const pVec = new THREE.Vector3(playerPos.x, 5, playerPos.z);
        const distToPlayer = butterfly.position.distanceTo(pVec);
        if (distToPlayer < 8) { // If player is within 8 units
          const fleeDir = butterfly.position.clone().sub(pVec).normalize();
          butterfly.velocity.add(fleeDir.multiplyScalar(delta * 15)); // Scatter fast!
        }
      }

      // Limit speed
      butterfly.velocity.clampLength(0, 5);

      // Apply velocity to position
      butterfly.position.add(butterfly.velocity.clone().multiplyScalar(delta));

      // Update dummy transform
      dummy.position.copy(butterfly.position);
      
      // Fluttering animation (scale Y to simulate wings flapping)
      const flap = Math.sin(butterfly.phase);
      dummy.scale.set(0.2, 0.05 + Math.abs(flap) * 0.2, 0.2); // Thin wings flapping
      
      // Face movement direction
      const lookAtTarget = butterfly.position.clone().add(butterfly.velocity);
      dummy.lookAt(lookAtTarget);
      
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    if (meshRef.current) {
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      {/* A simple glowing diamond shape for the mechanical butterfly */}
      <octahedronGeometry args={[1, 0]} />
      <meshPhysicalMaterial 
        color="#00FF7F" 
        emissive="#00FF7F"
        emissiveIntensity={2}
        transparent
        opacity={0.8}
        wireframe
      />
    </instancedMesh>
  );
};
