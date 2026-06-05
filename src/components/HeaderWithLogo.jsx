import logo from '../assets/images/CI.png';

function HeaderWithLogo({ title, subtitle, isSmall = false }) {
  return (
    <header className={isSmall ? "header-small" : "header"}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        padding: 'clamp(15px, 2vw, 25px) clamp(20px, 3vw, 30px)',
        position: 'relative',
        backgroundColor: '#1a4d2a',
        borderRadius: 'clamp(50px, 10vw, 80px)',
        margin: 'clamp(10px, 2vw, 20px) clamp(15px, 3vw, 30px) 0 clamp(15px, 3vw, 30px)',
        boxShadow: '0 6px 20px rgba(0,0,0,0.25)'
      }}>
        <div style={{
          position: 'absolute',
          left: 'clamp(20px, 3vw, 40px)',
          height: isSmall ? 'clamp(45px, 8vh, 75px)' : 'clamp(60px, 10vh, 95px)',
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
          marginLeft: isSmall ? 'clamp(80px, 15vw, 120px)' : 'clamp(100px, 18vw, 150px)'
        }}>
          <h1 style={{ 
            margin: 0, 
            color: '#ffffff', 
            fontSize: isSmall ? 'clamp(1.2rem, 4vw, 2.2rem)' : 'clamp(1.8rem, 6vw, 3rem)',
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
              margin: 'clamp(6px, 1.5vh, 12px) 0 0 0', 
              fontSize: 'clamp(0.8rem, 2.5vw, 1.3rem)',
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