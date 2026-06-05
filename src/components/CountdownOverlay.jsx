import { useState, useEffect } from 'react';

function CountdownOverlay({ onComplete }) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) {
      onComplete();
      return;
    }
    const timer = setTimeout(() => setCount(count - 1), 1000);
    return () => clearTimeout(timer);
  }, [count, onComplete]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3500,
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        fontSize: 'clamp(3rem, 15vw, 6rem)',
        fontWeight: 'bold',
        color: 'white',
        textShadow: '0 0 20px #ff9800',
        animation: 'pulse 1s infinite'
      }}>
        {count}
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulse { 0% { transform: scale(1); opacity: 0.7; } 50% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(1); opacity: 0.7; } }
      `}</style>
    </div>
  );
}

export default CountdownOverlay;