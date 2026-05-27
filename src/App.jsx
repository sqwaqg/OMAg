import { useState, useEffect } from 'react'
import TopNavBar from './components/TopNavBar'
import HeaderWithLogo from './components/HeaderWithLogo'
import BotHelper from './components/BotHelper'
import ExitModal from './components/ExitModal'
import StoryIntro from './components/StoryIntro'
import StoryOutro from './components/StoryOutro'
import DialogScene from './components/DialogScene'
import useSpeech from './hooks/useSpeech'
import InteractiveBackground from './components/InteractiveBackground'
import './index.css'
import story1Image from './assets/images/story1.png'
import story2Image from './assets/images/story2.png'
import { story1Dialogs, story1IntroText, story1OutroText, story1Tips } from './data/story1Data'
import { story2Dialogs, story2IntroText, story2OutroText, story2Tips } from './data/story2Data'

function App() {
  const [currentScreen, setCurrentScreen] = useState('start')
  const [showIntro, setShowIntro] = useState(false)
  const [showOutro, setShowOutro] = useState(false)
  const [pendingStory, setPendingStory] = useState(null)
  const [showExitModal, setShowExitModal] = useState(false)
  const [pendingScreen, setPendingScreen] = useState(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [botHighlight, setBotHighlight] = useState(false)
  const { speak, stop } = useSpeech()
  
  const [balance, setBalance] = useState(null)
  const [loading, setLoading] = useState(true)

  const [stats, setStats] = useState({
    money: 0,
    score: 0,
    level: 1
  })

  const [progress, setProgress] = useState({
    story1: 0,
    story2: 0
  })

  useEffect(() => {
    fetch('http://localhost:3001/api/game/state')
      .then(res => {
        if (!res.ok) throw new Error('Бэкенд не отвечает')
        return res.json()
      })
      .then(data => {
        console.log('Данные с бэкенда:', data)
        setBalance(data.balance)
        setStats(prev => ({ ...prev, money: data.balance || 0 }))
        setLoading(false)
      })
      .catch(error => {
        console.warn('Бэкенд не доступен:', error.message)
        setBalance(500)
        setLoading(false)
      })
  }, [])

const getTipsForScreen = () => {
  if (currentScreen === 'start') {
    return [
      'Привет! Я твой друг и помощник в мире денег!',
      'Давай вместе учиться управлять деньгами!',
      'Деньги — это весело, когда знаешь, как с ними обращаться!',
      'Я здесь, чтобы помочь тебе стать финансово грамотным!',
      'Каждый день узнавай что-то новое о деньгах!',
      'Вместе мы научимся копить и тратить с умом!',
      'Не бойся ошибаться — это часть обучения!',
      'Финансовая грамотность открывает много возможностей!',
      'Я всегда рядом, если нужен совет!'
    ]
  }
  if (currentScreen === 'story1') {
    return [
      'Сначала купи хлеб и молоко — это самое важное!',
      'Смотри на цены и сравнивай товары!',
      'Не бери всё подряд — думай о бюджете!',
      'Сладости можно купить, но только после нужных продуктов!',
      'Составь список до магазина — так легче!',
      'Помни: нужное важнее желаемого!',
      'Иногда дешевле купить больше и дешевле за килограмм!',
      'Не забывай проверять срок годности!',
      '500 рублей — это не так много, выбирай с умом!',
      'Ты справишься, главное — внимательность!'
    ]
  }
  if (currentScreen === 'story2') {
    return [
      'Копить каждый день понемногу — отличная привычка!',
      'Вклад в банке — твои деньги работают на тебя!',
      'Кредит удобен, но отдавать придётся больше!',
      'Маленькие сбережения превращаются в большую цель!',
      'Подумай дважды, прежде чем взять в долг!',
      'Копить сложнее, но выгоднее в конце!',
      'Установи цель и копи шаг за шагом!',
      'Каждый отложенный рубль приближает мечту!',
      'Банковский вклад помогает сохранить деньги!',
      'Кредит бери только в самом крайнем случае!'
    ]
  }
  return [
    'Нажми на меня, если нужен совет!',
    'Я всегда готов помочь тебе!',
    'Спроси меня о чём угодно!'
  ]
}

  const openStory = (storyId, storyTitle, storyDesc) => {
    console.log('openStory:', storyId)
    stop()
    speak(`Вы выбрали историю: ${storyTitle}. ${storyDesc}`)
    setPendingStory(storyId)
    setShowIntro(true)
  }

  const handleIntroComplete = () => {
    console.log('Интро завершено, переходим к диалогу')
    setShowIntro(false)
    // Сразу переключаем на экран истории, но диалог покажется через gameStarted
    setCurrentScreen(pendingStory)
    setPendingStory(null)
  }

  const handleDialogComplete = () => {
    console.log('Диалог завершён, начинаем игру')
    setGameStarted(true)
  }

  const completeStory = () => {
    setShowOutro(true)
  }

  const handleOutroComplete = () => {
    setShowOutro(false)
    setCurrentScreen('start')
    setGameStarted(false)
  }

  const handleExit = (targetScreen) => {
    const currentProgress = currentScreen === 'story1' ? progress.story1 : progress.story2
    if (currentProgress > 0) {
      stop()
      speak('Точно хочешь выйти? Весь прогресс будет потерян!')
      setPendingScreen(targetScreen)
      setShowExitModal(true)
    } else {
      setCurrentScreen(targetScreen)
      setGameStarted(false)
    }
  }

  const confirmExit = () => {
    if (currentScreen === 'story1') {
      setProgress({...progress, story1: 0})
    } else if (currentScreen === 'story2') {
      setProgress({...progress, story2: 0})
    }
    setCurrentScreen(pendingScreen)
    setShowExitModal(false)
    setPendingScreen(null)
    setGameStarted(false)
  }

  const cancelExit = () => {
    setShowExitModal(false)
    setPendingScreen(null)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: '1.2rem', color: '#666' }}>
        Загрузка...
      </div>
    )
  }

  // ========== СТАРТОВЫЙ ЭКРАН (с интро) ==========
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
        
        {/* ИНТРО - показывается поверх стартового экрана */}
        {showIntro && pendingStory === 'story1' && (
          <StoryIntro 
            title="Покупка продуктов" 
            text="Сегодня ты пойдёшь в магазин один! У тебя есть деньги на счету. Нужно купить хлеб, молоко и что-то вкусное. Будь внимателен: денег может не хватить на всё!" 
            onComplete={handleIntroComplete} 
          />
        )}
        {showIntro && pendingStory === 'story2' && (
          <StoryIntro 
            title="Копим или берём в долг?" 
            text="Ты очень хочешь новую игрушку, но денег пока не хватает. У тебя есть выбор: копить каждый день или попросить у родителей в долг. Что выберешь?" 
            onComplete={handleIntroComplete} 
          />
        )}
      </div>
    )
  }
  
 // ИСТОРИЯ 1
if (currentScreen === 'story1') {
  if (!gameStarted) {
    return (
      <>
        <InteractiveBackground />
        <DialogScene 
          onComplete={handleDialogComplete} 
          balance={balance || stats.money}
          onBotHint={(isHighlight) => setBotHighlight(isHighlight)}
          dialogs={story1Dialogs}
        />
        <BotHelper tips={story1Tips} highlight={botHighlight} />
      </>
    )
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
            <h3 style={{ marginBottom: '25px', color: '#1a5c1a', fontSize: '1.8rem' }}>
              🛒 Твой бюджет: {balance} ₽
            </h3>
            <p style={{ color: '#3a5a3a', fontSize: '1.2rem', marginBottom: '35px' }}>
              Здесь будет игра с продуктами!
            </p>
            <button onClick={() => {
              const newProgress = Math.min(progress.story1 + 20, 100)
              setProgress({...progress, story1: newProgress})
              if (newProgress === 100) {
                speak('Поздравляю! Ты успешно справился с покупками!')
                completeStory()
              }
            }} style={{ 
              padding: '16px 35px', 
              background: 'linear-gradient(135deg, #2e7d32, #1b5e20)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '40px', 
              cursor: 'pointer', 
              fontSize: '1.2rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              +20% прогресса (демо)
            </button>
          </div>
        </div>
      </main>
      <footer className="footer"><span>Банк Центр-Инвест • Учимся финансовой грамотности</span></footer>
      <BotHelper tips={story1Tips} highlight={botHighlight} />
      {showExitModal && <ExitModal onConfirm={confirmExit} onCancel={cancelExit} />}
      {showOutro && <StoryOutro title={story1OutroText.title} text={story1OutroText.text} onComplete={handleOutroComplete} />}
    </div>
  )
}
  
  // ========== ИСТОРИЯ 2 ==========
  if (currentScreen === 'story2') {
    if (!gameStarted) {
      return (
        <DialogScene 
          onComplete={handleDialogComplete} 
          balance={balance || stats.money}
          onBotHint={(isHighlight) => setBotHighlight(isHighlight)}
        />
      )
    }
    
    return (
      <div className="app-container">
        <InteractiveBackground />
        <HeaderWithLogo title="Копим или берём в долг?" />
        <TopNavBar onBack={() => handleExit('start')} progress={progress.story2} stats={{ ...stats, money: balance }} />
        <main className="main-content" style={{ paddingTop: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto' }}>
            <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: '40px', padding: '50px 40px', textAlign: 'center' }}>
              <h3 style={{ marginBottom: '30px', color: '#2e7d32', fontSize: '1.8rem' }}>💰 Что выберешь?</h3>
              <div style={{ display: 'flex', gap: '20px', flexDirection: 'column', alignItems: 'center' }}>
                <button onClick={() => {
                  speak('Отличный выбор! Копить в банке выгодно, твои деньги будут расти')
                  setStats({...stats, money: balance + 100, score: stats.score + 10})
                  setProgress({...progress, story2: 100})
                  completeStory()
                }} style={{ padding: '18px 30px', width: '100%', maxWidth: '350px', fontSize: '1.2rem', borderRadius: '50px', border: 'none', background: 'linear-gradient(135deg, #2e7d32, #1b5e20)', color: 'white', cursor: 'pointer' }}>
                  🏦 Копить в банке (вклад)
                </button>
                <button onClick={() => {
                  speak('Кредит удобен, но помни: отдавать придётся больше, чем взял')
                  setStats({...stats, money: balance - 50, score: stats.score + 5})
                  setProgress({...progress, story2: 100})
                  completeStory()
                }} style={{ padding: '18px 30px', width: '100%', maxWidth: '350px', fontSize: '1.2rem', borderRadius: '50px', border: 'none', background: 'linear-gradient(135deg, #ff9800, #fb8c00)', color: 'white', cursor: 'pointer' }}>
                  👨‍👩‍👧 Попросить у родителей (кредит)
                </button>
              </div>
            </div>
          </div>
        </main>
        <footer className="footer"><span>Банк Центр-Инвест • Учимся финансовой грамотности</span></footer>
        <BotHelper tips={getTipsForScreen()} highlight={botHighlight} />
        {showExitModal && <ExitModal onConfirm={confirmExit} onCancel={cancelExit} />}
        {showOutro && <StoryOutro title="Копим или берём в долг?" text="Отличный выбор! Теперь ты знаешь разницу между вкладом и кредитом. Помни: копить выгоднее, но требует терпения!" onComplete={handleOutroComplete} />}
      </div>
    )
  }
}

export default App