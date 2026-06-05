const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;
const STATE_FILE = path.join(__dirname, 'game-state.json');
const DAILY_INCOME = 50;
const START_BALANCE = 500;

let gameState = null;

function initializeGameState() {
    return {
        balance: START_BALANCE,
        day: 1,
        inventory: [],
        message: "Игра началась. У тебя 500 монет."
    };
}

function loadGameState() {
    try {
        if (fs.existsSync(STATE_FILE)) {
            const data = fs.readFileSync(STATE_FILE, 'utf8');
            const parsed = JSON.parse(data);
            
            if (typeof parsed.balance === 'number' &&
                typeof parsed.day === 'number' &&
                Array.isArray(parsed.inventory) &&
                typeof parsed.message === 'string') {
                gameState = parsed;
                console.log('Сохранение загружено');
            } else {
                console.log('Файл повреждён, создана новая игра');
                gameState = initializeGameState();
            }
        } else {
            gameState = initializeGameState();
            console.log('Новая игра создана');
        }
    } catch (err) {
        console.error('Ошибка загрузки:', err.message);
        gameState = initializeGameState();
    }
}

function saveGameState() {
    try {
        fs.writeFileSync(STATE_FILE, JSON.stringify(gameState, null, 2));
        console.log('Игра сохранена');
    } catch (err) {
        console.error('Ошибка сохранения:', err.message);
    }
}

function isValidAmount(value) {
    return typeof value === 'number' && !isNaN(value) && value > 0;
}

app.get('/api/game/state', (req, res) => {
    if (!gameState) {
        return res.status(500).json({ error: 'Ошибка состояния игры' });
    }
    res.json({
        balance: gameState.balance,
        day: gameState.day,
        inventory: gameState.inventory,
        message: gameState.message
    });
});

app.post('/api/game/buy', (req, res) => {
    const { itemName, price } = req.body;
    
    if (!itemName || typeof itemName !== 'string') {
        return res.status(400).json({ 
            success: false, 
            message: 'Название товара указано неверно' 
        });
    }
    
    if (!isValidAmount(price)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Цена должна быть положительным числом' 
        });
    }
    
    if (gameState.balance < price) {
        return res.json({
            success: false,
            message: `Не хватает денег. Нужно ${price}, а у тебя ${gameState.balance}`,
            currentBalance: gameState.balance
        });
    }
    
    gameState.balance -= price;
    gameState.inventory.push({
        item: itemName,
        price: price,
        purchasedAt: new Date().toISOString()
    });
    gameState.message = `Купил ${itemName} за ${price} монет. Осталось: ${gameState.balance}`;
    
    saveGameState();
    
    res.json({
        success: true,
        newBalance: gameState.balance,
        message: gameState.message
    });
});

app.post('/api/game/earn', (req, res) => {
    const { amount } = req.body;
    
    if (!isValidAmount(amount)) {
        return res.status(400).json({
            success: false,
            message: 'Сумма должна быть положительным числом'
        });
    }
    
    gameState.balance += amount;
    gameState.message = `Получил ${amount} монет. Теперь у тебя ${gameState.balance}`;
    saveGameState();
    
    res.json({
        success: true,
        newBalance: gameState.balance,
        message: gameState.message
    });
});

app.post('/api/game/nextDay', (req, res) => {
    gameState.day++;
    gameState.balance += DAILY_INCOME;
    gameState.message = `День ${gameState.day}. Получено ${DAILY_INCOME} монет. Баланс: ${gameState.balance}`;
    saveGameState();
    
    res.json({
        success: true,
        day: gameState.day,
        newBalance: gameState.balance,
        message: gameState.message
    });
});

app.post('/api/game/reset', (req, res) => {
    gameState = initializeGameState();
    saveGameState();
    
    res.json({
        success: true,
        message: 'Игра сброшена. Начинай заново',
        gameState: {
            balance: gameState.balance,
            day: gameState.day,
            inventory: gameState.inventory
        }
    });
});

function startServer() {
    loadGameState();
    
    app.listen(PORT, () => {
        console.log(`Сервер запущен на http://localhost:${PORT}`);
        console.log(`Доступные запросы:`);
        console.log(`  GET  /api/game/state - Получить состояние игры`);
        console.log(`  POST /api/game/buy  - Купить предмет`);
        console.log(`  POST /api/game/earn - Получить деньги`);
        console.log(`  POST /api/game/nextDay - Следующий день`);
        console.log(`  POST /api/game/reset - Сбросить игру`);
    });
}

startServer();