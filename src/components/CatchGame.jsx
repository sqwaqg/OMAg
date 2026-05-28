import { useState, useEffect, useRef } from 'react';

import coinPlus100 from '../assets/images/coin_plus100.png';
import coinPlus150 from '../assets/images/coin_plus150.png';
import coinMinus50 from '../assets/images/coin_minus50.png';
import coinMinus150 from '../assets/images/coin_minus150.png';
import pigImage from '../assets/images/pig.png';

const CatchGame = ({ config, onFinish, onBack }) => {
  const target = config?.target ?? 500;
  const positiveValues = config?.positiveValues ?? [100, 150];
  const negativeValues = config?.negativeValues ?? [-50, -150];
  const positiveCount = config?.positiveCount ?? 5;
  const negativeCount = config?.negativeCount ?? 3;
  const totalItems = config?.totalItems ?? 8;
  const stopOnTarget = config?.stopOnTarget ?? true;

  const [items, setItems] = useState([]);
  const [score, setScore] = useState(0);
  const [caught, setCaught] = useState(0);
  const [missed, setMissed] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const catcherRef = useRef(null);
  const gameAreaRef = useRef(null);
  const animationRef = useRef(null);
  const lastSpawnRef = useRef(Date.now());
  const spawnedCountRef = useRef(0);
  const targetReachedRef = useRef(false);

  useEffect(() => {
    if (gameOver) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          setResult('lose');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameOver]);

  const generateItems = () => {
    const itemsList = [];
    for (let i = 0; i < positiveCount; i++) {
      const value = positiveValues[Math.floor(Math.random() * positiveValues.length)];
      itemsList.push({ id: Math.random().toString(36).substr(2, 9), value, type: 'positive' });
    }
    for (let i = 0; i < negativeCount; i++) {
      const value = negativeValues[Math.floor(Math.random() * negativeValues.length)];
      itemsList.push({ id: Math.random().toString(36).substr(2, 9), value, type: 'negative' });
    }
    for (let i = itemsList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [itemsList[i], itemsList[j]] = [itemsList[j], itemsList[i]];
    }
    return itemsList;
  };

  const [allItems] = useState(generateItems());

  const getItemImage = (value, type) => {
    if (value === 100 && type === 'positive') return coinPlus100;
    if (value === 150 && type === 'positive') return coinPlus150;
    if (value === -50 && type === 'negative') return coinMinus50;
    if (value === -150 && type === 'negative') return coinMinus150;
    return null;
  };

  useEffect(() => {
    const gameArea = gameAreaRef.current;
    const catcher = catcherRef.current;
    if (!gameArea || !catcher) return;

    const handleMouseMove = (e) => {
      const rect = gameArea.getBoundingClientRect();
      let x = e.clientX - rect.left - catcher.offsetWidth / 2;
      x = Math.max(0, Math.min(x, rect.width - catcher.offsetWidth));
      catcher.style.left = `${x}px`;
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      const rect = gameArea.getBoundingClientRect();
      let x = e.touches[0].clientX - rect.left - catcher.offsetWidth / 2;
      x = Math.max(0, Math.min(x, rect.width - catcher.offsetWidth));
      catcher.style.left = `${x}px`;
    };

    gameArea.addEventListener('mousemove', handleMouseMove);
    gameArea.addEventListener('touchmove', handleTouchMove);
    gameArea.addEventListener('touchstart', (e) => e.preventDefault());

    return () => {
      gameArea.removeEventListener('mousemove', handleMouseMove);
      gameArea.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  useEffect(() => {
    if (gameOver) return;

    const update = () => {
      const now = Date.now();

      if (spawnedCountRef.current < totalItems && now - lastSpawnRef.current > 800) {
        const newItem = allItems[spawnedCountRef.current];
        if (newItem) {
          setItems(prev => [...prev, {
            ...newItem,
            y: 0,
            x: Math.random() * (gameAreaRef.current?.clientWidth - 50),
          }]);
          spawnedCountRef.current++;
          lastSpawnRef.current = now;
        }
      }

      setItems(prev => {
        const catcherRect = catcherRef.current?.getBoundingClientRect();
        const gameRect = gameAreaRef.current?.getBoundingClientRect();
        const gameHeight = gameAreaRef.current?.clientHeight || 600;
        const newItems = [];

        let newScore = score;
        let newCaught = caught;
        let newMissed = missed;

        for (const item of prev) {
          const newY = item.y + 5;
          let caughtFlag = false;

          if (catcherRect && gameRect &&
              newY + 50 >= catcherRect.top - gameRect.top &&
              newY <= catcherRect.bottom - gameRect.top &&
              item.x + 50 >= catcherRect.left - gameRect.left &&
              item.x <= catcherRect.right - gameRect.left) {
            newScore += item.value;
            newCaught++;
            caughtFlag = true;
          }
          else if (newY + 50 >= gameHeight) {
            newMissed++;
            caughtFlag = true;
          }
          else {
            newItems.push({ ...item, y: newY });
          }
        }

        if (newScore !== score) setScore(newScore);
        if (newCaught !== caught) setCaught(newCaught);
        if (newMissed !== missed) setMissed(newMissed);

        if (stopOnTarget && newScore >= target && !targetReachedRef.current) {
          targetReachedRef.current = true;
          setResult('win');
          setGameOver(true);
        }

        return newItems;
      });

      animationRef.current = requestAnimationFrame(update);
    };

    animationRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationRef.current);
  }, [gameOver, allItems, target, stopOnTarget, score, caught, missed]);

  useEffect(() => {
    if (gameOver) return;
    if (spawnedCountRef.current >= totalItems && items.length === 0 && !targetReachedRef.current) {
      if (score >= target) {
        setResult('win');
      } else {
        setResult('lose');
      }
      setGameOver(true);
    }
  }, [items, gameOver, target, score]);

  useEffect(() => {
    if (gameOver && result) {
      onFinish(result, score);
    }
  }, [gameOver, result, onFinish, score]);

  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '20px',
      background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
      borderRadius: '40px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        padding: '15px 25px',
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '60px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255,255,255,0.5)'
      }}>
        <button 
          onClick={onBack}
          style={{
            background: 'rgba(46,125,50,0.9)',
            border: 'none',
            padding: '10px 24px',
            borderRadius: '40px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            color: 'white',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          ← Назад
        </button>
        
        <div style={{ 
          fontSize: '1.3rem', 
          fontWeight: 'bold', 
          color: '#2e7d32',
          background: 'rgba(46,125,50,0.15)',
          padding: '8px 20px',
          borderRadius: '40px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>🎯</span> Цель: {target} ₽
        </div>
        
        <div style={{ 
          display: 'flex',
          gap: '15px',
          alignItems: 'center'
        }}>
          <div style={{ 
            fontSize: '1.2rem', 
            fontWeight: 'bold', 
            color: timeLeft < 10 ? '#c62828' : '#2e7d32',
            background: 'rgba(46,125,50,0.15)',
            padding: '8px 16px',
            borderRadius: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span>⏱️</span> {timeLeft} сек
          </div>
          <div style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: '#1b5e20',
            background: 'rgba(46,125,50,0.15)',
            padding: '8px 20px',
            borderRadius: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            minWidth: '150px',
            justifyContent: 'center'
          }}>
            <span>💰</span> <span style={{ minWidth: '70px', textAlign: 'center' }}>{score}</span> ₽
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '30px',
        marginBottom: '15px'
      }}>
        <div style={{ fontSize: '1rem', color: '#2e7d32' }}>✅ Поймано: {caught}</div>
        <div style={{ fontSize: '1rem', color: '#c62828' }}>❌ Промахи: {missed}</div>
      </div>

      <div
        ref={gameAreaRef}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1100px',
          height: '650px',
          margin: '0 auto',
          background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 50%, #81c784 100%)',
          overflow: 'hidden',
          border: '3px solid rgba(255,255,255,0.4)',
          borderRadius: '40px',
          cursor: 'none',
          touchAction: 'none',
          boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
        }}
      >
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '70px',
          background: 'linear-gradient(180deg, #4caf50, #2e7d32)',
          borderTop: '3px solid rgba(255,255,255,0.3)',
          borderRadius: '0 0 40px 40px',
          pointerEvents: 'none',
          zIndex: 2
        }} />

        {items.map(item => {
          const itemImage = getItemImage(item.value, item.type);
          return (
            <div
              key={item.id}
              style={{
                position: 'absolute',
                left: `${item.x}px`,
                top: `${item.y}px`,
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'itemSpawn 0.2s ease-out',
                zIndex: 10
              }}
            >
              <img src={itemImage} alt="монета" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
          );
        })}

        <div
          ref={catcherRef}
          style={{
            position: 'absolute',
            bottom: '20px',
            width: '100px',
            height: '80px',
            left: '350px',
            zIndex: 20,
            transition: 'left 0.05s linear',
            cursor: 'grab'
          }}
        >
          <img 
            src={pigImage} 
            alt="Копилка"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 8px 15px rgba(0,0,0,0.2))'
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes itemSpawn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default CatchGame;