import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { PORTFOLIO_DATA } from '../../data/portfolio';

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

  useEffect(() => {
    if (!activeInteraction) {
      setIsOpen(false);
    }
  }, [activeInteraction]);

  if (!isOpen || !activeInteraction) return null;

  // Render logic based on the active zone
  const renderContent = () => {
    switch (activeInteraction) {
      case 'project-1':
        return (
          <>
            <h2 style={{ color: '#00BCD4', textTransform: 'uppercase', letterSpacing: '3px', borderBottom: '1px solid rgba(0,188,212,0.3)', paddingBottom: '10px' }}>DATABANK: Projects</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', marginTop: '20px', maxHeight: '60vh', overflowY: 'auto', paddingRight: '10px' }}>
              {PORTFOLIO_DATA.projects.map((proj) => (
                <div key={proj.id} style={{ background: 'rgba(0,0,0,0.4)', padding: '20px', borderLeft: '3px solid #00BCD4' }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#fff' }}>{proj.title}</h3>
                  <p style={{ color: '#aaa', fontSize: '14px', lineHeight: '1.6' }}>{proj.description}</p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '15px' }}>
                    {proj.techStack.map(tech => (
                      <span key={tech} style={{ fontSize: '11px', color: '#00BCD4', background: 'rgba(0,188,212,0.1)', padding: '4px 8px', borderRadius: '4px' }}>{tech}</span>
                    ))}
                  </div>
                  {proj.repo && (
                    <a href={proj.repo} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '15px', color: '#FF5F1F', textDecoration: 'none', fontSize: '13px', textTransform: 'uppercase' }}>
                      [ View Repository ]
                    </a>
                  )}
                </div>
              ))}
            </div>
          </>
        );

      case 'skills-forge':
        return (
          <>
            <h2 style={{ color: '#FF5F1F', textTransform: 'uppercase', letterSpacing: '3px', borderBottom: '1px solid rgba(255,95,31,0.3)', paddingBottom: '10px' }}>FORGE: Skills & Stack</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
              {PORTFOLIO_DATA.skills.map((category) => (
                <div key={category.title}>
                  <h4 style={{ color: '#fff', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>{category.title}</h4>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {category.skills.map(skill => (
                      <span key={skill} style={{ border: '1px solid rgba(255,95,31,0.5)', padding: '6px 12px', fontSize: '13px', color: '#FF5F1F' }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        );

      case 'history-vault':
        return (
          <>
            <h2 style={{ color: '#E0E0E0', textTransform: 'uppercase', letterSpacing: '3px', borderBottom: '1px solid rgba(224,224,224,0.3)', paddingBottom: '10px' }}>VAULT: History</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px', borderLeft: '1px dashed rgba(255,255,255,0.2)', paddingLeft: '20px' }}>
              {PORTFOLIO_DATA.history.map((item, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '-25px', top: '5px', width: '10px', height: '10px', background: '#fff', borderRadius: '50%' }} />
                  <div style={{ color: '#00BCD4', fontSize: '12px', letterSpacing: '2px', marginBottom: '5px' }}>{item.year}</div>
                  <h3 style={{ margin: '0 0 5px 0', color: '#fff' }}>{item.role} <span style={{ color: '#666' }}>@ {item.company}</span></h3>
                  <p style={{ color: '#aaa', fontSize: '14px', lineHeight: '1.5' }}>{item.description}</p>
                </div>
              ))}
            </div>
          </>
        );

      case 'contact-core':
        return (
          <>
            <h2 style={{ color: '#00BCD4', textTransform: 'uppercase', letterSpacing: '3px', borderBottom: '1px solid rgba(0,188,212,0.3)', paddingBottom: '10px' }}>CORE: Transmission</h2>
            <p style={{ color: '#aaa', marginTop: '20px', marginBottom: '30px' }}>Initiate contact sequence. Open channels available below.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <a href={`mailto:${PORTFOLIO_DATA.contact.email}`} style={{ color: '#fff', textDecoration: 'none', padding: '15px', background: 'rgba(0,188,212,0.1)', border: '1px solid rgba(0,188,212,0.5)', display: 'flex', justifyContent: 'space-between' }}>
                <span>INITIATE EMAIL</span>
                <span style={{ color: '#00BCD4' }}>{PORTFOLIO_DATA.contact.email}</span>
              </a>
              <a href={PORTFOLIO_DATA.contact.github} target="_blank" rel="noreferrer" style={{ color: '#fff', textDecoration: 'none', padding: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', justifyContent: 'space-between' }}>
                <span>ACCESS GITHUB</span>
                <span style={{ color: '#aaa' }}>↗</span>
              </a>
              <a href={PORTFOLIO_DATA.contact.linkedin} target="_blank" rel="noreferrer" style={{ color: '#fff', textDecoration: 'none', padding: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', justifyContent: 'space-between' }}>
                <span>ACCESS LINKEDIN</span>
                <span style={{ color: '#aaa' }}>↗</span>
              </a>
            </div>
          </>
        );

      case 'secret-poneglyph':
        return (
          <>
            <h2 style={{ color: '#FF003C', textTransform: 'uppercase', letterSpacing: '5px', borderBottom: '1px solid rgba(255,0,60,0.3)', paddingBottom: '10px', textAlign: 'center' }}>{PORTFOLIO_DATA.secret.title}</h2>
            <div style={{ padding: '30px', border: '1px solid #FF003C', background: 'rgba(255,0,60,0.05)', marginTop: '20px' }}>
              <p style={{ color: '#fff', fontSize: '18px', lineHeight: '1.8', fontStyle: 'italic', textAlign: 'center' }}>
                "{PORTFOLIO_DATA.secret.message}"
              </p>
              <p style={{ color: '#FF003C', textAlign: 'right', marginTop: '20px', letterSpacing: '2px' }}>
                — {PORTFOLIO_DATA.secret.author}
              </p>
            </div>
          </>
        );

      default:
        return <div>Data Corruption Detected.</div>;
    }
  };

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
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '40px',
        maxWidth: '700px',
        width: '90%',
        color: '#E0E0E0',
        fontFamily: 'var(--font-mono)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        pointerEvents: 'auto'
      }}>
        
        {renderContent()}

        <button 
          onClick={() => setIsOpen(false)}
          style={{
            marginTop: '40px',
            background: 'transparent',
            border: 'none',
            color: '#666',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            fontSize: '12px',
            letterSpacing: '2px',
            transition: 'color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
          onMouseOut={(e) => e.currentTarget.style.color = '#666'}
        >
          [ESC] Close Protocol
        </button>
      </div>
    </div>
  );
};
