import { useState, useEffect, useRef } from 'react'

import botNormal from '../assets/images/bot_normal.png'
import botSleepy from '../assets/images/bot_sleepy.png'
import botSleeping from '../assets/images/bot_sleeping.png'

function BotHelper({ tips, highlight = false }) {
  const [showTip, setShowTip] = useState(false)
  const [currentTip, setCurrentTip] = useState('')
  const [isHovered, setIsHovered] = useState(false)
  const [botState, setBotState] = useState('normal')
  const inactivityTimer = useRef(null)
  const sleepTimer = useRef(null)
  const autoTipTimer = useRef(null)
  const tipTimeoutRef = useRef(null)

  const showRandomTip = () => {
    if (!tips || tips.length === 0) return
    
    if (tipTimeoutRef.current) clearTimeout(tipTimeoutRef.current)
    
    const randomIndex = Math.floor(Math.random() * tips.length)
    setCurrentTip(tips[randomIndex])
    setShowTip(true)
    
    tipTimeoutRef.current = setTimeout(() => {
      setShowTip(false)
    }, 6000)
  }

  const startAutoTipTimer = () => {
    if (autoTipTimer.current) clearInterval(autoTipTimer.current)
    autoTipTimer.current = setInterval(() => {
      if (botState === 'normal' && !showTip) {
        showRandomTip()
      }
    }, 10000)
  }

  const resetInactivityTimer = () => {
    setBotState('normal')
    
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current)
    if (sleepTimer.current) clearTimeout(sleepTimer.current)
    
    inactivityTimer.current = setTimeout(() => {
      setBotState('sleepy')
      
      sleepTimer.current = setTimeout(() => {
        setBotState('sleeping')
      }, 1500)
    }, 15000)
  }

  useEffect(() => {
    const activityEvents = ['click', 'mousemove', 'keydown', 'touchstart']
    
    const handleActivity = () => {
      resetInactivityTimer()
    }
    
    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity)
    })
    
    resetInactivityTimer()
    startAutoTipTimer()
    
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity)
      })
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current)
      if (sleepTimer.current) clearTimeout(sleepTimer.current)
      if (autoTipTimer.current) clearInterval(autoTipTimer.current)
      if (tipTimeoutRef.current) clearTimeout(tipTimeoutRef.current)
    }
  }, [tips])

  useEffect(() => {
    if (isHovered) {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current)
      if (sleepTimer.current) clearTimeout(sleepTimer.current)
      setBotState('normal')
    } else {
      resetInactivityTimer()
    }
  }, [isHovered])

  const handleBotClick = () => {
    showRandomTip()
  }

  const getBotImage = () => {
    switch (botState) {
      case 'sleepy':
        return botSleepy
      case 'sleeping':
        return botSleeping
      default:
        return botNormal
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
          animation: 'none',
          borderRadius: '50%',
          overflow: 'hidden',
          backgroundColor: 'rgba(134, 84, 180, 0.85)',
          border: '3px solid rgba(255, 255, 255, 0.9)',
          boxShadow: isHovered ? '0 8px 30px rgba(0,0,0,0.25)' : '0 6px 20px rgba(0,0,0,0.2)',
          boxSizing: 'border-box'
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
          maxWidth: '350px',
          minWidth: '250px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '24px',
          padding: '18px 24px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          zIndex: 999,
          animation: 'bounceIn 0.3s ease',
        }}>
          <p style={{ margin: 0, fontSize: '1.1rem', color: '#333', lineHeight: '1.5' }}>
            {currentTip}
          </p>
        </div>
      )}

      <style>
        {`
          @keyframes bounceIn {
            0% {
              opacity: 0;
              transform: scale(0.8) translateY(20px);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
        `}
      </style>
    </>
  )
}

export default BotHelper