import { useState, useEffect } from 'react';
import TopNavBar from './components/TopNavBar';
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
  
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  const [difficulty, setDifficulty] = useState(null);
  const [showShop, setShowShop] = useState(false);

  const [stats, setStats] = useState({
    money: 0,
    score: 0,
    level: 1
  });

  const [progress, setProgress] = useState({
    story1: 0,
    story2: 0
  });

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
    if (currentScreen === 'story1') {
      return story1Tips;
    }
    if (currentScreen === 'story2') {
      return story2Tips;
    }
    return ['Нажми на меня, если нужен совет!', 'Я всегда готов помочь тебе!', 'Спроси меня о чём угодно!'];
  };

  const openStory = (storyId, storyTitle, storyDesc) => {
    console.log('openStory called for', storyId);
    stop();
    speak(`Вы выбрали историю: ${storyTitle}. ${storyDesc}`);
    setPendingStory(storyId);
    setShowIntro(true);
    setGameStarted(false);
    setStory2Choice(null);
    setShowChoice(false);
    setShowFamilyDialog(false);
    setGameResult(null);
    setShowGame(false);
    setGameConfig(null);
  };

  const handleIntroComplete = () => {
    console.log('handleIntroComplete called, pendingStory:', pendingStory);
    stop();
    setShowIntro(false);
    if (pendingStory === 'story2') {
      console.log('Переход на story2');
      setCurrentScreen('story2');
      setShowFamilyDialog(true);
    } else if (pendingStory === 'story1') {
      console.log('Переход на story1 для диалога');
      setCurrentScreen('story1');
      setGameStarted(false);
    }
    setPendingStory(null);
  };

  const handleFamilyDialogComplete = () => {
    console.log('Семейный диалог завершён, переходим к выбору');
    setShowFamilyDialog(false);
    setShowChoice(true);
  };

  const handleChoiceComplete = (choice) => {
    console.log('Выбор сделан:', choice);
    setStory2Choice(choice);
    setShowChoice(false);
    
    if (choice === 'deposit') {
      setGameConfig({
        mode: 'deposit',
        target: 500,
        positiveValues: [100, 150],
        negativeValues: [-50],
        positiveCount: 48,
        negativeCount: 2,
        totalItems: 50,
        stopOnTarget: true
      });
    } else {
      setGameConfig({
        mode: 'credit',
        target: 2300,
        positiveValues: [100, 150],
        negativeValues: [-50, -150],
        positiveCount: 32,
        negativeCount: 18,
        totalItems: 50,
        stopOnTarget: true
      });
    }
    setShowGame(true);
  };

  const handleDialogComplete = () => {
    console.log('Диалог завершён, currentScreen:', currentScreen);
    if (currentScreen === 'story1') {
      setGameStarted(true);
    } else if (currentScreen === 'story2') {
      if (story2Choice === 'deposit') {
        setGameResult('deposit_success');
      } else {
        setGameResult('credit_success');
      }
    }
  };

  const completeStory = () => {
    setShowOutro(true);
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
    }
  };

  const confirmExit = () => {
    if (currentScreen === 'story1') {
      setProgress({...progress, story1: 0});
    } else if (currentScreen === 'story2') {
      setProgress({...progress, story2: 0});
    }
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
  };

  const cancelExit = () => {
    setShowExitModal(false);
    setPendingScreen(null);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: '1.2rem', color: '#666' }}>
        Загрузка...
      </div>
    );
  }

  // СТАРТОВЫЙ ЭКРАН
  if (currentScreen === 'start') {
    return (
      <div className="app-container">
        <InteractiveBackground />
        <HeaderWithLogo title="Финансовая грамотность для детей" subtitle="Учись управлять деньгами весело и интересно!" />
        <main className="main-content">
          <div className="stories-grid">
            <div className="story-card" onClick={() => openStory('story1', 'Покупка продуктов', 'Тебе нужно купить хлеб, молоко и что-то вкусное')}>
              <div className="story-image">
                <img src={story1Image} alt="Покупка продуктов" />
              </div>
              <h2>Покупка продуктов</h2>
              <p>У тебя есть {balance} рублей. Сможешь купить всё необходимое?</p>
            </div>
            <div className="story-card" onClick={() => openStory('story2', 'Копим или берём в долг?', 'Узнай, что выгоднее: копить или взять кредит')}>
              <div className="story-image">
                <img src={story2Image} alt="Копим или берём в долг?" />
              </div>
              <h2>Копим или берём в долг?</h2>
              <p>Хочешь новую игрушку? Что выгоднее: копить или взять кредит?</p>
            </div>
          </div>
        </main>
        <footer className="footer">
          <div>© 2026 Банк Центр-Инвест</div>
          <div className="contact-info">
            <span>📞 8-800-XXX-XX-XX</span>
            <span>✉ info@center-invest.ru</span>
          </div>
        </footer>
        <BotHelper tips={getTipsForScreen()} highlight={botHighlight} />
        
        {showIntro && pendingStory === 'story1' && (
          <StoryIntro 
            title={story1IntroText.title}
            text={story1IntroText.text}
            onComplete={handleIntroComplete}
          />
        )}
        {showIntro && pendingStory === 'story2' && (
          <StoryIntro 
            title={story2IntroText.title}
            text={story2IntroText.text}
            onComplete={handleIntroComplete}
          />
        )}
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
            onComplete={() => {
              setGameStarted(true);
            }} 
            balance={balance || stats.money}
            onBotHint={(isHighlight) => setBotHighlight(isHighlight)}
            dialogs={story1Dialogs}
          />
        </>
      );
    }
    
    return (
      <div className="app-container">
        <InteractiveBackground />
        <HeaderWithLogo title="Покупка продуктов" />
        <TopNavBar onBack={() => handleExit('start')} progress={progress.story1} stats={{ ...stats, money: balance }} />
        <main className="main-content" style={{ paddingTop: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto' }}>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(12px)',
              borderRadius: '40px', 
              padding: '50px 40px',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.15)',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.4)'
            }}>
              {!difficulty && !showShop && (
  <div style={{ textAlign: 'center', marginTop: '20px' }}>
    <h3>Выберите уровень сложности</h3>
    <div style={{ marginTop: '20px' }}>
      <button
        onClick={() => setDifficulty('easy')}
        style={{ margin: '10px', padding: '12px 24px', fontSize: '16px', cursor: 'pointer' }}
      >
        Лёгкий
      </button>
      <button
        onClick={() => setDifficulty('hard')}
        style={{ margin: '10px', padding: '12px 24px', fontSize: '16px', cursor: 'pointer' }}
      >
        Сложный
      </button>
    </div>
  </div>
)}

{difficulty && !showShop && (
  <div style={{ marginTop: '20px' }}>
    <ShopGame
      difficulty={difficulty}
      onFinish={(totalSpent) => {
        setShowShop(true);
        const remaining = 500 - totalSpent;
        fetch('http://localhost:3001/api/game/earn', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: remaining })
        }).catch(err => console.warn('API error:', err));
        setProgress(prev => ({ ...prev, story1: 100 }));
        completeStory();
      }}
    />
  </div>
)}
            </div>
          </div>
        </main>
        <footer className="footer"><span>Банк Центр-Инвест • Учимся финансовой грамотности</span></footer>
        <BotHelper tips={getTipsForScreen()} highlight={botHighlight} />
        {showExitModal && <ExitModal onConfirm={confirmExit} onCancel={cancelExit} />}
        {showOutro && <StoryOutro title={story1OutroText.title} text={story1OutroText.text} onComplete={handleOutroComplete} />}
      </div>
    );
  }
  
  // ИСТОРИЯ 2
  if (currentScreen === 'story2') {
    // Семейный диалог
    if (showFamilyDialog) {
      return (
        <>
          <InteractiveBackground />
          <DialogScene2 
            onComplete={handleFamilyDialogComplete}
            balance={balance || stats.money}
            dialogs={familyDialogs}
            onBotHint={(isHighlight) => setBotHighlight(isHighlight)}
          />
          <BotHelper tips={story2Tips} highlight={botHighlight} />
        </>
      );
    }
    
    // Выбор между мамой и папой
    if (showChoice) {
      return (
        <>
          <InteractiveBackground />
          <ChoiceDialog2 onChoice={handleChoiceComplete} />
          <BotHelper tips={story2Tips} highlight={botHighlight} />
        </>
      );
    }
    
    // Игра (ловля монет)
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
              
              fetch('http://localhost:3001/api/game/earn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: moneyChange })
              }).catch(err => console.warn('API error:', err));
              
              setStats(prev => ({ ...prev, money: prev.money + moneyChange }));
              setProgress(prev => ({ ...prev, story2: 100 }));
              speak(message);
            }}
            onBack={() => {
              setShowGame(false);
              setShowChoice(true);
            }}
            onEncouragement={(phrase) => {
              setBotCustomTip(phrase);
              speak(phrase);
            }}
          />
          <BotHelper tips={story2Tips} highlight={botHighlight} customTip={botCustomTip} />
        </div>
      );
    }
    
    // Финальные диалоги после игры
    if (gameResult) {
      // Победа в кредите или вкладе
      if ((story2Choice === 'credit' && gameResult === 'credit_success') ||
          (story2Choice === 'deposit' && gameResult === 'deposit_success')) {
        return (
          <VictoryDialog 
            onComplete={() => {
              setGameResult(null);
              setStory2Choice(null);
              setShowChoice(false);
              setGameStarted(false);
              setCurrentScreen('start');
            }}
            score={stats.money}
            type={story2Choice}
          />
        );
      }
      
      // Поражение в кредите
      if (story2Choice === 'credit' && gameResult === 'credit_fail') {
        return (
          <LossDialog 
            onComplete={() => {
              setGameResult(null);
              setStory2Choice(null);
              setShowChoice(false);
              setGameStarted(false);
              setCurrentScreen('start');
            }}
            type="credit"
          />
        );
      }
      
      // Остальные случаи (deposit_fail)
      let endingTitle = '';
      let endingText = '';
      if (story2Choice === 'deposit' && gameResult === 'deposit_fail') {
        endingTitle = depositFail.title || 'История с вкладом';
        endingText = depositFail.text || 'Доченька, со дня твоего рождения и вклада прошёл ровно год...';
      } else if (story2Choice === 'credit' && gameResult === 'credit_success') {
        endingTitle = endingSuccess.title;
        endingText = endingSuccess.text;
      } else if (story2Choice === 'credit' && gameResult === 'credit_fail') {
        endingTitle = endingFail.title;
        endingText = endingFail.text;
      }
      return (
        <StoryOutro 
          title={endingTitle}
          text={endingText}
          onComplete={handleOutroComplete}
        />
      );
    }
    
    return null;
  }

  return null;
}

export default App;