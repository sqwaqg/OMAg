import { useState, useEffect } from 'react';
import useSpeech from '../hooks/useSpeech';
import background2 from '../assets/images/background2.png';
import foxGirlWithBows from '../assets/images/fox_girl_with_bows.png';
import foxGirlSad from '../assets/images/fox_girl_sad.png';
import foxMother from '../assets/images/fox_mother.png';
import foxFather from '../assets/images/fox_father.png';
import bows from '../assets/images/bows.png';
import botSad from '../assets/images/bot_sad.png';

function LossDialog({ onComplete, type, playSfx }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [foxImage, setFoxImage] = useState(foxGirlWithBows);
  const [showBowsFly, setShowBowsFly] = useState(false);
  const { speak, stop } = useSpeech();

  useEffect(() => {
    if (playSfx) playSfx('fail');
    speak('За год ты не накопила нужную сумму. Бантики пришлось отдать.', { rate: 1.1 });
    const timer = setTimeout(() => {
      setShowBowsFly(true);
      setFoxImage(foxGirlSad);
    }, 1500);
    return () => {
      clearTimeout(timer);
      stop();
    };
  }, [playSfx]);

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
      <div style={{ position: 'absolute', bottom: 0, left: 'clamp(5%, 2vw, 8%)', width: 'clamp(200px, 30vw, 300px)', animation: 'slideInLeft 0.5s ease', zIndex: 5 }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <img src={foxImage} alt="Лисичка" style={{ width: '100%', height: 'auto', transform: 'scale(1.15)', transformOrigin: 'bottom center' }} />
          {showBowsFly && (
            <div style={{
              position: 'absolute',
              top: 'clamp(5%, 2vh, 10%)',
              left: 'clamp(60%, 5vw, 70%)',
              width: 'clamp(40px, 8vw, 60px)',
              animation: 'bowsFly 1s ease-in forwards',
              zIndex: 20,
              pointerEvents: 'none'
            }}>
              <img src={bows} alt="Бантики" style={{ width: '100%', height: 'auto' }} />
            </div>
          )}
        </div>
      </div>
      
      <div style={{ position: 'absolute', bottom: 0, right: 'clamp(8%, 2vw, 12%)', width: 'clamp(200px, 32vw, 320px)', animation: 'slideInRight 0.5s ease', zIndex: 5 }}>
        <img src={foxMother} alt="Мама" style={{ width: '100%', height: 'auto', transform: 'scale(1.3)', transformOrigin: 'bottom center' }} />
      </div>
      <div style={{ position: 'absolute', bottom: 0, right: 'clamp(0%, 1vw, 2%)', width: 'clamp(200px, 32vw, 320px)', animation: 'slideInRight 0.5s ease', zIndex: 5 }}>
        <img src={foxFather} alt="Папа" style={{ width: '100%', height: 'auto', transform: 'scale(1.4)', transformOrigin: 'bottom center' }} />
      </div>
      
      <div style={{
        position: 'absolute', bottom: 'clamp(30%, 5vh, 40%)', left: '50%', transform: 'translateX(-50%)',
        width: 'clamp(300px, 65vw, 600px)', backgroundColor: 'rgba(255,255,255,0.96)',
        borderRadius: 'clamp(30px, 6vw, 48px)', padding: 'clamp(20px, 5vw, 35px) clamp(20px, 6vw, 40px)',
        textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.25)', animation: 'bubbleAppear 0.4s ease', zIndex: 20
      }}>
        <img src={botSad} alt="Совёнок" style={{ width: 'clamp(60px, 10vw, 100px)', marginBottom: '15px', objectFit: 'contain' }} />
        <h2 style={{ color: '#c62828', marginBottom: '20px', fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 'bold' }}>Неудача...</h2>
        <p style={{ fontSize: 'clamp(1rem, 3vw, 1.3rem)', lineHeight: '1.5', color: '#333', marginBottom: '30px' }}>
          За год ты не накопила нужную сумму.<br />
          Папа продал твои бантики. Планшет остался, но бантиков больше нет.
        </p>
        <button onClick={handleFinish} style={{
          padding: 'clamp(10px, 2vw, 14px) clamp(30px, 6vw, 40px)',
          background: 'linear-gradient(135deg, #c62828, #b71c1c)',
          color: 'white', border: 'none', borderRadius: '60px', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
          fontWeight: 'bold', cursor: 'pointer'
        }}>Завершить →</button>
      </div>
      
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-150px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(150px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes bubbleAppear { from { opacity: 0; transform: translateX(-50%) scale(0.9); } to { opacity: 1; transform: translateX(-50%) scale(1); } }
        @keyframes bowsFly {
          0% { opacity: 1; transform: translateX(0) translateY(0) rotate(0deg); }
          100% { opacity: 0; transform: translateX(400px) translateY(-50px) rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default LossDialog;