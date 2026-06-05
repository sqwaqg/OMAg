import logo from '../assets/images/CI.png';

function HeaderWithLogo({ title, subtitle, isSmall = false }) {
  return (
    <header className={isSmall ? "header-small" : "header"}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        padding: '25px 30px',
        position: 'relative',
        backgroundColor: '#1a4d2a',
        borderRadius: '80px',
        margin: '20px 30px 0 30px',
        boxShadow: '0 6px 20px rgba(0,0,0,0.25)'
      }}>
        <div style={{
          position: 'absolute',
          left: '40px',
          height: isSmall ? '75px' : '95px',
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
        
        <div style={{
          textAlign: 'center',
          marginLeft: '150px'
        }}>
          <h1 style={{ 
            margin: 0, 
            color: '#ffffff', 
            fontSize: isSmall ? '2.2rem' : '3rem',
            fontWeight: '800',
            fontFamily: "'Segoe UI', 'Arial', 'Comfortaa', sans-serif",
            letterSpacing: '-0.5px',
            textShadow: '2px 2px 6px rgba(0,0,0,0.3)'
          }}>
            {title}
          </h1>
          {subtitle && !isSmall && (
            <p style={{ 
              color: 'rgba(255,255,255,0.95)', 
              margin: '12px 0 0 0', 
              fontSize: '1.3rem',
              fontWeight: '500',
              textShadow: '1px 1px 4px rgba(0,0,0,0.2)'
            }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}

export default HeaderWithLogo;