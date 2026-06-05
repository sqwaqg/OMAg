import { useState, useRef, useEffect } from 'react';
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
import botSmart from '../assets/images/bot_smart.png';

const ShopGame = ({ difficulty, onFinish, onBack, onEncouragement, balance: balanceProp }) => {
  const categories = [
    { id: 'bread', name: 'Хлеб', required: true, img: breadImg, priceEasy: [30, 40], priceHard: [33, 47] },
    { id: 'milk', name: 'Молоко', required: true, img: milkImg, priceEasy: [25, 70], priceHard: [27, 74] },
    { id: 'eggs', name: 'Яйца', required: true, img: eggsImg, priceEasy: [29, 60], priceHard: [34, 79] },
    { id: 'carrot', name: 'Морковка', required: true, img: carrotImg, priceEasy: [20, 35], priceHard: [23, 32] },
    { id: 'sausage', name: 'Колбаса', required: false, img: sausageImg, priceEasy: [80, 150], priceHard: [84, 159] },
    { id: 'yogurt', name: 'Йогурт', required: false, img: yogurtImg, priceEasy: [15, 40], priceHard: [18, 45] },
    { id: 'banana', name: 'Банан', required: false, img: bananaImg, priceEasy: [45, 55], priceHard: [49, 56] },
    { id: 'candy', name: 'Конфеты', required: false, img: candyImg, priceEasy: [25, 30], priceHard: [28, 33] },
    { id: 'lollipop', name: 'Леденец', required: false, img: lollipopImg, priceEasy: [15, 20], priceHard: [19, 24] },
    { id: 'cocacola', name: 'Газировка', required: false, img: colaImg, priceEasy: [50, 65], priceHard: [52, 67] },
    { id: 'ball', name: 'Мячик', required: false, img: ballImg, priceEasy: [100, 150], priceHard: [108, 149] },
    { id: 'apple', name: 'Яблоки', required: false, img: appleImg, priceEasy: [50, 65], priceHard: [54, 69] }
  ];

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const [shuffledCategories] = useState(() => shuffleArray(categories));

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
      'Газировка': 'газировку',
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
  const balance = balanceProp ?? 500;
  const itemsPerSlide = 6;
  const totalSlides = Math.ceil(shuffledCategories.length / itemsPerSlide);

  const getRandomWish = () => {
    const optionalProducts = shuffledCategories.filter(c => !c.required);
    const randomIndex = Math.floor(Math.random() * optionalProducts.length);
    return optionalProducts[randomIndex];
  };

  const [wishProduct, setWishProduct] = useState(null);
  const [wishBought, setWishBought] = useState(false);

  useEffect(() => {
    setWishProduct(getRandomWish());
  }, []);

  useEffect(() => {
    if (wishProduct) {
      setWishBought(!!selectedItems[wishProduct.id]);
    }
  }, [selectedItems, wishProduct]);

  const hasCheapRisky = () => {
    const riskyIds = ['milk', 'yogurt', 'eggs', 'sausage'];
    for (let id of riskyIds) {
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

  const currentRaw = shuffledCategories.slice(currentSlide * itemsPerSlide, (currentSlide + 1) * itemsPerSlide);
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
    return shuffledCategories.filter(c => c.required).every(c => selectedItems[c.id]);
  };

  const getNeededForm = (productName) => {
    const feminine = ['Колбаса', 'Газировка', 'Морковка'];
    const neuter = ['Молоко'];
    const plural = ['Яйца', 'Конфеты', 'Яблоки'];
    if (plural.includes(productName)) return 'нужны';
    if (feminine.includes(productName)) return 'нужна';
    if (neuter.includes(productName)) return 'нужно';
    return 'нужен';
  };

  const selectItem = (category, variant) => {
    const prices = getPrices(category);
    const price = prices[variant];
    const current = selectedItems[category.id];
    
    let productNameForSpeech = category.name;
    if (productNameForSpeech === 'Йогурт') productNameForSpeech = 'йо́гурт';

    if (current && current.variant === variant) {
      removeItem(category.id);
      if (onEncouragement) onEncouragement(`Ты убрал ${getAccusative(productNameForSpeech)} из корзины.`);
      return;
    }
    if (current) removeItem(category.id, false);
    if (total + price > balance) {
      if (onEncouragement) onEncouragement(`Не хватает денег на ${getAccusative(productNameForSpeech)}!`);
      return;
    }
    setSelectedItems(prev => ({ ...prev, [category.id]: { variant, price, name: category.name, required: category.required } }));
    setTotal(prev => prev + price);
    setHistory(prev => [...prev, { categoryId: category.id, variant, price, action: 'add' }]);

    const neededForm = getNeededForm(category.name);

    if (category.required) {
      if (onEncouragement) onEncouragement(`Отлично! ${category.name} очень ${neededForm}!`);
    } else {
      if (!areRequiredSelected()) {
        if (onEncouragement) onEncouragement(`Ты уверен, что ${productNameForSpeech} нам ${neededForm}? Сначала купи обязательные продукты!`);
      } else {
        if (onEncouragement) onEncouragement(`Ты добавил ${getAccusative(productNameForSpeech)} в корзину.`);
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
      const category = shuffledCategories.find(c => c.id === last.categoryId);
      const prices = getPrices(category);
      const variant = last.price === prices[0] ? 0 : 1;
      setSelectedItems(prev => ({ ...prev, [last.categoryId]: { variant, price: last.price, name: category.name, required: category.required } }));
      setTotal(prev => prev + last.price);
    }
    if (onEncouragement) onEncouragement(`Отмена последнего действия.`);
  };

  const canFinish = () => shuffledCategories.filter(c => c.required).every(c => selectedItems[c.id]) && total <= balance;

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
    const cheapRisky = hasCheapRisky();
    const hasWish = wishBought;
    const wishName = wishProduct?.name || '';
    if (onEncouragement) {
      if (cheapRisky) {
        onEncouragement(`Осторожно! Дешёвые продукты оказались некачественными. Семья отравилась. В следующий раз не экономь на качестве.`);
      } else if (!hasWish) {
        onEncouragement(`Ты купил всё нужное, но не порадовал лисёнка. Он мечтал о ${wishName}. В следующий раз спроси его, чего он хочет.`);
      } else {
        onEncouragement(`Отлично! Покупки завершены, родители тобой гордятся! Лисёнок счастлив.`);
      }
    }
    onFinish(total, cheapRisky, hasWish, wishName);
  };

  const cancelFinish = () => {
    setShowConfirm(false);
  };

  const getSlideLabel = () => {
    if (totalSlides === 1) return 'Полка';
    return `Полка ${currentSlide + 1}`;
  };

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
          top: 'clamp(10px, 2vh, 20px)',
          left: 'clamp(10px, 2vw, 20px)',
          zIndex: 10,
          background: 'rgba(255, 255, 255, 0.9)',
          border: 'none',
          padding: 'clamp(8px, 1.5vw, 12px) clamp(16px, 3vw, 28px)',
          borderRadius: '40px',
          fontSize: 'clamp(0.8rem, 2vw, 1rem)',
          fontWeight: 'bold',
          cursor: 'pointer',
          color: '#5c3d2e',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}
      >
        Назад
      </button>

      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: 'clamp(600px, 90vw, 1400px)',
        margin: '0 auto',
        padding: 'clamp(50px, 8vh, 80px) clamp(10px, 2vw, 20px) clamp(10px, 2vh, 20px) clamp(10px, 2vw, 20px)',
        height: '100vh',
        display: 'flex',
        gap: 'clamp(10px, 2vw, 30px)',
        overflow: 'hidden'
      }}>
        <div style={{ flex: 2.5, height: 'calc(100vh - 80px)', overflow: 'hidden' }}>
          <div style={{
            background: 'rgba(122, 58, 13, 0.85)',
            borderRadius: 'clamp(20px, 4vw, 30px)',
            padding: 'clamp(10px, 2vw, 20px)',
            boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
            border: '2px solid #d4a373',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div style={{
              background: 'rgba(255,248,225,0.95)',
              borderRadius: 'clamp(15px, 3vw, 20px)',
              padding: 'clamp(10px, 2vw, 15px)',
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden'
            }}>
              <div className={`shelf-container ${isAnimating ? 'fade-anim' : ''}`}>
                {rows.map((row, rowIndex) => (
                  <div key={rowIndex} style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 'clamp(10px, 2vw, 25px)',
                    marginBottom: rowIndex === 0 ? 'clamp(10px, 2vw, 25px)' : 0
                  }}>
                    {row.map((cat, colIndex) => (
                      cat ? (
                        <div key={cat.id} className="product-card" style={{
                          background: 'white',
                          borderRadius: 'clamp(15px, 3vw, 20px)',
                          padding: 'clamp(8px, 1.5vw, 12px) clamp(6px, 1vw, 8px)',
                          textAlign: 'center',
                          boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                          position: 'relative',
                          border: selectedItems[cat.id] ? '3px solid #ffd700' : '1px solid #ddd',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          minHeight: 'clamp(180px, 25vh, 270px)',
                          height: 'auto',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                          {selectedItems[cat.id] && (
                            <div style={{
                              position: 'absolute',
                              top: '-10px',
                              right: '-10px',
                              width: 'clamp(20px, 4vw, 28px)',
                              height: 'clamp(20px, 4vw, 28px)',
                              background: '#5c3d2e',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              zIndex: 10
                            }}>
                              <span style={{ color: 'white', fontSize: 'clamp(12px, 2vw, 16px)', fontWeight: 'bold' }}>✓</span>
                            </div>
                          )}
                          <img 
                            src={cat.img} 
                            alt={cat.name} 
                            style={{ 
                              width: 'clamp(80px, 15vw, 250px)', 
                              height: 'auto', 
                              objectFit: 'contain', 
                              marginBottom: 'clamp(5px, 1vh, 15px)' 
                            }} 
                          />
                          <div style={{ fontWeight: 'bold', fontSize: 'clamp(0.8rem, 2vw, 1.1rem)', color: '#5c3d2e' }}>{cat.name}</div>
                          {cat.required && difficulty === 'easy' && <div style={{ fontSize: 'clamp(0.6rem, 1.5vw, 0.8rem)', color: '#991616ff' }}>обязательно</div>}
                          <div style={{ display: 'flex', gap: 'clamp(5px, 1vw, 10px)', justifyContent: 'center', marginTop: 'clamp(8px, 1.5vh, 17px)', width: '100%' }}>
                            <button 
                              onClick={() => selectItem(cat, 0)} 
                              style={{ 
                                flex: 1, 
                                padding: 'clamp(3px, 1vw, 5px) clamp(5px, 1.5vw, 8px)', 
                                background: selectedItems[cat.id]?.variant === 0 ? '#5c3d2e' : '#f5a623', 
                                border: 'none', 
                                borderRadius: '30px', 
                                fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)', 
                                fontWeight: 'bold', 
                                color: 'white', 
                                cursor: 'pointer' 
                              }}
                            >
                              {getPrices(cat)[0]} ₽
                            </button>
                            <button 
                              onClick={() => selectItem(cat, 1)} 
                              style={{ 
                                flex: 1, 
                                padding: 'clamp(3px, 1vw, 5px) clamp(5px, 1.5vw, 8px)', 
                                background: selectedItems[cat.id]?.variant === 1 ? '#5c3d2e' : '#ff9800', 
                                border: 'none', 
                                borderRadius: '30px', 
                                fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)', 
                                fontWeight: 'bold', 
                                color: 'white', 
                                cursor: 'pointer' 
                              }}
                            >
                              {getPrices(cat)[1]} ₽
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div key={`empty-${rowIndex}-${colIndex}`} style={{
                          background: 'transparent',
                          height: 'clamp(180px, 25vh, 270px)'
                        }} />
                      )
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'clamp(15px, 3vw, 30px)', marginTop: 'clamp(10px, 1.5vh, 15px)' }}>
              <button
                onClick={() => changeSlide('prev')}
                disabled={currentSlide === 0}
                style={{ padding: 'clamp(6px, 1vw, 10px) clamp(15px, 3vw, 25px)', background: currentSlide === 0 ? '#ccc' : 'linear-gradient(135deg, #5c3d2e, #3d2a1f)', border: 'none', borderRadius: '40px', fontSize: 'clamp(0.7rem, 1.8vw, 0.9rem)', fontWeight: 'bold', color: 'white', cursor: currentSlide === 0 ? 'not-allowed' : 'pointer' }}
              >← Назад</button>
              <span style={{ fontSize: 'clamp(0.8rem, 2vw, 1rem)', fontWeight: 'bold', color: '#5c3d2e' }}>{getSlideLabel()}</span>
              <button
                onClick={() => changeSlide('next')}
                disabled={currentSlide === totalSlides - 1}
                style={{ padding: 'clamp(6px, 1vw, 10px) clamp(15px, 3vw, 25px)', background: currentSlide === totalSlides - 1 ? '#ccc' : 'linear-gradient(135deg, #5c3d2e, #3d2a1f)', border: 'none', borderRadius: '40px', fontSize: 'clamp(0.7rem, 1.8vw, 0.9rem)', fontWeight: 'bold', color: 'white', cursor: currentSlide === totalSlides - 1 ? 'not-allowed' : 'pointer' }}
              >Далее →</button>
            </div>

            <div style={{ display: 'flex', gap: 'clamp(10px, 2vw, 20px)', justifyContent: 'center', marginTop: 'clamp(10px, 1.5vh, 15px)', marginBottom: 'clamp(5px, 1vh, 10px)' }}>
              <button
                onClick={undo}
                disabled={history.length === 0}
                style={{ padding: 'clamp(6px, 1vw, 10px) clamp(15px, 3vw, 30px)', background: history.length === 0 ? '#ccc' : 'linear-gradient(135deg, #ff9800, #f57c00)', border: 'none', borderRadius: '40px', fontSize: 'clamp(0.7rem, 1.8vw, 0.9rem)', fontWeight: 'bold', color: 'white', cursor: history.length === 0 ? 'not-allowed' : 'pointer' }}
              >Отменить</button>
              <button
                onClick={finish}
                disabled={!canFinish()}
                style={{ padding: 'clamp(6px, 1vw, 10px) clamp(15px, 3vw, 30px)', background: !canFinish() ? '#ccc' : '#2e7d32', border: 'none', borderRadius: '40px', fontSize: 'clamp(0.7rem, 1.8vw, 0.9rem)', fontWeight: 'bold', color: 'white', cursor: !canFinish() ? 'not-allowed' : 'pointer' }}
              >Завершить покупки</button>
            </div>
          </div>
        </div>

        <div style={{
          flex: 1,
          maxWidth: 'clamp(200px, 30vw, 280px)',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: 'clamp(20px, 4vw, 30px)',
          padding: 'clamp(10px, 2vw, 15px)',
          backdropFilter: 'blur(8px)',
          height: 'calc(100vh - 100px)',
          overflowY: 'auto',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <div style={{ fontSize: 'clamp(1rem, 3vw, 1.4rem)', fontWeight: 'bold', marginBottom: 'clamp(5px, 1vh, 10px)', textAlign: 'center', color: '#5c3d2e' }}>Баланс: {balance} ₽</div>
          <div style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)', fontWeight: 'bold', marginBottom: 'clamp(10px, 2vh, 15px)', textAlign: 'center', color: '#5c3d2e' }}>Итого: {total} ₽</div>

          <h3 style={{ color: '#5c3d2e', marginBottom: 'clamp(5px, 1vh, 10px)', fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)', borderBottom: '2px solid #d4a373', paddingBottom: 'clamp(3px, 0.5vh, 5px)' }}>Список покупок</h3>
          <div>
            {shuffledCategories.map(cat => {
              const selected = selectedItems[cat.id];
              if (!selected && !cat.required) return null;
              return (
                <div key={cat.id} style={{ padding: 'clamp(5px, 1vh, 8px) 0', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'clamp(0.7rem, 1.8vw, 0.9rem)' }}>
                  <span style={{ color: selected ? '#5c3d2e' : '#999', fontWeight: selected ? 'bold' : 'normal' }}>{cat.name}</span>
                  <span style={{ fontWeight: 'bold', color: selected ? '#5c3d2e' : '#999' }}>{selected ? `${selected.price} ₽` : 'не выбран'}</span>
                </div>
              );
            })}
            
            {wishProduct && (
              <div style={{
                marginTop: 'clamp(10px, 2vh, 15px)',
                paddingTop: 'clamp(5px, 1vh, 10px)',
                borderTop: '1px dashed #ccc',
                backgroundColor: '#fff8e7',
                borderRadius: 'clamp(12px, 2vw, 16px)',
                padding: 'clamp(5px, 1vh, 10px)',
                marginBottom: 'clamp(5px, 1vh, 10px)'
              }}>
                <div style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)', fontWeight: 'bold', color: '#f76f14ff', marginBottom: 'clamp(5px, 1vh, 8px)' }}>Что хочет лисёнок</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(5px, 1vw, 12px)' }}>
                  <div style={{ flex: 1, fontWeight: 'bold', color: '#5c3d2e', fontSize: 'clamp(0.8rem, 2vw, 1rem)' }}>{wishProduct.name}</div>
                  {wishBought ? (
                    <span style={{ fontWeight: 'bold', color: '#2e7d32', fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)' }}>куплен</span>
                  ) : (
                    <span style={{ color: '#999', fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)' }}>не куплен</span>
                  )}
                </div>
              </div>
            )}
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
            borderRadius: 'clamp(30px, 8vw, 48px)',
            padding: 'clamp(20px, 5vw, 30px)',
            textAlign: 'center',
            maxWidth: 'clamp(280px, 80vw, 450px)',
            width: '85%',
            boxShadow: '0 30px 50px rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,215,0,0.5)'
          }}>
            <img src={botSmart} alt="Совёнок" style={{ width: 'clamp(50px, 10vw, 80px)', height: 'auto', margin: '0 auto 10px', objectFit: 'contain' }} />
            <h3 style={{ color: '#2e7d32', marginBottom: 'clamp(10px, 2vh, 15px)', fontSize: 'clamp(1rem, 3vw, 1.5rem)' }}>Завершить покупки?</h3>
            <p style={{ marginBottom: 'clamp(5px, 1vh, 10px)', fontSize: 'clamp(0.8rem, 2vw, 1rem)', color: '#5c3d2e', fontWeight: 'bold' }}>Ты потратил {total} ₽ из {balance} ₽</p>
            <p style={{ marginBottom: 'clamp(15px, 3vh, 25px)', color: '#666', fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)' }}>Остаток: {balance - total} ₽</p>
            <div style={{ display: 'flex', gap: 'clamp(10px, 2vw, 15px)', justifyContent: 'center' }}>
              <button onClick={confirmFinish} style={{ padding: 'clamp(6px, 1vw, 10px) clamp(15px, 3vw, 20px)', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '40px', fontSize: 'clamp(0.8rem, 2vw, 1rem)', fontWeight: 'bold', cursor: 'pointer' }}>Да, завершить</button>
              <button onClick={cancelFinish} style={{ padding: 'clamp(6px, 1vw, 10px) clamp(15px, 3vw, 20px)', background: '#ddd', color: '#333', border: 'none', borderRadius: '40px', fontSize: 'clamp(0.8rem, 2vw, 1rem)', fontWeight: 'bold', cursor: 'pointer' }}>Вернуться</button>
            </div>
          </div>
        </div>
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