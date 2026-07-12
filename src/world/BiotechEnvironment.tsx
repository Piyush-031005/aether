import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BioTree } from '../components/3d/BioTree';
import { CyberRain } from './CyberRain';
import { ProjectPoneglyphs } from '../components/3d/ProjectPoneglyphs';
import { AchievementMountains } from '../components/3d/AchievementMountains';
import { Signpost } from '../components/3d/Signpost';

// Custom Water Shader Material
const WaterMaterial = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <shaderMaterial
      ref={materialRef}
      transparent
      depthWrite={false}
      uniforms={{
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color('#00BCD4') },
        uColor2: { value: new THREE.Color('#002244') },
      }}
      vertexShader={`
        uniform float uTime;
        varying vec2 vUv;
        varying vec3 vPos;
        
        // Simplex noise function
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy) );
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m; m = m*m;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        void main() {
          vUv = uv;
          vPos = position;
          
          float elevation = snoise(vec2(position.x * 0.2 + uTime * 0.5, position.y * 0.2 + uTime * 0.5)) * 2.0;
          vec3 newPosition = position + vec3(0.0, 0.0, elevation);
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `}
      fragmentShader={`
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        varying vec2 vUv;
        varying vec3 vPos;
        
        void main() {
          float mixStrength = (sin(vPos.z * 0.5 + uTime) + 1.0) * 0.5;
          vec3 color = mix(uColor1, uColor2, mixStrength);
          
          // Add some glowing crests
          float crest = smoothstep(0.8, 1.0, mixStrength);
          color += vec3(crest * 0.5);
          
          gl_FragColor = vec4(color, 0.85); // 85% opacity
        }
      `}
    />
  );
};

export const BiotechEnvironment = () => {
  const treePositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    // Generate scattered trees on the sand dunes
    for (let i = 0; i < 40; i++) {
      const x = (Math.random() - 0.5) * 120;
      const z = (Math.random() - 0.5) * 120;
      // Avoid the center spawning area
      if (Math.abs(x) < 30 && Math.abs(z) < 30) continue;
      positions.push([x, -1, z]);
    }
    return positions;
  }, []);

  return (
    <group>
      {/* Dynamic Cyber-Rain Weather */}
      <CyberRain />

      {/* Massive Cyber-Ocean (North Side) */}
      <mesh position={[0, -0.5, -50]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[200, 100, 128, 64]} />
        <WaterMaterial />
      </mesh>

      {/* Glowing Shoreline Transition (At Z=0 where Ocean meets Sand) */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[200, 0.5, 2]} />
        <meshStandardMaterial color="#00BCD4" emissive="#00BCD4" emissiveIntensity={2} transparent opacity={0.8} />
      </mesh>

      {/* Sand Dunes (South Side / Central Landmass) */}
      <mesh position={[0, -0.1, 50]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[200, 100, 64, 64]} />
        <meshStandardMaterial 
          color="#ffefbe" 
          metalness={0.1} 
          roughness={0.9} 
          wireframe={false} 
        />
      </mesh>

      {/* The Great Digital Waterfall (Far North) */}
      <group position={[0, 20, -95]}>
        <mesh>
          <boxGeometry args={[60, 50, 2]} />
          <meshPhysicalMaterial 
            color="#00BCD4"
            transmission={0.9}
            roughness={0.1}
            thickness={2}
            emissive="#005577"
            emissiveIntensity={0.5}
          />
        </mesh>
        {/* Waterfall Particle Glow */}
        <pointLight color="#00BCD4" position={[0, -10, 5]} intensity={5} distance={50} decay={2} />
      </group>

      {/* Physical Signposts pointing to Zones */}
      <Signpost position={[0, 0, 10]} rotation={[0, 0, 0]} label="^ ACHIEVEMENTS" color="#00BCD4" />
      <Signpost position={[-15, 0, 15]} rotation={[0, Math.PI / 4, 0]} label="<- PONEGLYPH PROJECTS" color="#FF5F1F" />
      <Signpost position={[15, 0, 15]} rotation={[0, -Math.PI / 4, 0]} label="DIGITAL FOREST ->" color="#00FF7F" />

      {/* Epic Monuments */}
      <ProjectPoneglyphs />
      <AchievementMountains />

      {/* Bioluminescent Forest */}
      {treePositions.map((pos, idx) => (
        <BioTree key={`tree-${idx}`} position={pos} />
      ))}
    </group>
  );
};
