import { useState } from 'react'
import BotHelper from './components/BotHelper'
import TopNavBar from './components/TopNavBar'
import HeaderWithLogo from './components/HeaderWithLogo'
import ExitModal from './components/ExitModal'
import './index.css'

function App() {
  const [currentScreen, setCurrentScreen] = useState('start')
  const [showExitModal, setShowExitModal] = useState(false)
  const [pendingScreen, setPendingScreen] = useState(null)
  
  const [stats, setStats] = useState({
    money: 500,
    score: 0,
    level: 1
  })

  const [progress, setProgress] = useState({
    story1: 0,
    story2: 0
  })

  const getTipsForScreen = () => {
    if (currentScreen === 'start') {
      return [
        'Выбери историю, которая тебе интересна!',
        'Финансовая грамотность — это весело!',
        'Помни: деньги любят счёт!',
        'Начни с первой истории, она проще!'
      ]
    }
    if (currentScreen === 'story1') {
      return [
        'Сначала купи хлеб и молоко!',
        'Не трать всё на сладости!',
        'Составь список продуктов до магазина',
        'Сравнивай цены на товары!'
      ]
    }
    if (currentScreen === 'story2') {
      return [
        'Копить сложнее, но выгоднее кредита!',
        'В кредите придётся отдавать больше денег',
        'Если копить каждый день по 10₽, за месяц накопится 300₽!',
        'Спроси у родителей, как они планируют бюджет'
      ]
    }
    return ['Нажми на меня, если нужен совет!']
  }

  const handleExit = (targetScreen) => {
    setPendingScreen(targetScreen)
    setShowExitModal(true)
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
  }

  const cancelExit = () => {
    setShowExitModal(false)
    setPendingScreen(null)
  }

  // Стартовый экран
  if (currentScreen === 'start') {
    return (
      <div className="app-container">
        <HeaderWithLogo 
          title="Финансовая грамотность для детей"
          subtitle="Учись управлять деньгами весело и интересно!"
        />

        <main className="main-content">
          <div className="stories-grid">
            <div className="story-card" onClick={() => setCurrentScreen('story1')}>
              <div className="story-icon">🛒</div>
              <h2>Покупка продуктов</h2>
              <p>У тебя есть 500 рублей. Сможешь купить всё необходимое?</p>
            </div>

            <div className="story-card" onClick={() => setCurrentScreen('story2')}>
              <div className="story-icon">💰</div>
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
        
        <BotHelper tips={getTipsForScreen()} />
      </div>
    )
  }
  
  // История 1
  if (currentScreen === 'story1') {
    return (
      <div className="app-container">
        <HeaderWithLogo 
          title="Покупка продуктов"
          isSmall={true}
        />

        <TopNavBar 
          onBack={() => handleExit('start')}
          progress={progress.story1}
          stats={stats}
        />

        <main className="main-content" style={{ 
          paddingTop: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ 
            maxWidth: '700px',
            width: '100%',
            margin: '0 auto'
          }}>
            <div style={{ 
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '40px', 
              padding: '45px 35px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255,255,255,0.6)',
              textAlign: 'center'
            }}>
              <h3 style={{ 
                marginBottom: '25px', 
                color: '#ff6b35', 
                fontSize: '1.8rem',
                fontWeight: '600'
              }}>
                🛒 Твой бюджет: {stats.money} ₽
              </h3>
              
              <p style={{ 
                color: '#666', 
                fontSize: '1.2rem',
                marginBottom: '35px'
              }}>
                Здесь будет игра с продуктами!
              </p>
              
              {/* Демо-кнопка - БОЛЬШАЯ И ПО ЦЕНТРУ */}
              <div>
                <button 
                  onClick={() => setProgress({...progress, story1: Math.min(progress.story1 + 20, 100)})}
                  style={{
                    padding: '16px 35px',
                    background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '40px',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                  }}
                >
                  +20% прогресса (демо)
                </button>
              </div>
            </div>
          </div>
        </main>

        <footer className="footer-small">
          <span>Банк Центр-Инвест • Учимся финансовой грамотности</span>
        </footer>
        
        <BotHelper tips={getTipsForScreen()} />

        {showExitModal && (
          <ExitModal onConfirm={confirmExit} onCancel={cancelExit} />
        )}
      </div>
    )
  }
  
  // История 2
  if (currentScreen === 'story2') {
    return (
      <div className="app-container">
        <HeaderWithLogo 
          title="Копим или берём в долг?"
          isSmall={true}
        />

        <TopNavBar 
          onBack={() => handleExit('start')}
          progress={progress.story2}
          stats={stats}
        />

        <main className="main-content" style={{ 
          paddingTop: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ 
            maxWidth: '700px',
            width: '100%',
            margin: '0 auto'
          }}>
            <div style={{ 
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '40px', 
              padding: '45px 35px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255,255,255,0.6)',
              textAlign: 'center'
            }}>
              <h3 style={{ 
                marginBottom: '30px', 
                color: '#ff6b35', 
                fontSize: '1.8rem',
                fontWeight: '600'
              }}>
                💰 Что выберешь?
              </h3>
              
              <div style={{ display: 'flex', gap: '20px', flexDirection: 'column', alignItems: 'center' }}>
                <button 
                  onClick={() => {
                    setStats({...stats, money: 600, score: stats.score + 10})
                    setProgress({...progress, story2: 100})
                  }}
                  style={{ 
                    padding: '18px 30px',
                    width: '100%',
                    maxWidth: '350px',
                    fontSize: '1.2rem', 
                    borderRadius: '50px', 
                    border: 'none', 
                    background: 'linear-gradient(135deg, #4CAF50, #45a049)', 
                    color: 'white', 
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                  }}
                >
                  🏦 Копить в банке (вклад)
                </button>
                
                <button 
                  onClick={() => {
                    setStats({...stats, money: 450, score: stats.score + 5})
                    setProgress({...progress, story2: 100})
                  }}
                  style={{ 
                    padding: '18px 30px',
                    width: '100%',
                    maxWidth: '350px',
                    fontSize: '1.2rem', 
                    borderRadius: '50px', 
                    border: 'none', 
                    background: 'linear-gradient(135deg, #ff9800, #fb8c00)', 
                    color: 'white', 
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                  }}
                >
                  👨‍👩‍👧 Попросить у родителей (кредит)
                </button>
              </div>
            </div>
          </div>
        </main>

        <footer className="footer-small">
          <span>Банк Центр-Инвест • Учимся финансовой грамотности</span>
        </footer>
        
        <BotHelper tips={getTipsForScreen()} />

        {showExitModal && (
          <ExitModal onConfirm={confirmExit} onCancel={cancelExit} />
        )}
      </div>
    )
  }
}

export default App