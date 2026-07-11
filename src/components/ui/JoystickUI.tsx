import React, { useEffect, useRef } from 'react';
import { useJoystickStore } from '../../store/useJoystickStore';
import nipplejs from 'nipplejs';

export const JoystickUI = () => {
  const joystickContainerRef = useRef<HTMLDivElement>(null);
  const setInputs = useJoystickStore((state) => state.setInputs);
  
  // Only show on touch devices
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  useEffect(() => {
    if (!isTouchDevice || !joystickContainerRef.current) return;

    const manager = nipplejs.create({
      zone: joystickContainerRef.current,
      mode: 'static',
      position: { left: '50%', top: '50%' },
      color: '#00BCD4',
      size: 100,
    });

    // @ts-ignore
    manager.on('move', (_: any, data: any) => {
      const angle = data.angle.degree;
      const distance = data.distance; // 0 to 50

      // Reset
      let forward = false, backward = false, left = false, right = false;

      // Only trigger if we pushed the stick far enough
      if (distance > 10) {
        if (angle >= 45 && angle <= 135) forward = true;
        else if (angle >= 225 && angle <= 315) backward = true;
        
        if (angle >= 135 && angle <= 225) left = true;
        else if (angle <= 45 || angle >= 315) right = true;
      }

      setInputs({ forward, backward, left, right });
    });

    manager.on('end', () => {
      setInputs({ forward: false, backward: false, left: false, right: false });
    });

    return () => {
      manager.destroy();
    };
  }, [isTouchDevice, setInputs]);

  if (!isTouchDevice) return null;

  return (
    <>
      {/* Left Joystick Zone */}
      <div 
        ref={joystickContainerRef}
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '40px',
          width: '120px',
          height: '120px',
          background: 'rgba(0,188,212,0.05)',
          border: '1px solid rgba(0,188,212,0.2)',
          borderRadius: '50%',
          zIndex: 1000,
          pointerEvents: 'auto'
        }}
      />
      
      {/* Right Action Button */}
      <div 
        style={{
          position: 'absolute',
          bottom: '60px',
          right: '40px',
          zIndex: 1000,
          pointerEvents: 'auto'
        }}
      >
        <button
          onPointerDown={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'e' }))}
          onPointerUp={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'e' }))}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(255,95,31,0.1)',
            border: '2px solid rgba(255,95,31,0.5)',
            color: '#FF5F1F',
            fontFamily: 'var(--font-mono)',
            fontSize: '18px',
            fontWeight: 'bold',
            boxShadow: '0 0 20px rgba(255,95,31,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
            WebkitUserSelect: 'none'
          }}
        >
          [ E ]
        </button>
      </div>
    </>
  );
};
