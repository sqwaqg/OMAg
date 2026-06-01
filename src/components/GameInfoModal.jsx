function GameInfoModal({ title, content, onPlay, onExit }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 5000,
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.97)',
        borderRadius: '60px',
        padding: '50px 45px',
        maxWidth: '700px',
        width: '85%',
        textAlign: 'center',
        boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
        position: 'relative',
        border: '2px solid #ffd966'
      }}>
        <button
          onClick={onExit}
          style={{
            position: 'absolute',
            top: '20px',
            right: '25px',
            background: 'transparent',
            border: 'none',
            fontSize: '32px',
            fontWeight: 'bold',
            cursor: 'pointer',
            color: '#999',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#333'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
        >
          ✕
        </button>
        <h2 style={{ color: '#2e7d32', marginBottom: '20px', fontSize: '2rem' }}>{title}</h2>
        <div style={{ fontSize: '1.2rem', lineHeight: '1.6', color: '#333', marginBottom: '30px', whiteSpace: 'pre-wrap', textAlign: 'left' }}>
          {content}
        </div>
        <button
          onClick={onPlay}
          style={{
            padding: '14px 32px',
            background: '#2e7d32',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            marginRight: '15px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Начать игру
        </button>
        <button
          onClick={onExit}
          style={{
            padding: '14px 32px',
            background: '#ccc',
            color: '#333',
            border: 'none',
            borderRadius: '50px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Выйти в меню
        </button>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}

export default GameInfoModal;