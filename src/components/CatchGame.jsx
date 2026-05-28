import { useState, useEffect, useRef } from 'react';

const CatchGame = ({ config, onFinish }) => {
  const [items, setItems] = useState([]);
  const [score, setScore] = useState(0);
  const [caught, setCaught] = useState(0);
  const [missed, setMissed] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState(null);
  const catcherRef = useRef(null);
  const gameAreaRef = useRef(null);
  const animationRef = useRef(null);
  const lastSpawnRef = useRef(Date.now());
  const spawnedCountRef = useRef(0);
  const targetReachedRef = useRef(false);

  const { target, positiveValues, negativeValues, positiveCount, negativeCount, totalItems, stopOnTarget } = config;

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

  const [allItems] = useState(generateItems);

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

      // Спавн
      if (spawnedCountRef.current < totalItems && now - lastSpawnRef.current > 800) {
        const newItem = allItems[spawnedCountRef.current];
        if (newItem) {
          setItems(prev => [...prev, {
            ...newItem,
            y: 0,
            x: Math.random() * (gameAreaRef.current?.clientWidth - 40),
          }]);
          spawnedCountRef.current++;
          lastSpawnRef.current = now;
        }
      }

      // Движение и обработка
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

          // Попадание в корзинку
          if (catcherRect && gameRect &&
              newY + 40 >= catcherRect.top - gameRect.top &&
              newY <= catcherRect.bottom - gameRect.top &&
              item.x + 40 >= catcherRect.left - gameRect.left &&
              item.x <= catcherRect.right - gameRect.left) {
            newScore += item.value;
            newCaught++;
            caughtFlag = true;
          }
          // Промах (упала ниже)
          else if (newY + 40 >= gameHeight) {
            newMissed++;
            caughtFlag = true;
          }
          // Продолжаем движение
          else {
            newItems.push({ ...item, y: newY });
          }
        }

        // Однократное обновление состояний
        if (newScore !== score) setScore(newScore);
        if (newCaught !== caught) setCaught(newCaught);
        if (newMissed !== missed) setMissed(newMissed);

        // Проверка победы
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

  // Проверка конца игры
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
    <div style={{ textAlign: 'center' }}>
      <div style={{ marginBottom: '10px', fontSize: '1.5rem', fontWeight: 'bold' }}>
        Score: {score} / {target}
      </div>
      <div style={{ marginBottom: '10px' }}>
        Caught: {caught} | Missed: {missed}
      </div>
      <div
        ref={gameAreaRef}
        style={{
          position: 'relative',
          width: '800px',
          height: '500px',
          margin: '0 auto',
          background: '#f0f0f0',
          overflow: 'hidden',
          border: '2px solid #ccc',
          cursor: 'none',
          touchAction: 'none',
        }}
      >
        {items.map(item => (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              left: `${item.x}px`,
              top: `${item.y}px`,
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: item.type === 'positive' ? 'gold' : 'red',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: 'black',
            }}
          >
            {item.value}
          </div>
        ))}
        <div
          ref={catcherRef}
          style={{
            position: 'absolute',
            bottom: '10px',
            width: '100px',
            height: '50px',
            background: 'brown',
            borderRadius: '10px',
            left: '350px',
          }}
        />
      </div>
    </div>
  );
};

export default CatchGame;