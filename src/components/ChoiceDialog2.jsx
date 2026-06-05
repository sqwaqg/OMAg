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
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3000,
      animation: 'fadeIn 0.3s ease'
    }}>
      <div style={{
        display: 'flex',
        gap: '60px',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        maxWidth: '1000px',
        width: '100%',
        padding: '30px'
      }}>
        {/* Мама - слева */}
        <div style={{
          background: 'rgba(255,255,255,0.98)',
          borderRadius: '50px',
          padding: '40px 35px',
          textAlign: 'center',
          width: '340px',
          transition: 'transform 0.3s',
          cursor: 'pointer',
          boxShadow: '0 25px 45px rgba(0,0,0,0.3)',
          border: '2px solid #ffd966'
        }}
        onClick={() => onChoice('deposit')}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
          <img 
            src={foxMother} 
            alt="Мама" 
            style={{ width: '180px', height: 'auto', marginBottom: '25px' }}
          />
          <h3 style={{ color: '#2e7d32', marginBottom: '15px', fontSize: '1.8rem' }}>Мама — Вклад</h3>
          <p style={{ fontSize: '1rem', color: '#555', lineHeight: '1.4' }}>
            Отдай деньги на хранение под 15% годовых. Через год получишь больше!
          </p>
          <button style={{
            marginTop: '25px',
            padding: '14px 30px',
            background: '#2e7d32',
            color: 'white',
            border: 'none',
            borderRadius: '40px',
            cursor: 'pointer',
            fontSize: '1.1rem',
            fontWeight: 'bold'
          }}>
            Выбрать маму
          </button>
        </div>

        {/* Папа - справа */}
        <div style={{
          background: 'rgba(255,255,255,0.98)',
          borderRadius: '50px',
          padding: '40px 35px',
          textAlign: 'center',
          width: '340px',
          transition: 'transform 0.3s',
          cursor: 'pointer',
          boxShadow: '0 25px 45px rgba(0,0,0,0.3)',
          border: '2px solid #ffd966'
        }}
        onClick={() => onChoice('credit')}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
          <img 
            src={foxFather} 
            alt="Папа" 
            style={{ width: '190px', height: 'auto', marginBottom: '25px' }}
          />
          <h3 style={{ color: '#ff9800', marginBottom: '15px', fontSize: '1.8rem' }}>Папа — Кредит</h3>
          <p style={{ fontSize: '1rem', color: '#555', lineHeight: '1.4' }}>
            Возьми 2 000 ₽ сейчас, но через год верни 2 300 ₽. Планшет получишь сразу!
          </p>
          <button style={{
            marginTop: '25px',
            padding: '14px 30px',
            background: '#ff9800',
            color: 'white',
            border: 'none',
            borderRadius: '40px',
            cursor: 'pointer',
            fontSize: '1.1rem',
            fontWeight: 'bold'
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