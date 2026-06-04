import { useState, useEffect, useRef } from 'react';
import useSpeech from '../hooks/useSpeech';

import botNormal from '../assets/images/bot_normal.png';
import botSleepy from '../assets/images/bot_sleepy.png';
import botSleeping from '../assets/images/bot_sleeping.png';
import botWaking from '../assets/images/bot_waking.png';
import botHappy from '../assets/images/bot_happy.png';

function BotHelper({ tips, highlight = false, isHappy = false, customTip = '', disableAutoTips = false, isMuted = false }) {
  const [showTip, setShowTip] = useState(false);
  const [currentTip, setCurrentTip] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [botState, setBotState] = useState('normal');
  const { speak, stop } = useSpeech();

  const inactivityTimer = useRef(null);
  const sleepTimer = useRef(null);
  const wakingTimer = useRef(null);
  const autoTipTimer = useRef(null);
  const tipTimer = useRef(null);

  // Озвучивание подсказки (учитывает isMuted и disableAutoTips)
  const speakTip = (tipText) => {
    if (isMuted) return;
    if (disableAutoTips) return; // не озвучиваем во время диалогов/игр
    stop(); // останавливаем текущую речь, чтобы не перебивать саму себя, но если идёт диалог, он всё равно не даст боту говорить из-за disableAutoTips
    speak(tipText, { rate: 0.95, pitch: 1.15, speaker: 'bot' });
  };

  // Обработка customTip (подсказки из игры)
  useEffect(() => {
    if (customTip && customTip !== '') {
      if (tipTimer.current) {
        clearTimeout(tipTimer.current);
        tipTimer.current = null;
      }
      setShowTip(false);
      setTimeout(() => {
        setCurrentTip(customTip);
        setShowTip(true);
        const duration = Math.min(8000, Math.max(2500, customTip.length * 70));
        tipTimer.current = setTimeout(() => {
          setShowTip(false);
          tipTimer.current = null;
        }, duration);
        // Озвучиваем, если не отключено
        if (!disableAutoTips && !isMuted) {
          speakTip(customTip);
        }
      }, 50);
    }
  }, [customTip, disableAutoTips, isMuted]);

  const showRandomTip = () => {
    if (disableAutoTips) return;
    if (botState !== 'normal') return;
    if (!tips || tips.length === 0) return;

    if (tipTimer.current) clearTimeout(tipTimer.current);
    const randomIndex = Math.floor(Math.random() * tips.length);
    const tipText = tips[randomIndex];
    setCurrentTip(tipText);
    setShowTip(true);
    const duration = Math.min(8000, Math.max(3000, tipText.length * 60));
    tipTimer.current = setTimeout(() => {
      setShowTip(false);
      tipTimer.current = null;
    }, duration);
    // Озвучиваем
    speakTip(tipText);
  };

  const startAutoTips = () => {
    if (disableAutoTips) return;
    if (autoTipTimer.current) clearInterval(autoTipTimer.current);
    autoTipTimer.current = setInterval(() => {
      if (botState === 'normal' && !showTip && !customTip) {
        showRandomTip();
      }
    }, 10000);
  };

  const wakeUp = () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (sleepTimer.current) clearTimeout(sleepTimer.current);
    if (botState === 'sleeping') {
      setBotState('waking');
      if (wakingTimer.current) clearTimeout(wakingTimer.current);
      wakingTimer.current = setTimeout(() => {
        setBotState('normal');
        startInactivityTimer();
      }, 1500);
    } else if (botState === 'sleepy') {
      setBotState('normal');
      startInactivityTimer();
    } else {
      setBotState('normal');
      startInactivityTimer();
    }
  };

  const startInactivityTimer = () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (sleepTimer.current) clearTimeout(sleepTimer.current);
    inactivityTimer.current = setTimeout(() => {
      setBotState('sleepy');
      sleepTimer.current = setTimeout(() => setBotState('sleeping'), 1500);
    }, 12000);
  };

  const resetInactivity = () => wakeUp();

  useEffect(() => {
    const events = ['click', 'mousemove', 'keydown', 'touchstart'];
    const handleActivity = () => resetInactivity();
    events.forEach(event => window.addEventListener(event, handleActivity));
    startInactivityTimer();
    if (!disableAutoTips) startAutoTips();
    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      if (sleepTimer.current) clearTimeout(sleepTimer.current);
      if (wakingTimer.current) clearTimeout(wakingTimer.current);
      if (autoTipTimer.current) clearInterval(autoTipTimer.current);
      if (tipTimer.current) clearTimeout(tipTimer.current);
      stop();
    };
  }, [disableAutoTips, stop]);

  useEffect(() => {
    if (botState === 'normal' && !disableAutoTips && !customTip) startAutoTips();
  }, [botState, disableAutoTips, customTip]);

  useEffect(() => {
    if (isHovered) resetInactivity();
  }, [isHovered]);

  const handleBotClick = () => {
    resetInactivity();
    if (!customTip && !disableAutoTips) {
      setTimeout(() => showRandomTip(), 100);
    }
  };

  const getBotImage = () => {
    if (isHappy) return botHappy;
    switch (botState) {
      case 'sleepy': return botSleepy;
      case 'sleeping': return botSleeping;
      case 'waking': return botWaking;
      default: return botNormal;
    }
  };

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
          width: isHovered ? '170px' : '160px',
          height: isHovered ? '170px' : '160px',
          cursor: 'pointer',
          zIndex: 1000,
          transition: 'all 0.2s ease',
          borderRadius: '50%',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #e9d5ff, #c084fc, #a855f7, #7e22ce)',
          border: '3px solid rgba(255, 255, 255, 0.9)',
          boxShadow: isHovered ? '0 8px 30px rgba(0,0,0,0.3)' : '0 6px 20px rgba(0,0,0,0.2)'
        }}
      >
        <img
          src={getBotImage()}
          alt="Помощник"
          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', padding: '12px' }}
        />
      </div>

      {showTip && (
        <div
          style={{
            position: 'fixed',
            bottom: '200px',
            right: '30px',
            maxWidth: '380px',
            minWidth: '280px',
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            borderRadius: '32px',
            padding: '20px 28px',
            boxShadow: '0 12px 28px rgba(0,0,0,0.2)',
            zIndex: 1001,
            animation: 'bubblePop 0.25s ease-out',
            border: '1px solid #ffd966',
            backdropFilter: 'blur(2px)'
          }}
        >
          <div
            style={{
              position: 'absolute',
              bottom: '-10px',
              right: '25px',
              width: 0,
              height: 0,
              borderLeft: '12px solid transparent',
              borderRight: '12px solid transparent',
              borderTop: '12px solid rgba(255,255,255,0.98)',
              filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.1))'
            }}
          />
          <p style={{ margin: 0, fontSize: '1.15rem', color: '#2d3e2b', lineHeight: '1.5', fontWeight: 500 }}>
            {currentTip}
          </p>
        </div>
      )}

      <style>{`
        @keyframes bubblePop {
          0% { opacity: 0; transform: translateY(15px) scale(0.9); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}

export default BotHelper;