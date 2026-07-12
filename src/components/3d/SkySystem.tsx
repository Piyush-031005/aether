import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import * as THREE from 'three';
import { create } from 'zustand';

// Global state for Time of Day
export const useTimeStore = create<{
  timeOfDay: 'morning' | 'golden_hour' | 'night';
  setTimeOfDay: (time: 'morning' | 'golden_hour' | 'night') => void;
}>((set) => ({
  timeOfDay: 'golden_hour',
  setTimeOfDay: (time) => set({ timeOfDay: time })
}));

export const SkySystem = () => {
  const timeOfDay = useTimeStore(state => state.timeOfDay);
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);

  // Settings for different times of day
  const timeSettings = {
    morning: {
      sunPosition: [100, 50, 100] as [number, number, number],
      rayleigh: 1.5,
      mieCoefficient: 0.005,
      dirLightIntensity: 2.0,
      dirLightColor: '#ffffff',
      ambientIntensity: 0.6,
      ambientColor: '#ffffff',
      fogColor: '#aaddff',
      fogDensity: 0.005
    },
    golden_hour: {
      sunPosition: [100, 10, -100] as [number, number, number],
      rayleigh: 3,
      mieCoefficient: 0.01,
      dirLightIntensity: 1.5,
      dirLightColor: '#ffaa55',
      ambientIntensity: 0.3,
      ambientColor: '#ff7733',
      fogColor: '#ff7733',
      fogDensity: 0.008
    },
    night: {
      sunPosition: [0, -100, 0] as [number, number, number], // Sun is down
      rayleigh: 0.1,
      mieCoefficient: 0.001,
      dirLightIntensity: 0.1, // Moonlight
      dirLightColor: '#55aaff',
      ambientIntensity: 0.1,
      ambientColor: '#111122',
      fogColor: '#050510',
      fogDensity: 0.015
    }
  };

  const currentSettings = timeSettings[timeOfDay];

  // Smooth transitions between time of day states
  useFrame((state, delta) => {
    if (dirLightRef.current && ambientLightRef.current) {
      // Lerp intensities
      dirLightRef.current.intensity = THREE.MathUtils.lerp(dirLightRef.current.intensity, currentSettings.dirLightIntensity, delta * 2);
      ambientLightRef.current.intensity = THREE.MathUtils.lerp(ambientLightRef.current.intensity, currentSettings.ambientIntensity, delta * 2);
      
      // Update Scene Fog smoothly
      if (state.scene.fog instanceof THREE.FogExp2) {
        state.scene.fog.density = THREE.MathUtils.lerp(state.scene.fog.density, currentSettings.fogDensity, delta * 2);
        
        // Lerp fog color
        const targetFogColor = new THREE.Color(currentSettings.fogColor);
        state.scene.fog.color.lerp(targetFogColor, delta * 2);
        state.scene.background = state.scene.fog.color;
      }
    }
  });

  return (
    <>
      <Sky 
        sunPosition={currentSettings.sunPosition}
        rayleigh={currentSettings.rayleigh}
        mieCoefficient={currentSettings.mieCoefficient}
        mieDirectionalG={0.8}
      />
      <ambientLight ref={ambientLightRef} color={currentSettings.ambientColor} intensity={currentSettings.ambientIntensity} />
      <directionalLight 
        ref={dirLightRef}
        color={currentSettings.dirLightColor}
        position={currentSettings.sunPosition}
        intensity={currentSettings.dirLightIntensity}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={500}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
        shadow-bias={-0.0001}
      />
    </>
  );
};
