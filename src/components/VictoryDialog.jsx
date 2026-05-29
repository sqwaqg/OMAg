import { useState, useEffect } from 'react';
import useSpeech from '../hooks/useSpeech';
import foxGirlWithBows from '../assets/images/fox_girl_with_bows.png';
import foxGirlHappy from '../assets/images/fox_girl_happy.png'; // счастливая с планшетом
import foxMother from '../assets/images/fox_mother.png';
import foxFather from '../assets/images/fox_father.png';
import tablet from '../assets/images/tablet.png';
import background2 from '../assets/images/background2.png';

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
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `url(${background2})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center 30%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3000,
      animation: isFadingOut ? 'fadeOut 0.4s ease forwards' : 'fadeIn 0.5s ease'
    }}>
      {/* Девочка слева */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: '8%',
        width: '35%',
        maxWidth: '350px',
        animation: 'slideInLeft 0.5s ease',
        transition: 'all 0.5s ease'
      }}>
        <img 
          src={isHappy ? foxGirlHappy : foxGirlWithBows} 
          alt="Лисичка" 
          style={{ width: '100%', height: 'auto' }} 
        />
      </div>

      {/* Планшет (большой, с подсветкой, летит к девочке) */}
      {showTablet && (
        <div style={{
          position: 'absolute',
          bottom: isHappy ? '25%' : '35%',
          left: isHappy ? '25%' : '50%',
          transform: 'translateX(-50%)',
          width: isHappy ? '100px' : '120px',
          transition: 'all 1s ease-in-out',
          animation: 'tabletGlow 1s ease-in-out, tabletFly 1s ease-in-out forwards',
          zIndex: 15
        }}>
          <img 
            src={tablet} 
            alt="Планшет" 
            style={{ width: '100%', height: 'auto', filter: 'drop-shadow(0 0 15px gold)' }} 
          />
        </div>
      )}

      {/* Мама справа */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        right: '15%',
        width: '32%',
        maxWidth: '320px',
        animation: 'slideInRight 0.5s ease'
      }}>
        <img src={foxMother} alt="Мама" style={{ width: '100%', height: 'auto' }} />
      </div>

      {/* Папа справа выше */}
      <div style={{
        position: 'absolute',
        bottom: '5%',
        right: '3%',
        width: '34%',
        maxWidth: '340px',
        animation: 'slideInRight 0.5s ease'
      }}>
        <img src={foxFather} alt="Папа" style={{ width: '100%', height: 'auto' }} />
      </div>

      {/* Облачко диалога */}
      <div style={{
        position: 'absolute',
        bottom: '40%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60%',
        maxWidth: '500px',
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: '30px',
        padding: '25px 30px',
        textAlign: 'center',
        boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
        animation: 'bubbleAppear 0.4s ease'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎉🏆🎉</div>
        <h2 style={{ color: '#2e7d32', marginBottom: '15px', fontSize: '1.8rem' }}>Поздравляем!</h2>
        <p style={{ fontSize: '1.2rem', lineHeight: '1.5', color: '#333', marginBottom: '25px' }}>
          Ты накопила {score} ₽ и получила планшет!<br />
          Родители тобой очень гордятся! 🌟
        </p>
        <button
          onClick={handleFinish}
          style={{
            padding: '12px 30px',
            background: 'linear-gradient(135deg, #2e7d32, #1b5e20)',
            color: 'white',
            border: 'none',
            borderRadius: '40px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Завершить →
        </button>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-150px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(150px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes bubbleAppear { from { opacity: 0; transform: translateX(-50%) scale(0.9); } to { opacity: 1; transform: translateX(-50%) scale(1); } }
        @keyframes tabletGlow {
          0% { filter: drop-shadow(0 0 5px gold); }
          50% { filter: drop-shadow(0 0 30px gold); }
          100% { filter: drop-shadow(0 0 15px gold); }
        }
        @keyframes tabletFly {
          0% { left: 50%; bottom: 35%; width: 120px; opacity: 1; }
          100% { left: 22%; bottom: 30%; width: 80px; opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default VictoryDialog;