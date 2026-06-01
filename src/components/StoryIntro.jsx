import { useState, useEffect } from 'react'
import useSpeech from '../hooks/useSpeech'

function StoryIntro({ title, text, onComplete }) {
  const [isFadingOut, setIsFadingOut] = useState(false)
  const { speak, stop } = useSpeech()

  useEffect(() => {
    // Небольшая задержка, чтобы избежать конфликта с предыдущей речью
    const timer = setTimeout(() => {
      speak(text, { rate: 0.95 })
    }, 100)
    return () => {
      clearTimeout(timer)
      stop()
    }
  }, [text, speak, stop])

  const handleContinue = () => {
    stop()
    setIsFadingOut(true)
    setTimeout(() => {
      onComplete()
    }, 400)
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, #e8f5e9 0%, #ffffff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      animation: isFadingOut ? 'fadeOut 0.4s ease forwards' : 'fadeIn 0.4s ease'
    }}>
      <div style={{
        maxWidth: '750px',
        width: '85%',
        padding: '50px 40px',
        textAlign: 'center',
        background: 'rgba(255, 255, 240, 0.95)',
        borderRadius: '60px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
        border: '2px solid #ffd966',
        animation: isFadingOut ? 'slideOut 0.4s ease forwards' : 'slideIn 0.4s ease'
      }}>
        <div style={{ fontSize: '5rem', marginBottom: '20px', animation: 'bounce 0.5s ease' }}>📖</div>
        <h2 style={{ color: '#2e7d32', marginBottom: '25px', fontSize: '2.4rem', fontWeight: '700' }}>
          {title}
        </h2>
        <p style={{ fontSize: '1.3rem', lineHeight: '1.5', color: '#333', marginBottom: '40px' }}>
          {text}
        </p>
        <button
          onClick={handleContinue}
          style={{
            padding: '16px 48px',
            background: 'linear-gradient(135deg, #2e7d32, #1b5e20)',
            color: 'white',
            border: 'none',
            borderRadius: '60px',
            fontSize: '1.3rem',
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
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
          }
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes slideOut {
            from {
              opacity: 1;
              transform: translateY(0);
            }
            to {
              opacity: 0;
              transform: translateY(-30px);
            }
          }
          @keyframes bounce {
            0% {
              transform: scale(0.8);
              opacity: 0;
            }
            50% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  )
}

export default StoryIntro