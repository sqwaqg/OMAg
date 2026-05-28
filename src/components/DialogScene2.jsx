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
      <div style={{ position: 'absolute', bottom: 0, left: '10%', width: '35%', maxWidth: '350px', animation: 'slideInLeft 0.5s ease', zIndex: 5 }}>
        <img src={foxGirl} alt="Лисёнок" style={{ width: '100%', height: 'auto' }} />
      </div>

      {/* Мама справа */}
      <div style={{ position: 'absolute', bottom: 0, right: '18%', width: '32%', maxWidth: '320px', animation: 'slideInRight 0.5s ease', zIndex: 5 }}>
        <img src={foxMother} alt="Мама" style={{ width: '100%', height: 'auto' }} />
      </div>

      {/* Папа справа выше */}
      <div style={{ position: 'absolute', bottom: '8%', right: '5%', width: '34%', maxWidth: '340px', animation: 'slideInRight 0.5s ease', zIndex: 4 }}>
        <img src={foxFather} alt="Папа" style={{ width: '100%', height: 'auto' }} />
      </div>

      {/* Облачко девочки */}
      {isGirl && dialogText && (
        <div style={{
          position: 'absolute', bottom: '50%', left: '18%', width: '40%', maxWidth: '380px',
          backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '28px', padding: '18px 24px',
          animation: 'bubbleAppearLeft 0.3s ease', zIndex: 10
        }}>
          <div style={{ position: 'absolute', bottom: '-12px', left: '20px', width: 0, height: 0, borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderTop: '12px solid rgba(255,255,255,0.95)' }} />
          <p style={{ fontSize: '1.2rem', lineHeight: '1.45', color: '#333' }}>{dialogText}</p>
        </div>
      )}

      {/* Облачко мамы */}
      {isMother && dialogText && (
        <div style={{
          position: 'absolute', bottom: '50%', right: '28%', width: '40%', maxWidth: '380px',
          backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '28px', padding: '18px 24px',
          animation: 'bubbleAppearRight 0.3s ease', zIndex: 10
        }}>
          <div style={{ position: 'absolute', bottom: '-12px', right: '20px', width: 0, height: 0, borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderTop: '12px solid rgba(255,255,255,0.95)' }} />
          <p style={{ fontSize: '1.2rem', lineHeight: '1.45', color: '#333' }}>{dialogText}</p>
        </div>
      )}

      {/* Облачко папы */}
      {isFather && dialogText && (
        <div style={{
          position: 'absolute', bottom: '50%', right: '12%', width: '40%', maxWidth: '380px',
          backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '28px', padding: '18px 24px',
          animation: 'bubbleAppearRight 0.3s ease', zIndex: 10
        }}>
          <div style={{ position: 'absolute', bottom: '-12px', right: '20px', width: 0, height: 0, borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderTop: '12px solid rgba(255,255,255,0.95)' }} />
          <p style={{ fontSize: '1.2rem', lineHeight: '1.45', color: '#333' }}>{dialogText}</p>
        </div>
      )}

      <button onClick={goToNext} style={{ position: 'absolute', bottom: '5%', right: '5%', padding: '12px 28px', backgroundColor: '#2e7d32', color: 'white', border: 'none', borderRadius: '40px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', zIndex: 20 }}>Вперёд →</button>

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