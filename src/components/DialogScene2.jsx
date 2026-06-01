import { useState, useEffect, useRef } from 'react'
import useSpeech from '../hooks/useSpeech'
import background2 from '../assets/images/background2.png'
import foxGirl from '../assets/images/fox_girl.png'
import foxMother from '../assets/images/fox_mother.png'
import foxFather from '../assets/images/fox_father.png'

function DialogScene2({ onComplete, balance, onBotHint, dialogs }) {
  const [step, setStep] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const { speak, stop } = useSpeech()
  const isSpeakingRef = useRef(false)
  const timeoutRef = useRef(null)
  const stepRef = useRef(step)

  const getDialogText = (dialog) => {
    if (typeof dialog.text === 'function') return dialog.text(balance)
    let text = dialog.text
    text = text.replace(/10[\s]?000/g, 'десять тысяч')
    text = text.replace(/2[\s]?000/g, 'две тысячи')
    text = text.replace(/11[\s]?500/g, 'одиннадцать тысяч пятьсот')
    text = text.replace(/2[\s]?300/g, 'две тысячи триста')
    text = text.replace(/15%/g, 'пятнадцать процентов')
    text = text.replace(/сынок/gi, 'дочка')
    text = text.replace(/Сынок/gi, 'Дочка')
    text = text.replace(/Лисёнок/gi, 'Дочка')
    return text
  }

  useEffect(() => { stepRef.current = step }, [step])

  const getVoicePitch = (speaker) => {
    switch(speaker) {
      case 'girl': return 1.35
      case 'mother': return 1.05
      case 'father': return 0.85
      default: return 1.0
    }
  }

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
      utterance.pitch = getVoicePitch(speakerType)
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
    if (step + 1 < dialogs.length) {
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
  const isGirl = currentDialog?.speaker === 'girl'
  const isMother = currentDialog?.speaker === 'mother'
  const isFather = currentDialog?.speaker === 'father'

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundImage: `url(${background2})`,
      backgroundSize: 'cover', backgroundPosition: 'center 30%',
      cursor: 'pointer',
      animation: isFadingOut ? 'fadeOut 0.4s ease forwards' : 'fadeIn 0.5s ease'
    }} onClick={handleScreenClick}>
      
      {/* Девочка слева */}
      <div style={{ position: 'absolute', bottom: 0, left: '8%', width: '35%', maxWidth: '350px', animation: 'slideInLeft 0.5s ease', zIndex: 5 }}>
        <img src={foxGirl} alt="Лисёнок" style={{ width: '100%', height: 'auto' }} />
      </div>

      {/* Мама */}
      <div style={{ position: 'absolute', bottom: 0, left: '60%', width: '38%', maxWidth: '380px', animation: 'slideInRight 0.5s ease', zIndex: 5 }}>
        <img src={foxMother} alt="Мама" style={{ width: '100%', height: 'auto' }} />
      </div>

      {/* Папа */}
      <div style={{ position: 'absolute', bottom: '2%', left: '70%', width: '38%', maxWidth: '380px', animation: 'slideInRight 0.5s ease', zIndex: 4 }}>
        <img src={foxFather} alt="Папа" style={{ width: '100%', height: 'auto' }} />
      </div>

      {/* Облачко девочки – чуть правее, чтобы не закрывать лицо */}
      {isGirl && dialogText && (
        <div style={{
          position: 'absolute', bottom: '50%', left: '18%', width: '35%', maxWidth: '400px',
          backgroundColor: 'rgba(255,255,255,0.96)', borderRadius: '40px', padding: '20px 28px',
          animation: 'bubbleAppearLeft 0.3s ease', zIndex: 10, boxShadow: '0 12px 28px rgba(0,0,0,0.2)', border: '1px solid #ffd966'
        }}>
          <div style={{ position: 'absolute', bottom: '-12px', left: '25px', width: 0, height: 0, borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderTop: '14px solid rgba(255,255,255,0.96)' }} />
          <p style={{ fontSize: '1.2rem', lineHeight: '1.45', color: '#333' }}>{dialogText}</p>
        </div>
      )}

      {/* Облачко мамы – левее, чтобы не перекрывать лицо */}
      {isMother && dialogText && (
        <div style={{
          position: 'absolute', bottom: '55%', left: '48%', width: '35%', maxWidth: '400px',
          backgroundColor: 'rgba(255,255,255,0.96)', borderRadius: '40px', padding: '20px 28px',
          animation: 'bubbleAppearRight 0.3s ease', zIndex: 10, boxShadow: '0 12px 28px rgba(0,0,0,0.2)', border: '1px solid #ffd966'
        }}>
          <div style={{ position: 'absolute', bottom: '-12px', right: '25px', width: 0, height: 0, borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderTop: '14px solid rgba(255,255,255,0.96)' }} />
          <p style={{ fontSize: '1.2rem', lineHeight: '1.45', color: '#333' }}>{dialogText}</p>
        </div>
      )}

      {/* Облачко папы – левее */}
      {isFather && dialogText && (
        <div style={{
          position: 'absolute', bottom: '55%', left: '58%', width: '35%', maxWidth: '400px',
          backgroundColor: 'rgba(255,255,255,0.96)', borderRadius: '40px', padding: '20px 28px',
          animation: 'bubbleAppearRight 0.3s ease', zIndex: 10, boxShadow: '0 12px 28px rgba(0,0,0,0.2)', border: '1px solid #ffd966'
        }}>
          <div style={{ position: 'absolute', bottom: '-12px', right: '25px', width: 0, height: 0, borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderTop: '14px solid rgba(255,255,255,0.96)' }} />
          <p style={{ fontSize: '1.2rem', lineHeight: '1.45', color: '#333' }}>{dialogText}</p>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-150px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(150px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes bubbleAppearLeft { from { opacity: 0; transform: translateX(-40px) scale(0.9); } to { opacity: 1; transform: translateX(0) scale(1); } }
        @keyframes bubbleAppearRight { from { opacity: 0; transform: translateX(40px) scale(0.9); } to { opacity: 1; transform: translateX(0) scale(1); } }
      `}</style>
    </div>
  )
}

export default DialogScene2