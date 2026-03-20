import React, { useState, useEffect, useRef } from 'react'

const CORRECT_PIN = '9025'
const STORAGE_KEY = 'rpm_pin_unlocked'

interface PinGateProps {
  onUnlock: () => void
}

export function PinGate({ onUnlock }: PinGateProps) {
  const [digits, setDigits] = useState(['', '', '', ''])
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputs.current[0]?.focus()
  }, [])

  function handleChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return
    const next = [...digits]
    next[index] = value
    setDigits(next)
    setError(false)

    if (value && index < 3) {
      inputs.current[index + 1]?.focus()
    }

    if (value && index === 3) {
      const pin = [...next.slice(0, 3), value].join('')
      checkPin(pin)
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  function checkPin(pin: string) {
    if (pin === CORRECT_PIN) {
      localStorage.setItem(STORAGE_KEY, 'true')
      onUnlock()
    } else {
      setShake(true)
      setError(true)
      setDigits(['', '', '', ''])
      setTimeout(() => {
        setShake(false)
        inputs.current[0]?.focus()
      }, 600)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A]">
      {/* Logo area */}
      <div className="mb-10 flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-[#1A1A1A] border border-[#C9963D]/30 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9963D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        <div className="text-center">
          <h1 className="text-white text-xl font-semibold tracking-wide">RPM Life OS</h1>
          <p className="text-[#666] text-sm mt-1">Enter your access code</p>
        </div>
      </div>

      {/* PIN inputs */}
      <div
        className={`flex gap-4 ${shake ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
        style={shake ? { animation: 'shake 0.5s ease-in-out' } : {}}
      >
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={el => { inputs.current[i] = el }}
            type="password"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            className={`
              w-14 h-16 text-center text-2xl font-bold rounded-xl border-2 bg-[#141414] text-white outline-none
              transition-all duration-200 caret-transparent
              ${error
                ? 'border-red-500/70 bg-red-500/5'
                : digit
                  ? 'border-[#C9963D] bg-[#1A1A1A]'
                  : 'border-[#2A2A2A] focus:border-[#C9963D]/60'
              }
            `}
          />
        ))}
      </div>

      {error && (
        <p className="mt-5 text-red-400 text-sm">Incorrect code — try again</p>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-8px); }
          30% { transform: translateX(8px); }
          45% { transform: translateX(-6px); }
          60% { transform: translateX(6px); }
          75% { transform: translateX(-3px); }
          90% { transform: translateX(3px); }
        }
      `}</style>
    </div>
  )
}
