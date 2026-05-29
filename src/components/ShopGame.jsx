import { useState } from 'react';

const ShopGame = ({ difficulty, onFinish }) => {
  const categories = [
    { id: 'milk', name: 'Молоко', required: true },
    { id: 'sausage', name: 'Колбаса', required: false },
    { id: 'carrot', name: 'Морковка', required: true },
    { id: 'yogurt', name: 'Йогурт', required: false },
    { id: 'eggs', name: 'Яйца', required: true },
    { id: 'banana', name: 'Банан', required: false },
    { id: 'bread', name: 'Хлеб', required: true },
    { id: 'candy', name: 'Конфеты', required: false },
    { id: 'lollipop', name: 'Леденец', required: false },
    { id: 'cocacola', name: 'Кока-кола', required: false },
    { id: 'ball', name: 'Мячик', required: false },
    { id: 'apple', name: 'Яблоки', required: false }
  ];

  const prices = {
    easy: {
      milk: [70, 90],
      sausage: [150, 200],
      carrot: [30, 50],
      yogurt: [60, 90],
      eggs: [100, 130],
      banana: [50, 80],
      bread: [40, 60],
      candy: [20, 35],
      lollipop: [15, 25],
      cocacola: [80, 110],
      ball: [200, 300],
      apple: [60, 90]
    },
    hard: {
      milk: [90, 120],
      sausage: [180, 240],
      carrot: [50, 70],
      yogurt: [80, 110],
      eggs: [130, 170],
      banana: [70, 100],
      bread: [60, 85],
      candy: [30, 50],
      lollipop: [25, 40],
      cocacola: [100, 140],
      ball: [250, 380],
      apple: [80, 110]
    }
  };

  const currentPrices = prices[difficulty];
  const [selectedItems, setSelectedItems] = useState({});
  const [total, setTotal] = useState(0);
  const [history, setHistory] = useState([]);
  const balance = 500;

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

  // Разделяем товары на два стеллажа (по 6 товаров)
  const shelf1 = categories.slice(0, 6);
  const shelf2 = categories.slice(6, 12);

  // Группируем по 2 товара на полку
  const groupByTwo = (items) => {
    const rows = [];
    for (let i = 0; i < items.length; i += 2) {
      rows.push(items.slice(i, i + 2));
    }
    return rows;
  };

  const shelf1Rows = groupByTwo(shelf1);
  const shelf2Rows = groupByTwo(shelf2);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>Магазин</h2>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Баланс: {balance} ₽</div>
        <div style={{ fontSize: '20px' }}>Итого: {total} ₽</div>
      </div>

      <div style={{ display: 'flex', gap: '40px', justifyContent: 'space-between' }}>
        {/* Стеллаж 1 */}
        <div style={{ flex: 1, border: '1px solid #ccc', padding: '20px', borderRadius: '10px' }}>
          <h3 style={{ textAlign: 'center' }}>Стеллаж 1</h3>
          {shelf1Rows.map((row, rowIndex) => (
            <div key={rowIndex} style={{ display: 'flex', gap: '20px', marginBottom: '20px', justifyContent: 'center' }}>
              {row.map(cat => (
                <div key={cat.id} style={{ flex: 1, border: '1px solid #ddd', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                  <strong>{cat.name}</strong> {cat.required && <span style={{ color: 'red' }}>(обяз)</span>}
                  <div style={{ marginTop: '10px' }}>
                    <button onClick={() => selectItem(cat, 0)} style={{ marginRight: '10px', padding: '5px 10px' }}>
                      Дешёвый: {currentPrices[cat.id][0]} ₽
                    </button>
                    <button onClick={() => selectItem(cat, 1)} style={{ padding: '5px 10px' }}>
                      Дорогой: {currentPrices[cat.id][1]} ₽
                    </button>
                  </div>
                  {selectedItems[cat.id] && (
                    <div style={{ color: 'green', marginTop: '5px' }}>
                      Выбран: {selectedItems[cat.id].variant === 0 ? 'Дешёвый' : 'Дорогой'} ({selectedItems[cat.id].price} ₽)
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Стеллаж 2 */}
        <div style={{ flex: 1, border: '1px solid #ccc', padding: '20px', borderRadius: '10px' }}>
          <h3 style={{ textAlign: 'center' }}>Стеллаж 2</h3>
          {shelf2Rows.map((row, rowIndex) => (
            <div key={rowIndex} style={{ display: 'flex', gap: '20px', marginBottom: '20px', justifyContent: 'center' }}>
              {row.map(cat => (
                <div key={cat.id} style={{ flex: 1, border: '1px solid #ddd', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                  <strong>{cat.name}</strong> {cat.required && <span style={{ color: 'red' }}>(обяз)</span>}
                  <div style={{ marginTop: '10px' }}>
                    <button onClick={() => selectItem(cat, 0)} style={{ marginRight: '10px', padding: '5px 10px' }}>
                      Дешёвый: {currentPrices[cat.id][0]} ₽
                    </button>
                    <button onClick={() => selectItem(cat, 1)} style={{ padding: '5px 10px' }}>
                      Дорогой: {currentPrices[cat.id][1]} ₽
                    </button>
                  </div>
                  {selectedItems[cat.id] && (
                    <div style={{ color: 'green', marginTop: '5px' }}>
                      Выбран: {selectedItems[cat.id].variant === 0 ? 'Дешёвый' : 'Дорогой'} ({selectedItems[cat.id].price} ₽)
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Список покупок */}
      <div style={{ marginTop: '30px', padding: '15px', border: '1px solid #ccc', background: '#f9f9f9', borderRadius: '10px' }}>
        <h3>Список покупок</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {categories.map(cat => (
            <div key={cat.id}>
              {cat.name}: {selectedItems[cat.id] ? `Выбран (${selectedItems[cat.id].price} ₽)` : 'Не выбран'}
            </div>
          ))}
        </div>
      </div>

      {/* Кнопки */}
      <div style={{ marginTop: '30px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
        <button onClick={undo} disabled={history.length === 0} style={{ padding: '12px 24px', fontSize: '16px', cursor: 'pointer' }}>
          Отменить
        </button>
        <button onClick={finish} disabled={!canFinish()} style={{ padding: '12px 24px', fontSize: '16px', cursor: 'pointer', background: canFinish() ? 'green' : 'gray', color: 'white' }}>
          Завершить
        </button>
      </div>
    </div>
  );
};

export default ShopGame;