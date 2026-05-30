import { useState, useEffect, useRef } from 'react'
import useSpeech from '../hooks/useSpeech'
import background1 from '../assets/images/background1.png'
import foxChildNoMoney from '../assets/images/fox_child_no_money.png'
import foxChildWithMoney from '../assets/images/fox_child_with_money.png'
import foxMother from '../assets/images/fox_mother.png'

function DialogScene1({ onComplete, balance, onBotHint, dialogs, onUpdateBalance }) {
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

  const getDialogText = (dialog) => {
    if (typeof dialog.text === 'function') return dialog.text(balance)
    return dialog.text
  }

  useEffect(() => { stepRef.current = step }, [step])

  useEffect(() => {
    return () => {
      stop()
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [stop])

  const speakFull = async (text, speakerType, currentStep) => {
    if (isSpeakingRef.current) {
      stop()
      isSpeakingRef.current = false
      await new Promise(r => setTimeout(r, 50))
    }
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'ru-RU'
      utterance.rate = 1.2
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
      return
    }

    if (step === 2) {
      setShowMoneyEffect(true)
      setHasMoney(true)
      if (onUpdateBalance) {
        onUpdateBalance(balance)
      }
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

  const handleListModalClose = () => {
    setShowListModal(false)
    setTimeout(() => {
      setStep(step + 1)
    }, 100)
  }

  const handleScreenClick = (e) => {
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
    speakFull(dialogText, currentDialog.speaker, step)

    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [step])

  if (!isVisible) return null

  const currentDialog = dialogs[step]
  const dialogText = currentDialog ? getDialogText(currentDialog) : ''
  const isMother = currentDialog?.speaker === 'mother'
  const isChild = currentDialog?.speaker === 'child'

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundImage: `url(${background1})`,
      backgroundSize: 'cover', backgroundPosition: 'center 30%',
      cursor: 'pointer',
      animation: isFadingOut ? 'fadeOut 0.4s ease forwards' : 'fadeIn 0.5s ease'
    }} onClick={handleScreenClick}>
      
      {/* Лисёнок слева */}
      <div style={{ position: 'absolute', bottom: 0, left: '12%', width: '30%', maxWidth: '300px', animation: 'slideInLeft 0.5s ease' }}>
        <img src={hasMoney ? foxChildWithMoney : foxChildNoMoney} alt="Лисёнок" style={{ width: '100%', height: 'auto' }} />
      </div>

      {/* Мама справа */}
      <div style={{ 
        position: 'absolute', bottom: 0, right: motherLeaving ? '-30%' : '12%', 
        width: '36%', maxWidth: '360px', transition: 'right 0.6s ease',
        animation: motherLeaving ? 'slideOutRightSlow 1.5s ease forwards' : 'slideInRight 0.5s ease' 
      }}>
        <img src={foxMother} alt="Мама" style={{ width: '100%', height: 'auto' }} />
      </div>

      {/* Эффект получения денег */}
      {showMoneyEffect && (
        <div style={{
          position: 'absolute', bottom: '45%', left: '25%',
          backgroundColor: 'white', borderRadius: '40px', padding: '18px 30px',
          boxShadow: '0 12px 28px rgba(0,0,0,0.2)', animation: 'moneyCloud 1s ease-out forwards',
          pointerEvents: 'none', zIndex: 20, display: 'flex', alignItems: 'center', gap: '12px',
          fontSize: '1.5rem', fontWeight: 'bold', color: '#2e7d32', whiteSpace: 'nowrap'
        }}>
          <span>💰</span> +{balance} ₽<span>✨</span>
        </div>
      )}

      {showListModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          animation: 'fadeIn 0.2s ease'
        }} onClick={handleListModalClose}>
          <div style={{
            background: '#fff9ef', borderRadius: '48px', padding: '40px 35px',
            maxWidth: '480px', width: '85%', textAlign: 'center',
            boxShadow: '0 30px 50px rgba(0,0,0,0.3)', position: 'relative',
            border: '2px solid #ffd966'
          }}>
            <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', width: '60px', height: '8px', background: '#d4b87a', borderRadius: '4px' }} />
            <h2 style={{ color: '#3e2723', marginBottom: '30px', fontSize: '2rem' }}>📋 Список продуктов</h2>
            <ul style={{ textAlign: 'left', fontSize: '1.3rem', lineHeight: '2', marginBottom: '35px', paddingLeft: '25px', listStyleType: 'none', color: '#4a3b2c' }}>
              <li>🥛 Молоко</li>
              <li>🍞 Хлеб</li>
              <li>🥚 Яйца</li>
              <li>🥕 Морковка</li>
              <li style={{ marginTop: '15px', color: '#ff9800' }}>🍬 На сдачу купи себе вкусняшку!</li>
            </ul>
            <button onClick={handleListModalClose} style={{ padding: '14px 35px', background: 'linear-gradient(135deg, #2e7d32, #1b5e20)', color: 'white', border: 'none', borderRadius: '50px', fontSize: '1.1rem', cursor: 'pointer' }}>Понятно →</button>
          </div>
        </div>
      )}

      {/* Облачко ребёнка - увеличенное */}
      {isChild && dialogText && (
        <div style={{ position: 'absolute', bottom: '45%', left: '22%', width: '42%', maxWidth: '450px', backgroundColor: 'rgba(255,255,255,0.96)', borderRadius: '40px', padding: '24px 32px', animation: 'bubbleAppearLeft 0.3s ease', boxShadow: '0 12px 28px rgba(0,0,0,0.2)', border: '1px solid #ffd966' }}>
          <div style={{ position: 'absolute', bottom: '-12px', left: '30px', width: 0, height: 0, borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderTop: '14px solid rgba(255,255,255,0.96)' }} />
          <p style={{ fontSize: '1.3rem', lineHeight: '1.5', color: '#333' }}>{dialogText}</p>
        </div>
      )}
      {/* Облачко мамы - увеличенное */}
      {isMother && dialogText && !motherLeaving && (
        <div style={{ position: 'absolute', bottom: '45%', right: '22%', width: '42%', maxWidth: '450px', backgroundColor: 'rgba(255,255,255,0.96)', borderRadius: '40px', padding: '24px 32px', animation: 'bubbleAppearRight 0.3s ease', boxShadow: '0 12px 28px rgba(0,0,0,0.2)', border: '1px solid #ffd966' }}>
          <div style={{ position: 'absolute', bottom: '-12px', right: '30px', width: 0, height: 0, borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderTop: '14px solid rgba(255,255,255,0.96)' }} />
          <p style={{ fontSize: '1.3rem', lineHeight: '1.5', color: '#333' }}>{dialogText}</p>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-150px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(150px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideOutRightSlow { 0% { transform: translateX(0) scaleX(1); opacity: 1; } 100% { transform: translateX(400px) scaleX(-1); opacity: 0; } }
        @keyframes bubbleAppearLeft { from { opacity: 0; transform: translateX(-40px) scale(0.9); } to { opacity: 1; transform: translateX(0) scale(1); } }
        @keyframes bubbleAppearRight { from { opacity: 0; transform: translateX(40px) scale(0.9); } to { opacity: 1; transform: translateX(0) scale(1); } }
        @keyframes moneyCloud { 0% { opacity: 0; transform: translateY(0) scale(0.8); } 20% { opacity: 1; transform: translateY(-20px) scale(1); } 80% { opacity: 1; transform: translateY(-60px) scale(1); } 100% { opacity: 0; transform: translateY(-100px) scale(0.9); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  )
}

export default DialogScene1