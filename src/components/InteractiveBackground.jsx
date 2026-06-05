import { useState, useEffect } from 'react'

function InteractiveBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100
      const y = (e.clientY / window.innerHeight) * 100
      setMousePosition({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -2,
        background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, #8bc34a 0%, #689f38 40%, #33691e 100%)`,
        transition: 'background 0.1s ease'
      }}
    />
  )
}

export default InteractiveBackground