import { useState, useEffect } from 'react';
import useSpeech from '../hooks/useSpeech';
import background2 from '../assets/images/background2.png';
import foxGirl from '../assets/images/fox_girl.png';
import foxGirlHappy from '../assets/images/fox_girl_happy.png';
import foxMotherHappy from '../assets/images/mother_happy.png';
import foxFatherHappy from '../assets/images/father_happy.png';
import tablet from '../assets/images/tablet.png';
import botHappy from '../assets/images/bot_happy.png';

function VictoryDialog({ onComplete, score, type }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showTablet, setShowTablet] = useState(false);
  const [isHappy, setIsHappy] = useState(false);
  const { speak, stop } = useSpeech();

  useEffect(() => {
    speak('Ура! Ты справилась! Родители тобой гордятся!', { rate: 1.0 });
    setTimeout(() => setShowTablet(true), 1000);
    setTimeout(() => setIsHappy(true), 2500);
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
      <div style={{ position: 'absolute', bottom: 0, left: '8%', width: '32%', maxWidth: '320px', animation: 'slideInLeft 0.5s ease' }}>
        <img src={isHappy ? foxGirlHappy : foxGirl} alt="Лисичка" style={{ width: '100%', height: 'auto', transform: 'scale(1.15)', transformOrigin: 'bottom center' }} />
      </div>
      {showTablet && (
        <div style={{
          position: 'absolute',
          bottom: isHappy ? '25%' : '35%',
          left: isHappy ? '22%' : '50%',
          transform: 'translateX(-50%)',
          width: isHappy ? '200px' : '240px',
          transition: 'all 1s ease-in-out',
          animation: 'tabletGlow 1s ease-in-out',
          zIndex: 15
        }}>
          <img src={tablet} alt="Планшет" style={{ width: '100%', height: 'auto', filter: 'drop-shadow(0 0 15px gold)' }} />
        </div>
      )}
      <div style={{ position: 'absolute', bottom: 0, right: '12%', width: '32%', maxWidth: '320px', animation: 'slideInRight 0.5s ease, happyGlow 1s ease 0.5s' }}>
        <img src={foxMotherHappy} alt="Мама" style={{ width: '100%', height: 'auto', transform: 'scale(1.3)', transformOrigin: 'bottom center' }} />
      </div>
      <div style={{ position: 'absolute', bottom: 0, right: '2%', width: '32%', maxWidth: '320px', animation: 'slideInRight 0.5s ease, happyGlow 1s ease 0.5s' }}>
        <img src={foxFatherHappy} alt="Папа" style={{ width: '100%', height: 'auto', transform: 'scale(1.4)', transformOrigin: 'bottom center' }} />
      </div>
      <div style={{
        position: 'absolute', bottom: '40%', left: '50%', transform: 'translateX(-50%)',
        width: '65%', maxWidth: '600px', backgroundColor: 'rgba(255,255,255,0.96)',
        borderRadius: '48px', padding: '35px 40px', textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0,0,0,0.25)', animation: 'bubbleAppear 0.4s ease'
      }}>
        <img src={botHappy} alt="Совёнок" style={{ width: '100px', height: '100px', marginBottom: '15px', objectFit: 'contain' }} />
        <h2 style={{ color: '#2e7d32', marginBottom: '20px', fontSize: '2rem', fontWeight: 'bold' }}>Поздравляем!</h2>
        <p style={{ fontSize: '1.3rem', lineHeight: '1.5', color: '#333', marginBottom: '30px' }}>
          Ты накопила {score} ₽ и получила планшет!<br />
          Родители тобой очень гордятся!
        </p>
        <button onClick={handleFinish} style={{
          padding: '14px 40px', background: 'linear-gradient(135deg, #2e7d32, #1b5e20)',
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
        @keyframes tabletGlow { 0% { filter: drop-shadow(0 0 5px gold); } 50% { filter: drop-shadow(0 0 25px gold); } 100% { filter: drop-shadow(0 0 10px gold); } }
        @keyframes happyGlow {
          0% { filter: drop-shadow(0 0 0px gold); transform: scale(1); }
          50% { filter: drop-shadow(0 0 15px gold); transform: scale(1.05); }
          100% { filter: drop-shadow(0 0 0px gold); transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

export default VictoryDialog;