function ExitModal({ onConfirm, onCancel }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '40px',
        padding: '35px',
        maxWidth: '350px',
        textAlign: 'center',
        animation: 'scaleIn 0.2s ease'
      }}>
        {/* Заглушка для картинки - заменишь на свою */}
        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 15px auto',
          background: 'linear-gradient(135deg, #ff6b35, #f093fb)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.5rem'
        }}>
          🐣
        </div>
        <h3 style={{ marginBottom: '12px', color: '#333', fontSize: '1.4rem' }}>Точно хочешь выйти?</h3>
        <p style={{ marginBottom: '25px', color: '#666', fontSize: '1rem', lineHeight: '1.4' }}>
          Весь прогресс в этой истории будет потерян!
        </p>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '14px',
              background: '#ff6b35',
              border: 'none',
              borderRadius: '30px',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Да, выйти
          </button>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '14px',
              background: '#e0e0e0',
              border: 'none',
              borderRadius: '30px',
              color: '#333',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
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