import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { RigidBody, CapsuleCollider, RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { TheArchitect } from '../components/3d/TheArchitect';

const SPEED = 8;
const ROTATION_SPEED = 2;

// All vectors created ONCE at module level — never re-allocated per frame
const _moveDir = new THREE.Vector3();
const _cameraOffset = new THREE.Vector3();
const _idealCameraPos = new THREE.Vector3();
const _playerPos = new THREE.Vector3();
const _cameraTarget = new THREE.Vector3();
const _targetQuat = new THREE.Quaternion();
const _yAxis = new THREE.Vector3(0, 1, 0);

export const CharacterController = () => {
  const bodyRef = useRef<RapierRigidBody>(null);
  const meshRef = useRef<THREE.Group>(null);
  const [, getKeys] = useKeyboardControls();

  // useRef for per-frame mutable values — NEVER triggers React re-renders
  const rotationAngle = useRef(Math.PI);
  const cameraPos = useRef(new THREE.Vector3(0, 4, 8));

  useFrame((state, delta) => {
    if (!bodyRef.current || !meshRef.current) return;

    const { forward, backward, left, right } = getKeys();

    // ── 1. Steering ────────────────────────────────────────────
    let turn = 0;
    if (left) turn += 1;
    if (right) turn -= 1;
    rotationAngle.current += turn * ROTATION_SPEED * delta;

    _targetQuat.setFromAxisAngle(_yAxis, rotationAngle.current);
    meshRef.current.quaternion.slerp(_targetQuat, 0.12);

    // Lean into turns
    meshRef.current.rotation.z = THREE.MathUtils.lerp(
      meshRef.current.rotation.z,
      turn * 0.2,
      0.08
    );

    // ── 2. Thrust ──────────────────────────────────────────────
    let thrust = 0;
    if (forward) thrust = 1;
    if (backward) thrust = -0.5;

    _moveDir
      .set(0, 0, 1)
      .applyAxisAngle(_yAxis, rotationAngle.current)
      .multiplyScalar(thrust * SPEED);

    const vel = bodyRef.current.linvel();
    bodyRef.current.setLinvel(
      {
        x: THREE.MathUtils.lerp(vel.x, _moveDir.x, 0.06),
        y: vel.y,
        z: THREE.MathUtils.lerp(vel.z, _moveDir.z, 0.06),
      },
      true
    );

    // ── 3. Chase Camera ────────────────────────────────────────
    const t = bodyRef.current.translation();
    _playerPos.set(t.x, t.y, t.z);

    // 5 units behind, 2.5 units above — rotates with player
    _cameraOffset.set(0, 2.5, -5).applyAxisAngle(_yAxis, rotationAngle.current);
    _idealCameraPos.copy(_playerPos).add(_cameraOffset);

    // Smooth lerp — absolutely no jumps or zoom-ins
    cameraPos.current.lerp(_idealCameraPos, 0.06);
    state.camera.position.copy(cameraPos.current);

    _cameraTarget.set(t.x, t.y + 1.2, t.z);
    state.camera.lookAt(_cameraTarget);
  });

  return (
    <RigidBody
      ref={bodyRef}
      colliders={false}
      mass={1}
      type="dynamic"
      position={[0, 2, 0]}
      enabledRotations={[false, false, false]}
      linearDamping={2}
    >
      <CapsuleCollider args={[0.5, 0.5]} />
      <group ref={meshRef}>
        <TheArchitect />
      </group>
    </RigidBody>
  );
};
