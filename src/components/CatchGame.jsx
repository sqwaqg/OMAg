import { useState, useEffect, useRef } from 'react';
import InfoModal from './InfoModal';
import CountdownOverlay from './CountdownOverlay';

import coinPlus100 from '../assets/images/coin_plus100.png';
import coinPlus150 from '../assets/images/coin_plus150.png';
import coinMinus50 from '../assets/images/coin_minus50.png';
import coinMinus150 from '../assets/images/coin_minus150.png';
import pigImage from '../assets/images/pig.png';

const CatchGame = ({ config, onFinish, onBack, onEncouragement }) => {
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
  const [isPaused, setIsPaused] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [infoContent, setInfoContent] = useState({ title: '', text: '' });
  
  const catcherRef = useRef(null);
  const gameAreaRef = useRef(null);
  const animationRef = useRef(null);
  const lastSpawnRef = useRef(Date.now());
  const spawnedCountRef = useRef(0);
  const targetReachedRef = useRef(false);
  const encouragementTimer = useRef(null);

  const encouragementPhrases = [
    'Так держать!', 'Ты круто ловишь!', 'Ещё немного!', 'Почти у цели!',
    'Ты справишься!', 'Верю в тебя!', 'Отличная работа!', 'Продолжай в том же духе!',
    'Ты молодец!', 'У тебя отлично получается!', 'Не сдавайся!', 'Ты на верном пути!'
  ];

  useEffect(() => {
    if (gameOver) return;
    const startEncouragementTimer = () => {
      if (encouragementTimer.current) clearInterval(encouragementTimer.current);
      encouragementTimer.current = setInterval(() => {
        if (!isPaused && !gameOver && onEncouragement) {
          const randomPhrase = encouragementPhrases[Math.floor(Math.random() * encouragementPhrases.length)];
          onEncouragement(randomPhrase);
        }
      }, 5000);
    };
    startEncouragementTimer();
    return () => {
      if (encouragementTimer.current) clearInterval(encouragementTimer.current);
    };
  }, [gameOver, isPaused, onEncouragement]);

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
      if (isPaused) return;
      const rect = gameArea.getBoundingClientRect();
      let x = e.clientX - rect.left - catcher.offsetWidth / 2;
      x = Math.max(0, Math.min(x, rect.width - catcher.offsetWidth));
      catcher.style.left = `${x}px`;
    };

    const handleTouchMove = (e) => {
      if (isPaused) return;
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
  }, [isPaused]);

  useEffect(() => {
    if (gameOver) return;

    const update = () => {
      if (isPaused) {
        animationRef.current = requestAnimationFrame(update);
        return;
      }

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
  }, [gameOver, allItems, target, stopOnTarget, score, caught, missed, isPaused]);

  useEffect(() => {
    if (gameOver) return;
    if (spawnedCountRef.current >= totalItems && items.length === 0 && !targetReachedRef.current) {
      setResult(score >= target ? 'win' : 'lose');
      setGameOver(true);
    }
  }, [items, gameOver, target, score]);

  useEffect(() => {
    if (gameOver && result) {
      if (encouragementTimer.current) clearInterval(encouragementTimer.current);
      onFinish(result, score);
    }
  }, [gameOver, result, onFinish, score]);

  const openInfo = () => {
    setInfoContent({
      title: 'Полезные советы',
      text: 'Вклад – надёжный способ сохранить деньги. Кредит помогает купить вещь сейчас, но потом нужно возвращать больше. Какой путь выберешь ты? Будь внимателен при выборе!',
      facts: [
        '💰 Вклады обычно имеют процентную ставку – твои деньги работают на тебя.',
        '📉 Кредит может быть полезен для крупных покупок, но переплата может быть значительной.',
        '📊 Если вовремя не вернуть кредит, могут быть штрафы и испорченная кредитная история.',
        '🐷 Копить маленькими суммами каждый месяц – отличная привычка для финансовой свободы.',
        '📈 Даже 50 рублей, отложенные сегодня, через год с процентами станут больше.'
      ]
    });
    setIsPaused(true);
    setShowInfo(true);
  };

  const handleInfoClose = () => {
    setShowInfo(false);
    setShowCountdown(true);
  };

  const handleCountdownComplete = () => {
    setShowCountdown(false);
    setIsPaused(false);
  };

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
        border: '1px solid rgba(255,255,255,0.5)',
        position: 'relative'
      }}>
        <button 
          onClick={onBack}
          disabled={isPaused}
          style={{
            background: 'rgba(46,125,50,0.9)',
            border: 'none',
            padding: '10px 24px',
            borderRadius: '40px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: isPaused ? 'not-allowed' : 'pointer',
            color: 'white',
            opacity: isPaused ? 0.5 : 1
          }}
        >
          Назад
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

        <button
          onClick={openInfo}
          disabled={isPaused}
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#ff9800',
            border: 'none',
            fontSize: '1.3rem',
            fontWeight: 'bold',
            color: 'white',
            cursor: isPaused ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            opacity: isPaused ? 0.5 : 1
          }}
        >
          i
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '15px' }}>
        <div style={{ fontSize: '1rem', color: '#2e7d32' }}>Поймано: {caught}</div>
        <div style={{ fontSize: '1rem', color: '#c62828' }}>Промахи: {missed}</div>
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
          cursor: isPaused ? 'default' : 'none',
          touchAction: 'none',
          boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
          opacity: isPaused ? 0.7 : 1,
          transition: 'opacity 0.2s'
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
              <img src={itemImage} alt="coin" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
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
            cursor: isPaused ? 'default' : 'grab'
          }}
        >
          <img src={pigImage} alt="piggy bank" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 8px 15px rgba(0,0,0,0.2))' }} />
        </div>
      </div>

      {showInfo && (
        <InfoModal
          title={infoContent.title}
          content={infoContent.text}
          onClose={handleInfoClose}
        />
      )}
      {showCountdown && (
        <CountdownOverlay onComplete={handleCountdownComplete} />
      )}

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