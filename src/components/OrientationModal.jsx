import { useEffect, useState } from 'react';

function OrientationModal() {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const check = () => setIsPortrait(window.innerHeight > window.innerWidth);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!isPortrait) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.95)',
      backdropFilter: 'blur(10px)',
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div style={{ fontSize: 'clamp(3rem, 10vw, 5rem)', marginBottom: '20px' }}>📱</div>
      <h2 style={{ fontSize: 'clamp(1.2rem, 5vw, 1.8rem)', marginBottom: '10px' }}>Поверните устройство</h2>
      <p style={{ fontSize: 'clamp(0.9rem, 4vw, 1.2rem)', maxWidth: '300px' }}>
        Пожалуйста, переверните телефон в горизонтальное положение.
      </p>
      <div style={{ marginTop: '30px', fontSize: 'clamp(2rem, 8vw, 3rem)', animation: 'rotateArrow 1s infinite' }}>↻</div>
      <style>{`
        @keyframes rotateArrow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(90deg); }
        }
      `}</style>
    </div>
  );
}

export default OrientationModal;