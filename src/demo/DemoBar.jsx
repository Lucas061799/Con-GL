import { BRAND_GRADIENT } from '../components/FormField'

// Only mounts under ?demo. A fixed bar for walking the flow without typing —
// the forms are pre-answered, so every step still runs its own validation and
// simply passes.
export default function DemoBar({ jumps, active }) {
  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[10001] no-print flex items-center gap-1 rounded-full px-2 py-1.5"
      style={{ background: 'white', border: '1px solid #E5E7EB', boxShadow: '0 8px 28px rgba(17,24,39,0.14)' }}
    >
      <span
        className="text-[10px] font-bold uppercase tracking-[0.12em] px-2.5"
        style={{ background: BRAND_GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
      >
        Demo
      </span>
      {jumps.map(j => {
        const on = j.key === active
        return (
          <button
            key={j.key}
            type="button"
            onClick={j.go}
            className="px-3 py-1.5 rounded-full text-[11.5px] font-semibold transition whitespace-nowrap"
            style={on
              ? { background: BRAND_GRADIENT, color: 'white' }
              : { color: '#4B5563' }}
            onMouseEnter={e => { if (!on) e.currentTarget.style.background = '#F3F4F6' }}
            onMouseLeave={e => { if (!on) e.currentTarget.style.background = 'transparent' }}
          >
            {j.label}
          </button>
        )
      })}
    </div>
  )
}
