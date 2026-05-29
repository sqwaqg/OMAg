import { useState } from 'react';
import shopBackground from '../assets/images/shop.jpg';

// Импорт картинок продуктов
import milkImg from '../assets/images/milk.png';
import sausageImg from '../assets/images/sos.png';
import carrotImg from '../assets/images/carrot.png';
import yogurtImg from '../assets/images/jog.png';
import eggsImg from '../assets/images/eggs.png';
import bananaImg from '../assets/images/banana.png';
import breadImg from '../assets/images/bread.png';
import candyImg from '../assets/images/sweets.png';
import lollipopImg from '../assets/images/candy_pop.png';
import colaImg from '../assets/images/cola.png';
import ballImg from '../assets/images/ball.png';
import appleImg from '../assets/images/apples.png';

const ShopGame = ({ difficulty, onFinish, onBack }) => {
  const categories = [
    { id: 'milk', name: 'Молоко', required: true, img: milkImg, priceEasy: [70, 90], priceHard: [90, 120] },
    { id: 'sausage', name: 'Колбаса', required: false, img: sausageImg, priceEasy: [150, 200], priceHard: [180, 240] },
    { id: 'carrot', name: 'Морковка', required: true, img: carrotImg, priceEasy: [30, 50], priceHard: [50, 70] },
    { id: 'yogurt', name: 'Йогурт', required: false, img: yogurtImg, priceEasy: [60, 90], priceHard: [80, 110] },
    { id: 'eggs', name: 'Яйца', required: true, img: eggsImg, priceEasy: [100, 130], priceHard: [130, 170] },
    { id: 'banana', name: 'Банан', required: false, img: bananaImg, priceEasy: [50, 80], priceHard: [70, 100] },
    { id: 'bread', name: 'Хлеб', required: true, img: breadImg, priceEasy: [40, 60], priceHard: [60, 85] },
    { id: 'candy', name: 'Конфеты', required: false, img: candyImg, priceEasy: [20, 35], priceHard: [30, 50] },
    { id: 'lollipop', name: 'Леденец', required: false, img: lollipopImg, priceEasy: [15, 25], priceHard: [25, 40] },
    { id: 'cocacola', name: 'Кола', required: false, img: colaImg, priceEasy: [80, 110], priceHard: [100, 140] },
    { id: 'ball', name: 'Мячик', required: false, img: ballImg, priceEasy: [200, 300], priceHard: [250, 380] },
    { id: 'apple', name: 'Яблоки', required: false, img: appleImg, priceEasy: [60, 90], priceHard: [80, 110] }
  ];

  const getPrices = (cat) => (difficulty === 'easy' ? cat.priceEasy : cat.priceHard);

  const [selectedItems, setSelectedItems] = useState({});
  const [total, setTotal] = useState(0);
  const [history, setHistory] = useState([]);
  const balance = 500;

  const selectItem = (category, variant) => {
    const prices = getPrices(category);
    const price = prices[variant];
    const currentSelection = selectedItems[category.id];
    if (currentSelection && currentSelection.variant === variant) {
      removeItem(category.id);
      return;
    }
    if (currentSelection) removeItem(category.id, false);
    setSelectedItems(prev => ({ ...prev, [category.id]: { variant, price, name: category.name, required: category.required } }));
    setTotal(prev => prev + price);
    setHistory(prev => [...prev, { categoryId: category.id, variant, price, action: 'add' }]);
  };

  const removeItem = (categoryId, addToHistory = true) => {
    const item = selectedItems[categoryId];
    if (!item) return;
    const newSelected = { ...selectedItems };
    delete newSelected[categoryId];
    setSelectedItems(newSelected);
    setTotal(prev => prev - item.price);
    if (addToHistory) setHistory(prev => [...prev, { categoryId, price: item.price, action: 'remove' }]);
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
    setHistory(prev => prev.slice(0, -1));
  };

  const canFinish = () => categories.filter(c => c.required).every(c => selectedItems[c.id]) && total <= balance;
  const finish = () => canFinish() && onFinish(total);

  const shelf1 = categories.slice(0, 6);
  const shelf2 = categories.slice(6, 12);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundImage: `url(${shopBackground})`,
      backgroundSize: 'cover', backgroundPosition: 'center',
      overflow: 'auto', zIndex: 1000
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1 }} />
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '1200px', margin: '0 auto', padding: '20px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Верхняя панель */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '15px 20px', background: 'rgba(255,255,255,0.9)', borderRadius: '60px', backdropFilter: 'blur(8px)' }}>
          <button onClick={onBack} style={{ background: '#2e7d32', border: 'none', padding: '10px 24px', borderRadius: '40px', fontSize: '1rem', fontWeight: 'bold', color: 'white', cursor: 'pointer' }}>← Назад</button>
          <div style={{ background: '#ffd700', padding: '8px 20px', borderRadius: '40px', fontWeight: 'bold', color: '#1a5c1a' }}>🛒 Бюджет: {balance} ₽</div>
          <div style={{ background: total > balance ? '#c62828' : '#2e7d32', padding: '8px 20px', borderRadius: '40px', fontWeight: 'bold', color: 'white' }}>💰 Итого: {total} ₽</div>
        </div>

        {/* Стеллаж 1 */}
        <div style={{ background: 'rgba(255,248,225,0.9)', borderRadius: '30px', padding: '20px', marginBottom: '30px', backdropFilter: 'blur(4px)' }}>
          <h3 style={{ textAlign: 'center', color: '#5c3d2e', marginBottom: '20px' }}>📦 Стеллаж 1</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '15px' }}>
            {shelf1.map(cat => {
              const prices = getPrices(cat);
              const selected = selectedItems[cat.id];
              return (
                <div key={cat.id} style={{ background: 'white', borderRadius: '20px', padding: '10px', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', border: selected ? '2px solid gold' : '1px solid #ddd' }}>
                  <img src={cat.img} alt={cat.name} style={{ width: '60px', height: '60px', objectFit: 'contain', margin: '0 auto' }} />
                  <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{cat.name}</div>
                  {cat.required && <div style={{ fontSize: '0.7rem', color: '#c62828' }}>обязательно</div>}
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '8px' }}>
                    <button onClick={() => selectItem(cat, 0)} style={{ background: selected?.variant === 0 ? '#2e7d32' : '#f5a623', border: 'none', padding: '4px 8px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold', color: 'white', cursor: 'pointer' }}>🟢 {prices[0]} ₽</button>
                    <button onClick={() => selectItem(cat, 1)} style={{ background: selected?.variant === 1 ? '#2e7d32' : '#ff9800', border: 'none', padding: '4px 8px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold', color: 'white', cursor: 'pointer' }}>⭐ {prices[1]} ₽</button>
                  </div>
                  {selected && <div style={{ fontSize: '0.7rem', color: '#2e7d32', marginTop: '5px' }}>✓ в корзине</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Стеллаж 2 */}
        <div style={{ background: 'rgba(255,248,225,0.9)', borderRadius: '30px', padding: '20px', marginBottom: '30px', backdropFilter: 'blur(4px)' }}>
          <h3 style={{ textAlign: 'center', color: '#5c3d2e', marginBottom: '20px' }}>📦 Стеллаж 2</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '15px' }}>
            {shelf2.map(cat => {
              const prices = getPrices(cat);
              const selected = selectedItems[cat.id];
              return (
                <div key={cat.id} style={{ background: 'white', borderRadius: '20px', padding: '10px', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', border: selected ? '2px solid gold' : '1px solid #ddd' }}>
                  <img src={cat.img} alt={cat.name} style={{ width: '60px', height: '60px', objectFit: 'contain', margin: '0 auto' }} />
                  <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{cat.name}</div>
                  {cat.required && <div style={{ fontSize: '0.7rem', color: '#c62828' }}>обязательно</div>}
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '8px' }}>
                    <button onClick={() => selectItem(cat, 0)} style={{ background: selected?.variant === 0 ? '#2e7d32' : '#f5a623', border: 'none', padding: '4px 8px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold', color: 'white', cursor: 'pointer' }}>🟢 {prices[0]} ₽</button>
                    <button onClick={() => selectItem(cat, 1)} style={{ background: selected?.variant === 1 ? '#2e7d32' : '#ff9800', border: 'none', padding: '4px 8px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold', color: 'white', cursor: 'pointer' }}>⭐ {prices[1]} ₽</button>
                  </div>
                  {selected && <div style={{ fontSize: '0.7rem', color: '#2e7d32', marginTop: '5px' }}>✓ в корзине</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Корзина и кнопки */}
        <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: '30px', padding: '20px', marginTop: 'auto', backdropFilter: 'blur(8px)' }}>
          <h3 style={{ color: '#2e7d32', marginBottom: '15px' }}>🛍️ Корзина</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px', marginBottom: '20px' }}>
            {categories.map(cat => {
              const selected = selectedItems[cat.id];
              return (
                <div key={cat.id} style={{ padding: '5px 10px', background: selected ? '#e8f5e9' : '#f5f5f5', borderRadius: '20px', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{cat.name}</span>
                  <span style={{ fontWeight: 'bold', color: selected ? '#2e7d32' : '#999' }}>{selected ? `${selected.price} ₽` : 'не выбран'}</span>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <button onClick={undo} disabled={history.length === 0} style={{ padding: '12px 30px', background: history.length === 0 ? '#ccc' : '#ff9800', border: 'none', borderRadius: '40px', fontSize: '1rem', fontWeight: 'bold', color: 'white', cursor: history.length === 0 ? 'not-allowed' : 'pointer' }}>🔄 Отменить</button>
            <button onClick={finish} disabled={!canFinish()} style={{ padding: '12px 40px', background: canFinish() ? 'linear-gradient(135deg, #2e7d32, #1b5e20)' : '#ccc', border: 'none', borderRadius: '40px', fontSize: '1rem', fontWeight: 'bold', color: 'white', cursor: canFinish() ? 'pointer' : 'not-allowed' }}>✅ Завершить покупки</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopGame;