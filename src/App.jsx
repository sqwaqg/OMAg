import { useState, useEffect } from 'react';
import HeaderWithLogo from './components/HeaderWithLogo';
import BotHelper from './components/BotHelper';
import ExitModal from './components/ExitModal';
import StoryIntro from './components/StoryIntro';
import StoryOutro from './components/StoryOutro';
import DialogScene1 from './components/DialogScene1';
import DialogScene2 from './components/DialogScene2';
import ChoiceDialog2 from './components/ChoiceDialog2';
import InteractiveBackground from './components/InteractiveBackground';
import useSpeech from './hooks/useSpeech';
import { story1Dialogs, story1IntroText, story1OutroText, story1Tips } from './data/story1Data';
import { story2IntroText, story2OutroText, story2Tips, depositDialogs, creditDialogs, endingSuccess, endingFail, depositSuccess, depositFail, familyDialogs } from './data/story2Data';
import './index.css';
import story1Image from './assets/images/story1.png';
import story2Image from './assets/images/story2.png';
import CatchGame from './components/CatchGame';
import VictoryDialog from './components/VictoryDialog';
import LossDialog from './components/LossDialog';
import ShopGame from './components/ShopGame';
import BadEndingOutro from './components/BadEndingOutro';
import DepositFailDialog from './components/DepositFailDialog';
import GoodEndingStory1 from './components/GoodEndingStory1';
import RulesWithOwl from './components/RulesWithOwl';
import GoodEndingWithBall from './components/GoodEndingWithBall';
import { useSound } from './hooks/useSound'; // <-- добавили

function App() {
  const [currentScreen, setCurrentScreen] = useState('start');
  const [showIntro, setShowIntro] = useState(false);
  const [showOutro, setShowOutro] = useState(false);
  const [pendingStory, setPendingStory] = useState(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const [pendingScreen, setPendingScreen] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [botHighlight, setBotHighlight] = useState(false);
  const [botCustomTip, setBotCustomTip] = useState('');
  const { speak, stop } = useSpeech();
  
  const [story2Choice, setStory2Choice] = useState(null);
  const [showChoice, setShowChoice] = useState(false);
  const [showFamilyDialog, setShowFamilyDialog] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  
  const [showGame, setShowGame] = useState(false);
  const [gameConfig, setGameConfig] = useState(null);

  const [shopBalance, setShopBalance] = useState(null);
  
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  const [difficulty, setDifficulty] = useState(null);
  const [showShop, setShowShop] = useState(false);
  const [showShopOutro, setShowShopOutro] = useState(false);
  const [lastTotalSpent, setLastTotalSpent] = useState(0);
  const [lastEndingType, setLastEndingType] = useState('good');

  const [isBotMuted, setIsBotMuted] = useState(false);
  const toggleBotMute = () => setIsBotMuted(!isBotMuted);

  const [showGameInfo1, setShowGameInfo1] = useState(false);
  const [showGameInfo2, setShowGameInfo2] = useState(false);

  const [stats, setStats] = useState({ money: 0, score: 0, level: 1 });
  const [progress, setProgress] = useState({ story1: 0, story2: 0 });

  const [lastWishName, setLastWishName] = useState('');
  
  // Подключаем звуки
  const { playSfx } = useSound(); // <-- добавили

  useEffect(() => {
    fetch('http://localhost:3001/api/game/state')
      .then(res => {
        if (!res.ok) throw new Error('Бэкенд не отвечает');
        return res.json();
      })
      .then(data => {
        console.log('Данные с бэкенда:', data);
        setBalance(data.balance);
        setStats(prev => ({ ...prev, money: data.balance || 0 }));
        setLoading(false);
      })
      .catch(error => {
        console.warn('Бэкенд не доступен:', error.message);
        setBalance(500);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (currentScreen === 'start') {
      document.title = 'Финансовая грамотность для детей';
    } else if (currentScreen === 'story1') {
      if (showGameInfo1) document.title = 'Правила магазина';
      else if (difficulty) document.title = 'Выбор сложности';
      else if (showShop) document.title = 'Магазин — игра';
      else document.title = 'Диалог с мамой';
    } else if (currentScreen === 'story2') {
      if (showFamilyDialog) document.title = 'Семейный разговор';
      else if (showChoice) document.title = 'Вклад или кредит?';
      else if (showGameInfo2) document.title = 'Правила игры';
      else if (showGame) document.title = 'Ловля монеток';
      else document.title = 'Копим или берём в долг?';
    } else {
      document.title = 'Финансовая грамотность';
    }
  }, [currentScreen, showGameInfo1, difficulty, showShop, showFamilyDialog, showChoice, showGameInfo2, showGame]);

  const getTipsForScreen = () => {
    if (currentScreen === 'start') {
      return [
        'Привет! Я твой друг и помощник в мире денег!',
        'Давай вместе учиться управлять деньгами!',
        'Деньги — это весело, когда знаешь, как с ними обращаться!',
        'Я здесь, чтобы помочь тебе стать финансово грамотным!',
        'Каждый день узнавай что-то новое о деньгах!',
        'Ты можешь задать мне любой вопрос о финансах!',
        'Вместе мы научимся копить и тратить с умом!',
        'Не бойся ошибаться — это часть обучения!',
        'Финансовая грамотность открывает много возможностей!',
        'Я всегда рядом, если нужен совет!'
      ];
    }
    if (currentScreen === 'story1') return story1Tips;
    if (currentScreen === 'story2') return story2Tips;
    return ['Нажми на меня, если нужен совет!', 'Я всегда готов помочь тебе!', 'Спроси меня о чём угодно!'];
  };

  const openStory = (storyId, storyTitle, storyDesc) => {
    console.log('openStory called for', storyId);
    stop();
    setBotCustomTip('');
    setBotHighlight(false);
    setPendingStory(storyId);
    setShowIntro(true);
    setGameStarted(false);
    setStory2Choice(null);
    setShowChoice(false);
    setShowFamilyDialog(false);
    setGameResult(null);
    setShowGame(false);
    setGameConfig(null);
    setDifficulty(null);
    setShowShop(false);
    setShowShopOutro(false);
    setShowGameInfo1(false);
    setShowGameInfo2(false);

    if (storyId === 'story1') {
      const newBalance = Math.floor(Math.random() * (650 - 390 + 1)) + 390;
      setShopBalance(newBalance);
    }
  };

  const handleIntroComplete = () => {
    console.log('handleIntroComplete called, pendingStory:', pendingStory);
    stop();
    setShowIntro(false);
    if (pendingStory === 'story2') {
      setCurrentScreen('story2');
      setShowFamilyDialog(true);
    } else if (pendingStory === 'story1') {
      setCurrentScreen('story1');
      setGameStarted(false);
      setShowGameInfo1(true);
    }
    setPendingStory(null);
  };

  const handleFamilyDialogComplete = () => {
    setShowFamilyDialog(false);
    setShowGameInfo2(true);
  };

  const handleChoiceComplete = (choice) => {
    setStory2Choice(choice);
    setShowChoice(false);
    let config = null;
    if (choice === 'deposit') {
      config = {
        mode: 'deposit',
        target: 500,
        positiveValues: [100, 150],
        negativeValues: [-50],
        positiveCount: 40,
        negativeCount: 10,
        totalItems: 50,
        stopOnTarget: true
      };
    } else {
      config = {
        mode: 'credit',
        target: 2300,
        positiveValues: [100, 150],
        negativeValues: [-50, -150],
        positiveCount: 32,
        negativeCount: 18,
        totalItems: 50,
        stopOnTarget: true
      };
    }
    setGameConfig(config);
    setShowGame(true);
  };

  const handleGameInfo2Play = () => {
    setShowGameInfo2(false);
    setShowChoice(true);
  };

  const handleDialogComplete = () => {
    if (currentScreen === 'story1') {
      setGameStarted(true);
    } else if (currentScreen === 'story2') {
      if (story2Choice === 'deposit') setGameResult('deposit_success');
      else setGameResult('credit_success');
    }
  };

  const handleOutroComplete = () => {
    setShowOutro(false);
    setCurrentScreen('start');
    setGameStarted(false);
    setGameResult(null);
    setStory2Choice(null);
    setShowChoice(false);
    setShowFamilyDialog(false);
    setShowGame(false);
    setGameConfig(null);
    setDifficulty(null);
    setShowShop(false);
    setShowShopOutro(false);
    setShowGameInfo1(false);
    setShowGameInfo2(false);
    setBotCustomTip('');
    setBotHighlight(false);
  };

  const handleExit = (targetScreen) => {
    const currentProgress = currentScreen === 'story1' ? progress.story1 : progress.story2;
    if (currentProgress > 0) {
      stop();
      speak('Точно хочешь выйти? Весь прогресс будет потерян!');
      setPendingScreen(targetScreen);
      setShowExitModal(true);
    } else {
      setCurrentScreen(targetScreen);
      setGameStarted(false);
      setGameResult(null);
      setStory2Choice(null);
      setShowChoice(false);
      setShowFamilyDialog(false);
      setShowGame(false);
      setGameConfig(null);
      setDifficulty(null);
      setShowShop(false);
      setShowShopOutro(false);
      setShowGameInfo1(false);
      setShowGameInfo2(false);
      setBotCustomTip('');
      setBotHighlight(false);
    }
  };

  const confirmExit = () => {
    if (currentScreen === 'story1') setProgress({...progress, story1: 0});
    else if (currentScreen === 'story2') setProgress({...progress, story2: 0});
    setCurrentScreen(pendingScreen);
    setShowExitModal(false);
    setPendingScreen(null);
    setGameStarted(false);
    setGameResult(null);
    setStory2Choice(null);
    setShowChoice(false);
    setShowFamilyDialog(false);
    setShowGame(false);
    setGameConfig(null);
    setDifficulty(null);
    setShowShop(false);
    setShowShopOutro(false);
    setShowGameInfo1(false);
    setShowGameInfo2(false);
    setBotCustomTip('');
    setBotHighlight(false);
  };

  const cancelExit = () => {
    setShowExitModal(false);
    setPendingScreen(null);
  };

  if (loading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: '1.2rem', color: '#489b4fff' }}>Подожди немного. Сейчас всё появится!</div>;
  }

  // СТАРТОВЫЙ
  if (currentScreen === 'start') {
    return (
      <div className="app-container">
        <InteractiveBackground />
        <HeaderWithLogo title="Финансы с лисятами" subtitle="Учись управлять деньгами весело и интересно вместе с лисятами!" />
        <main className="main-content">
          <div className="stories-grid">
            <div className="story-card" onClick={() => openStory('story1', 'Покупка продуктов', 'Тебе нужно купить хлеб, молоко и что-то вкусное')}>
              <div className="story-image"><img src={story1Image} alt="Покупка продуктов" /></div>
              <h2>Покупка продуктов</h2>
              <p>Мама дала денег, чтобы ты купил все, что есть в списке. Сможешь купить всё необходимое?</p>
            </div>
            <div className="story-card" onClick={() => openStory('story2', 'Копим или берём в долг?', 'Узнай, что выгоднее: копить или взять кредит')}>
              <div className="story-image"><img src={story2Image} alt="Копим или берём в долг?" /></div>
              <h2>Копим или берём в долг?</h2>
              <p>Хочешь планшет, но у тебя немного не хватает денег? Что же выгоднее: копить или взять кредит?</p>
            </div>
          </div>
        </main>
        <footer className="footer">
          <div>© 2026 Банк Центр-Инвест</div>
        </footer>
        <BotHelper tips={getTipsForScreen()} highlight={botHighlight} customTip={botCustomTip} isMuted={isBotMuted} />
        <div style={{ position: 'fixed', bottom: '30px', right: '190px', zIndex: 1001 }}>
          <button onClick={toggleBotMute} style={{ width: '40px', height: '40px', borderRadius: '50%', background: isBotMuted ? '#c62828' : '#2e7d32', border: 'none', fontSize: '1.3rem', fontWeight: 'bold', color: 'white', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>{isBotMuted ? '🔇' : '🔊'}</button>
        </div>
        {showIntro && pendingStory === 'story1' && <StoryIntro title={story1IntroText.title} text={story1IntroText.text} onComplete={handleIntroComplete} />}
        {showIntro && pendingStory === 'story2' && <StoryIntro title={story2IntroText.title} text={story2IntroText.text} onComplete={handleIntroComplete} />}
      </div>
    );
  }
  
  // ИСТОРИЯ 1
  if (currentScreen === 'story1') {
    if (!gameStarted) {
      return (
        <>
          <InteractiveBackground />
          <DialogScene1 
            onComplete={() => setGameStarted(true)} 
            balance={balance || stats.money}
            onBotHint={(isHighlight) => setBotHighlight(isHighlight)}
            dialogs={story1Dialogs}
            onUpdateBalance={(newBalance) => { setBalance(newBalance); setStats(prev => ({ ...prev, money: newBalance })); }}
            onExit={() => handleExit('start')}
            onSkip={() => setGameStarted(true)}
            playSfx={playSfx} // <-- добавили
          />
          <BotHelper tips={story1Tips} highlight={botHighlight} customTip={botCustomTip} disableAutoTips={true} isMuted={isBotMuted} />
          <div style={{ position: 'fixed', bottom: '30px', right: '190px', zIndex: 1001 }}>
            <button onClick={toggleBotMute} style={{ width: '40px', height: '40px', borderRadius: '50%', background: isBotMuted ? '#c62828' : '#2e7d32', border: 'none', fontSize: '1.3rem', color: 'white', cursor: 'pointer' }}>{isBotMuted ? '🔇' : '🔊'}</button>
          </div>
        </>
      );
    }
    
    // Аутро после магазина
    if (showShopOutro) {
      if (lastEndingType === 'bad') {
        return <BadEndingOutro onComplete={() => { setShowShopOutro(false); handleOutroComplete(); }} playSfx={playSfx} />; // <-- добавили
      } else if (lastEndingType === 'noBall') {
        return <GoodEndingStory1 onComplete={() => { setShowShopOutro(false); handleOutroComplete(); }} playSfx={playSfx} />; // <-- добавили
      } else {
        return <GoodEndingWithBall 
          onComplete={() => { setShowShopOutro(false); handleOutroComplete(); }} 
          wishName={lastWishName} 
          playSfx={playSfx} // <-- добавили
        />;
      }
    }
    
    // Показываем правила игры с совёнком
    if (showGameInfo1 && !difficulty && !showShop) {
      return (
        <>
          <InteractiveBackground />
          <RulesWithOwl
            title="Правила игры в магазин"
            text="Перед тобой магазин. Нужно купить обязательные продукты: хлеб, молоко, яйца, морковку. У тебя будет случайный бюджет от 390 до 650 рублей. Также можно добавить другие товары, но не выходи за бюджет. Дешёвые молочные продукты и колбаса могут быть некачественными – будь внимателен! Нажми 'Начать игру', чтобы выбрать сложность."
            onPlay={() => setShowGameInfo1(false)}
            onExit={() => handleExit('start')}
          />
          <BotHelper tips={story1Tips} highlight={botHighlight} customTip={botCustomTip} disableAutoTips={true} isMuted={isBotMuted} />
          <div style={{ position: 'fixed', bottom: '30px', right: '190px', zIndex: 1001 }}>
            <button onClick={toggleBotMute} style={{ width: '40px', height: '40px', borderRadius: '50%', background: isBotMuted ? '#c62828' : '#2e7d32', border: 'none', fontSize: '1.3rem', color: 'white', cursor: 'pointer' }}>{isBotMuted ? '🔇' : '🔊'}</button>
          </div>
        </>
      );
    }
    
    // Выбор сложности
    if (!difficulty && !showShop) {
      return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }}>
          <InteractiveBackground />
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(255,255,255,0.96)',
            backdropFilter: 'blur(12px)',
            borderRadius: '60px',
            padding: '40px',
            textAlign: 'center',
            zIndex: 1001,
            minWidth: '380px',
            boxShadow: '0 30px 50px rgba(0,0,0,0.3)',
            border: '2px solid #ffd966'
          }}>
            <h2 style={{ color: '#2e7d32', marginBottom: '20px', fontSize: '2rem' }}>Выбери уровень сложности</h2>
            <p style={{ marginBottom: '30px', color: '#666', fontSize: '1rem' }}>Чем выше сложность, тем дороже продукты!</p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => setDifficulty('easy')}
                style={{
                  padding: '14px 30px',
                  background: 'linear-gradient(135deg, #4caf50, #2e7d32)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >Лёгкий уровень</button>
              <button
                onClick={() => setDifficulty('hard')}
                style={{
                  padding: '14px 30px',
                  background: 'linear-gradient(135deg, #ff9800, #f57c00)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >Сложный уровень</button>
            </div>
          </div>
          <BotHelper tips={getTipsForScreen()} highlight={botHighlight} customTip={botCustomTip} isMuted={isBotMuted} />
          <div style={{ position: 'fixed', bottom: '30px', right: '190px', zIndex: 1001 }}>
            <button onClick={toggleBotMute} style={{ width: '40px', height: '40px', borderRadius: '50%', background: isBotMuted ? '#c62828' : '#2e7d32', border: 'none', fontSize: '1.3rem', color: 'white', cursor: 'pointer' }}>{isBotMuted ? '🔇' : '🔊'}</button>
          </div>
        </div>
      );
    }
    
    // Магазин
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, overflow: 'hidden' }}>
        <InteractiveBackground />
        {difficulty && !showShop && (
          <ShopGame
            difficulty={difficulty}
            balance={shopBalance}
            onFinish={(totalSpent, cheapRisky, hasWish, wishName) => {
              setShowShop(true);
              const remaining = (balance || stats.money) - totalSpent;
              setBalance(remaining);
              setStats(prev => ({ ...prev, money: remaining }));
              setProgress(prev => ({ ...prev, story1: 100 }));
              setLastTotalSpent(totalSpent);
              setLastWishName(wishName || '');
              if (cheapRisky) {
                setLastEndingType('bad');
              } else if (!hasWish) {
                setLastEndingType('noBall');
              } else {
                setLastEndingType('good');
              }
              fetch('http://localhost:3001/api/game/earn', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: totalSpent }) }).catch(err => console.warn('API error:', err));
              setShowShopOutro(true);
            }}
            onBack={() => setDifficulty(null)}
            onEncouragement={(phrase) => setBotCustomTip(phrase)}
          />
        )}
        <BotHelper tips={getTipsForScreen()} highlight={botHighlight} customTip={botCustomTip} isMuted={isBotMuted} />
        <div style={{ position: 'fixed', bottom: '30px', right: '190px', zIndex: 1001 }}>
          <button onClick={toggleBotMute} style={{ width: '40px', height: '40px', borderRadius: '50%', background: isBotMuted ? '#c62828' : '#2e7d32', border: 'none', fontSize: '1.3rem', color: 'white', cursor: 'pointer' }}>{isBotMuted ? '🔇' : '🔊'}</button>
        </div>
        {showExitModal && <ExitModal onConfirm={confirmExit} onCancel={cancelExit} />}
      </div>
    );
  }
  
  // ИСТОРИЯ 2
  if (currentScreen === 'story2') {
    if (showFamilyDialog) {
      return (
        <>
          <InteractiveBackground />
          <DialogScene2 
            onComplete={handleFamilyDialogComplete} 
            balance={balance || stats.money} 
            dialogs={familyDialogs} 
            onBotHint={(isHighlight) => setBotHighlight(isHighlight)} 
            onExit={() => handleExit('start')}
            onSkip={handleFamilyDialogComplete}
          />
          <BotHelper tips={story2Tips} highlight={botHighlight} customTip={botCustomTip} disableAutoTips={true} isMuted={isBotMuted} />
          <div style={{ position: 'fixed', bottom: '30px', right: '190px', zIndex: 1001 }}>
            <button onClick={toggleBotMute} style={{ width: '40px', height: '40px', borderRadius: '50%', background: isBotMuted ? '#c62828' : '#2e7d32', border: 'none', fontSize: '1.3rem', color: 'white', cursor: 'pointer' }}>{isBotMuted ? '🔇' : '🔊'}</button>
          </div>
        </>
      );
    }
    
    if (showChoice) {
      return (
        <>
          <InteractiveBackground />
          <ChoiceDialog2 onChoice={handleChoiceComplete} />
          <BotHelper tips={story2Tips} highlight={botHighlight} customTip={botCustomTip} disableAutoTips={true} isMuted={isBotMuted} />
          <div style={{ position: 'fixed', bottom: '30px', right: '190px', zIndex: 1001 }}>
            <button onClick={toggleBotMute} style={{ width: '40px', height: '40px', borderRadius: '50%', background: isBotMuted ? '#c62828' : '#2e7d32', border: 'none', fontSize: '1.3rem', color: 'white', cursor: 'pointer' }}>{isBotMuted ? '🔇' : '🔊'}</button>
          </div>
        </>
      );
    }
    
    if (showGameInfo2) {
      return (
        <>
          <InteractiveBackground />
          <RulesWithOwl
            title="Правила игры"
            text="Помоги лисичке накопить на планшет! Лови падающие монетки. Положительные монеты (100 и 150 ₽) увеличивают сумму, отрицательные (-50 и -150 ₽) – уменьшают. Нужно набрать целевую сумму. Будь внимателен! Нажми 'Начать игру', чтобы продолжить."
            onPlay={handleGameInfo2Play}
            onExit={() => handleExit('start')}
          />
          <BotHelper tips={story2Tips} highlight={botHighlight} customTip={botCustomTip} disableAutoTips={true} isMuted={isBotMuted} />
          <div style={{ position: 'fixed', bottom: '30px', right: '190px', zIndex: 1001 }}>
            <button onClick={toggleBotMute} style={{ width: '40px', height: '40px', borderRadius: '50%', background: isBotMuted ? '#c62828' : '#2e7d32', border: 'none', fontSize: '1.3rem', color: 'white', cursor: 'pointer' }}>{isBotMuted ? '🔇' : '🔊'}</button>
          </div>
        </>
      );
    }
    
    if (showGame && gameConfig) {
      return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'white', zIndex: 1000, overflow: 'auto' }}>
          <CatchGame
            config={gameConfig}
            onFinish={(result, finalScore) => {
              setShowGame(false);
              let message = '';
              let moneyChange = 0;
              if (gameConfig.mode === 'deposit') {
                if (finalScore >= 500) {
                  message = 'Ты накопила 500 рублей. Вместе с процентами по вкладу и подарками на день рождения ты можешь купить ноутбук или планшет с чехлом.';
                  moneyChange = 500;
                  setGameResult('deposit_success');
                } else {
                  message = 'Доченька, со дня твоего рождения и вклада прошёл ровно год. У тебя накопилось 11500 рублей. Ты не накопила 500 рублей, как мы договаривались? Смотри, у тебя сегодня было день рождения, тебе подарили деньги, плюс остались деньги с прошлого дня рождения, плюс 1500 рублей благодаря вкладу. Ты можешь сложить свои деньги и купить ноутбук вместо планшета, либо купить планшет и какой-нибудь чехол к нему.';
                  moneyChange = 0;
                  setGameResult('deposit_fail');
                }
              } else {
                if (result === 'win') {
                  message = 'Ты вернула долг! Планшет и бантики — твои!';
                  moneyChange = 2300;
                  setGameResult('credit_success');
                } else {
                  message = 'Ты не накопила 2300. Папа продал твои бантики, они покрыли остаток долга. Планшет остался, но бантиков больше нет.';
                  moneyChange = 0;
                  setGameResult('credit_fail');
                }
              }
              fetch('http://localhost:3001/api/game/earn', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: moneyChange }) }).catch(err => console.warn('API error:', err));
              setStats(prev => ({ ...prev, money: prev.money + moneyChange }));
              setProgress(prev => ({ ...prev, story2: 100 }));
              speak(message);
            }}
            onBack={() => { setShowGame(false); setShowChoice(true); }}
            onEncouragement={(phrase) => setBotCustomTip(phrase)}
          />
          <BotHelper tips={story2Tips} highlight={botHighlight} customTip={botCustomTip} disableAutoTips={true} isMuted={isBotMuted} />
          <div style={{ position: 'fixed', bottom: '30px', right: '190px', zIndex: 1001 }}>
            <button onClick={toggleBotMute} style={{ width: '40px', height: '40px', borderRadius: '50%', background: isBotMuted ? '#c62828' : '#2e7d32', border: 'none', fontSize: '1.3rem', color: 'white', cursor: 'pointer' }}>{isBotMuted ? '🔇' : '🔊'}</button>
          </div>
        </div>
      );
    }
    
    if (gameResult) {
      if ((story2Choice === 'credit' && gameResult === 'credit_success') || (story2Choice === 'deposit' && gameResult === 'deposit_success')) {
        return <VictoryDialog onComplete={() => { setGameResult(null); setStory2Choice(null); setShowChoice(false); setGameStarted(false); setCurrentScreen('start'); }} score={stats.money} type={story2Choice} playSfx={playSfx} />; // <-- добавили
      }
      if (story2Choice === 'credit' && gameResult === 'credit_fail') {
        return <LossDialog onComplete={() => { setGameResult(null); setStory2Choice(null); setShowChoice(false); setGameStarted(false); setCurrentScreen('start'); }} type="credit" playSfx={playSfx} />; // <-- добавили
      }
      if (story2Choice === 'deposit' && gameResult === 'deposit_fail') {
        return <DepositFailDialog onComplete={() => { setGameResult(null); setStory2Choice(null); setShowChoice(false); setGameStarted(false); setCurrentScreen('start'); }} score={stats.money} playSfx={playSfx} />; // <-- добавили
      }
      let endingTitle = '';
      let endingText = '';
      if (story2Choice === 'credit' && gameResult === 'credit_success') {
        endingTitle = endingSuccess.title;
        endingText = endingSuccess.text;
      } else if (story2Choice === 'credit' && gameResult === 'credit_fail') {
        endingTitle = endingFail.title;
        endingText = endingFail.text;
      }
      return <StoryOutro title={endingTitle} text={endingText} onComplete={handleOutroComplete} />;
    }
    return null;
  }

  return null;
}

export default App;