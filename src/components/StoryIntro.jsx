import { useState, useEffect } from 'react';
import useSpeech from '../hooks/useSpeech';
import botSmart from '../assets/images/bot_smart.png';

function StoryIntro({ title, text, onComplete }) {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const { speak, stop } = useSpeech();

  useEffect(() => {
    const timer = setTimeout(() => {
      speak(text, { rate: 1.1 });
    }, 100);
    return () => {
      clearTimeout(timer);
      stop();
    };
  }, [text, speak, stop]);

  const handleContinue = () => {
    stop();
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 400);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 50%, #1b5e20 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      animation: isFadingOut ? 'fadeOut 0.4s ease forwards' : 'fadeIn 0.4s ease'
    }}>
      <div style={{
        maxWidth: 'clamp(300px, 80vw, 750px)',
        width: '85%',
        padding: 'clamp(25px, 5vw, 50px) clamp(25px, 6vw, 40px)',
        textAlign: 'center',
        background: 'rgba(255, 255, 240, 0.95)',
        borderRadius: 'clamp(30px, 8vw, 60px)',
        boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
        border: '2px solid #ffd966',
        animation: isFadingOut ? 'slideOut 0.4s ease forwards' : 'slideIn 0.4s ease'
      }}>
        <img src={botSmart} alt="Совёнок" style={{ width: 'clamp(60px, 12vw, 100px)', height: 'auto', marginBottom: 'clamp(10px, 2vw, 20px)', objectFit: 'contain' }} />
        <h2 style={{ color: '#2e7d32', marginBottom: 'clamp(15px, 3vw, 25px)', fontSize: 'clamp(1.2rem, 5vw, 2.4rem)', fontWeight: '700' }}>{title}</h2>
        <p style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.3rem)', lineHeight: '1.5', color: '#333', marginBottom: 'clamp(25px, 5vw, 40px)' }}>{text}</p>
        <button
          onClick={handleContinue}
          style={{
            padding: 'clamp(10px, 2vw, 16px) clamp(30px, 6vw, 48px)',
            background: 'linear-gradient(135deg, #2e7d32, #1b5e20)',
            color: 'white',
            border: 'none',
            borderRadius: '60px',
            fontSize: 'clamp(0.9rem, 2.5vw, 1.3rem)',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Продолжить →
        </button>
      </div>

      <style>
        {`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
          @keyframes slideIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes slideOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-30px); } }
        `}
      </style>
    </div>
  );
}

export default StoryIntro;