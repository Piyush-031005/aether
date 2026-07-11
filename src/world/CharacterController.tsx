import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { RigidBody, CapsuleCollider, RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { TheArchitect } from '../components/3d/TheArchitect';

const SPEED = 8;
const ROTATION_SPEED = 2;

export const CharacterController = () => {
  const ref = useRef<RapierRigidBody>(null);
  const meshRef = useRef<THREE.Group>(null);
  const [, getKeys] = useKeyboardControls();
  
  // Track rotation state
  const [rotationAngle, setRotationAngle] = useState(Math.PI); // Start facing away from camera

  // Camera tracking target
  const cameraTarget = new THREE.Vector3();
  const cameraPosition = new THREE.Vector3();

  useFrame((state, delta) => {
    const { forward, backward, left, right } = getKeys();
    
    if (ref.current && meshRef.current) {
      // 1. Handle Rotation (Steering the hoverboard)
      let turn = 0;
      if (left) turn += 1;
      if (right) turn -= 1;
      
      const newRotation = rotationAngle + (turn * ROTATION_SPEED * delta);
      setRotationAngle(newRotation);

      // Smoothly rotate the visual mesh to match the calculated rotation
      const targetQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), newRotation);
      meshRef.current.quaternion.slerp(targetQuaternion, 0.1);

      // Simulate leaning when turning
      const leanAngle = turn * 0.3; // Lean left/right based on turn
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, leanAngle, 0.1);

      // 2. Handle Movement (Thrust)
      let thrust = 0;
      if (forward) thrust += 1;
      if (backward) thrust -= 0.5; // Reverse is slower

      // Calculate forward vector based on current rotation
      const moveDir = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), newRotation);
      moveDir.multiplyScalar(thrust * SPEED);

      // Apply linear velocity (keep y velocity for gravity/falling)
      const currentVel = ref.current.linvel();
      
      // Smoothly interpolate velocity for a glide/hover effect
      const targetVel = new THREE.Vector3(moveDir.x, currentVel.y, moveDir.z);
      const glideVel = new THREE.Vector3(currentVel.x, currentVel.y, currentVel.z).lerp(targetVel, 0.05);

      ref.current.setLinvel(glideVel, true);

      // 3. Third-Person Chase Camera
      const playerPos = ref.current.translation();
      
      // Calculate desired camera position (behind and slightly above the player)
      const cameraOffset = new THREE.Vector3(0, 2, -6);
      cameraOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), newRotation); // Rotate offset to match player
      
      const idealCameraPos = new THREE.Vector3(playerPos.x, playerPos.y, playerPos.z).add(cameraOffset);
      
      // Smoothly move camera
      cameraPosition.lerp(idealCameraPos, 0.05);
      state.camera.position.copy(cameraPosition);

      // Make camera look at a point slightly above the player
      cameraTarget.set(playerPos.x, playerPos.y + 1, playerPos.z);
      state.camera.lookAt(cameraTarget);
    }
  });

  return (
    <RigidBody 
      ref={ref} 
      colliders={false} 
      mass={1} 
      type="dynamic" 
      position={[0, 2, 0]} 
      enabledRotations={[false, false, false]} // Keep the physical body upright, visual mesh handles leaning
      linearDamping={1} // Adds "air resistance" to the hoverboard
    >
      <CapsuleCollider args={[0.5, 0.5]} />
      
      {/* The Visual Container that rotates and leans */}
      <group ref={meshRef}>
        <TheArchitect />
      </group>
    </RigidBody>
  );
};
