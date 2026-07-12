import React, { useEffect, useState } from 'react';
import { Vector3 } from 'three';

// Global state to store player position for the minimap without triggering full React re-renders every frame
export const playerPositionStore = {
  current: new Vector3()
};

export const MiniMap = () => {
  const [pos, setPos] = useState({ x: 0, z: 0 });

  // Update the UI less frequently than 60fps to save performance
  useEffect(() => {
    const interval = setInterval(() => {
      setPos({
        x: playerPositionStore.current.x,
        z: playerPositionStore.current.z
      });
    }, 100); // 10fps update for UI map
    return () => clearInterval(interval);
  }, []);

  // Map settings
  const mapSize = 150; // Visual size in px
  const worldSize = 200; // Represents -100 to 100 in game world
  
  // Convert world coordinates to minimap coordinates
  const getMapCoords = (worldX: number, worldZ: number) => {
    const scale = mapSize / worldSize;
    // Map center is 0,0. We need to shift it to center of the mapSize
    const x = (worldX + worldSize / 2) * scale;
    const y = (worldZ + worldSize / 2) * scale; // Z maps to Y on screen
    return { x, y };
  };

  const playerCoords = getMapCoords(pos.x, pos.z);

  return (
    <div style={{
      position: 'absolute',
      bottom: '30px',
      right: '30px',
      width: `${mapSize}px`,
      height: `${mapSize}px`,
      backgroundColor: 'rgba(10, 20, 30, 0.6)',
      border: '2px solid #00BCD4',
      borderRadius: '50%', // Circular radar
      overflow: 'hidden',
      pointerEvents: 'none',
      boxShadow: '0 0 20px rgba(0, 188, 212, 0.3)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100
    }}>
      {/* Grid Lines */}
      <div style={{
        position: 'absolute', width: '100%', height: '100%',
        backgroundImage: 'linear-gradient(#00BCD4 1px, transparent 1px), linear-gradient(90deg, #00BCD4 1px, transparent 1px)',
        backgroundSize: '30px 30px',
        opacity: 0.2
      }} />

      {/* Radar Sweep Animation */}
      <style>{`
        @keyframes radar-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
      <div style={{
        position: 'absolute', width: '50%', height: '50%',
        background: 'conic-gradient(from 0deg, transparent 70%, rgba(0, 255, 127, 0.5) 100%)',
        top: 0, left: '50%', transformOrigin: 'bottom left',
        animation: 'radar-spin 4s linear infinite',
      }} />

      {/* Player Blip */}
      <div style={{
        position: 'absolute',
        width: '10px',
        height: '10px',
        backgroundColor: '#00FF7F',
        borderRadius: '50%',
        boxShadow: '0 0 10px #00FF7F',
        left: `${playerCoords.x}px`,
        top: `${playerCoords.y}px`,
        transform: 'translate(-50%, -50%)',
        transition: 'left 0.1s linear, top 0.1s linear'
      }} />
      
      {/* Center Reticle */}
      <div style={{
        position: 'absolute',
        width: '4px', height: '4px',
        backgroundColor: 'rgba(0, 188, 212, 0.5)',
        borderRadius: '50%'
      }} />
    </div>
  );
};
