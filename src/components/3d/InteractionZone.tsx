import React, { useState } from 'react';
import { RigidBody } from '@react-three/rapier';
import { Html } from '@react-three/drei';
import { useGameStore } from '../../store/useGameStore';

interface InteractionZoneProps {
  id: string;
  position: [number, number, number];
  radius?: number;
  label?: string;
}

export const InteractionZone: React.FC<InteractionZoneProps> = ({ id, position, radius = 2, label = 'INTERACT' }) => {
  const [isNear, setIsNear] = useState(false);
  const setActiveInteraction = useGameStore((state) => state.setActiveInteraction);

  const handleEnter = () => {
    setIsNear(true);
    setActiveInteraction(id);
  };

  const handleExit = () => {
    setIsNear(false);
    setActiveInteraction(null);
  };

  return (
    <group position={position}>
      {/* Invisible Sensor */}
      <RigidBody 
        type="fixed" 
        sensor 
        onIntersectionEnter={handleEnter} 
        onIntersectionExit={handleExit}
      >
        <cylinderCollider args={[2, radius]} />
      </RigidBody>

      {/* Holographic Prompt */}
      {isNear && (
        <Html position={[0, 1.5, 0]} center distanceFactor={10} zIndexRange={[100, 0]}>
          <div style={{
            background: 'rgba(10, 10, 10, 0.8)',
            border: '1px solid #FF5F1F',
            padding: '8px 12px',
            color: '#FF5F1F',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            pointerEvents: 'none',
            animation: 'pulse 2s infinite'
          }}>
            [E] {label}
          </div>
        </Html>
      )}
      
      {/* Optional: Glow ring on the floor to indicate the zone visually */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[radius - 0.2, radius, 32]} />
        <meshBasicMaterial color={isNear ? "#FF5F1F" : "#00BCD4"} transparent opacity={0.3} />
      </mesh>
    </group>
  );
};
