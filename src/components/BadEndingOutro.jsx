import { useState, useEffect } from 'react';
import useSpeech from '../hooks/useSpeech';

// TODO: заменить на отравленные фреймы персонажей
import foxFather from '../assets/images/fox_father.png';
import foxChild from '../assets/images/fox_child.png'; // сын
import foxGirl from '../assets/images/fox_girl.png'; // дочь
import foxMother from '../assets/images/fox_mother.png';

function BadEndingOutro({ onComplete }) {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const { speak, stop } = useSpeech();
  const title = 'Будь внимательнее!';
  const text = 'Ты купил дешёвые молочные продукты. Они быстро испортились, и все члены семьи отравились. В следующий раз выбирай качественные продукты!';

  useEffect(() => {
    speak(text, { rate: 1.1 });
    return () => stop();
  }, []);

  const handleFinish = () => {
    stop();
    setIsFadingOut(true);
    setTimeout(() => onComplete(), 400);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'linear-gradient(135deg, #e8f5e9 0%, #ffffff 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000,
      animation: isFadingOut ? 'fadeOut 0.4s ease forwards' : 'fadeIn 0.4s ease'
    }}>
      {/* ===== ЛЕВАЯ СТОРОНА: папа + дочь ===== */}
      {/* Папа – у края, отзеркален (смотрит направо) */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: '2%',
        width: '30%',
        maxWidth: '300px',
        animation: 'slideInLeft 0.5s ease',
        transform: 'scaleX(-1)'
      }}>
        <img src={foxFather} alt="Папа" style={{ width: '100%', height: 'auto' }} />
      </div>
      {/* Дочь – рядом с папой, чуть правее, не отзеркалена */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: '18%',
        width: '22%',
        maxWidth: '220px',
        animation: 'slideInLeft 0.5s ease 0.1s'
      }}>
        <img src={foxGirl} alt="Дочь" style={{ width: '100%', height: 'auto' }} />
      </div>

      {/* ===== ПРАВАЯ СТОРОНА: мама + сын ===== */}
      {/* Мама – у края, НЕ отзеркалена (оригинальный взгляд влево) */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        right: '2%',
        width: '30%',
        maxWidth: '300px',
        animation: 'slideInRight 0.5s ease'
      }}>
        <img src={foxMother} alt="Мама" style={{ width: '100%', height: 'auto' }} />
      </div>
      {/* Сын – рядом с мамой, чуть левее */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        right: '18%',
        width: '22%',
        maxWidth: '220px',
        animation: 'slideInRight 0.5s ease 0.1s'
      }}>
        <img src={foxChild} alt="Сын" style={{ width: '100%', height: 'auto' }} />
      </div>

      {/* ЦЕНТРАЛЬНОЕ ОКНО */}
      <div style={{
        position: 'relative',
        zIndex: 20,
        maxWidth: '650px',
        width: '85%',
        padding: '40px 35px',
        textAlign: 'center',
        background: 'rgba(255, 255, 240, 0.97)',
        borderRadius: '60px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
        border: '2px solid #ffd966',
        animation: 'slideIn 0.4s ease'
      }}>
        <div style={{ fontSize: '4.5rem', marginBottom: '15px' }}>😔💔🤢</div>
        <h2 style={{ color: '#c62828', marginBottom: '20px', fontSize: '2.2rem', fontWeight: 'bold' }}>{title}</h2>
        <p style={{ fontSize: '1.3rem', lineHeight: '1.5', color: '#333', marginBottom: '35px' }}>{text}</p>
        <button
          onClick={handleFinish}
          style={{
            padding: '14px 40px',
            background: 'linear-gradient(135deg, #c62828, #b71c1c)',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Завершить →
        </button>
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

export default BadEndingOutro;