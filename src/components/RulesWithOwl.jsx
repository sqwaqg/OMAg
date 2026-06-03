import { useState, useEffect } from 'react';
import useSpeech from '../hooks/useSpeech';
import botSmart from '../assets/images/bot_smart.png';

function RulesWithOwl({ title, text, onPlay }) {
  const [isVisible, setIsVisible] = useState(true);
  const { speak, stop } = useSpeech();

  useEffect(() => {
    speak(text, { rate: 0.95, pitch: 1.15 });
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
        width: '85%',
        maxWidth: '1200px'
      }}>
        {/* Облачко – слева, центрировано */}
        <div style={{
          position: 'relative',
          width: '65%',
          background: 'rgba(255, 255, 255, 0.97)',
          borderRadius: '60px',
          padding: '35px 45px',
          textAlign: 'center',
          boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
          border: '3px solid #ffd966',
          animation: 'scaleIn 0.3s ease'
        }}>
          {/* Стрелка вправо – к совёнку */}
          <div style={{
            position: 'absolute',
            right: '-25px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 0,
            height: 0,
            borderTop: '20px solid transparent',
            borderBottom: '20px solid transparent',
            borderLeft: '25px solid rgba(255,255,255,0.97)',
            filter: 'drop-shadow(4px 0 4px rgba(0,0,0,0.1))'
          }} />
          <h2 style={{ color: '#2e7d32', marginBottom: '20px', fontSize: '2rem', fontWeight: 'bold' }}>{title}</h2>
          <div style={{
            background: '#f9f3e0',
            borderRadius: '48px',
            padding: '25px 30px',
            textAlign: 'left',
            fontSize: '1.2rem',
            lineHeight: '1.5',
            color: '#2d3e2b',
            marginBottom: '35px',
            border: '1px solid #ffd966'
          }}>
            {text}
          </div>
          <button
            onClick={handleStart}
            style={{
              padding: '14px 40px',
              background: 'linear-gradient(135deg, #2e7d32, #1b5e20)',
              color: 'white',
              border: 'none',
              borderRadius: '60px',
              fontSize: '1.3rem',
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

        {/* Совёнок – абсолютно справа */}
        <div style={{
          position: 'absolute',
          right: '0',
          transform: 'translateX(50%)',
          width: '500px',
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none'
        }}>
          <img 
            src={botSmart} 
            alt="Совёнок" 
            style={{ 
              width: '500px', 
              height: '500px', 
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