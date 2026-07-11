import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { RigidBody, CapsuleCollider, RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';

const SPEED = 5;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();

export const CharacterController = () => {
  const ref = useRef<RapierRigidBody>(null);
  const [, getKeys] = useKeyboardControls();

  useFrame((state) => {
    const { forward, backward, left, right } = getKeys();
    
    if (ref.current) {
      // Calculate movement direction
      frontVector.set(0, 0, Number(backward) - Number(forward));
      sideVector.set(Number(left) - Number(right), 0, 0);
      
      direction
        .subVectors(frontVector, sideVector)
        .normalize()
        .multiplyScalar(SPEED)
        .applyEuler(state.camera.rotation);

      // Apply movement
      ref.current.setLinvel({ x: direction.x, y: ref.current.linvel().y, z: direction.z }, true);

      // Simple Camera follow (smooth)
      const playerPos = ref.current.translation();
      state.camera.position.lerp(
        new THREE.Vector3(playerPos.x, playerPos.y + 1.5, playerPos.z + 5),
        0.1
      );
      state.camera.lookAt(playerPos.x, playerPos.y, playerPos.z);
    }
  });

  return (
    <RigidBody 
      ref={ref} 
      colliders={false} 
      mass={1} 
      type="dynamic" 
      position={[0, 2, 0]} 
      enabledRotations={[false, false, false]}
    >
      <CapsuleCollider args={[0.5, 0.5]} />
      
      {/* Invisible mesh for debugging / visual reference for now */}
      <mesh castShadow>
        <capsuleGeometry args={[0.5, 1, 4]} />
        <meshStandardMaterial color="#E0E0E0" wireframe />
      </mesh>
    </RigidBody>
  );
};
