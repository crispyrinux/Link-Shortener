'use client'

import React, { useEffect, useState } from 'react'

export function CoreSpinLoader() {
  const [loadingText, setLoadingText] = useState('Initializing')

  useEffect(() => {
    const states = ['Loading...', 'Fetching Data..', 'Syncing...', 'Processing..', 'Optimizing...']
    let i = 0

    const interval = setInterval(() => {
      i = (i + 1) % states.length
      setLoadingText(states[i])
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-8">
      <div className="relative flex h-20 w-20 items-center justify-center">
        <div
          className="
            absolute inset-0 rounded-full bg-cyan-400/12 blur-xl animate-pulse
          "
        />

        <div
          className="
            absolute inset-0 rounded-full border border-dashed border-cyan-500/20
            animate-[spin_10s_linear_infinite]
          "
        />

        <div
          className="
            absolute inset-1 rounded-full border-2 border-transparent border-t-cyan-400
            shadow-[0_0_10px_rgba(34,211,238,0.45)] animate-[spin_2s_linear_infinite]
          "
        />

        <div
          className="
            absolute inset-3 rounded-full border-2 border-transparent border-b-purple-500
            shadow-[0_0_10px_rgba(168,85,247,0.35)] animate-[spin_3s_linear_infinite_reverse]
          "
        />

        <div
          className="
            absolute inset-5 rounded-full border border-transparent border-l-white/45
            animate-[spin_1s_ease-in-out_infinite]
          "
        />

        <div className="absolute inset-0 animate-[spin_4s_linear_infinite]">
          <div
            className="
              absolute left-1/2 top-0 h-1 w-1 -translate-x-1/2 rounded-full bg-cyan-400
              shadow-[0_0_8px_rgba(34,211,238,0.85)]
            "
          />
        </div>

        <div
          className="
            absolute h-2 w-2 rounded-full bg-white animate-pulse
            shadow-[0_0_12px_rgba(255,255,255,0.9)]
          "
        />
      </div>

      <div className="flex h-8 flex-col items-center justify-center gap-1">
        <span
          key={loadingText}
          className="
            text-[10px] font-medium uppercase tracking-[0.3em] text-cyan-200/70
            animate-in fade-in slide-in-from-bottom-2 duration-500
          "
        >
          {loadingText}
        </span>
      </div>
    </div>
  )
}

export { CoreSpinLoader as Spinner }
