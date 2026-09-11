import { useState, useRef, useEffect } from 'react'
import sidebarBg from '../assets/sidebar-bg.png'
import norbieface from '../assets/norbieface.png'

// Left step rail — same shape as the Commercial Auto / GL-BOP apps: white
// panel, numbered steps, Norbie chat card pinned at the bottom over the
// palm-leaf watermark.
// Quick jump for demos: one button that opens the list of places to go.
export function DemoJump({ jumps, active }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const away = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', away)
    return () => document.removeEventListener('mousedown', away)
  }, [open])

  return (
    <div ref={ref} className="relative">
      {open && (
        <div
          className="absolute bottom-full left-0 right-0 mb-2 rounded-xl p-1.5"
          style={{ background: 'var(--surface-card)', border: '1px solid var(--line)', boxShadow: '0 8px 28px rgba(17,24,39,0.16)' }}
        >
          {jumps.map(j => {
            const on = j.key === active
            return (
              <button
                key={j.key}
                type="button"
                onClick={() => { setOpen(false); j.go() }}
                className="w-full text-left px-3 py-2 rounded-lg text-[13px] transition hover:bg-gray-50"
                style={on
                  ? { background: 'linear-gradient(88.09deg, rgba(92,46,212,0.12) 0%, rgba(166,20,195,0.12) 100%)', color: '#7C3AED', fontWeight: 600 }
                  : { color: 'var(--ink-2)' }}
              >
                {j.label}
              </button>
            )
          })}
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
        style={{ background: 'var(--glass)', border: '1.5px solid var(--line)' }}
      >
        <span
          className="w-10 h-5 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(88.09deg, rgba(92,46,212,0.14) 0%, rgba(166,20,195,0.14) 100%)' }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
          </svg>
        </span>
        <span style={{ fontSize: '14.5px', fontWeight: 400, color: 'var(--ink-2)' }}>Quick Jump</span>
      </button>
    </div>
  )
}

// The toggle Builder's Risk puts under the chat card.
function DarkToggle({ dark, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
      style={{ background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.55)', border: dark ? '1.5px solid transparent' : '1.5px solid #E5E7EB' }}
    >
      <div className="w-10 h-5 rounded-full relative transition-all shrink-0" style={{ background: dark ? '#E8622A' : '#D1D5DB' }}>
        <div
          className="absolute top-0.5 w-4 h-4 rounded-full shadow transition-all flex items-center justify-center"
          style={{ left: dark ? 22 : 2, background: 'white' }}
        >
          {dark ? (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="#6B7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          ) : (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="#6B7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </div>
      </div>
      <span style={{ fontSize: '14.5px', fontWeight: 400, color: dark ? '#F9FAFB' : '#6B7280' }}>Dark Mode</span>
    </button>
  )
}

export default function Sidebar({
  productName, submissionNumber, steps, activeStep, completed, onStepClick, progress,
  dark = false, onToggleDark, demoJumps, demoActive,
}) {
  return (
    <aside
      className="w-64 2xl:w-72 hidden lg:flex flex-col h-full shrink-0 relative overflow-hidden"
      style={{ background: 'var(--surface-rail)', borderRight: dark ? '1px solid rgba(255,255,255,0.12)' : '1px solid #F3F4F6' }}
    >
      <div className="px-5 pt-5 pb-3 relative z-10">
        <h2 className="text-base font-bold leading-tight text-navy">{productName}</h2>
        <p className="text-[11px] mt-0.5 text-gray-400 whitespace-nowrap">Submission Number: {submissionNumber}</p>

        {progress != null && (
          <div className="flex items-center gap-2.5 mt-3">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--fill-subtle)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, background: 'linear-gradient(88.09deg, #5C2ED4 0%, #A614C3 100%)' }}
              />
            </div>
            <span className="text-[11px] font-bold text-gray-400 tabular-nums">{progress}%</span>
          </div>
        )}

        <div className="mt-3" style={{ borderBottom: dark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #F3F4F6' }} />
      </div>

      <nav className="flex-1 py-1 px-3 overflow-y-auto custom-scroll relative z-10">
        {steps.map(step => {
          const isActive = step.key === activeStep
          const isDone = !!completed[step.key] && !isActive
          return (
            <div key={step.key} className="relative mb-0.5">
              {isActive && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-full"
                  style={{ background: 'linear-gradient(180deg, #5C2ED4 0%, #A614C3 100%)' }}
                />
              )}
              <button
                type="button"
                onClick={() => onStepClick?.(step.key)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150"
                style={isActive
                  ? dark
                    ? { background: 'linear-gradient(180deg, rgba(42,28,70,0.28) 0%, rgba(166,20,195,0.68) 100%)', border: '1.5px solid rgba(166,20,195,0.65)', boxShadow: '0 4px 24px rgba(166,20,195,0.25)' }
                    : { background: '#ffffff', border: '1.5px solid #7C3AED', boxShadow: '0 2px 12px rgba(92,46,212,0.12)' }
                  : { border: '1.5px solid transparent', background: 'transparent' }}
              >
                <span
                  className="w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0"
                  style={isActive
                    ? dark ? { background: 'rgba(255,255,255,0.2)', color: '#FFFFFF' } : { background: 'linear-gradient(88.09deg, rgba(92,46,212,0.12) 0%, rgba(166,20,195,0.12) 100%)', color: '#5C2ED4' }
                    : isDone
                      ? dark
                        ? { background: 'linear-gradient(88.09deg, rgba(92,46,212,0.7) 0%, rgba(166,20,195,0.7) 100%)', color: '#ffffff' }
                        : { background: 'linear-gradient(88.09deg, rgba(92,46,212,0.12) 0%, rgba(166,20,195,0.12) 100%)', color: '#5C2ED4' }
                      : { background: dark ? 'rgba(255,255,255,0.08)' : '#F3F4F6', color: dark ? '#6B7280' : '#9CA3AF' }}
                >
                  {isDone ? '✓' : step.number}
                </span>
                <span
                  className={`text-xs truncate ${isActive ? 'font-semibold' : isDone ? 'font-medium' : ''}`}
                  style={isActive && dark ? { color: '#FFFFFF' } : isActive
                    ? {
                        background: 'linear-gradient(88.09deg, #5C2ED4 0.11%, #A614C3 63.8%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }
                    : { color: dark ? (isDone ? '#D1D5DB' : '#8B8FA8') : (isDone ? '#4B5563' : '#9CA3AF') }}
                >
                  {step.label}
                </span>
              </button>
            </div>
          )
        })}
      </nav>

      {demoJumps && (
        <div className="px-3 pb-2 relative z-20">
          <DemoJump jumps={demoJumps} active={demoActive} />
        </div>
      )}

      <div className="px-3 pb-2 relative z-10">
        <div
          className="flex items-center gap-3 rounded-xl px-4 py-3"
          style={{ background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.55)', border: dark ? '1.5px solid transparent' : '1.5px solid #E5E7EB' }}
        >
          <img src={norbieface} alt="Norbie" className="w-8 h-8 rounded-full shrink-0 object-cover" />
          <div>
            <p className="text-sm font-normal" style={{ color: dark ? '#F9FAFB' : '#374151' }}>Chat with Norbie</p>
            <p className="text-xs" style={{ color: '#9CA3AF' }}>AI Assistant</p>
          </div>
        </div>
      </div>

      {onToggleDark && (
        <div className="px-3 pb-4 relative z-10">
          <DarkToggle dark={dark} onToggle={onToggleDark} />
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-full pointer-events-none select-none">
        <img
          src={sidebarBg} alt=""
          className="absolute bottom-0 left-0 w-full h-full object-cover object-bottom"
          style={{ opacity: dark ? 0.6 : 0.58, clipPath: 'inset(0 1px 0 0)' }}
        />
      </div>
    </aside>
  )
}
