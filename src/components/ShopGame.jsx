import { useState, useRef, useEffect } from 'react';
import InfoModal from './InfoModal';

// Импорт картинок продуктов
import breadImg from '../assets/images/bread.png';
import milkImg from '../assets/images/milk.png';
import eggsImg from '../assets/images/eggs.png';
import carrotImg from '../assets/images/carrot.png';
import sausageImg from '../assets/images/sos.png';
import yogurtImg from '../assets/images/jog.png';
import bananaImg from '../assets/images/banana.png';
import candyImg from '../assets/images/sweets.png';
import lollipopImg from '../assets/images/candy_pop.png';
import colaImg from '../assets/images/cola.png';
import ballImg from '../assets/images/ball.png';
import appleImg from '../assets/images/apples.png';

const ShopGame = ({ difficulty, onFinish, onBack, onEncouragement }) => {
  const categories = [
    { id: 'bread', name: 'Хлеб', required: true, img: breadImg, priceEasy: [40, 60], priceHard: [52, 67] },
    { id: 'milk', name: 'Молоко', required: true, img: milkImg, priceEasy: [70, 90], priceHard: [69, 112] },
    { id: 'eggs', name: 'Яйца', required: true, img: eggsImg, priceEasy: [100, 130], priceHard: [87, 115] },
    { id: 'carrot', name: 'Морковка', required: true, img: carrotImg, priceEasy: [30, 50], priceHard: [45, 89] },
    { id: 'sausage', name: 'Колбаса', required: false, img: sausageImg, priceEasy: [150, 200], priceHard: [120, 209] },
    { id: 'yogurt', name: 'Йогурт', required: false, img: yogurtImg, priceEasy: [60, 90], priceHard: [77, 118] },
    { id: 'banana', name: 'Банан', required: false, img: bananaImg, priceEasy: [50, 80], priceHard: [66, 99] },
    { id: 'candy', name: 'Конфеты', required: false, img: candyImg, priceEasy: [20, 35], priceHard: [29, 54] },
    { id: 'lollipop', name: 'Леденец', required: false, img: lollipopImg, priceEasy: [15, 25], priceHard: [22, 41] },
    { id: 'cocacola', name: 'Кола', required: false, img: colaImg, priceEasy: [80, 110], priceHard: [99, 144] },
    { id: 'ball', name: 'Мячик', required: false, img: ballImg, priceEasy: [200, 300], priceHard: [99, 199] },
    { id: 'apple', name: 'Яблоки', required: false, img: appleImg, priceEasy: [60, 90], priceHard: [79, 119] }
  ];

  const getPrices = (cat) => (difficulty === 'easy' ? cat.priceEasy : cat.priceHard);

  const getAccusative = (name) => {
    const exceptions = {
      'Морковка': 'морковку',
      'Колбаса': 'колбасу',
      'Яйца': 'яйца',
      'Молоко': 'молоко',
      'Хлеб': 'хлеб',
      'Йогурт': 'йогурт',
      'Банан': 'банан',
      'Конфеты': 'конфеты',
      'Леденец': 'леденец',
      'Кола': 'колу',
      'Мячик': 'мячик',
      'Яблоки': 'яблоки'
    };
    return exceptions[name] || name.toLowerCase();
  };

  const [selectedItems, setSelectedItems] = useState({});
  const [total, setTotal] = useState(0);
  const [history, setHistory] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [infoContent, setInfoContent] = useState({ title: '', text: '' });
  const balance = 500;
  const itemsPerSlide = 6;
  const totalSlides = Math.ceil(categories.length / itemsPerSlide);

  const hasCheapDairy = () => {
    const dairyIds = ['milk', 'yogurt', 'eggs'];
    for (let id of dairyIds) {
      const item = selectedItems[id];
      if (item && item.variant === 0) return true;
    }
    return false;
  };

  const changeSlide = (direction) => {
    if (isAnimating) return;
    setIsAnimating(true);
    if (direction === 'next' && currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    } else if (direction === 'prev' && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
    setTimeout(() => setIsAnimating(false), 300);
  };

  const currentRaw = categories.slice(currentSlide * itemsPerSlide, (currentSlide + 1) * itemsPerSlide);
  const items = [...currentRaw];
  while (items.length < 6) items.push(null);
  const rows = [items.slice(0, 3), items.slice(3, 6)];

  const getCheapWarning = (category, variant) => {
    if (variant !== 0) return null;
    const id = category.id;
    if (id === 'milk' || id === 'yogurt' || id === 'eggs') {
      const warnings = [
        'Осторожно! Дешёвые молочные продукты могут быстро испортиться. Переплатить немного за качество — иногда выгоднее, чем потом выбросить.',
        'Эти продукты быстро портятся. Лучше съесть их в ближайшее время, иначе придётся выбросить.',
        'Дешёвое — не всегда выгодное. Такие продукты часто портятся быстрее. Учти это.'
      ];
      return warnings[Math.floor(Math.random() * warnings.length)];
    }
    if (id === 'sausage') {
      const warnings = [
        'С дешёвым мясом будь осторожнее. Оно может быть не очень свежим и хранится меньше.',
        'Дешёвая колбаса часто содержит больше добавок. Лучше выбрать качественную, но реже.'
      ];
      return warnings[Math.floor(Math.random() * warnings.length)];
    }
    if (id === 'carrot' || id === 'apple' || id === 'banana') {
      const warnings = [
        'Дешёвые фрукты и овощи часто бывают мятыми или быстро гниют. Лучше съесть их в ближайший день.',
        'Овощи и фрукты по скидке могут быть не самыми свежими. Проверь их перед покупкой!'
      ];
      return warnings[Math.floor(Math.random() * warnings.length)];
    }
    if (id === 'ball') {
      return 'Мячик – это здорово для игр! Но сначала убедись, что у тебя хватает на все обязательные продукты.';
    }
    return null;
  };

  const areRequiredSelected = () => {
    return categories.filter(c => c.required).every(c => selectedItems[c.id]);
  };

  const selectItem = (category, variant) => {
    const prices = getPrices(category);
    const price = prices[variant];
    const current = selectedItems[category.id];
    if (current && current.variant === variant) {
      removeItem(category.id);
      if (onEncouragement) onEncouragement(`Ты убрал ${getAccusative(category.name)} из корзины.`);
      return;
    }
    if (current) removeItem(category.id, false);
    if (total + price > balance) {
      if (onEncouragement) onEncouragement(`Не хватает денег на ${getAccusative(category.name)}!`);
      return;
    }
    setSelectedItems(prev => ({ ...prev, [category.id]: { variant, price, name: category.name, required: category.required } }));
    setTotal(prev => prev + price);
    setHistory(prev => [...prev, { categoryId: category.id, variant, price, action: 'add' }]);

    if (category.required) {
      if (onEncouragement) onEncouragement(`Отлично! ${category.name} очень нужен!`);
    } else {
      if (!areRequiredSelected()) {
        if (onEncouragement) onEncouragement(`Ты уверен, что ${category.name} нам нужен? Сначала купи обязательные продукты!`);
      } else {
        if (onEncouragement) onEncouragement(`Ты добавил ${getAccusative(category.name)} в корзину.`);
      }
    }

    const warning = getCheapWarning(category, variant);
    if (warning && onEncouragement) {
      onEncouragement(warning);
    }
  };

  const removeItem = (categoryId, addToHistory = true) => {
    const item = selectedItems[categoryId];
    if (!item) return;
    const newSelected = { ...selectedItems };
    delete newSelected[categoryId];
    setSelectedItems(newSelected);
    setTotal(prev => prev - item.price);
    if (addToHistory) {
      setHistory(prev => [...prev, { categoryId, price: item.price, action: 'remove' }]);
      if (onEncouragement) onEncouragement(`Ты убрал ${getAccusative(item.name)} из корзины.`);
    }
  };

  const undo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    if (last.action === 'add') {
      removeItem(last.categoryId, false);
    } else {
      const category = categories.find(c => c.id === last.categoryId);
      const prices = getPrices(category);
      const variant = last.price === prices[0] ? 0 : 1;
      setSelectedItems(prev => ({ ...prev, [last.categoryId]: { variant, price: last.price, name: category.name, required: category.required } }));
      setTotal(prev => prev + last.price);
    }
    if (onEncouragement) onEncouragement(`Отмена последнего действия.`);
  };

  const canFinish = () => categories.filter(c => c.required).every(c => selectedItems[c.id]) && total <= balance;

  const finish = () => {
    if (canFinish()) {
      const productList = Object.values(selectedItems).map(item => item.name.toLowerCase()).join(', ');
      const remaining = balance - total;
      const checkMessage = `Проверь чек: ты купил ${productList} на сумму ${total} рублей. Остаток ${remaining} рублей. Точно завершаем покупки?`;
      if (onEncouragement) onEncouragement(checkMessage);
      setShowConfirm(true);
    } else {
      if (onEncouragement) onEncouragement(`Не хватает обязательных товаров!`);
    }
  };

  const confirmFinish = () => {
    const cheapDairy = hasCheapDairy();
    if (onEncouragement) {
      if (cheapDairy) {
        onEncouragement(`Осторожно! Ты купил дешёвые молочные продукты. Они могут испортиться быстрее и вызвать отравление. Родители очень расстроены.`);
      } else {
        onEncouragement(`Отлично! Покупки завершены, родители тобой гордятся!`);
      }
    }
    onFinish(total, cheapDairy);
  };

  const cancelFinish = () => {
    setShowConfirm(false);
  };

  const openInfo = () => {
    setInfoContent({
      title: 'Полезные советы',
      text: 'Выбирай качественные продукты! Дешёвые молочные продукты могут быстро испортиться. Обрати внимание на срок годности. Всегда проверяй упаковку. Не бери просрочку!',
      facts: [
        '🍼 Молоко с коротким сроком годности обычно натуральнее, чем "долгоиграющее".',
        '🥛 Просроченные молочные продукты могут вызвать серьёзное отравление.',
        '💡 Иногда чуть более дорогой продукт оказывается выгоднее – он дольше хранится и вкуснее.',
        '🧀 Творог и сыр лучше покупать в прозрачной упаковке – так видна консистенция.',
        '📅 Всегда проверяй дату производства и срок годности!'
      ]
    });
    setShowInfo(true);
  };

  const handleInfoClose = () => {
    setShowInfo(false);
  };

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, #f5e6d3 0%, #e8d5b7 50%, #d4b896 100%)',
      overflow: 'hidden',
      zIndex: 1000
    }}>
      <button
        onClick={onBack}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 10,
          background: 'rgba(255, 255, 255, 0.9)',
          border: 'none',
          padding: '12px 28px',
          borderRadius: '40px',
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          color: '#5c3d2e',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          transition: 'transform 0.2s'
        }}
      >
        ← Выйти в меню
      </button>

      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '80px 20px 20px 20px',
        height: '100vh',
        display: 'flex',
        gap: '30px',
        overflow: 'hidden'
      }}>
        {/* ЛЕВАЯ ЧАСТЬ: полки */}
        <div style={{ flex: 2.5, height: 'calc(100vh - 120px)', overflow: 'hidden' }}>
          <div style={{
            background: 'rgba(139, 69, 19, 0.85)',
            borderRadius: '30px',
            padding: '20px',
            boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
            border: '2px solid #d4a373',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div style={{
              background: 'rgba(255,248,225,0.95)',
              borderRadius: '20px',
              padding: '20px',
              flex: 1,
              overflow: 'hidden'
            }}>
              <div className={`shelf-container ${isAnimating ? 'fade-anim' : ''}`}>
                {rows.map((row, rowIndex) => (
                  <div key={rowIndex} style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '25px',
                    marginBottom: rowIndex === 0 ? '25px' : 0
                  }}>
                    {row.map((cat, colIndex) => (
                      cat ? (
                        <div key={cat.id} className="product-card" style={{
                          background: 'white',
                          borderRadius: '25px',
                          padding: '18px 12px',
                          textAlign: 'center',
                          boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                          position: 'relative',
                          transition: 'transform 0.2s, border 0.2s, box-shadow 0.2s',
                          border: selectedItems[cat.id] ? '3px solid #ffd700' : '1px solid #ddd',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          height: '240px',
                          cursor: 'pointer',
                          opacity: 1
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                          {selectedItems[cat.id] && (
                            <div style={{
                              position: 'absolute',
                              top: '-10px',
                              right: '-10px',
                              width: '32px',
                              height: '32px',
                              background: '#5c3d2e',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                              zIndex: 10
                            }}>
                              <span style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>✓</span>
                            </div>
                          )}
                          <img src={cat.img} alt={cat.name} style={{ width: '85px', height: '85px', objectFit: 'contain', marginBottom: '8px' }} />
                          <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#5c3d2e' }}>{cat.name}</div>
                          {cat.required && <div style={{ fontSize: '0.7rem', color: '#c62828' }}>обязательно</div>}
                          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px', width: '100%' }}>
                            <button onClick={() => selectItem(cat, 0)} style={{ flex: 1, padding: '6px 8px', background: selectedItems[cat.id]?.variant === 0 ? '#5c3d2e' : '#f5a623', border: 'none', borderRadius: '30px', fontSize: '0.75rem', fontWeight: 'bold', color: 'white', cursor: 'pointer' }}>🟢 {getPrices(cat)[0]} ₽</button>
                            <button onClick={() => selectItem(cat, 1)} style={{ flex: 1, padding: '6px 8px', background: selectedItems[cat.id]?.variant === 1 ? '#5c3d2e' : '#ff9800', border: 'none', borderRadius: '30px', fontSize: '0.75rem', fontWeight: 'bold', color: 'white', cursor: 'pointer' }}>⭐ {getPrices(cat)[1]} ₽</button>
                          </div>
                        </div>
                      ) : (
                        <div key={`empty-${rowIndex}-${colIndex}`} style={{
                          background: 'transparent',
                          height: '240px'
                        }} />
                      )
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px', marginTop: '20px' }}>
              <button
                onClick={() => changeSlide('prev')}
                disabled={currentSlide === 0}
                style={{ padding: '12px 30px', background: currentSlide === 0 ? '#ccc' : 'linear-gradient(135deg, #5c3d2e, #3d2a1f)', border: 'none', borderRadius: '50px', fontSize: '1rem', fontWeight: 'bold', color: 'white', cursor: currentSlide === 0 ? 'not-allowed' : 'pointer' }}
              >← Назад</button>
              <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#5c3d2e' }}>Слайд {currentSlide + 1} из {totalSlides}</span>
              <button
                onClick={() => changeSlide('next')}
                disabled={currentSlide === totalSlides - 1}
                style={{ padding: '12px 30px', background: currentSlide === totalSlides - 1 ? '#ccc' : 'linear-gradient(135deg, #5c3d2e, #3d2a1f)', border: 'none', borderRadius: '50px', fontSize: '1rem', fontWeight: 'bold', color: 'white', cursor: currentSlide === totalSlides - 1 ? 'not-allowed' : 'pointer' }}
              >Далее →</button>
            </div>

            <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', marginTop: '20px', marginBottom: '10px' }}>
              <button
                onClick={undo}
                disabled={history.length === 0}
                style={{ padding: '12px 40px', background: history.length === 0 ? '#ccc' : 'linear-gradient(135deg, #ff9800, #f57c00)', border: 'none', borderRadius: '50px', fontSize: '1rem', fontWeight: 'bold', color: 'white', cursor: history.length === 0 ? 'not-allowed' : 'pointer' }}
              >🔄 Отменить</button>
              <button
                onClick={finish}
                disabled={!canFinish()}
                style={{ padding: '12px 50px', background: !canFinish() ? '#ccc' : 'linear-gradient(135deg, #5c3d2e, #3d2a1f)', border: 'none', borderRadius: '50px', fontSize: '1rem', fontWeight: 'bold', color: 'white', cursor: !canFinish() ? 'not-allowed' : 'pointer' }}
              >✅ Завершить покупки</button>
            </div>
          </div>
        </div>

        {/* ПРАВАЯ ЧАСТЬ: список покупок */}
        <div style={{
          flex: 1,
          maxWidth: '340px',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '30px',
          padding: '20px',
          backdropFilter: 'blur(8px)',
          height: 'calc(100vh - 120px)',
          overflowY: 'auto',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          position: 'relative'
        }}>
          <button
            onClick={openInfo}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#ff9800',
              border: 'none',
              fontSize: '1.3rem',
              fontWeight: 'bold',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}
          >i</button>
          <div style={{ fontSize: '1.6rem', fontWeight: 'bold', marginBottom: '15px', textAlign: 'center', color: '#5c3d2e' }}>🛒 Баланс: {balance} ₽</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center', color: '#5c3d2e' }}>💰 Итого: {total} ₽</div>
          <h3 style={{ color: '#5c3d2e', marginBottom: '15px', fontSize: '1.3rem', borderBottom: '2px solid #d4a373', paddingBottom: '5px' }}>📝 Список покупок</h3>
          <div>
            {categories.map(cat => {
              const selected = selectedItems[cat.id];
              if (!selected && !cat.required) return null;
              return (
                <div key={cat.id} style={{ padding: '10px 0', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: selected ? '#5c3d2e' : '#999', fontWeight: selected ? 'bold' : 'normal' }}>{cat.name}</span>
                  <span style={{ fontWeight: 'bold', color: selected ? '#5c3d2e' : '#999' }}>{selected ? `${selected.price} ₽` : 'не выбран'}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #fff9ef, #fff0e0)',
            borderRadius: '48px',
            padding: '40px 35px',
            textAlign: 'center',
            maxWidth: '480px',
            width: '90%',
            boxShadow: '0 30px 50px rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,215,0,0.5)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🛍️</div>
            <h3 style={{ color: '#2e7d32', marginBottom: '20px', fontSize: '1.8rem' }}>Завершить покупки?</h3>
            <p style={{ marginBottom: '15px', fontSize: '1.2rem', color: '#5c3d2e', fontWeight: 'bold' }}>Ты потратил {total} ₽ из {balance} ₽</p>
            <p style={{ marginBottom: '30px', color: '#666' }}>Остаток: {balance - total} ₽</p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
              <button onClick={confirmFinish} style={{ padding: '12px 28px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '40px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>Да, завершить</button>
              <button onClick={cancelFinish} style={{ padding: '12px 28px', background: '#ddd', color: '#333', border: 'none', borderRadius: '40px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>Вернуться</button>
            </div>
          </div>
        </div>
      )}

      {showInfo && (
        <InfoModal
          title={infoContent.title}
          content={infoContent.text}
          facts={infoContent.facts}
          onClose={handleInfoClose}
        />
      )}
      

      <style>{`
        .shelf-container { transition: opacity 0.4s ease; }
        .fade-anim { animation: fadeSlide 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1); }
        @keyframes fadeSlide { 0% { opacity: 0; transform: translateX(15px) scale(0.98); } 100% { opacity: 1; transform: translateX(0) scale(1); } }
        button:active { transform: scale(0.96); }
        .product-card { transition: transform 0.2s, border 0.2s, box-shadow 0.2s; }
        .product-card:active { transform: scale(0.98); }
      `}</style>
    </div>
  );
};

export default ShopGame;