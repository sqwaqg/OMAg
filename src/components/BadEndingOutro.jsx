import { useState, useEffect } from 'react';
import useSpeech from '../hooks/useSpeech';
import fatherDaughterImg from '../assets/images/bad_ending_father_daughter.png';
import motherSonImg from '../assets/images/bad_ending_mother_son.png';
import botSad from '../assets/images/bot_sad.png';
import background2 from '../assets/images/background2.png';

function BadEndingOutro({ onComplete, playSfx }) {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const { speak, stop } = useSpeech();
  const title = 'Будь внимательнее!';
  const text = 'Осторожно! Дешёвые продукты оказались некачественными. Семья отравилась. В следующий раз не экономь на качестве.';

  useEffect(() => {
    if (playSfx) playSfx('fail');
    speak(text, { rate: 1.1 });
    return () => stop();
  }, [playSfx]);

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
      <div style={{ position: 'absolute', bottom: 'clamp(60px, 15vh, 120px)', left: '5%', width: 'clamp(250px, 40vw, 400px)' }}>
        <img src={fatherDaughterImg} alt="Отец и дочь" style={{ width: '100%', height: 'auto', transform: 'scale(clamp(1.2, 4vw, 1.6))', transformOrigin: 'bottom center' }} />
      </div>
      <div style={{ position: 'absolute', bottom: 'clamp(60px, 15vh, 120px)', right: '5%', width: 'clamp(250px, 40vw, 400px)' }}>
        <img src={motherSonImg} alt="Мама и сын" style={{ width: '100%', height: 'auto', transform: 'scale(clamp(1.2, 4vw, 1.6))', transformOrigin: 'bottom center' }} />
      </div>

      <div style={{
        position: 'relative', zIndex: 20,
        maxWidth: 'clamp(500px, 80vw, 700px)', width: '85%', padding: 'clamp(25px, 5vw, 40px) clamp(25px, 6vw, 35px)',
        textAlign: 'center', background: 'rgba(255,255,240,0.97)',
        borderRadius: 'clamp(40px, 8vw, 60px)', boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
        border: '2px solid #ffd966', animation: 'slideIn 0.4s ease'
      }}>
        <img src={botSad} alt="Совёнок" style={{ width: 'clamp(70px, 12vw, 100px)', height: 'auto', marginBottom: 'clamp(10px, 2vw, 15px)', objectFit: 'contain' }} />
        <h2 style={{ color: '#c62828', marginBottom: 'clamp(15px, 3vw, 20px)', fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', fontWeight: 'bold' }}>{title}</h2>
        <p style={{ fontSize: 'clamp(1rem, 3vw, 1.3rem)', lineHeight: '1.5', color: '#333', marginBottom: 'clamp(25px, 5vw, 35px)' }}>{text}</p>
        <button onClick={handleFinish} style={{
          padding: 'clamp(10px, 2vw, 14px) clamp(30px, 6vw, 40px)',
          background: 'linear-gradient(135deg, #c62828, #b71c1c)',
          color: 'white', border: 'none', borderRadius: '50px', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
          fontWeight: 'bold', cursor: 'pointer'
        }}>Завершить →</button>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

export default BadEndingOutro;