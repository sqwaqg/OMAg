import logo from '../assets/images/CI.png'

function HeaderWithLogo({ title, subtitle, isSmall = false }) {
  return (
    <header className={isSmall ? "header-small" : "header"}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        flexWrap: 'wrap',
        padding: '0 20px',
        position: 'relative'
      }}>
        {/* Логотип - без фона, с лёгкой тенью и свечением */}
        <div style={{
          position: 'absolute',
          left: '20px',
          height: isSmall ? '55px' : '65px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <img 
            src={logo} 
            alt="Банк Центр-Инвест"
            style={{
              height: '100%',
              width: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.2)) brightness(1.05)'
            }}
          />
        </div>
        
        {/* Заголовок */}
        <div style={{
          textAlign: 'center',
          marginLeft: '100px'
        }}>
          <h1 style={{ 
            margin: 0, 
            color: '#ffffff', 
            fontSize: isSmall ? '1.5rem' : '2.2rem',
            fontWeight: '700',
            fontFamily: "'Segoe UI', 'Arial', 'Comfortaa', sans-serif",
            letterSpacing: '-0.5px',
            textShadow: '2px 2px 6px rgba(0,0,0,0.25)'
          }}>
            {title}
          </h1>
          {subtitle && !isSmall && (
            <p style={{ 
              color: 'rgba(255,255,255,0.9)', 
              margin: '8px 0 0 0', 
              fontSize: '1rem',
              fontWeight: '500',
              textShadow: '1px 1px 4px rgba(0,0,0,0.2)'
            }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </header>
  )
}

export default HeaderWithLogo