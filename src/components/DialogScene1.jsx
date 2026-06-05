import { useState, useEffect, useRef } from 'react'
import useSpeech from '../hooks/useSpeech'
import background1 from '../assets/images/background1.png'
import foxChildNoMoney from '../assets/images/fox_child_no_money.png'
import foxChildWithMoney from '../assets/images/fox_child_with_money.png'
import foxMother from '../assets/images/fox_mother.png'
import milkIcon1 from '../assets/images/milk1.png'
import breadIcon1 from '../assets/images/bread1.png'
import eggsIcon1 from '../assets/images/eggs1.png'
import carrotIcon1 from '../assets/images/carrot1.png'

function DialogScene1({ onComplete, balance, onBotHint, dialogs, onUpdateBalance, onExit, onSkip, playSfx }) {
  const [step, setStep] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [motherLeaving, setMotherLeaving] = useState(false)
  const [showMoneyEffect, setShowMoneyEffect] = useState(false)
  const [hasMoney, setHasMoney] = useState(false)
  const [showListModal, setShowListModal] = useState(false)
  const { speak, stop } = useSpeech()
  const isSpeakingRef = useRef(false)
  const timeoutRef = useRef(null)
  const stepRef = useRef(step)
  const ringPlayedRef = useRef(false)

  const getDialogText = (dialog) => {
    if (typeof dialog.text === 'function') return dialog.text(balance);
    return dialog.text;
  };

  useEffect(() => { stepRef.current = step }, [step])

  useEffect(() => {
    return () => {
      stop()
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [stop])

  useEffect(() => {
    if (playSfx && !ringPlayedRef.current) {
      ringPlayedRef.current = true
      playSfx('ring')
    }
  }, [playSfx])

  const speakFull = async (text, speakerType) => {
    if (isSpeakingRef.current) {
      stop()
      isSpeakingRef.current = false
      await new Promise(r => setTimeout(r, 50))
    }
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'ru-RU'
      utterance.rate = 1.0
      utterance.pitch = speakerType === 'child' ? 1.3 : 1.0
      utterance.onend = () => { isSpeakingRef.current = false; resolve() }
      utterance.onerror = () => { isSpeakingRef.current = false; resolve() }
      isSpeakingRef.current = true
      window.speechSynthesis.speak(utterance)
    })
  }

  const goToNext = async () => {
    if (isSpeakingRef.current) {
      stop()
      isSpeakingRef.current = false
      await new Promise(r => setTimeout(r, 50))
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (step === 0) {
      setShowListModal(true)
      if (playSfx) playSfx('sound')
      return
    }
    if (step === 2) {
      setShowMoneyEffect(true)
      setHasMoney(true)
      if (onUpdateBalance) onUpdateBalance(balance)
      setTimeout(() => setShowMoneyEffect(false), 2000)
    }
    if (step === 8) {
      setMotherLeaving(true)
      setTimeout(() => setStep(step + 1), 500)
    } else if (step + 1 < dialogs.length) {
      setStep(step + 1)
    } else {
      stop()
      setIsFadingOut(true)
      setTimeout(() => {
        setIsVisible(false)
        onComplete()
      }, 500)
    }
  }

  const skipDialog = () => {
    if (onSkip) {
      stop()
      setIsFadingOut(true)
      setTimeout(() => {
        setIsVisible(false)
        onSkip()
      }, 500)
    }
  }

  const exitToMenu = () => {
    if (onExit) {
      stop()
      setIsFadingOut(true)
      setTimeout(() => {
        setIsVisible(false)
        onExit()
      }, 500)
    }
  }

  const handleListModalClose = () => {
    setShowListModal(false)
    setTimeout(() => setStep(step + 1), 100)
  }

  const handleScreenClick = (e) => {
    if (showListModal) return
    if (e.target.tagName === 'BUTTON') return
    goToNext()
  }

  useEffect(() => {
    if (step >= dialogs.length) {
      stop()
      setIsFadingOut(true)
      setTimeout(() => {
        setIsVisible(false)
        onComplete()
      }, 500)
      return
    }
    const currentDialog = dialogs[step]
    const dialogText = getDialogText(currentDialog)
    if (currentDialog.hasBotHint && onBotHint) {
      onBotHint(true)
      timeoutRef.current = setTimeout(() => onBotHint(false), 3000)
    }
    speakFull(dialogText, currentDialog.speaker)
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [step])

  if (!isVisible) return null

  const currentDialog = dialogs[step]
  const dialogText = currentDialog ? getDialogText(currentDialog) : ''
  const isMother = currentDialog?.speaker === 'mother'
  const isChild = currentDialog?.speaker === 'child'
  const foxImage = hasMoney ? foxChildWithMoney : foxChildNoMoney

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: `url(${background1})`,
        backgroundSize: 'cover', backgroundPosition: 'center 30%',
        cursor: 'pointer',
        animation: isFadingOut ? 'fadeOut 0.4s ease forwards' : 'fadeIn 0.5s ease'
      }}
      onClick={handleScreenClick}
    >
      <div style={{ position: 'fixed', top: '20px', left: '20px', zIndex: 100 }}>
        <button onClick={(e) => { e.stopPropagation(); exitToMenu(); }} style={{
          background: '#ff9800', color: 'white', border: 'none',
          borderRadius: '50px', padding: 'clamp(10px, 2vw, 14px) clamp(20px, 4vw, 28px)',
          fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
          fontWeight: 'bold', cursor: 'pointer'
        }}>Выйти в меню</button>
      </div>
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 100 }}>
        <button onClick={(e) => { e.stopPropagation(); skipDialog(); }} style={{
          background: '#2196f3', color: 'white', border: 'none',
          borderRadius: '50px', padding: 'clamp(10px, 2vw, 14px) clamp(20px, 4vw, 28px)',
          fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
          fontWeight: 'bold', cursor: 'pointer'
        }}>Пропустить</button>
      </div>

      {/* Лисёнок – относительный контейнер для облачка */}
      <div style={{ position: 'absolute', bottom: 0, left: '8%', width: 'clamp(200px, 36vw, 360px)', animation: 'slideInLeft 0.5s ease' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <img src={foxImage} alt="Лисёнок" style={{ width: '100%', height: 'auto', transform: 'scale(1.0)', transformOrigin: 'bottom center' }} />
          {isChild && dialogText && (
            <div style={{
              position: 'absolute',
              bottom: 'clamp(80%, 10vh, 95%)',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'clamp(200px, 45vw, 500px)',
              backgroundColor: 'rgba(255,255,255,0.96)',
              borderRadius: 'clamp(20px, 4vw, 40px)',
              padding: 'clamp(12px, 2vw, 24px) clamp(16px, 3vw, 32px)',
              boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
              border: '1px solid #ffd966',
              zIndex: 10,
              pointerEvents: 'none'
            }}>
              <div style={{ position: 'absolute', bottom: '-10px', left: '20px', width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderTop: '10px solid rgba(255,255,255,0.96)' }} />
              <p style={{ margin: 0, fontSize: 'clamp(0.9rem, 2.5vw, 1.3rem)', lineHeight: '1.5', color: '#333' }}>{dialogText}</p>
            </div>
          )}
        </div>
      </div>

      {/* Мама – относительный контейнер для облачка */}
      <div style={{
        position: 'absolute', bottom: 0, right: motherLeaving ? '-30%' : '8%',
        width: 'clamp(200px, 36vw, 360px)', transition: 'right 0.6s ease',
        animation: motherLeaving ? 'slideOutRightSlow 2.5s ease forwards' : 'slideInRight 0.5s ease'
      }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <img src={foxMother} alt="Мама" style={{ width: '100%', height: 'auto', transform: 'scale(1.35)', transformOrigin: 'bottom center' }} />
          {isMother && dialogText && !motherLeaving && (
            <div style={{
              position: 'absolute',
              bottom: 'clamp(80%, 10vh, 95%)',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'clamp(200px, 45vw, 500px)',
              backgroundColor: 'rgba(255,255,255,0.96)',
              borderRadius: 'clamp(20px, 4vw, 40px)',
              padding: 'clamp(12px, 2vw, 24px) clamp(16px, 3vw, 32px)',
              boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
              border: '1px solid #ffd966',
              zIndex: 10,
              pointerEvents: 'none'
            }}>
              <div style={{ position: 'absolute', bottom: '-10px', right: '20px', width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderTop: '10px solid rgba(255,255,255,0.96)' }} />
              <p style={{ margin: 0, fontSize: 'clamp(0.9rem, 2.5vw, 1.3rem)', lineHeight: '1.5', color: '#333' }}>{dialogText}</p>
            </div>
          )}
        </div>
      </div>

      {showMoneyEffect && (
        <div style={{
          position: 'absolute', bottom: '45%', left: '25%',
          backgroundColor: 'white', borderRadius: '40px', padding: '18px 30px',
          boxShadow: '0 12px 28px rgba(0,0,0,0.2)', animation: 'moneyCloud 1s ease-out forwards',
          pointerEvents: 'none', zIndex: 20, display: 'flex', alignItems: 'center', gap: '12px',
          fontSize: 'clamp(1rem, 3vw, 1.5rem)', fontWeight: 'bold', color: '#2e7d32', whiteSpace: 'nowrap'
        }}>
          Денюжки!
        </div>
      )}

      {showListModal && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
            animation: 'fadeIn 0.2s ease'
          }}
          onClick={handleListModalClose}
        >
          <div style={{
            background: '#fff9ef', borderRadius: 'clamp(30px, 8vw, 48px)', padding: 'clamp(20px, 5vw, 40px) clamp(20px, 6vw, 35px)',
            maxWidth: 'clamp(300px, 80vw, 480px)', width: '85%', textAlign: 'center',
            boxShadow: '0 30px 50px rgba(0,0,0,0.3)', position: 'relative',
            border: '2px solid #ffd966'
          }}>
            <h2 style={{ color: '#3e2723', marginBottom: 'clamp(20px, 5vw, 30px)', fontSize: 'clamp(1.5rem, 5vw, 2rem)' }}>Список продуктов:</h2>
            <ul style={{ textAlign: 'left', fontSize: 'clamp(1rem, 3vw, 1.3rem)', lineHeight: '2', marginBottom: '35px', paddingLeft: '25px', listStyleType: 'none', color: '#4a3b2c' }}>
              <li><img src={milkIcon1} alt="Молоко" style={{ width: 'clamp(20px, 5vw, 30px)', height: 'auto', marginRight: '10px', verticalAlign: 'middle' }} /> Молоко</li>
              <li><img src={breadIcon1} alt="Хлеб" style={{ width: 'clamp(20px, 5vw, 30px)', marginRight: '10px', verticalAlign: 'middle' }} /> Хлеб</li>
              <li><img src={eggsIcon1} alt="Яйца" style={{ width: 'clamp(20px, 5vw, 30px)', marginRight: '10px', verticalAlign: 'middle' }} /> Яйца</li>
              <li><img src={carrotIcon1} alt="Морковка" style={{ width: 'clamp(20px, 5vw, 30px)', marginRight: '10px', verticalAlign: 'middle' }} /> Морковка</li>
              <li style={{ marginTop: '15px', color: '#ff9800' }}>На сдачу купи себе вкусняшку!</li>
            </ul>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-150px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(150px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideOutRightSlow { 0% { transform: translateX(0) scaleX(1); opacity: 1; } 100% { transform: translateX(400px) scaleX(-1); opacity: 0; } }
        @keyframes moneyCloud { 0% { opacity: 0; transform: translateY(0) scale(0.8); } 20% { opacity: 1; transform: translateY(-20px) scale(1); } 80% { opacity: 1; transform: translateY(-60px) scale(1); } 100% { opacity: 0; transform: translateY(-100px) scale(0.9); } }
      `}</style>
    </div>
  )
}

export default DialogScene1