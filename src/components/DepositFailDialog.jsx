import { useState, useEffect } from 'react';
import useSpeech from '../hooks/useSpeech';
import foxGirlSad from '../assets/images/fox_girl_without_bows.png'; // грустная девочка (без бантиков)
import foxMother from '../assets/images/fox_mother.png';
import foxFather from '../assets/images/fox_father.png';

function DepositFailDialog({ onComplete, score }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const { speak, stop } = useSpeech();
  const text = 'Доченька, со дня твоего рождения и вклада прошёл ровно год. У тебя накопилось 11500 рублей. Ты не накопила 500 рублей, как мы договаривались? Смотри, у тебя сегодня было день рождения, тебе подарили деньги, плюс остались деньги с прошлого дня рождения, плюс 1500 рублей благодаря вкладу. Ты можешь сложить свои деньги и купить ноутбук вместо планшета, либо купить планшет и какой-нибудь чехол к нему.';

  useEffect(() => {
    speak(text, { rate: 0.95 });
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
      background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000,
      animation: isFadingOut ? 'fadeOut 0.4s ease forwards' : 'fadeIn 0.5s ease'
    }}>
      {/* Девочка грустная (без бантиков) */}
      <div style={{ position: 'absolute', bottom: 0, left: '10%', width: '30%', maxWidth: '300px', animation: 'slideInLeft 0.5s ease' }}>
        <img src={foxGirlSad} alt="Лисичка грустная" style={{ width: '100%', height: 'auto' }} />
      </div>
      {/* Мама и папа */}
      <div style={{ position: 'absolute', bottom: 0, right: '15%', width: '32%', maxWidth: '320px', animation: 'slideInRight 0.5s ease' }}>
        <img src={foxMother} alt="Мама" style={{ width: '100%', height: 'auto' }} />
      </div>
      <div style={{ position: 'absolute', bottom: '5%', right: '3%', width: '34%', maxWidth: '340px', animation: 'slideInRight 0.5s ease' }}>
        <img src={foxFather} alt="Папа" style={{ width: '100%', height: 'auto' }} />
      </div>
      {/* Облачко */}
      <div style={{
        position: 'absolute', bottom: '40%', left: '50%', transform: 'translateX(-50%)',
        width: '65%', maxWidth: '600px', backgroundColor: 'rgba(255,255,255,0.96)',
        borderRadius: '48px', padding: '35px 40px', textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0,0,0,0.25)', animation: 'bubbleAppear 0.4s ease'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '15px' }}>😔📉</div>
        <h2 style={{ color: '#ff9800', marginBottom: '20px', fontSize: '2rem', fontWeight: 'bold' }}>История с вкладом</h2>
        <p style={{ fontSize: '1.2rem', lineHeight: '1.5', color: '#333', marginBottom: '30px' }}>{text}</p>
        <button onClick={handleFinish} style={{
          padding: '14px 40px', background: 'linear-gradient(135deg, #ff9800, #f57c00)',
          color: 'white', border: 'none', borderRadius: '60px', fontSize: '1.2rem',
          fontWeight: 'bold', cursor: 'pointer', transition: 'transform 0.2s'
        }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}>Завершить →</button>
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