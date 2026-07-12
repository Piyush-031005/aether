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
        <div style={{ position: 'absolute', top: '10px', left: '10px', color: '#00BCD4', fontFamily: 'var(--font-mono)', fontSize: '10px', zIndex: 10 }}>[ MAP SYSTEM ONLINE ]</div>
      )}

      {/* Grid Lines */}
      <div style={{
        position: 'absolute', width: '100%', height: '100%',
        backgroundImage: 'linear-gradient(#00BCD4 1px, transparent 1px), linear-gradient(90deg, #00BCD4 1px, transparent 1px)',
        backgroundSize: expanded ? '60px 60px' : '30px 30px',
        opacity: 0.15,
        transition: 'background-size 0.4s ease'
      }} />

      {/* --- TOPOGRAPHIC MAP FEATURES (Only visible when expanded) --- */}
      <div style={{
        position: 'absolute', width: '100%', height: '100%',
        opacity: expanded ? 1 : 0, transition: 'opacity 0.4s ease', pointerEvents: 'none'
      }}>
        {/* Mountain Range (Top Left) */}
        <div style={{ position: 'absolute', top: '10%', left: '10%', width: '100px', height: '80px', border: '1px solid #00BCD4', borderRadius: '40% 60% 70% 30%', opacity: 0.5 }}>
          <div style={{ position: 'absolute', top: '10px', left: '10px', width: '60px', height: '40px', border: '1px solid #00BCD4', borderRadius: '30% 70% 50% 50%' }} />
          <div style={{ position: 'absolute', top: '-15px', left: '20px', fontSize: '10px', color: '#00BCD4', fontFamily: 'var(--font-mono)' }}>ACHIEVEMENTS</div>
        </div>

        {/* Mountain Range (Top Right) */}
        <div style={{ position: 'absolute', top: '20%', right: '10%', width: '90px', height: '70px', border: '1px solid #00BCD4', borderRadius: '50% 30% 60% 40%', opacity: 0.5 }}>
          <div style={{ position: 'absolute', top: '15px', right: '15px', width: '50px', height: '30px', border: '1px solid #00BCD4', borderRadius: '40% 60% 40% 60%' }} />
        </div>

        {/* Project Poneglyphs (Left Center) */}
        <div style={{ position: 'absolute', top: '50%', left: '25%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
          <div style={{ fontSize: '10px', color: '#FF5F1F', fontFamily: 'var(--font-mono)' }}>DATABANK</div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ width: '15px', height: '15px', border: '2px solid #FF5F1F', transform: 'rotate(45deg)', boxShadow: '0 0 10px rgba(255, 95, 31, 0.5)' }} />
            <div style={{ width: '15px', height: '15px', border: '2px solid #FF5F1F', transform: 'rotate(45deg)', boxShadow: '0 0 10px rgba(255, 95, 31, 0.5)' }} />
            <div style={{ width: '15px', height: '15px', border: '2px solid #FF5F1F', transform: 'rotate(45deg)', boxShadow: '0 0 10px rgba(255, 95, 31, 0.5)' }} />
          </div>
        </div>

        {/* Digital Forest (Bottom Right) */}
        <div style={{ position: 'absolute', bottom: '20%', right: '25%', width: '120px', height: '100px' }}>
          <div style={{ position: 'absolute', top: '-20px', right: '10px', fontSize: '10px', color: '#00FF7F', fontFamily: 'var(--font-mono)' }}>BIOLUMINESCENT ZONE</div>
          <div style={{ position: 'absolute', top: '20%', left: '30%', width: '20px', height: '20px', border: '1px dashed #00FF7F', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: '50%', left: '60%', width: '25px', height: '25px', border: '1px dashed #00FF7F', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: '60%', left: '10%', width: '15px', height: '15px', border: '1px dashed #00FF7F', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: '10%', left: '70%', width: '18px', height: '18px', border: '1px dashed #00FF7F', borderRadius: '50%' }} />
        </div>
      </div>
      {/* ----------------------------------------------------------- */}

      {/* Radar Sweep Animation (Only visible when minimized) */}
      <style>{`
        @keyframes radar-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
      <div style={{
        position: 'absolute', width: '50%', height: '50%',
        background: 'conic-gradient(from 0deg, transparent 70%, rgba(0, 255, 127, 0.5) 100%)',
        top: 0, left: '50%', transformOrigin: 'bottom left',
        animation: 'radar-spin 4s linear infinite',
        opacity: expanded ? 0 : 1, // Hide sweep when expanded
        transition: 'opacity 0.4s ease'
      }} />

      {/* Player Blip */}
      <div style={{
        position: 'absolute',
        width: expanded ? '12px' : '10px',
        height: expanded ? '12px' : '10px',
        backgroundColor: '#00FF7F',
        borderRadius: '50%',
        boxShadow: '0 0 15px #00FF7F',
        left: `${playerCoords.x}px`,
        top: `${playerCoords.y}px`,
        transform: 'translate(-50%, -50%)',
        transition: 'left 0.1s linear, top 0.1s linear, width 0.4s ease, height 0.4s ease',
        zIndex: 20
      }} />
      
      {/* Center Reticle */}
      <div style={{
        position: 'absolute',
        width: '4px', height: '4px',
        backgroundColor: 'rgba(0, 188, 212, 0.5)',
        borderRadius: '50%',
        zIndex: 20
      }} />
    </div>
  );
};
