import { useState, useEffect, useRef } from 'react'
import useSpeech from '../hooks/useSpeech'
import background1 from '../assets/images/background1.png'
import foxChild from '../assets/images/fox_child.png'
import foxMother from '../assets/images/fox_mother.png'

function DialogScene1({ onComplete, balance, onBotHint, dialogs }) {
  const [step, setStep] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [motherLeaving, setMotherLeaving] = useState(false)
  const { speak, stop } = useSpeech()
  const isSpeakingRef = useRef(false)
  const timeoutRef = useRef(null)
  const stepRef = useRef(step)

  const getDialogText = (dialog) => {
    if (typeof dialog.text === 'function') return dialog.text(balance)
    return dialog.text
  }

  useEffect(() => { stepRef.current = step }, [step])

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
        <img src={foxChild} alt="Лисёнок" style={{ width: '100%', height: 'auto' }} />
      </div>

      {/* Мама справа */}
      <div style={{ position: 'absolute', bottom: 0, right: motherLeaving ? '-30%' : '12%', width: '36%', maxWidth: '360px', transition: 'right 0.6s ease', animation: motherLeaving ? 'slideOutRight 0.6s ease forwards' : 'slideInRight 0.5s ease' }}>
        <img src={foxMother} alt="Мама" style={{ width: '100%', height: 'auto' }} />
      </div>

      {/* Облачко Лисёнка */}
      {isChild && dialogText && (
        <div style={{
          position: 'absolute', bottom: '45%', left: '25%', width: '40%', maxWidth: '380px',
          backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '28px', padding: '20px 28px',
          animation: 'bubbleAppearLeft 0.3s ease'
        }}>
          <div style={{ position: 'absolute', bottom: '-12px', left: '25px', width: 0, height: 0, borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderTop: '12px solid rgba(255,255,255,0.95)' }} />
          <p style={{ fontSize: '1.2rem', lineHeight: '1.5', color: '#333' }}>{dialogText}</p>
        </div>
      )}

      {/* Облачко Мамы */}
      {isMother && dialogText && !motherLeaving && (
        <div style={{
          position: 'absolute', bottom: '45%', right: '25%', width: '40%', maxWidth: '380px',
          backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '28px', padding: '20px 28px',
          animation: 'bubbleAppearRight 0.3s ease'
        }}>
          <div style={{ position: 'absolute', bottom: '-12px', right: '25px', width: 0, height: 0, borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderTop: '12px solid rgba(255,255,255,0.95)' }} />
          <p style={{ fontSize: '1.2rem', lineHeight: '1.5', color: '#333' }}>{dialogText}</p>
        </div>
      )}

      {/* Кнопка "Далее" */}
      <button onClick={goToNext} style={{ position: 'absolute', bottom: '5%', right: '5%', padding: '12px 28px', backgroundColor: '#2e7d32', color: 'white', border: 'none', borderRadius: '40px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', zIndex: 20 }}>
        Далее →
      </button>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-150px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(150px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideOutRight { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(300px); } }
        @keyframes bubbleAppearLeft { from { opacity: 0; transform: translateX(-40px) scale(0.9); } to { opacity: 1; transform: translateX(0) scale(1); } }
        @keyframes bubbleAppearRight { from { opacity: 0; transform: translateX(40px) scale(0.9); } to { opacity: 1; transform: translateX(0) scale(1); } }
      `}</style>
    </div>
  )
}

export default DialogScene1