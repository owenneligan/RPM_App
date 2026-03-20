import React, { useState, useEffect, useCallback } from 'react'

const CORRECT_CODE = '9025'

interface PasscodeProps {
  onUnlock: () => void
}

export function Passcode({ onUnlock }: PasscodeProps) {
  const [input, setInput] = useState('')
  const [shake, setShake] = useState(false)
  const [error, setError] = useState(false)

  const handleDigit = useCallback((digit: string) => {
    if (input.length >= 4) return
    const next = input + digit
    setInput(next)
    setError(false)

    if (next.length === 4) {
      if (next === CORRECT_CODE) {
        onUnlock()
      } else {
        setShake(true)
        setError(true)
        setTimeout(() => {
          setShake(false)
          setInput('')
          setError(false)
        }, 600)
      }
    }
  }, [input, onUnlock])

  const handleBackspace = useCallback(() => {
    setInput(prev => prev.slice(0, -1))
    setError(false)
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') handleDigit(e.key)
      else if (e.key === 'Backspace') handleBackspace()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleDigit, handleBackspace])

  const pad = ['1','2','3','4','5','6','7','8','9','','0','⌫']

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-base)',
      gap: '2.5rem',
    }}>
      {/* Logo / Title */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: '1.75rem',
          fontWeight: 700,
          color: 'var(--accent)',
          letterSpacing: '0.08em',
          marginBottom: '0.4rem',
        }}>
          RPM Life OS
        </div>
        <div style={{
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}>
          Enter your passcode
        </div>
      </div>

      {/* Digit dots */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          animation: shake ? 'passcode-shake 0.5s ease' : undefined,
        }}
      >
        {[0,1,2,3].map(i => (
          <div
            key={i}
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              border: `2px solid ${input.length > i ? 'var(--accent)' : error ? '#e05555' : 'var(--border)'}`,
              background: input.length > i ? 'rgba(201,150,61,0.12)' : 'var(--bg-card)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              color: 'var(--accent)',
              transition: 'border-color 0.2s, background 0.2s',
            }}
          >
            {input.length > i ? '●' : ''}
          </div>
        ))}
      </div>

      {/* Error message */}
      <div style={{
        height: '1.2rem',
        fontSize: '0.8rem',
        color: '#e05555',
        opacity: error ? 1 : 0,
        transition: 'opacity 0.2s',
        letterSpacing: '0.05em',
      }}>
        Incorrect code. Try again.
      </div>

      {/* Number pad */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 72px)',
        gap: '0.75rem',
      }}>
        {pad.map((key, idx) => {
          if (key === '') return <div key={idx} />
          const isBackspace = key === '⌫'
          return (
            <button
              key={idx}
              onClick={() => isBackspace ? handleBackspace() : handleDigit(key)}
              style={{
                height: 72,
                borderRadius: 14,
                border: '1px solid var(--border)',
                background: isBackspace ? 'transparent' : 'var(--bg-card)',
                color: isBackspace ? 'var(--text-muted)' : 'var(--text-primary)',
                fontSize: isBackspace ? '1.4rem' : '1.5rem',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.15s, transform 0.1s',
              }}
              onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.93)')}
              onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              {key}
            </button>
          )
        })}
      </div>

      <style>{`
        @keyframes passcode-shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-10px); }
          30% { transform: translateX(10px); }
          45% { transform: translateX(-8px); }
          60% { transform: translateX(8px); }
          75% { transform: translateX(-4px); }
          90% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  )
}
