import { useState, useEffect, useRef } from 'react';
import useSpeech from '../hooks/useSpeech';
import background2 from '../assets/images/background2.png';
import foxGirl from '../assets/images/fox_girl.png';
import foxMother from '../assets/images/fox_mother.png';
import foxFather from '../assets/images/fox_father.png';

function DialogScene2({ onComplete, balance, onBotHint, dialogs, onExit, onSkip }) {
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const { speak, stop } = useSpeech();
  const isSpeakingRef = useRef(false);
  const timeoutRef = useRef(null);
  const stepRef = useRef(step);

  const getDisplayText = (dialog) => {
    if (typeof dialog.text === 'function') return dialog.text(balance);
    let text = dialog.text;
    text = text.replace(/сынок/gi, 'дочка');
    text = text.replace(/Сынок/gi, 'Дочка');
    text = text.replace(/Лисёнок/gi, 'Дочка');
    text = text.replace(/\b(\d{4,5})\b/g, (match) => parseInt(match, 10).toLocaleString('ru-RU'));
    return text;
  };

  const getSpeechText = (displayText) => {
    let speech = displayText;
    speech = speech.replace(/[.,!?;:()\-–—]/g, ' ');
    speech = speech.replace(/10\s*000/g, 'десять тысяч');
    speech = speech.replace(/11\s*500/g, 'одиннадцать тысяч пятьсот');
    speech = speech.replace(/2\s*000/g, 'две тысячи');
    speech = speech.replace(/2\s*300/g, 'две тысячи триста');
    speech = speech.replace(/1\s*500/g, 'одна тысяча пятьсот');
    speech = speech.replace(/\b500\b/g, 'пятьсот');
    speech = speech.replace(/15%/g, 'пятнадцать процентов');
    speech = speech.replace(/\s+/g, ' ').trim();
    return speech;
  };

  useEffect(() => { stepRef.current = step }, [step]);

  const getVoicePitch = (speaker) => {
    switch(speaker) {
      case 'girl': return 1.25;
      case 'mother': return 1.0;
      case 'father': return 0.85;
      default: return 1.0;
    }
  };

  const speakFull = async (speechText, speakerType) => {
    if (isSpeakingRef.current) {
      stop();
      isSpeakingRef.current = false;
      await new Promise(r => setTimeout(r, 50));
    }
    isSpeakingRef.current = true;
    await speak(speechText, { rate: 1.0, pitch: getVoicePitch(speakerType), speaker: speakerType });
    isSpeakingRef.current = false;
  };

  const goToNext = async () => {
    if (isSpeakingRef.current) {
      stop();
      isSpeakingRef.current = false;
      await new Promise(r => setTimeout(r, 50));
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (step + 1 < dialogs.length) {
      setStep(step + 1);
    } else {
      stop();
      setIsFadingOut(true);
      setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, 500);
    }
  };

  const skipDialog = () => {
    if (onSkip) {
      stop();
      setIsFadingOut(true);
      setTimeout(() => {
        setIsVisible(false);
        onSkip();
      }, 500);
    }
  };

  const exitToMenu = () => {
    if (onExit) {
      stop();
      setIsFadingOut(true);
      setTimeout(() => {
        setIsVisible(false);
        onExit();
      }, 500);
    }
  };

  const handleScreenClick = (e) => {
    if (e.target.tagName === 'BUTTON') return;
    goToNext();
  };

  useEffect(() => {
    if (step >= dialogs.length) {
      stop();
      setIsFadingOut(true);
      setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, 500);
      return;
    }
    const currentDialog = dialogs[step];
    const displayText = getDisplayText(currentDialog);
    const speechText = getSpeechText(displayText);
    if (currentDialog.hasBotHint && onBotHint) {
      onBotHint(true);
      timeoutRef.current = setTimeout(() => onBotHint(false), 3000);
    }
    speakFull(speechText, currentDialog.speaker);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [step]);

  if (!isVisible) return null;

  const currentDialog = dialogs[step];
  const displayText = getDisplayText(currentDialog);
  const isGirl = currentDialog?.speaker === 'girl';
  const isMother = currentDialog?.speaker === 'mother';
  const isFather = currentDialog?.speaker === 'father';

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: `url(${background2})`,
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

      {/* Девочка */}
      <div style={{ position: 'absolute', bottom: 0, left: 'clamp(10%, 2vw, 14%)', width: 'clamp(200px, 32vw, 320px)', animation: 'slideInLeft 0.5s ease', zIndex: 5 }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <img src={foxGirl} alt="Лисёнок" style={{ width: '100%', height: 'auto', transform: 'scale(1.1)', transformOrigin: 'bottom center' }} />
          {isGirl && displayText && (
            <div style={{
              position: 'absolute',
              bottom: 'clamp(80%, 10vh, 95%)',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'clamp(200px, 45vw, 500px)',
              backgroundColor: 'rgba(255,255,255,0.96)',
              borderRadius: 'clamp(20px, 4vw, 40px)',
              padding: 'clamp(12px, 2vw, 22px) clamp(16px, 3vw, 30px)',
              boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
              border: '1px solid #ffd966',
              zIndex: 10,
              pointerEvents: 'none'
            }}>
              <div style={{ position: 'absolute', bottom: '-10px', left: '20px', width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderTop: '10px solid rgba(255,255,255,0.96)' }} />
              <p style={{ margin: 0, fontSize: 'clamp(0.9rem, 2.5vw, 1.3rem)', lineHeight: '1.45', color: '#333' }}>{displayText}</p>
            </div>
          )}
        </div>
      </div>

      {/* Мама */}
      <div style={{ position: 'absolute', bottom: 0, left: 'clamp(40%, 2vw, 48%)', width: 'clamp(220px, 34vw, 340px)', animation: 'slideInRight 0.5s ease', zIndex: 5 }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <img src={foxMother} alt="Мама" style={{ width: '100%', height: 'auto', transform: 'scale(1.3)', transformOrigin: 'bottom center' }} />
          {isMother && displayText && (
            <div style={{
              position: 'absolute',
              bottom: 'clamp(80%, 10vh, 95%)',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'clamp(200px, 45vw, 500px)',
              backgroundColor: 'rgba(255,255,255,0.96)',
              borderRadius: 'clamp(20px, 4vw, 40px)',
              padding: 'clamp(12px, 2vw, 22px) clamp(16px, 3vw, 30px)',
              boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
              border: '1px solid #ffd966',
              zIndex: 10,
              pointerEvents: 'none'
            }}>
              <div style={{ position: 'absolute', bottom: '-10px', right: '20px', width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderTop: '10px solid rgba(255,255,255,0.96)' }} />
              <p style={{ margin: 0, fontSize: 'clamp(0.9rem, 2.5vw, 1.3rem)', lineHeight: '1.45', color: '#333' }}>{displayText}</p>
            </div>
          )}
        </div>
      </div>

      {/* Папа */}
      <div style={{ position: 'absolute', bottom: 0, left: 'clamp(60%, 2vw, 68%)', width: 'clamp(220px, 34vw, 340px)', animation: 'slideInRight 0.5s ease', zIndex: 4 }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <img src={foxFather} alt="Папа" style={{ width: '100%', height: 'auto', transform: 'scale(1.4)', transformOrigin: 'bottom center' }} />
          {isFather && displayText && (
            <div style={{
              position: 'absolute',
              bottom: 'clamp(80%, 10vh, 95%)',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'clamp(200px, 45vw, 500px)',
              backgroundColor: 'rgba(255,255,255,0.96)',
              borderRadius: 'clamp(20px, 4vw, 40px)',
              padding: 'clamp(12px, 2vw, 22px) clamp(16px, 3vw, 30px)',
              boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
              border: '1px solid #ffd966',
              zIndex: 10,
              pointerEvents: 'none'
            }}>
              <div style={{ position: 'absolute', bottom: '-10px', right: '20px', width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderTop: '10px solid rgba(255,255,255,0.96)' }} />
              <p style={{ margin: 0, fontSize: 'clamp(0.9rem, 2.5vw, 1.3rem)', lineHeight: '1.45', color: '#333' }}>{displayText}</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-150px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(150px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </div>
  );
}

export default DialogScene2;