import { useState } from 'react';

const ShopGame = ({ difficulty, onFinish }) => {
  const categories = [
    { id: 'bread', name: 'Хлеб', required: true },
    { id: 'milk', name: 'Молоко', required: true },
    { id: 'eggs', name: 'Яйца', required: true },
    { id: 'carrot', name: 'Морковка', required: true },
    { id: 'sausage', name: 'Колбаса', required: false },
    { id: 'yogurt', name: 'Йогурт', required: false },
    { id: 'banana', name: 'Банан', required: false },
    { id: 'candy', name: 'Конфеты', required: false },
    { id: 'lollipop', name: 'Леденец', required: false },
    { id: 'cocacola', name: 'Кока-кола', required: false },
    { id: 'ball', name: 'Мячик', required: false },
    { id: 'apple', name: 'Яблоки', required: false }
  ];

  const prices = {
  easy: {
    bread: [40, 60], milk: [70, 90], eggs: [100, 130], carrot: [30, 50],
    sausage: [150, 200], yogurt: [60, 90], banana: [50, 80], candy: [20, 35],
    lollipop: [15, 25], cocacola: [80, 110], ball: [200, 300], apple: [60, 90]
  },
  hard: {
    bread: [52, 67], milk: [69, 112], eggs: [87, 115], carrot: [45, 89],
    sausage: [120, 209], yogurt: [77, 118], banana: [66, 99], candy: [29, 54],
    lollipop: [22, 41], cocacola: [99, 144], ball: [99, 199], apple: [79, 119]
  }
};

  const currentPrices = prices[difficulty];
  const [selectedItems, setSelectedItems] = useState({});
  const [total, setTotal] = useState(0);
  const [history, setHistory] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const balance = 500;
  const itemsPerSlide = 6;
  const totalSlides = Math.ceil(categories.length / itemsPerSlide);
  const currentItems = categories.slice(currentSlide * itemsPerSlide, (currentSlide + 1) * itemsPerSlide);

  const selectItem = (category, variant) => {
    const price = currentPrices[category.id][variant];
    const currentSelection = selectedItems[category.id];

    if (currentSelection && currentSelection.variant === variant) {
      removeItem(category.id);
      return;
    }

    if (currentSelection) {
      removeItem(category.id, false);
    }

    setSelectedItems(prev => ({
      ...prev,
      [category.id]: { variant, price, name: category.name, required: category.required }
    }));
    setTotal(prev => prev + price);
    setHistory(prev => [...prev, { categoryId: category.id, variant, price, action: 'add' }]);
  };

  const removeItem = (categoryId, addToHistory = true) => {
    const item = selectedItems[categoryId];
    if (!item) return;

    setSelectedItems(prev => {
      const newState = { ...prev };
      delete newState[categoryId];
      return newState;
    });
    setTotal(prev => prev - item.price);
    if (addToHistory) {
      setHistory(prev => [...prev, { categoryId, price: item.price, action: 'remove' }]);
    }
  };

  const undo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    if (last.action === 'add') {
      removeItem(last.categoryId, false);
    } else {
      const category = categories.find(c => c.id === last.categoryId);
      const price = last.price;
      const variant = price === currentPrices[category.id][0] ? 0 : 1;
      setSelectedItems(prev => ({
        ...prev,
        [last.categoryId]: { variant, price, name: category.name, required: category.required }
      }));
      setTotal(prev => prev + price);
    }
    setHistory(prev => prev.slice(0, -1));
  };

  const canFinish = () => {
    const requiredSelected = categories.filter(c => c.required).every(c => selectedItems[c.id]);
    return requiredSelected && total <= balance;
  };

  const finish = () => {
    if (canFinish()) {
      onFinish(total);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '30px', padding: '20px' }}>
      {/* Левая часть: товары и слайды */}
      <div style={{ flex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px' }}>
          {currentItems.map(cat => (
            <div key={cat.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '12px' }}>
              <strong>{cat.name}</strong> {cat.required && <span style={{ color: 'red' }}>(обяз)</span>}
              <div style={{ marginTop: '10px' }}>
                <button onClick={() => selectItem(cat, 0)} style={{ marginRight: '10px', padding: '8px 12px' }}>
                  Дешёвый: {currentPrices[cat.id][0]} ₽
                </button>
                <button onClick={() => selectItem(cat, 1)} style={{ padding: '8px 12px' }}>
                  Дорогой: {currentPrices[cat.id][1]} ₽
                </button>
              </div>
              {selectedItems[cat.id] && (
                <div style={{ color: 'green', marginTop: '8px' }}>
                  Выбран: {selectedItems[cat.id].variant === 0 ? 'Дешёвый' : 'Дорогой'} ({selectedItems[cat.id].price} ₽)
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
          <button onClick={() => setCurrentSlide(prev => prev - 1)} disabled={currentSlide === 0}>Назад</button>
          <span>Слайд {currentSlide + 1} из {totalSlides}</span>
          <button onClick={() => setCurrentSlide(prev => prev + 1)} disabled={currentSlide === totalSlides - 1}>Далее</button>
        </div>
        <div style={{ marginTop: '30px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <button onClick={undo} disabled={history.length === 0}>Отменить</button>
          <button onClick={finish} disabled={!canFinish()} style={{ backgroundColor: canFinish() ? 'green' : 'gray', color: 'white' }}>Завершить</button>
        </div>
      </div>

      {/* Правая часть: баланс и список покупок */}
      <div style={{ flex: 1, borderLeft: '2px solid #ccc', paddingLeft: '20px' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Баланс: {balance} ₽</div>
        <div style={{ fontSize: '20px', marginBottom: '20px' }}>Итого: {total} ₽</div>
        <h3>Список покупок</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {categories.map(cat => {
            const isSelected = !!selectedItems[cat.id];
            if (!isSelected && !cat.required) return null;
            return (
              <div key={cat.id} style={{ textDecoration: isSelected ? 'line-through' : 'none' }}>
                {cat.name} {isSelected ? `(${selectedItems[cat.id].price} ₽)` : '(не выбран)'}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ShopGame;