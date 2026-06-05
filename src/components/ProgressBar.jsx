function ProgressBar({ value, label }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '12px 20px',
      marginBottom: '20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '8px',
        fontSize: '0.85rem',
        color: '#666'
      }}>
        <span>{label || 'Прогресс истории'}</span>
        <span style={{ fontWeight: 'bold', color: '#4CAF50' }}>{value}%</span>
      </div>
      <div style={{
        width: '100%',
        height: '10px',
        backgroundColor: '#f0f0f0',
        borderRadius: '5px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${value}%`,
          height: '100%',
          backgroundColor: '#4CAF50',
          borderRadius: '5px',
          transition: 'width 0.5s ease'
        }} />
      </div>
    </div>
  )
}

export default ProgressBar