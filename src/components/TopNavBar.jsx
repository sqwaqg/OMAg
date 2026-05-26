function TopNavBar({ onBack, progress, stats }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '15px',
      padding: '10px 25px',
      marginBottom: '20px',
      flexWrap: 'wrap',
      background: 'transparent'
    }}>
      {/* Кнопка назад - БОЛЬШАЯ */}
      <button 
        onClick={onBack}
        style={{
          background: '#ff6b35',
          border: 'none',
          padding: '16px 28px',
          borderRadius: '35px',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          color: 'white',
          minWidth: '140px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          transition: 'transform 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        ← Назад
      </button>

      {/* Прогресс бар - БОЛЬШЕ И ВИДНЕЕ */}
      <div style={{
        maxWidth: '280px',
        minWidth: '200px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '8px',
          fontSize: '0.85rem',
          fontWeight: 'bold',
          color: '#555'
        }}>
          <span>📊 Прогресс истории</span>
          <span style={{ color: '#4CAF50' }}>{progress}%</span>
        </div>
        <div style={{
          width: '100%',
          height: '12px',
          backgroundColor: 'rgba(0,0,0,0.08)',
          borderRadius: '6px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            backgroundColor: '#4CAF50',
            transition: 'width 0.3s ease',
            borderRadius: '6px'
          }} />
        </div>
      </div>

      {/* Статы - БОЛЬШИЕ */}
      <div style={{
        display: 'flex',
        gap: '18px',
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(8px)',
        padding: '12px 24px',
        borderRadius: '50px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '1.3rem' }}>💰</span> {stats.money}
        </div>
        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '1.3rem' }}>⭐</span> {stats.score}
        </div>
        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '1.3rem' }}>🎯</span> {stats.level}
        </div>
      </div>
    </div>
  )
}

export default TopNavBar