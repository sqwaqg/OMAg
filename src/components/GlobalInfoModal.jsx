import botNormal from '../assets/images/bot_smart.png';

function GlobalInfoModal({ onClose }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 5000,
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.97)',
        borderRadius: '48px',
        padding: '40px 40px',
        maxWidth: '1000px',
        width: '85%',
        maxHeight: '85vh',
        overflowY: 'auto',
        boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
        position: 'relative',
        border: '2px solid #ffd966'
      }}>
        {/* Кнопка закрытия */}
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

        {/* Заголовок и совёнок */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', gap: '20px', flexWrap: 'wrap' }}>
          <h2 style={{ color: '#2e7d32', fontSize: '2rem', margin: 0 }}>Финансовая азбука</h2>
          <img src={botNormal} alt="Совёнок" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
        </div>

        {/* Две колонки */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          {/* Вклад */}
          <div style={{ background: '#f0f7f0', borderRadius: '32px', padding: '25px', border: '1px solid #c8e6c9' }}>
            <h3 style={{ color: '#2e7d32', fontSize: '1.8rem', marginTop: 0, marginBottom: '15px' }}>Вклад</h3>
            <p><strong>Суть:</strong> Ты копишь и зарабатываешь. Твои деньги работают на банк, а ты получаешь прибыль.</p>
            <p><strong>Зачем банку это надо?</strong> Чтобы пользоваться ими, пока они у него.</p>
            <p><strong>Твоя выгода:</strong> За то, что ты даёшь попользоваться, банк возвращает тебе твои деньги и добавляет ещё сверху (это проценты).</p>
            <p style={{ marginTop: '15px', fontStyle: 'italic' }}>Вклад — это когда банк должен тебе (и ты становишься чуть богаче).</p>
          </div>

          {/* Кредит */}
          <div style={{ background: '#fff3e0', borderRadius: '32px', padding: '25px', border: '1px solid #ffe0b2' }}>
            <h3 style={{ color: '#ff9800', fontSize: '1.8rem', marginTop: 0, marginBottom: '15px' }}>Кредит</h3>
            <p><strong>Суть:</strong> Ты пользуешься чужими деньгами сейчас, но в будущем отдашь больше, чем взял.</p>
            <p><strong>Твоя выгода:</strong> Ты получаешь деньги прямо сейчас.</p>
            <p><strong>Твоя обязанность:</strong> Потом ты должен вернуть не только эти деньги, но и добавить к ним сумму по процентам.</p>
            <p style={{ marginTop: '15px', fontStyle: 'italic' }}>Кредит — это когда ты должен банку (и тебе это стоит денег).</p>
          </div>
        </div>

        {/* Итоговая строка */}
        <div style={{ marginTop: '35px', textAlign: 'center', padding: '20px', background: '#e8f5e9', borderRadius: '40px' }}>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1b5e20', margin: 0 }}>
            Вклад — ты откладываешь на мечту. <p>Кредит — ты берёшь мечту сейчас, но потом за неё переплачиваешь.</p>
          </p>
        </div>

        <button
          onClick={onClose}
          style={{
            display: 'block',
            margin: '30px auto 0 auto',
            padding: '14px 32px',
            background: '#ff9800',
            color: 'white',
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
          Закрыть
        </button>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}

export default GlobalInfoModal;