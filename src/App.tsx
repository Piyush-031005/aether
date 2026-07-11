import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload, OrbitControls } from '@react-three/drei';
import { Physics } from '@react-three/rapier';

// Temporary Void Component until we build the actual world
const TheVoid = () => {
  return (
    <>
      <color attach="background" args={['#0A0A0A']} />
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#FF5F1F" />
      
      {/* A simple placeholder box to prove 3D is working */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#00BCD4" wireframe />
      </mesh>
    </>
  );
};

function App() {
  return (
    <>
      {/* 3D Canvas Layer */}
      <div className="canvas-container">
        <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
          <Suspense fallback={null}>
            <Physics>
              <TheVoid />
            </Physics>
            <OrbitControls makeDefault />
            <Preload all />
          </Suspense>
        </Canvas>
      </div>

      {/* HTML Overlay UI Layer */}
      <div className="ui-layer">
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: 'var(--font-mono)',
          color: 'var(--color-primary)',
          fontSize: '14px',
          letterSpacing: '4px',
          textTransform: 'uppercase'
        }}>
          Initializing Protocol...
        </div>
      </div>
    </>
  );
}

export default App;
