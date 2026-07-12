import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { RigidBody, CapsuleCollider, RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { TheArchitect } from '../components/3d/TheArchitect';
import { FloatingAI } from '../components/3d/FloatingAI';
import { audioSystem } from '../systems/AudioSystem';

import { useJoystickStore } from '../store/useJoystickStore';

const SPEED = 25;
const ROTATION_SPEED = 3;

// All vectors created ONCE at module level — never re-allocated per frame
const _moveDir = new THREE.Vector3();
const _cameraOffset = new THREE.Vector3();
const _idealCameraPos = new THREE.Vector3();
const _playerPos = new THREE.Vector3();
const _cameraTarget = new THREE.Vector3();
const _yAxis = new THREE.Vector3(0, 1, 0);

export const CharacterController = () => {
  const bodyRef = useRef<RapierRigidBody>(null);

  // TWO separate refs — CRITICAL to prevent quaternion/euler conflict
  // yawRef  → handles left/right rotation via quaternion (Y-axis only)
  // leanRef → handles the tilt lean via euler Z (child of yawRef)
  const yawRef = useRef<THREE.Group>(null);
  const leanRef = useRef<THREE.Group>(null);

  const [, getKeys] = useKeyboardControls();

  // Per-frame mutable state — never triggers re-renders
  const rotationAngle = useRef(Math.PI);
  const cameraPos = useRef(new THREE.Vector3(0, 4, 8));

  useFrame((state, delta) => {
    if (!bodyRef.current || !yawRef.current || !leanRef.current) return;

    const keys = getKeys();
    const joystick = useJoystickStore.getState();

    // Merge inputs
    const forward = keys.forward || joystick.forward;
    const backward = keys.backward || joystick.backward;
    const left = keys.left || joystick.left;
    const right = keys.right || joystick.right;

    // ── 1. Steering (YAW) — quaternion only on yawRef ──────────
    let turn = 0;
    if (left) turn += 1;
    if (right) turn -= 1;
    rotationAngle.current += turn * ROTATION_SPEED * delta;

    // Directly set quaternion on the YAW group — no euler involved here
    yawRef.current.quaternion.setFromAxisAngle(_yAxis, rotationAngle.current);

    // ── 2. Lean (ROLL) — euler only on leanRef (child) ─────────
    // This child never has its quaternion touched, so no conflict
    leanRef.current.rotation.z = THREE.MathUtils.lerp(
      leanRef.current.rotation.z,
      -turn * 0.2,   // negative = lean into turn direction
      0.08
    );

    // ── 3. Thrust & Flight ─────────────────────────────────────────
    let thrust = 0;
    if (forward) thrust = 1;
    if (backward) thrust = -0.5;

    let verticalThrust = 0;
    if (keys.jump) verticalThrust = 1;
    if (keys.sprint) verticalThrust = -1; // Assuming 'sprint' is mapped to Shift for down

    _moveDir
      .set(0, 0, 1)
      .applyAxisAngle(_yAxis, rotationAngle.current)
      .multiplyScalar(thrust * SPEED);

    const vel = bodyRef.current.linvel();
    
    // Calculate new Y velocity (Flight)
    // If not flying, let gravity do its job, but dampen falling slightly
    let newY = vel.y;
    if (verticalThrust !== 0) {
      newY = THREE.MathUtils.lerp(vel.y, verticalThrust * (SPEED * 0.5), 0.1);
    }

    bodyRef.current.setLinvel(
      {
        x: THREE.MathUtils.lerp(vel.x, _moveDir.x, 0.06),
        y: newY,
        z: THREE.MathUtils.lerp(vel.z, _moveDir.z, 0.06),
      },
      true
    );

    // Update engine pitch based on actual velocity
    const currentSpeed = Math.sqrt(vel.x * vel.x + newY * newY + vel.z * vel.z);
    const speedRatio = Math.min(currentSpeed / SPEED, 1);
    audioSystem.setEngineSpeed(speedRatio);

    // ── 4. Chase Camera ─────────────────────────────────────────
    const t = bodyRef.current.translation();
    _playerPos.set(t.x, t.y, t.z);

    _cameraOffset.set(0, 2.5, -5).applyAxisAngle(_yAxis, rotationAngle.current);
    _idealCameraPos.copy(_playerPos).add(_cameraOffset);

    cameraPos.current.lerp(_idealCameraPos, 0.06);
    state.camera.position.copy(cameraPos.current);

    _cameraTarget.set(t.x, t.y + 1.2, t.z);
    state.camera.lookAt(_cameraTarget);
  });

  return (
    <RigidBody
      ref={bodyRef}
      colliders="hull"
      mass={1}
      type="dynamic"
      position={[0, 5, 30]}
      enabledRotations={[false, true, false]}
      friction={0}
    >
      <CapsuleCollider args={[0.5, 0.5]} />

      {/* Outer group: YAW only (quaternion) */}
      <group ref={yawRef}>
        {/* Inner group: LEAN only (euler Z) — isolated from yaw quaternion */}
        <group ref={leanRef}>
          <TheArchitect />
          <group position={[0.8, 1, 0.8]}>
            <FloatingAI />
          </group>
        </group>
      </group>
    </RigidBody>
  );
};
