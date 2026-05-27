import { useState } from 'react'

function TopNavBar({ onBack, progress, stats }) {
  const [isBackHovered, setIsBackHovered] = useState(false)

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '20px',
      padding: '15px 25px',
      margin: '15px 20px 20px 20px',
      flexWrap: 'wrap',
      background: 'rgba(255, 255, 255, 0.25)',
      backdropFilter: 'blur(12px)',
      borderRadius: '60px',
      border: '1px solid rgba(255, 255, 255, 0.4)',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
    }}>
      {/* Кнопка назад */}
      <button 
        onClick={onBack}
        onMouseEnter={() => setIsBackHovered(true)}
        onMouseLeave={() => setIsBackHovered(false)}
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          border: 'none',
          padding: isBackHovered ? '14px 30px' : '12px 26px',
          borderRadius: '40px',
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          color: '#2e7d32',
          minWidth: '120px',
          boxShadow: isBackHovered ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
          transition: 'all 0.2s ease'
        }}
      >
        ← Назад
      </button>

      {/* Прогресс - большая таблетка */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '50px',
        padding: '16px 28px',
        minWidth: '280px',
        flex: 2,
        maxWidth: '450px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '12px',
          fontSize: '1rem',
          fontWeight: 'bold',
          color: '#1b5e20'
        }}>
          <span>Прогресс истории</span>
          <span style={{ color: '#2e7d32', fontSize: '1.1rem' }}>{progress}%</span>
        </div>
        <div style={{
          width: '100%',
          height: '18px',
          backgroundColor: 'rgba(46, 125, 50, 0.15)',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          <div className="progress-bar-fill" style={{
            width: `${progress}%`,
            height: '100%',
            backgroundColor: '#2e7d32',
            borderRadius: '12px',
            transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
          }} />
        </div>
      </div>

      {/* Статы */}
      <div style={{
        display: 'flex',
        gap: '18px',
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '12px 24px',
        borderRadius: '50px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        <div style={{ fontSize: '1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', color: '#2e7d32' }}>
          <span style={{ fontSize: '1.2rem' }}>💰</span> {stats.money}
        </div>
        <div style={{ fontSize: '1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', color: '#2e7d32' }}>
          <span style={{ fontSize: '1.2rem' }}>⭐</span> {stats.score}
        </div>
        <div style={{ fontSize: '1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', color: '#2e7d32' }}>
          <span style={{ fontSize: '1.2rem' }}>🎯</span> {stats.level}
        </div>
      </div>
    </div>
  )
}

export default TopNavBar