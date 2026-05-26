function TopBar({ onBack, progress, stats }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '15px 20px',
      background: 'white',
      borderBottom: '2px solid #f0f0f0',
      marginBottom: '20px'
    }}>
      {/* Кнопка назад - слева */}
      <button 
        onClick={onBack}
        style={{
          background: '#ff6b35',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '25px',
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          color: 'white',
          transition: 'transform 0.2s',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        ← Назад
      </button>

      {/* Прогресс - по центру */}
      <div style={{
        flex: 1,
        maxWidth: '300px',
        margin: '0 20px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '5px',
          fontSize: '0.8rem',
          color: '#666'
        }}>
          <span>Прогресс</span>
          <span>{progress}%</span>
        </div>
        <div style={{
          width: '100%',
          height: '10px',
          backgroundColor: '#f0f0f0',
          borderRadius: '5px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            backgroundColor: '#4CAF50',
            borderRadius: '5px',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* Статы - справа */}
      <div style={{
        display: 'flex',
        gap: '20px',
        background: '#f8f8f8',
        padding: '8px 16px',
        borderRadius: '20px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.2rem' }}>💰</div>
          <div style={{ fontSize: '0.75rem', color: '#666' }}>{stats.money}₽</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.2rem' }}>⭐</div>
          <div style={{ fontSize: '0.75rem', color: '#666' }}>{stats.score}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.2rem' }}>🎯</div>
          <div style={{ fontSize: '0.75rem', color: '#666' }}>{stats.level}</div>
        </div>
      </div>
    </div>
  )
}

export default TopBar