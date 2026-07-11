import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload, KeyboardControls } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { EffectComposer, Bloom, ChromaticAberration, Noise, SMAA } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

import { TheVoid } from './world/TheVoid';
import { World } from './world/World';
import { audioSystem } from './systems/AudioSystem';
import { OverlayUI } from './components/ui/OverlayUI';

// Key bindings map for the character controller
const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'jump', keys: ['Space'] },
];

function App() {
  const [phase, setPhase] = useState<'idle' | 'void' | 'world'>('idle');

  const handleInitialize = () => {
    setPhase('void');
    audioSystem.startHeartbeat();
    
    // Simulate transitioning from Void to the actual world after 6 seconds
    setTimeout(() => {
      setPhase('world');
      audioSystem.stopHeartbeat();
      
      // Start the immersive world audio
      audioSystem.startWorldAmbience();
      audioSystem.startEngine();
    }, 6000);
  };

  return (
    <>
      {/* 3D Canvas Layer */}
      <div className="canvas-container">
        <KeyboardControls map={keyboardMap}>
          <Canvas dpr={[1, 2]} shadows camera={{ position: [0, 2, 5], fov: 50 }} gl={{ antialias: false }}>
            <Suspense fallback={null}>
              
              {phase === 'void' && <TheVoid />}
              
              {phase === 'world' && (
                <Physics>
                  <World />
                </Physics>
              )}
              
              {/* God-Tier AAA Post-Processing */}
              <EffectComposer multisampling={0}>
                <SMAA />
                <Bloom 
                  luminanceThreshold={0.5} 
                  mipmapBlur 
                  intensity={1.2} 
                />
                <ChromaticAberration 
                  blendFunction={BlendFunction.NORMAL} 
                  offset={new THREE.Vector2(0.001, 0.001)} 
                  radialModulation={false}
                  modulationOffset={0}
                />
                <Noise opacity={0.03} />
              </EffectComposer>

              <Preload all />
            </Suspense>
          </Canvas>
        </KeyboardControls>
      </div>

      {/* HTML Overlay UI Layer */}
      <div className="ui-layer">
        {phase === 'idle' && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            pointerEvents: 'auto'
          }}>
            <button 
              onClick={handleInitialize}
              style={{
                background: 'transparent',
                border: '1px solid var(--color-primary)',
                color: 'var(--color-primary)',
                padding: '12px 24px',
                fontFamily: 'var(--font-mono)',
                fontSize: '14px',
                letterSpacing: '4px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 0 15px rgba(255, 95, 31, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-primary)';
                e.currentTarget.style.color = '#000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--color-primary)';
              }}
            >
              Enter The Codex
            </button>
          </div>
        )}

        {phase === 'void' && (
          <div style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-accent)',
            fontSize: '12px',
            letterSpacing: '8px',
            textTransform: 'uppercase',
            opacity: 0.8
          }}>
            Constructing Neural Pathways...
          </div>
        )}

        {phase === 'world' && (
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-text-main)',
            fontSize: '12px',
            letterSpacing: '2px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div><span style={{ color: 'var(--color-primary)' }}>[W,A,S,D]</span> MOVE</div>
            <div><span style={{ color: 'var(--color-accent)' }}>[E]</span> INTERACT</div>
            <div><span style={{ color: 'var(--color-accent)' }}>ZONE:</span> PROTOTYPE VALLEY</div>
          </div>
        )}
      </div>

      {/* 2D HTML Overlays */}
      <OverlayUI />
    </>
  );
}

export default App;
