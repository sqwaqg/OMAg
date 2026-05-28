import { useState, useEffect } from 'react'
import useSpeech from '../hooks/useSpeech'

function StoryIntro({ title, text, onComplete }) {
  const [isFadingOut, setIsFadingOut] = useState(false)
  const { speak, stop } = useSpeech()

  // Автоматическая озвучка при появлении
  useEffect(() => {
    speak(text, { rate: 0.95 })
    return () => stop() // ← очистка при размонтировании
  }, [text, speak, stop])

  const handleContinue = () => {
    stop() // ← останавливаем озвучку перед закрытием
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
        maxWidth: '600px',
        width: '90%',
        padding: '40px',
        textAlign: 'center',
        background: 'transparent',
        animation: isFadingOut ? 'slideOut 0.4s ease forwards' : 'slideIn 0.4s ease'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px', animation: 'bounce 0.5s ease' }}>📖</div>
        <h2 style={{ color: '#2e7d32', marginBottom: '20px', fontSize: '2rem', fontWeight: '600' }}>
          {title}
        </h2>
        <p style={{ fontSize: '1.2rem', lineHeight: '1.5', color: '#333', marginBottom: '40px' }}>
          {text}
        </p>
        <button
          onClick={handleContinue}
          style={{
            padding: '12px 30px',
            background: '#2e7d32',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'transform 0.2s'
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