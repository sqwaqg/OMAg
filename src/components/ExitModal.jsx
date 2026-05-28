function ExitModal({ onConfirm, onCancel }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,255,240,0.95))',
        backdropFilter: 'blur(10px)',
        borderRadius: '40px',
        padding: '35px',
        maxWidth: '350px',
        textAlign: 'center',
        animation: 'scaleIn 0.2s ease',
        border: '1px solid rgba(46,125,50,0.3)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 15px auto',
          background: 'linear-gradient(135deg, #2e7d32, #1b5e20)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.5rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
        }}>
          🦊
        </div>
        <h3 style={{ marginBottom: '12px', color: '#1a5c1a', fontSize: '1.5rem' }}>Точно хочешь выйти?</h3>
        <p style={{ marginBottom: '25px', color: '#4a6a4a', fontSize: '1rem', lineHeight: '1.4' }}>
          Весь прогресс в этой истории будет потерян!
        </p>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '14px',
              background: 'linear-gradient(135deg, #2e7d32, #1b5e20)',
              border: 'none',
              borderRadius: '30px',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Да, выйти
          </button>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '14px',
              background: 'rgba(100,100,100,0.3)',
              border: '1px solid rgba(100,100,100,0.5)',
              borderRadius: '30px',
              color: '#333',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Остаться
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}
      </style>
    </div>
  )
}

export default ExitModal