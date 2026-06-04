import { useState, useEffect } from 'react';
import useSpeech from '../hooks/useSpeech';
import background2 from '../assets/images/background2.png';
import foxGirlWithBows from '../assets/images/fox_girl_with_bows.png';
import foxMother from '../assets/images/fox_mother.png';
import foxFather from '../assets/images/fox_father.png';
import botSmart from '../assets/images/bot_smart.png'; // умный совёнок

function DepositFailDialog({ onComplete, score }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const { speak, stop } = useSpeech();
  // Короткое повествование вместо прямой речи
  const text = 'За год ты не накопила нужную сумму. Вклад принёс 1500 рублей, но до планшета не хватило. Ты можешь купить ноутбук или планшет с чехлом.';

  useEffect(() => {
    speak(text, { rate: 1.1 });
    return () => stop();
  }, []);

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
      {/* Девочка с бантиками */}
      <div style={{ position: 'absolute', bottom: 0, left: '8%', width: '30%', maxWidth: '300px'}}>
        <img src={foxGirlWithBows} alt="Лисичка" style={{ width: '100%', height: 'auto', transform: 'scale(1.15)', transformOrigin: 'bottom center' }} />
      </div>
      {/* Мама */}
      <div style={{ position: 'absolute', bottom: 0, right: '12%', width: '32%', maxWidth: '320px'}}>
        <img src={foxMother} alt="Мама" style={{ width: '100%', height: 'auto', transform: 'scale(1.3)', transformOrigin: 'bottom center' }} />
      </div>
      {/* Папа */}
      <div style={{ position: 'absolute', bottom: 0, right: '2%', width: '32%', maxWidth: '320px'}}>
        <img src={foxFather} alt="Папа" style={{ width: '100%', height: 'auto', transform: 'scale(1.4)', transformOrigin: 'bottom center' }} />
      </div>
      {/* Центральное окно – с умным совёнком */}
      <div style={{
        position: 'absolute', bottom: '30%', left: '50%', transform: 'translateX(-50%)',
        width: '65%', maxWidth: '600px', backgroundColor: 'rgba(255,255,255,0.96)',
        borderRadius: '48px', padding: '35px 40px', textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0,0,0,0.25)', animation: 'bubbleAppear 0.4s ease'
      }}>
        <img src={botSmart} alt="Совёнок" style={{ width: '100px', height: '100px', marginBottom: '15px', objectFit: 'contain' }} />
        <h2 style={{ color: '#ff9800', marginBottom: '20px', fontSize: '2rem', fontWeight: 'bold' }}>История с вкладом</h2>
        <p style={{ fontSize: '1.2rem', lineHeight: '1.5', color: '#333', marginBottom: '30px' }}>{text}</p>
        <button onClick={handleFinish} style={{
          padding: '14px 40px', background: 'linear-gradient(135deg, #ff9800, #f57c00)',
          color: 'white', border: 'none', borderRadius: '60px', fontSize: '1.2rem',
          fontWeight: 'bold', cursor: 'pointer', transition: 'transform 0.2s'
        }}>Завершить →</button>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-150px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(150px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes bubbleAppear { from { opacity: 0; transform: translateX(-50%) scale(0.9); } to { opacity: 1; transform: translateX(-50%) scale(1); } }
      `}</style>
    </div>
  );
}

export default DepositFailDialog;