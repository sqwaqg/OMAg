function InfoModal({ title, content, facts, onClose }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3000,
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.96)',
        borderRadius: '60px',
        padding: '50px 45px',
        maxWidth: '750px',
        width: '85%',
        maxHeight: '85vh',
        overflowY: 'auto',
        textAlign: 'center',
        boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
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
        {facts && facts.length > 0 && (
          <>
            <hr style={{ margin: '20px 0', borderColor: '#ffd966' }} />
            <h3 style={{ color: '#ff9800', fontSize: '1.5rem', marginBottom: '15px' }}>📚 Интересные факты</h3>
            <ul style={{ textAlign: 'left', fontSize: '1.1rem', lineHeight: '1.6', color: '#333', marginBottom: '30px' }}>
              {facts.map((fact, idx) => <li key={idx}>{fact}</li>)}
            </ul>
          </>
        )}
        <button
          onClick={onClose}
          style={{
            padding: '14px 32px',
            background: '#ff9800',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Вернуться к игре
        </button>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}

export default InfoModal;