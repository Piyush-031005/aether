import React, { useEffect, useState } from 'react';
import { Vector3 } from 'three';

// Global state to store player position for the minimap without triggering full React re-renders every frame
export const playerPositionStore = {
  current: new Vector3()
};

export const MiniMap = () => {
  const [pos, setPos] = useState({ x: 0, z: 0 });
  const [expanded, setExpanded] = useState(false);

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
  const mapSize = expanded ? 400 : 150; // Expands on click
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
    <div 
      onClick={() => setExpanded(!expanded)}
      style={{
      position: 'absolute',
      bottom: expanded ? '50%' : '30px',
      right: expanded ? '50%' : '30px',
      transform: expanded ? 'translate(50%, 50%)' : 'none',
      width: `${mapSize}px`,
      height: `${mapSize}px`,
      backgroundColor: 'rgba(10, 20, 30, 0.8)',
      border: '2px solid #00BCD4',
      borderRadius: expanded ? '20px' : '50%', // Square when expanded
      overflow: 'hidden',
      pointerEvents: 'auto',
      cursor: 'pointer',
      boxShadow: '0 0 30px rgba(0, 188, 212, 0.4)',
      backdropFilter: 'blur(15px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    }}>
      {expanded && (
        <div style={{ position: 'absolute', top: '10px', left: '10px', color: '#00BCD4', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>[ CLICK TO MINIMIZE ]</div>
      )}

      {/* Grid Lines */}
      <div style={{
        position: 'absolute', width: '100%', height: '100%',
        backgroundImage: 'linear-gradient(#00BCD4 1px, transparent 1px), linear-gradient(90deg, #00BCD4 1px, transparent 1px)',
        backgroundSize: expanded ? '60px 60px' : '30px 30px',
        opacity: 0.15,
        transition: 'background-size 0.4s ease'
      }} />

      {/* Map Zone Labels */}
      <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: expanded ? '14px' : '8px', color: '#00BCD4', fontFamily: 'var(--font-mono)', fontWeight: 'bold', transition: 'font-size 0.4s ease' }}>ACHIEVEMENTS</div>
      <div style={{ position: 'absolute', top: '50%', left: '15%', transform: 'translate(-50%, -50%)', fontSize: expanded ? '14px' : '8px', color: '#FF5F1F', fontFamily: 'var(--font-mono)', fontWeight: 'bold', transition: 'font-size 0.4s ease' }}>PROJECTS</div>
      <div style={{ position: 'absolute', top: '50%', right: '-5%', transform: 'translate(-50%, -50%)', fontSize: expanded ? '14px' : '8px', color: '#00FF7F', fontFamily: 'var(--font-mono)', fontWeight: 'bold', transition: 'font-size 0.4s ease' }}>FOREST</div>

      {/* Radar Sweep Animation */}
      <style>{`
        @keyframes radar-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
      <div style={{
        position: 'absolute', width: expanded ? '200%' : '50%', height: expanded ? '200%' : '50%',
        background: 'conic-gradient(from 0deg, transparent 70%, rgba(0, 255, 127, 0.5) 100%)',
        top: expanded ? '-50%' : 0, left: '50%', transformOrigin: 'bottom left',
        animation: 'radar-spin 4s linear infinite',
        opacity: expanded ? 0.3 : 1,
        transition: 'all 0.4s ease'
      }} />

      {/* Player Blip */}
      <div style={{
        position: 'absolute',
        width: expanded ? '16px' : '10px',
        height: expanded ? '16px' : '10px',
        backgroundColor: '#00FF7F',
        borderRadius: '50%',
        boxShadow: '0 0 15px #00FF7F',
        left: `${playerCoords.x}px`,
        top: `${playerCoords.y}px`,
        transform: 'translate(-50%, -50%)',
        transition: 'left 0.1s linear, top 0.1s linear, width 0.4s ease, height 0.4s ease'
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
