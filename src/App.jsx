import { useState, useEffect } from 'react'
import TopNavBar from './components/TopNavBar'
import HeaderWithLogo from './components/HeaderWithLogo'
import BotHelper from './components/BotHelper'
import ExitModal from './components/ExitModal'
import StoryIntro from './components/StoryIntro'
import StoryOutro from './components/StoryOutro'
import DialogScene1 from './components/DialogScene1'
import DialogScene2 from './components/DialogScene2'
import ChoiceDialog2 from './components/ChoiceDialog2'
import InteractiveBackground from './components/InteractiveBackground'
import useSpeech from './hooks/useSpeech'
import { story1Dialogs, story1IntroText, story1OutroText, story1Tips } from './data/story1Data'
import { story2IntroText, story2OutroText, story2Tips, depositDialogs, creditDialogs, endingSuccess, endingFail, depositSuccess, familyDialogs } from './data/story2Data'
import './index.css'
import story1Image from './assets/images/story1.png'
import story2Image from './assets/images/story2.png'

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
  
  // Состояния для истории 2
  const [story2Choice, setStory2Choice] = useState(null)
  const [showChoice, setShowChoice] = useState(false)
  const [showFamilyDialog, setShowFamilyDialog] = useState(false)
  const [gameResult, setGameResult] = useState(null)
  
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
        'Ты можешь задать мне любой вопрос о финансах!',
        'Вместе мы научимся копить и тратить с умом!',
        'Не бойся ошибаться — это часть обучения!',
        'Финансовая грамотность открывает много возможностей!',
        'Я всегда рядом, если нужен совет!'
      ]
    }
    if (currentScreen === 'story1') {
      return story1Tips
    }
    if (currentScreen === 'story2') {
      return story2Tips
    }
    return ['Нажми на меня, если нужен совет!', 'Я всегда готов помочь тебе!', 'Спроси меня о чём угодно!']
  }

  const openStory = (storyId, storyTitle, storyDesc) => {
  console.log('🔴 openStory ВЫЗВАН для', storyId)
  stop()
  speak(`Вы выбрали историю: ${storyTitle}. ${storyDesc}`)
  setPendingStory(storyId)
  setShowIntro(true)
  setGameStarted(false)
  // сброс состояний
  setStory2Choice(null)
  setShowChoice(false)
  setShowFamilyDialog(false)
  setGameResult(null)
}

const handleIntroComplete = () => {
  console.log('🟢 handleIntroComplete ВЫЗВАН, pendingStory:', pendingStory)
  setShowIntro(false)
  if (pendingStory === 'story2') {
    console.log('Переход на story2')
    setCurrentScreen('story2')
    setShowFamilyDialog(true)
  } else if (pendingStory === 'story1') {
    console.log('Переход на story1 для диалога, gameStarted = false')
    setCurrentScreen('story1')
    setGameStarted(false)   // ← ДИАЛОГ (не игра)
  }
  setPendingStory(null)
}

  const handleFamilyDialogComplete = () => {
    console.log('Семейный диалог завершён, переходим к выбору')
    setShowFamilyDialog(false)
    setShowChoice(true)
  }

  const handleChoiceComplete = (choice) => {
    console.log('Выбор сделан:', choice)
    setStory2Choice(choice)
    setShowChoice(false)
    setGameStarted(true)
  }

  const handleDialogComplete = () => {
    console.log('Диалог завершён, currentScreen:', currentScreen)
    if (currentScreen === 'story1') {
      setGameStarted(true)
    } else if (currentScreen === 'story2') {
      if (story2Choice === 'deposit') {
        setGameResult('deposit_success')
      } else {
        setGameResult('credit_success')
      }
    }
  }

  const completeStory = () => {
    setShowOutro(true)
  }

  const handleOutroComplete = () => {
    setShowOutro(false)
    setCurrentScreen('start')
    setGameStarted(false)
    setGameResult(null)
    setStory2Choice(null)
    setShowChoice(false)
    setShowFamilyDialog(false)
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
      setGameResult(null)
      setStory2Choice(null)
      setShowChoice(false)
      setShowFamilyDialog(false)
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
    setGameResult(null)
    setStory2Choice(null)
    setShowChoice(false)
    setShowFamilyDialog(false)
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
    )
  }
  
  // ИСТОРИЯ 1
  if (currentScreen === 'story1') {
    console.log('🔵 Мы внутри блока story1, gameStarted =', gameStarted)
    if (!gameStarted) {
      console.log('🟣 Запускаем DialogScene1 (диалог)')
      return (
        <>
          <InteractiveBackground />
          <DialogScene1 
            onComplete={() => {
              console.log('✅ Диалог завершён, переключаем gameStarted = true')
              setGameStarted(true)
            }} 
            balance={balance || stats.money}
            onBotHint={(isHighlight) => setBotHighlight(isHighlight)}
            dialogs={story1Dialogs}
          />
        </>
      )
    }
    
    console.log('🟢 Запускаем игру (бюджет 500 ₽)')
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
        <BotHelper tips={getTipsForScreen()} highlight={botHighlight} />
        {showExitModal && <ExitModal onConfirm={confirmExit} onCancel={cancelExit} />}
        {showOutro && <StoryOutro title={story1OutroText.title} text={story1OutroText.text} onComplete={handleOutroComplete} />}
      </div>
    )
  }
  
  // ИСТОРИЯ 2
  if (currentScreen === 'story2') {
    // Этап 0: семейный диалог (родители и девочка)
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
        </>
      )
    }
    
    // Этап 1: выбор между мамой и папой
    if (showChoice) {
      return (
        <>
          <InteractiveBackground />
          <ChoiceDialog2 onChoice={handleChoiceComplete} />
        </>
      )
    }
    
    // Этап 2: диалог в зависимости от выбора
    if (gameStarted && !gameResult) {
      const dialogs = story2Choice === 'deposit' ? depositDialogs : creditDialogs
      return (
        <>
          <InteractiveBackground />
          <DialogScene2 
            onComplete={handleDialogComplete}
            balance={balance || stats.money}
            dialogs={dialogs}
            onBotHint={(isHighlight) => setBotHighlight(isHighlight)}
          />
        </>
      )
    }
    
    // Этап 3: финал
    if (gameResult) {
      let endingTitle = ''
      let endingText = ''
      if (story2Choice === 'deposit') {
        endingTitle = depositSuccess.title
        endingText = depositSuccess.text
      } else {
        endingTitle = endingSuccess.title
        endingText = endingSuccess.text
      }
      return (
        <StoryOutro 
          title={endingTitle}
          text={endingText}
          onComplete={handleOutroComplete}
        />
      )
    }
    
    return null
  }

  return null
}

export default App