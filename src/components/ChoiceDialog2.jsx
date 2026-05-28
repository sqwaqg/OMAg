import foxMother from '../assets/images/fox_mother.png'
import foxFather from '../assets/images/fox_father.png'

function ChoiceDialog2({ onChoice }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3000,
      animation: 'fadeIn 0.3s ease'
    }}>
      <div style={{
        display: 'flex',
        gap: '50px',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        maxWidth: '800px',
        width: '100%',
        padding: '20px'
      }}>
        {/* Мама - слева */}
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '40px',
          padding: '30px',
          textAlign: 'center',
          width: '300px',
          transition: 'transform 0.3s',
          cursor: 'pointer',
          boxShadow: '0 15px 35px rgba(0,0,0,0.3)'
        }}
        onClick={() => onChoice('deposit')}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
          <img 
            src={foxMother} 
            alt="Мама" 
            style={{ width: '160px', height: 'auto', marginBottom: '20px' }}
          />
          <h3 style={{ color: '#2e7d32', marginBottom: '15px', fontSize: '1.4rem' }}>Мама — Вклад</h3>
          <p style={{ fontSize: '0.9rem', color: '#555' }}>
            Отдай деньги на хранение под 15% годовых. Через год получишь больше!
          </p>
          <button style={{
            marginTop: '20px',
            padding: '12px 25px',
            background: '#2e7d32',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}>
            Выбрать маму
          </button>
        </div>

        {/* Папа - справа */}
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '40px',
          padding: '30px',
          textAlign: 'center',
          width: '300px',
          transition: 'transform 0.3s',
          cursor: 'pointer',
          boxShadow: '0 15px 35px rgba(0,0,0,0.3)'
        }}
        onClick={() => onChoice('credit')}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
          <img 
            src={foxFather} 
            alt="Папа" 
            style={{ width: '170px', height: 'auto', marginBottom: '20px' }}
          />
          <h3 style={{ color: '#ff9800', marginBottom: '15px', fontSize: '1.4rem' }}>Папа — Кредит</h3>
          <p style={{ fontSize: '0.9rem', color: '#555' }}>
            Возьми 2 000 ₽ сейчас, но через год верни 2 300 ₽. Планшет получишь сразу!
          </p>
          <button style={{
            marginTop: '20px',
            padding: '12px 25px',
            background: '#ff9800',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}>
            Выбрать папу
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
    </div>
  )
}

export default ChoiceDialog2