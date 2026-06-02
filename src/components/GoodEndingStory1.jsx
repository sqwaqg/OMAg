import { useState, useEffect } from 'react';
import useSpeech from '../hooks/useSpeech';
import background2 from '../assets/images/background2.png';
import foxChildWithMoney from '../assets/images/fox_child_with_money.png';
import foxMother from '../assets/images/fox_mother.png';
import botHappy from '../assets/images/bot_happy.png';

function GoodEndingStory1({ onComplete }) {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const { speak, stop } = useSpeech();
  const title = 'Отличная работа!';
  const text = 'Ты купил все качественные продукты. Родители гордятся тобой!';

  useEffect(() => {
    speak(text, { rate: 0.95 });
    return () => stop();
  }, [text]);

  const handleFinish = () => {
    stop();
    setIsFadingOut(true);
    setTimeout(() => onComplete(), 400);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundImage: `url(${background2})`,
      backgroundSize: 'cover', backgroundPosition: 'center 30%',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000,
      animation: isFadingOut ? 'fadeOut 0.4s ease forwards' : 'fadeIn 0.4s ease'
    }}>
      {/* Ребёнок (лисёнок) – слева */}
      <div style={{ position: 'absolute', bottom: 0, left: '10%', width: '30%', maxWidth: '300px', animation: 'slideInLeft 0.5s ease' }}>
        <img src={foxChildWithMoney} alt="Лисёнок" style={{ width: '100%', height: 'auto', transform: 'scale(1.15)', transformOrigin: 'bottom center' }} />
      </div>
      {/* Мама – справа */}
      <div style={{ position: 'absolute', bottom: 0, right: '10%', width: '32%', maxWidth: '320px', animation: 'slideInRight 0.5s ease' }}>
        <img src={foxMother} alt="Мама" style={{ width: '100%', height: 'auto', transform: 'scale(1.3)', transformOrigin: 'bottom center' }} />
      </div>
      {/* Центральное окно – с совой */}
      <div style={{
        position: 'relative', zIndex: 20,
        maxWidth: '700px', width: '85%', padding: '45px 40px',
        textAlign: 'center', background: 'rgba(255,255,240,0.97)',
        borderRadius: '60px', boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
        border: '2px solid #ffd966', animation: 'slideIn 0.4s ease'
      }}>
        <img src={botHappy} alt="Совёнок" style={{ width: '100px', height: '100px', marginBottom: '15px', objectFit: 'contain' }} />
        <h2 style={{ color: '#2e7d32', marginBottom: '20px', fontSize: '2.2rem', fontWeight: 'bold' }}>{title}</h2>
        <p style={{ fontSize: '1.3rem', lineHeight: '1.5', color: '#333', marginBottom: '35px' }}>{text}</p>
        <button onClick={handleFinish} style={{
          padding: '14px 40px', background: 'linear-gradient(135deg, #2e7d32, #1b5e20)',
          color: 'white', border: 'none', borderRadius: '50px', fontSize: '1.2rem',
          fontWeight: 'bold', cursor: 'pointer'
        }}>Завершить →</button>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-150px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(150px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </div>
  );
}

export default GoodEndingStory1;