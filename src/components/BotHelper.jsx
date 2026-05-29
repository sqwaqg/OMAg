import { useState, useEffect, useRef } from 'react'

import botNormal from '../assets/images/bot_normal.png'
import botSleepy from '../assets/images/bot_sleepy.png'
import botSleeping from '../assets/images/bot_sleeping.png'
import botWaking from '../assets/images/bot_waking.png'
import botHappy from '../assets/images/bot_happy.png'

function BotHelper({ tips, highlight = false, isHappy = false, customTip = '' }) {
  const [showTip, setShowTip] = useState(false)
  const [currentTip, setCurrentTip] = useState('')
  const [isHovered, setIsHovered] = useState(false)
  const [botState, setBotState] = useState('normal')
  
  const inactivityTimer = useRef(null)
  const sleepTimer = useRef(null)
  const wakingTimer = useRef(null)
  const autoTipTimer = useRef(null)
  const tipTimer = useRef(null)

  // Показываем внешнюю подсказку (из игры)
  useEffect(() => {
    if (customTip && customTip !== '') {
      setCurrentTip(customTip)
      setShowTip(true)
      if (tipTimer.current) clearTimeout(tipTimer.current)
      tipTimer.current = setTimeout(() => {
        setShowTip(false)
      }, 5000)
    }
  }, [customTip])

  const showRandomTip = () => {
    if (botState !== 'normal') return
    if (!tips || tips.length === 0) return
    
    if (tipTimer.current) clearTimeout(tipTimer.current)
    
    const randomIndex = Math.floor(Math.random() * tips.length)
    setCurrentTip(tips[randomIndex])
    setShowTip(true)
    
    tipTimer.current = setTimeout(() => {
      setShowTip(false)
    }, 5000)
  }

  const startAutoTips = () => {
    if (autoTipTimer.current) clearInterval(autoTipTimer.current)
    autoTipTimer.current = setInterval(() => {
      if (botState === 'normal' && !showTip) {
        showRandomTip()
      }
    }, 10000)
  }

  const wakeUp = () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current)
    if (sleepTimer.current) clearTimeout(sleepTimer.current)
    
    if (botState === 'sleeping') {
      setBotState('waking')
      if (wakingTimer.current) clearTimeout(wakingTimer.current)
      wakingTimer.current = setTimeout(() => {
        setBotState('normal')
        startInactivityTimer()
      }, 1500)
    } else if (botState === 'sleepy') {
      setBotState('normal')
      startInactivityTimer()
    } else {
      setBotState('normal')
      startInactivityTimer()
    }
  }

  const startInactivityTimer = () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current)
    if (sleepTimer.current) clearTimeout(sleepTimer.current)
    
    inactivityTimer.current = setTimeout(() => {
      setBotState('sleepy')
      sleepTimer.current = setTimeout(() => {
        setBotState('sleeping')
      }, 1500)
    }, 12000)
  }

  const resetInactivity = () => {
    wakeUp()
  }

  useEffect(() => {
    const events = ['click', 'mousemove', 'keydown', 'touchstart']
    const handleActivity = () => resetInactivity()
    
    events.forEach(event => window.addEventListener(event, handleActivity))
    startInactivityTimer()
    startAutoTips()
    
    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity))
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current)
      if (sleepTimer.current) clearTimeout(sleepTimer.current)
      if (wakingTimer.current) clearTimeout(wakingTimer.current)
      if (autoTipTimer.current) clearInterval(autoTipTimer.current)
      if (tipTimer.current) clearTimeout(tipTimer.current)
    }
  }, [])

  useEffect(() => {
    if (botState === 'normal') {
      startAutoTips()
    }
  }, [botState])

  useEffect(() => {
    if (isHovered) {
      resetInactivity()
    }
  }, [isHovered])

  const handleBotClick = () => {
    resetInactivity()
    setTimeout(() => {
      showRandomTip()
    }, 100)
  }

  const getBotImage = () => {
    if (isHappy) return botHappy
    switch (botState) {
      case 'sleepy': return botSleepy
      case 'sleeping': return botSleeping
      case 'waking': return botWaking
      default: return botNormal
    }
  }

  return (
    <>
      <div
        onClick={handleBotClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: isHovered ? '150px' : '140px',
          height: isHovered ? '150px' : '140px',
          cursor: 'pointer',
          zIndex: 1000,
          transition: 'all 0.2s ease',
          borderRadius: '50%',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #c5a3ff, #8b5cf6, #6d28d9, #4c1d95)',
          border: '3px solid rgba(255, 255, 255, 0.9)',
          boxShadow: isHovered ? '0 8px 30px rgba(0,0,0,0.3)' : '0 6px 20px rgba(0,0,0,0.2)'
        }}
      >
        <img 
          src={getBotImage()} 
          alt="Помощник"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
            padding: '12px'
          }}
        />
      </div>

      {showTip && (
        <div style={{
          position: 'fixed',
          bottom: '180px',
          right: '30px',
          maxWidth: '320px',
          minWidth: '240px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '24px',
          padding: '16px 22px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          zIndex: 999,
          animation: 'fadeInUp 0.2s ease'
        }}>
          <p style={{ margin: 0, fontSize: '1rem', color: '#333', lineHeight: '1.45' }}>
            {currentTip}
          </p>
        </div>
      )}

      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(10px);
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