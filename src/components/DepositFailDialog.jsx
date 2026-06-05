import { useState, useEffect } from 'react';
import useSpeech from '../hooks/useSpeech';
import background2 from '../assets/images/background2.png';
import foxGirlWithBows from '../assets/images/fox_girl_with_bows.png';
import foxMother from '../assets/images/fox_mother.png';
import foxFather from '../assets/images/fox_father.png';
import botSmart from '../assets/images/bot_smart.png';

function DepositFailDialog({ onComplete, score, playSfx }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const { speak, stop } = useSpeech();

  const displayText = 'За год ты не накопила 500 рублей. Но с подарками на день рождения, остатками с прошлого года и 1500 ₽ как проценты по вкладу у тебя всё равно есть выбор: купить ноутбук или планшет с чехлом.';
  const speechText = displayText.replace(/1500/g, 'полторы тысячи');

  useEffect(() => {
    if (playSfx) playSfx('win');
    speak(speechText, { rate: 0.95 });
    return () => stop();
  }, [playSfx, speechText]);

  const handleFinish = () => {
    stop();
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 500);
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundImage: `url(${background2})`,
      backgroundSize: 'cover', backgroundPosition: 'center 30%',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000,
      animation: isFadingOut ? 'fadeOut 0.4s ease forwards' : 'fadeIn 0.5s ease'
    }}>
      <div style={{ position: 'absolute', bottom: 0, left: 'clamp(5%, 2vw, 8%)', width: 'clamp(200px, 30vw, 300px)' }}>
        <img src={foxGirlWithBows} alt="Лисичка" style={{ width: '100%', height: 'auto', transform: 'scale(1.15)', transformOrigin: 'bottom center' }} />
      </div>
      <div style={{ position: 'absolute', bottom: 0, right: 'clamp(8%, 2vw, 12%)', width: 'clamp(200px, 32vw, 320px)' }}>
        <img src={foxMother} alt="Мама" style={{ width: '100%', height: 'auto', transform: 'scale(1.3)', transformOrigin: 'bottom center' }} />
      </div>
      <div style={{ position: 'absolute', bottom: 0, right: 'clamp(1%, 1vw, 2%)', width: 'clamp(200px, 32vw, 320px)' }}>
        <img src={foxFather} alt="Папа" style={{ width: '100%', height: 'auto', transform: 'scale(1.4)', transformOrigin: 'bottom center' }} />
      </div>
      <div style={{
        position: 'absolute', bottom: 'clamp(20%, 15vh, 30%)', left: '50%', transform: 'translateX(-50%)',
        width: 'clamp(280px, 65vw, 600px)', backgroundColor: 'rgba(255,255,255,0.96)',
        borderRadius: 'clamp(30px, 8vw, 48px)', padding: 'clamp(25px, 5vw, 35px) clamp(25px, 6vw, 40px)',
        textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.25)', animation: 'bubbleAppear 0.4s ease'
      }}>
        <img src={botSmart} alt="Совёнок" style={{ width: 'clamp(70px, 12vw, 100px)', height: 'auto', marginBottom: 'clamp(10px, 2vw, 15px)', objectFit: 'contain' }} />
        <h2 style={{ color: '#ff9800', marginBottom: 'clamp(15px, 3vw, 20px)', fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 'bold' }}>Почти получилось!</h2>
        <p style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)', lineHeight: '1.5', color: '#333', marginBottom: 'clamp(20px, 4vw, 30px)' }}>{displayText}</p>
        <button onClick={handleFinish} style={{
          padding: 'clamp(10px, 2vw, 14px) clamp(25px, 5vw, 40px)',
          background: 'linear-gradient(135deg, #ff9800, #f57c00)',
          color: 'white', border: 'none', borderRadius: '60px', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
          fontWeight: 'bold', cursor: 'pointer'
        }}>Завершить →</button>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes bubbleAppear { from { opacity: 0; transform: translateX(-50%) scale(0.9); } to { opacity: 1; transform: translateX(-50%) scale(1); } }
      `}</style>
    </div>
  );
}

export default DepositFailDialog;