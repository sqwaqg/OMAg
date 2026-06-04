import { useState, useEffect, useRef } from 'react'
import useSpeech from '../hooks/useSpeech'
import background2 from '../assets/images/background2.png'
import foxGirl from '../assets/images/fox_girl.png'
import foxMother from '../assets/images/fox_mother.png'
import foxFather from '../assets/images/fox_father.png'

function DialogScene2({ onComplete, balance, onBotHint, dialogs, onExit, onSkip }) {
  const [step, setStep] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const { speak, stop } = useSpeech()
  const isSpeakingRef = useRef(false)
  const timeoutRef = useRef(null)
  const stepRef = useRef(step)

  const getDialogText = (dialog) => {
    if (typeof dialog.text === 'function') return dialog.text(balance);
    let text = dialog.text;
    text = text.replace(/сынок/gi, 'дочка');
    text = text.replace(/Сынок/gi, 'Дочка');
    text = text.replace(/Лисёнок/gi, 'Дочка');
    text = text.replace(/\b\d+\b/g, (match) => {
      return parseInt(match, 10).toLocaleString('ru-RU');
    });
    return text;
  };

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
      
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        zIndex: 100
      }}>
        <button
          onClick={(e) => { e.stopPropagation(); exitToMenu(); }}
          style={{
            background: '#ff9800',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            padding: '14px 28px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background 0.2s, transform 0.2s',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f57c00'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#ff9800'}
        >Выйти в меню</button>
      </div>

      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 100
      }}>
        <button
          onClick={(e) => { e.stopPropagation(); skipDialog(); }}
          style={{
            background: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            padding: '14px 28px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background 0.2s, transform 0.2s',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#1976d2'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#2196f3'}
        >Пропустить</button>
      </div>

      {/* Девочка – чуть ближе к центру, масштаб 1.1 */}
      <div style={{ position: 'absolute', bottom: 0, left: '14%', width: '32%', maxWidth: '320px', animation: 'slideInLeft 0.5s ease', zIndex: 5 }}>
        <img src={foxGirl} alt="Лисёнок" style={{ width: '100%', height: 'auto', transform: 'scale(1.1)', transformOrigin: 'bottom center' }} />
      </div>

      {/* Мама – правее, масштаб 1.3 */}
      <div style={{ position: 'absolute', bottom: 0, left: '48%', width: '34%', maxWidth: '340px', animation: 'slideInRight 0.5s ease', zIndex: 5 }}>
        <img src={foxMother} alt="Мама" style={{ width: '100%', height: 'auto', transform: 'scale(1.3)', transformOrigin: 'bottom center' }} />
      </div>

      {/* Папа – ещё правее, масштаб 1.4 */}
      <div style={{ position: 'absolute', bottom: 0, left: '68%', width: '34%', maxWidth: '340px', animation: 'slideInRight 0.5s ease', zIndex: 4 }}>
        <img src={foxFather} alt="Папа" style={{ width: '100%', height: 'auto', transform: 'scale(1.4)', transformOrigin: 'bottom center' }} />
      </div>

      {/* Облачко девочки */}
      {isGirl && dialogText && (
        <div style={{
          position: 'absolute', bottom: '55%', left: '18%', width: '35%', maxWidth: '420px',
          backgroundColor: 'rgba(255,255,255,0.96)', borderRadius: '40px', padding: '22px 30px',
          animation: 'bubbleAppearLeft 0.3s ease', zIndex: 10, boxShadow: '0 12px 28px rgba(0,0,0,0.2)', border: '1px solid #ffd966'
        }}>
          <div style={{ position: 'absolute', bottom: '-12px', left: '25px', width: 0, height: 0, borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderTop: '14px solid rgba(255,255,255,0.96)' }} />
          <p style={{ fontSize: '1.3rem', lineHeight: '1.45', color: '#333' }}>{dialogText}</p>
        </div>
      )}

      {/* Облачко мамы */}
      {isMother && dialogText && (
        <div style={{
          position: 'absolute', bottom: '55%', left: '44%', width: '35%', maxWidth: '420px',
          backgroundColor: 'rgba(255,255,255,0.96)', borderRadius: '40px', padding: '22px 30px',
          animation: 'bubbleAppearRight 0.3s ease', zIndex: 10, boxShadow: '0 12px 28px rgba(0,0,0,0.2)', border: '1px solid #ffd966'
        }}>
          <div style={{ position: 'absolute', bottom: '-12px', right: '25px', width: 0, height: 0, borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderTop: '14px solid rgba(255,255,255,0.96)' }} />
          <p style={{ fontSize: '1.3rem', lineHeight: '1.45', color: '#333' }}>{dialogText}</p>
        </div>
      )}

      {/* Облачко папы */}
      {isFather && dialogText && (
        <div style={{
          position: 'absolute', bottom: '55%', left: '62%', width: '35%', maxWidth: '420px',
          backgroundColor: 'rgba(255,255,255,0.96)', borderRadius: '40px', padding: '22px 30px',
          animation: 'bubbleAppearRight 0.3s ease', zIndex: 10, boxShadow: '0 12px 28px rgba(0,0,0,0.2)', border: '1px solid #ffd966'
        }}>
          <div style={{ position: 'absolute', bottom: '-12px', right: '25px', width: 0, height: 0, borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderTop: '14px solid rgba(255,255,255,0.96)' }} />
          <p style={{ fontSize: '1.3rem', lineHeight: '1.45', color: '#333' }}>{dialogText}</p>
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