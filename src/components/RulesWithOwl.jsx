import { useState, useEffect } from 'react';
import useSpeech from '../hooks/useSpeech';
import botSmart from '../assets/images/bot_smart.png';

function RulesWithOwl({ title, text, onPlay }) {
  const [isVisible, setIsVisible] = useState(true);
  const { speak, stop } = useSpeech();

  useEffect(() => {
    speak(text, { rate: 1.1, pitch: 1.15 });
    return () => stop();
  }, [text, speak, stop]);

  const handleStart = () => {
    stop();
    setIsVisible(false);
    onPlay();
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 5000,
      animation: 'fadeIn 0.3s ease'
    }}>
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'clamp(280px, 85vw, 1200px)',
        maxWidth: '1200px'
      }}>
        <div style={{
          position: 'relative',
          width: 'clamp(200px, 65vw, 65%)',
          background: 'rgba(255, 255, 255, 0.97)',
          borderRadius: 'clamp(30px, 8vw, 60px)',
          padding: 'clamp(20px, 5vw, 35px) clamp(25px, 6vw, 45px)',
          textAlign: 'center',
          boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
          border: '3px solid #ffd966',
          animation: 'scaleIn 0.3s ease'
        }}>
          <div style={{
            position: 'absolute',
            right: '-clamp(12px, 3vw, 25px)',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 0,
            height: 0,
            borderTop: 'clamp(10px, 2vw, 20px) solid transparent',
            borderBottom: 'clamp(10px, 2vw, 20px) solid transparent',
            borderLeft: 'clamp(12px, 3vw, 25px) solid rgba(255,255,255,0.97)',
            filter: 'drop-shadow(4px 0 4px rgba(0,0,0,0.1))'
          }} />
          <h2 style={{ color: '#2e7d32', marginBottom: 'clamp(15px, 3vw, 20px)', fontSize: 'clamp(1.2rem, 4vw, 2rem)', fontWeight: 'bold' }}>{title}</h2>
          <div style={{
            background: '#f9f3e0',
            borderRadius: 'clamp(30px, 6vw, 48px)',
            padding: 'clamp(15px, 3vw, 25px) clamp(20px, 4vw, 30px)',
            textAlign: 'left',
            fontSize: 'clamp(0.85rem, 2.5vw, 1.2rem)',
            lineHeight: '1.5',
            color: '#2d3e2b',
            marginBottom: 'clamp(20px, 4vw, 35px)',
            border: '1px solid #ffd966'
          }}>
            {text}
          </div>
          <button
            onClick={handleStart}
            style={{
              padding: 'clamp(8px, 2vw, 14px) clamp(25px, 6vw, 40px)',
              background: 'linear-gradient(135deg, #2e7d32, #1b5e20)',
              color: 'white',
              border: 'none',
              borderRadius: '60px',
              fontSize: 'clamp(0.9rem, 2.5vw, 1.3rem)',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              boxShadow: '0 6px 14px rgba(0,0,0,0.2)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Начать игру
          </button>
        </div>

        <div style={{
          position: 'absolute',
          right: '0',
          transform: 'translateX(50%)',
          width: 'clamp(200px, 30vw, 500px)',
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none'
        }}>
          <img 
            src={botSmart} 
            alt="Совёнок" 
            style={{ 
              width: '100%', 
              height: 'auto', 
              objectFit: 'contain', 
              filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))'
            }} 
          />
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}

export default RulesWithOwl;