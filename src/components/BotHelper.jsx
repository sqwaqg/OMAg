import { useState, useEffect, useRef } from 'react'

function BotHelper({ tips }) {
  const [showTip, setShowTip] = useState(false)
  const [currentTip, setCurrentTip] = useState('')
  const timerRef = useRef(null)
  const autoTipTimerRef = useRef(null)

  const showRandomTip = () => {
    console.log('Бот показывает совет:', tips) // Для отладки
    if (!tips || tips.length === 0) {
      setCurrentTip('Нажми на меня, если нужен совет!')
    } else {
      const randomIndex = Math.floor(Math.random() * tips.length)
      setCurrentTip(tips[randomIndex])
    }
    setShowTip(true)
    
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setShowTip(false)
    }, 10000)
  }

  const handleBotClick = () => {
    showRandomTip()
    if (autoTipTimerRef.current) clearTimeout(autoTipTimerRef.current)
    startAutoTipTimer()
  }

  const startAutoTipTimer = () => {
    if (autoTipTimerRef.current) clearTimeout(autoTipTimerRef.current)
    autoTipTimerRef.current = setTimeout(() => {
      if (!showTip) {
        showRandomTip()
      }
    }, 10000)
  }

  useEffect(() => {
    startAutoTipTimer()
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (autoTipTimerRef.current) clearTimeout(autoTipTimerRef.current)
    }
  }, [tips])

  return (
    <>
      <div
        onClick={handleBotClick}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '80px',
          height: '80px',
          cursor: 'pointer',
          zIndex: 1000,
          transition: 'transform 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {/* Заглушка персонажа - заменишь на свою картинку */}
        <div style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#ff6b35',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.5rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
        }}>
          🤖
        </div>
      </div>

      {showTip && (
        <div
          style={{
            position: 'fixed',
            bottom: '120px',
            right: '30px',
            maxWidth: '300px',
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '14px 18px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
            zIndex: 999,
            animation: 'slideIn 0.3s ease-out',
            borderLeft: '5px solid #ff6b35'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>💡</span>
            <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.4', color: '#333', flex: 1 }}>
              {currentTip}
            </p>
            <button
              onClick={() => setShowTip(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1rem',
                cursor: 'pointer',
                color: '#ccc',
                padding: '0 4px'
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </>
  )
}

export default BotHelper