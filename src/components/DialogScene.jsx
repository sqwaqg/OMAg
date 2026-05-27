import { useState, useEffect, useRef } from 'react'
import useSpeech from '../hooks/useSpeech'

// Фон для первой истории
import backgroundImage from '../assets/images/background1.png'

// Персонажи
import foxChild from '../assets/images/fox_child.png'
import foxMother from '../assets/images/fox_mother.png'

function DialogScene({ onComplete, balance, onBotHint, dialogs: customDialogs }) {
  const [step, setStep] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [motherLeaving, setMotherLeaving] = useState(false)
  const { speak, stop } = useSpeech()
  const isSpeakingRef = useRef(false)
  const timeoutRef = useRef(null)
  const stepRef = useRef(step)

  // Функция для получения текста из диалога (поддерживает строки и функции)
  const getDialogText = (dialog) => {
    if (typeof dialog.text === 'function') {
      return dialog.text(balance)
    }
    return dialog.text
  }

  // Стандартные диалоги для истории 1 (если не переданы кастомные)
  const defaultDialogs = [
    { speaker: 'mother', text: 'Лисёнок, мы идём в магазин. Вот тебе список продуктов, которые нужно купить для дома.' },
    { speaker: 'child', text: 'Я сам? Прямо как взрослый?' },
    { speaker: 'mother', text: (b) => `Прямо как взрослый. Держи ${b} рублей. Это все наши деньги на покупки. И вот список.` },
    { speaker: 'child', text: 'Ого... Тут всё нужное. А хватит ли?' },
    { speaker: 'mother', text: 'В этом и задача, малыш. Нужно выбрать только то, что поместится в бюджет. Бери самое важное, считай внимательно.' },
    { speaker: 'child', text: 'А если я ошибусь?' },
    { speaker: 'mother', text: 'Тебе поможет совушка. Но ты попробуй сам. Это и есть взрослое решение — думать, прежде чем положить в корзину.', hasBotHint: true },
    { speaker: 'child', text: 'Хорошо. Я посчитаю. Всё, что влезет в бюджет — куплю. Остальное оставлю на полке.' },
    { speaker: 'mother', text: 'Молодец. А теперь — вперёд! Полки перед тобой, смотри на цены и считай. Я буду ждать тебя у кассы.' },
    { speaker: 'child', text: (b) => `Итак... У меня ${b} рублей. Что же я могу купить?` }
  ]

  const dialogs = customDialogs || defaultDialogs

  useEffect(() => {
    stepRef.current = step
  }, [step])

  // Озвучка с правильными голосами
  const speakFull = async (textOrFunction, speakerType, currentStep) => {
    const text = typeof textOrFunction === 'function' ? textOrFunction(balance) : textOrFunction
    
    if (isSpeakingRef.current) {
      stop()
      isSpeakingRef.current = false
      await new Promise(resolve => setTimeout(resolve, 50))
    }
    
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'ru-RU'
      utterance.rate = 0.95
      
      // Красивые голоса для персонажей
      if (speakerType === 'child') {
        utterance.pitch = 1.3
        utterance.rate = 0.92
        // Ищем детский/высокий голос
        const voices = window.speechSynthesis.getVoices()
        const childVoice = voices.find(voice => 
          voice.lang === 'ru-RU' && (voice.name.includes('Google') || voice.name.includes('Female') || voice.name.includes('Maria'))
        )
        if (childVoice) utterance.voice = childVoice
      } else if (speakerType === 'mother') {
        utterance.pitch = 1.0
        utterance.rate = 0.9
        // Ищем женский голос для мамы
        const voices = window.speechSynthesis.getVoices()
        const motherVoice = voices.find(voice => 
          voice.lang === 'ru-RU' && (voice.name.includes('Google') || voice.name.includes('Female') || voice.name === 'Microsoft Irina')
        )
        if (motherVoice) utterance.voice = motherVoice
      } else {
        utterance.pitch = 1.0
        utterance.rate = 0.95
      }
      
      utterance.onend = () => {
        isSpeakingRef.current = false
        resolve()
      }
      
      utterance.onerror = () => {
        isSpeakingRef.current = false
        resolve()
      }
      
      isSpeakingRef.current = true
      window.speechSynthesis.speak(utterance)
    })
  }

  // Переход к следующему диалогу
  const nextDialog = async () => {
    if (isSpeakingRef.current) {
      stop()
      isSpeakingRef.current = false
      await new Promise(resolve => setTimeout(resolve, 50))
    }
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    
    if (step === 8) {
      setMotherLeaving(true)
      setTimeout(() => {
        setStep(step + 1)
      }, 500)
    } else if (step + 1 < dialogs.length) {
      setStep(step + 1)
    } else {
      setIsFadingOut(true)
      setTimeout(() => {
        setIsVisible(false)
        onComplete()
      }, 500)
    }
  }

  const handleScreenClick = (e) => {
    if (e.target.tagName === 'BUTTON') return
    nextDialog()
  }

  useEffect(() => {
    if (step >= dialogs.length) {
      setIsFadingOut(true)
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false)
        onComplete()
      }, 500)
      return
    }

    const currentDialog = dialogs[step]
    const dialogText = getDialogText(currentDialog)
    
    if (currentDialog.hasBotHint && onBotHint) {
      onBotHint(true)
      timeoutRef.current = setTimeout(() => {
        if (onBotHint) onBotHint(false)
      }, 3000)
    }
    
    speakFull(dialogText, currentDialog.speaker, step)
    
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [step])

  if (!isVisible) return null

  const currentDialog = dialogs[step]
  const dialogText = currentDialog ? getDialogText(currentDialog) : ''
  const isMother = currentDialog?.speaker === 'mother'
  const isChild = currentDialog?.speaker === 'child'

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 30%',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        animation: isFadingOut ? 'fadeOut 0.4s ease forwards' : 'fadeIn 0.5s ease',
        cursor: 'pointer'
      }}
      onClick={handleScreenClick}
    >
      {/* Лисёнок слева */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: '12%',
        width: '30%',
        maxWidth: '300px',
        textAlign: 'center',
        animation: 'slideInLeft 0.5s ease',
        zIndex: 5
      }}>
        <img 
          src={foxChild} 
          alt="Лисёнок" 
          style={{ 
            width: '100%', 
            height: 'auto', 
            display: 'block',
            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))'
          }} 
        />
      </div>

      {/* Мама Лиса справа */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        right: motherLeaving ? '-30%' : '12%',
        width: '36%',
        maxWidth: '360px',
        textAlign: 'center',
        animation: motherLeaving ? 'slideOutRight 0.6s ease forwards' : 'slideInRight 0.5s ease',
        zIndex: 5,
        transition: 'right 0.6s ease'
      }}>
        <img 
          src={foxMother} 
          alt="Мама Лиса" 
          style={{ 
            width: '100%', 
            height: 'auto', 
            display: 'block',
            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))'
          }} 
        />
      </div>

      {/* Облачко Лисёнка */}
      {isChild && dialogText && (
        <div style={{
          position: 'absolute',
          bottom: '45%',
          left: '28%',
          width: '40%',
          maxWidth: '380px',
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderRadius: '28px',
          padding: '20px 28px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          zIndex: 10,
          animation: 'bubbleAppearLeft 0.3s ease',
          pointerEvents: 'none'
        }}>
          <div style={{
            position: 'absolute',
            bottom: '-12px',
            left: '25px',
            width: 0,
            height: 0,
            borderLeft: '12px solid transparent',
            borderRight: '12px solid transparent',
            borderTop: '12px solid rgba(255,255,255,0.95)'
          }} />
          <p style={{ 
            margin: 0, 
            fontSize: '1.2rem', 
            lineHeight: '1.5', 
            color: '#333',
            fontWeight: '500'
          }}>
            {dialogText}
          </p>
        </div>
      )}

      {/* Облачко Мамы Лисы */}
      {isMother && dialogText && !motherLeaving && (
        <div style={{
          position: 'absolute',
          bottom: '45%',
          right: '28%',
          width: '40%',
          maxWidth: '380px',
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderRadius: '28px',
          padding: '20px 28px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          zIndex: 10,
          animation: 'bubbleAppearRight 0.3s ease',
          pointerEvents: 'none'
        }}>
          <div style={{
            position: 'absolute',
            bottom: '-12px',
            right: '25px',
            width: 0,
            height: 0,
            borderLeft: '12px solid transparent',
            borderRight: '12px solid transparent',
            borderTop: '12px solid rgba(255,255,255,0.95)'
          }} />
          <p style={{ 
            margin: 0, 
            fontSize: '1.2rem', 
            lineHeight: '1.5', 
            color: '#333',
            fontWeight: '500'
          }}>
            {dialogText}
          </p>
        </div>
      )}

      {/* Кнопка "Вперёд" */}
      <button
        onClick={nextDialog}
        style={{
          position: 'absolute',
          bottom: '5%',
          right: '5%',
          padding: '12px 28px',
          backgroundColor: '#2e7d32',
          color: 'white',
          border: 'none',
          borderRadius: '40px',
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          zIndex: 20,
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          transition: 'transform 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        Вперёд →
      </button>

      {/* Подсказка */}
      <div style={{
        position: 'absolute',
        top: '3%',
        right: '3%',
        backgroundColor: 'rgba(255,255,255,0.9)',
        color: '#333',
        fontSize: '0.75rem',
        padding: '6px 12px',
        borderRadius: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        zIndex: 20,
        fontWeight: '500'
      }}>
        💡 Нажми в любом месте для продолжения
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
          }
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-150px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(150px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes slideOutRight {
            from {
              opacity: 1;
              transform: translateX(0);
            }
            to {
              opacity: 0;
              transform: translateX(300px);
            }
          }
          @keyframes bubbleAppearLeft {
            from {
              opacity: 0;
              transform: translateX(-40px) scale(0.9);
            }
            to {
              opacity: 1;
              transform: translateX(0) scale(1);
            }
          }
          @keyframes bubbleAppearRight {
            from {
              opacity: 0;
              transform: translateX(40px) scale(0.9);
            }
            to {
              opacity: 1;
              transform: translateX(0) scale(1);
            }
          }
        `}
      </style>
    </div>
  )
}

export default DialogScene