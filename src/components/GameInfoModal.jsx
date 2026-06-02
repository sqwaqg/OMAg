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
        padding: '45px 50px',
        maxWidth: '750px',
        width: '85%',
        textAlign: 'center',
        boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
        position: 'relative',
        border: '3px solid #ffd966'
      }}>
        <h2 style={{ color: '#2e7d32', marginBottom: '25px', fontSize: '2rem', fontWeight: 'bold' }}>
          {title}
        </h2>
        <div style={{ fontSize: '1.2rem', lineHeight: '1.6', color: '#333', marginBottom: '40px', whiteSpace: 'pre-wrap', textAlign: 'left' }}>
          {content}
        </div>
        <div style={{ display: 'flex', gap: '25px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={onPlay}
            style={{
              padding: '14px 40px',
              background: 'linear-gradient(135deg, #2e7d32, #1b5e20)',
              color: 'white',
              border: 'none',
              borderRadius: '60px',
              fontSize: '1.3rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              boxShadow: '0 6px 14px rgba(0,0,0,0.2)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Начать игру
          </button>
          <button
            onClick={onExit}
            style={{
              padding: '14px 40px',
              background: '#e0e0e0',
              color: '#333',
              border: 'none',
              borderRadius: '60px',
              fontSize: '1.3rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Выйти в меню
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}

export default GameInfoModal;