import { useEffect, useState } from 'react'

const words = ['Launching...', 'Loading your OS...', 'Syncing data...', 'Almost there...']

export default function Loader() {
  const [word, setWord] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setWord(w => (w + 1) % words.length)
    }, 600)

    const progressInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(progressInterval); return 100 }
        return p + 1.5
      })
    }, 30)

    return () => { clearInterval(wordInterval); clearInterval(progressInterval) }
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      zIndex: 9999,
    }}>

      {/* Animated background orbs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', width: '500px', height: '500px',
          borderRadius: '50%', top: '-100px', left: '-100px',
          background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
          animation: 'pulse 3s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', width: '400px', height: '400px',
          borderRadius: '50%', bottom: '-100px', right: '-100px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          animation: 'pulse 3s ease-in-out infinite 1.5s',
        }} />
        <div style={{
          position: 'absolute', width: '300px', height: '300px',
          borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          background: 'radial-gradient(circle, rgba(250,204,21,0.05) 0%, transparent 70%)',
          animation: 'pulse 4s ease-in-out infinite',
        }} />
      </div>

      {/* Logo */}
      <div style={{ position: 'relative', marginBottom: '2rem' }}>
        <div style={{
          fontSize: '64px', marginBottom: '0',
          animation: 'float 2s ease-in-out infinite',
          filter: 'drop-shadow(0 0 30px rgba(124,58,237,0.6))'
        }}>🚀</div>
      </div>

      {/* Title */}
      <div style={{
        fontFamily: 'Syne, sans-serif',
        fontSize: '48px', fontWeight: '800',
        background: 'linear-gradient(135deg, #f1f5f9 0%, #a78bfa 50%, #facc15 100%)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        marginBottom: '8px', letterSpacing: '-2px'
      }}>
        Launchpad
      </div>

      <div style={{ fontSize: '14px', color: 'var(--text3)', marginBottom: '3rem', letterSpacing: '0.1em' }}>
        YOUR LIFE OS
      </div>

      {/* Progress bar */}
      <div style={{ width: '280px', marginBottom: '1.5rem' }}>
        <div style={{
          height: '2px', background: 'var(--surface2)',
          borderRadius: '2px', overflow: 'hidden'
        }}>
          <div style={{
            height: '100%', width: `${progress}%`,
            background: 'linear-gradient(90deg, var(--violet), var(--accent), var(--yellow))',
            borderRadius: '2px',
            transition: 'width 0.03s linear',
            boxShadow: '0 0 10px rgba(124,58,237,0.8)'
          }} />
        </div>
      </div>

      {/* Loading word */}
      <div style={{
        fontSize: '13px', color: 'var(--text3)',
        fontFamily: 'JetBrains Mono, monospace',
        letterSpacing: '0.05em'
      }}>
        {words[word]}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
      `}</style>
    </div>
  )
}