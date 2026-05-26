function HeaderWithLogo({ title, subtitle, isSmall = false }) {
  return (
    <header className={isSmall ? "header-small" : "header"}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '60px',  // Увеличен отступ
        flexWrap: 'wrap',
        paddingLeft: '70px'  // Добавлен отступ слева
      }}>
        <div className="logo-image">
          ЛОГО
        </div>
        <div>
          <h1 style={{ 
            margin: 0, 
            color: '#333', 
            fontSize: isSmall ? '1.4rem' : '1.9rem',
            fontWeight: '600'
          }}>
            {title}
          </h1>
          {subtitle && !isSmall && (
            <p style={{ color: '#666', margin: '5px 0 0 0', fontSize: '0.95rem' }}>{subtitle}</p>
          )}
        </div>
      </div>
    </header>
  )
}

export default HeaderWithLogo