import { useState, useEffect } from 'react';
import useSpeech from '../hooks/useSpeech';
import foxGirlWithBows from '../assets/images/fox_girl_with_bows.png';
import foxGirlWithoutBows from '../assets/images/fox_girl_without_bows.png';
import foxMother from '../assets/images/fox_mother.png';
import foxFather from '../assets/images/fox_father.png';
import bows from '../assets/images/bows.png';

function LossDialog({ onComplete, type }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showBowsLoss, setShowBowsLoss] = useState(false);
  const [foxImage, setFoxImage] = useState(foxGirlWithBows);
  const { speak, stop } = useSpeech();

  useEffect(() => {
    speak('За год ты не накопила нужную сумму. Бантики пришлось отдать.', { rate: 1.0 });
    setTimeout(() => {
      setShowBowsLoss(true);
      setFoxImage(foxGirlWithoutBows);
    }, 1500);
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
      background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
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
        animation: 'slideInLeft 0.5s ease'
      }}>
        <img src={foxImage} alt="Лисичка" style={{ width: '100%', height: 'auto' }} />
        {showBowsLoss && (
          <div style={{
            position: 'absolute',
            top: '10%',
            right: '-30%',
            width: '60px',
            animation: 'bowsFly 1s ease forwards'
          }}>
            <img src={bows} alt="Бантики" style={{ width: '100%', height: 'auto' }} />
          </div>
        )}
      </div>

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
        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>😔💔</div>
        <h2 style={{ color: '#c62828', marginBottom: '15px', fontSize: '1.8rem' }}>Неудача...</h2>
        <p style={{ fontSize: '1.2rem', lineHeight: '1.5', color: '#333', marginBottom: '25px' }}>
          За год ты не накопила нужную сумму.<br />
          Папа продал твои бантики. Планшет остался, но бантиков больше нет.
        </p>
        <button
          onClick={handleFinish}
          style={{
            padding: '12px 30px',
            background: 'linear-gradient(135deg, #c62828, #b71c1c)',
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
        @keyframes bowsFly { 0% { opacity: 1; transform: translateX(0) rotate(0); } 100% { opacity: 0; transform: translateX(200px) rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default LossDialog;