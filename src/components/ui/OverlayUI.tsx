import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../store/useGameStore';

// Mock Data for the Portfolio Content
const PORTFOLIO_DATA: Record<string, { title: string; content: string; tech?: string[] }> = {
  'project-1': {
    title: 'AETHER // The Creator Protocol',
    content: 'A AAA WebGL portfolio experience built with React Three Fiber, Rapier Physics, and Zustand. Features a fully custom Third-Person Hoverboard controller and procedural environments.',
    tech: ['React Three Fiber', 'Rapier', 'Zustand', 'GSAP']
  },
  'skills-forge': {
    title: 'Forge Nexus: Skills',
    content: 'Mastery over the Modern Web Stack. Forging robust architectures that scale from simple landing pages to full-blown 3D immersive experiences.',
    tech: ['React', 'TypeScript', 'Three.js', 'Node.js', 'PostgreSQL']
  },
  'history-vault': {
    title: 'Memory Vault: Origin',
    content: 'Every creator has a beginning. From writing the first console.log() to architecting biomechanical digital civilizations. The journey is continuous.',
  },
  'contact-core': {
    title: 'Helios Reactor: Transmission',
    content: 'The core is stable. Ready to transmit data. Initiate contact sequence to open a direct channel to the Architect.',
  }
};

export const OverlayUI = () => {
  const activeInteraction = useGameStore((state) => state.activeInteraction);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'e' && activeInteraction) {
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeInteraction]);

  // If we move away from the interaction zone, close the modal automatically
  useEffect(() => {
    if (!activeInteraction) {
      setIsOpen(false);
    }
  }, [activeInteraction]);

  if (!isOpen || !activeInteraction) return null;

  const data = PORTFOLIO_DATA[activeInteraction] || { title: 'Unknown Data', content: 'Corrupted data chunk.' };

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'rgba(10, 10, 10, 0.85)',
        backdropFilter: 'blur(10px)',
        border: '1px solid #00BCD4',
        padding: '40px',
        maxWidth: '600px',
        width: '90%',
        color: '#E0E0E0',
        fontFamily: 'var(--font-mono)',
        boxShadow: '0 0 30px rgba(0, 188, 212, 0.2)',
        pointerEvents: 'auto'
      }}>
        <h2 style={{ color: '#FF5F1F', marginTop: 0, textTransform: 'uppercase', letterSpacing: '2px' }}>
          {data.title}
        </h2>
        
        <p style={{ lineHeight: '1.6', fontSize: '16px' }}>
          {data.content}
        </p>

        {data.tech && (
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {data.tech.map((t) => (
              <span key={t} style={{
                background: 'rgba(0, 188, 212, 0.1)',
                border: '1px solid rgba(0, 188, 212, 0.5)',
                padding: '4px 8px',
                fontSize: '12px',
                color: '#00BCD4'
              }}>
                {t}
              </span>
            ))}
          </div>
        )}

        <button 
          onClick={() => setIsOpen(false)}
          style={{
            marginTop: '30px',
            background: 'transparent',
            border: '1px solid #FF5F1F',
            color: '#FF5F1F',
            padding: '10px 20px',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 95, 31, 0.1)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
        >
          [ESC] Close Protocol
        </button>
      </div>
    </div>
  );
};
