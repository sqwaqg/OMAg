function ExitModal({ onConfirm, onCancel }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(245,255,245,0.98))',
        backdropFilter: 'blur(10px)',
        borderRadius: '60px',
        padding: '45px 40px',
        maxWidth: '450px',
        width: '85%',
        textAlign: 'center',
        animation: 'scaleIn 0.2s ease',
        border: '2px solid #ffd966',
        boxShadow: '0 30px 50px rgba(0,0,0,0.3)'
      }}>
        <div style={{
          width: '100px',
          height: '100px',
          margin: '0 auto 20px auto',
          background: 'linear-gradient(135deg, #2e7d32, #1b5e20)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '3rem',
          boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
        }}>
          🦊
        </div>
        <h3 style={{ marginBottom: '15px', color: '#1a5c1a', fontSize: '2rem' }}>Точно хочешь выйти?</h3>
        <p style={{ marginBottom: '30px', color: '#4a6a4a', fontSize: '1.1rem', lineHeight: '1.4' }}>
          Весь прогресс в этой истории будет потерян!
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '14px',
              background: 'linear-gradient(135deg, #2e7d32, #1b5e20)',
              border: 'none',
              borderRadius: '50px',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Да, выйти
          </button>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '14px',
              background: 'rgba(100,100,100,0.2)',
              border: '2px solid rgba(100,100,100,0.5)',
              borderRadius: '50px',
              color: '#333',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
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