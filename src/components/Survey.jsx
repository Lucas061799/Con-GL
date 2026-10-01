import { useState } from 'react'
import { BRAND_GRADIENT } from './FormField'

// The receipt's survey. BTIS has a real one — server-side, Ugesh said it went
// live that morning — and no integration has come, so this is the shape it
// would take in our shell. Nothing is posted anywhere.
//
// It has a column of its own beside the receipt, so it is not something you
// scroll past, and it stretches the height of that column. Five questions an
// agent can answer in half a minute without typing, then one they can type in
// if they want to.
//
// Every option group is a grid, two columns or three, so the pills line up on
// both edges. Wrapping them freely left a ragged block that read as a mistake
// next to the even rows above it.
const STAR = 'M12 2.6l2.9 5.88 6.49.94-4.7 4.58 1.11 6.47L12 17.42l-5.8 3.05 1.1-6.47-4.69-4.58 6.49-.94z'
const SCORES = [1, 2, 3, 4, 5]
const AGAINST_LEGACY = ['Faster', 'Same', 'Slower']
const DURATIONS = ['Under 5 min', '5–10 min', '10–20 min', 'Over 20 min']
// The five steps, then Other with a box of its own. "Nothing" is kept out of
// the grid and given the full width: it is the opt-out, not a sixth step.
const FRICTION = ['Classifications', 'Eligibility', 'Coverages', 'Payment', 'Signing', 'Other']
const AGAIN = ['Yes', 'No', 'Not sure']

function Question({ children, label }) {
  return (
    <div className="mt-4">
      <p className="text-[12px] font-semibold mb-2 leading-snug" style={{ color: 'var(--ink)' }}>
        {label}
      </p>
      {children}
    </div>
  )
}

function Pill({ on, children, className = '', ...rest }) {
  return (
    <button
      type="button"
      className={`px-2 py-1.5 rounded-lg text-[11px] font-medium transition truncate ${className}`}
      style={on
        ? { background: BRAND_GRADIENT, color: 'white', border: '1px solid transparent' }
        : { background: 'var(--surface-soft)', color: 'var(--ink-2)', border: '1px solid var(--line)' }}
      {...rest}
    >
      {children}
    </button>
  )
}

export default function Survey() {
  const [score, setScore] = useState(null)
  const [hover, setHover] = useState(null)
  const [pace, setPace] = useState(null)
  const [duration, setDuration] = useState(null)
  const [friction, setFriction] = useState([])
  const [frictionOther, setFrictionOther] = useState('')
  const [again, setAgain] = useState(null)
  const [comment, setComment] = useState('')
  const [sent, setSent] = useState(false)
  const shown = hover ?? score ?? 0

  const pick = (current, set) => (value) => set(current === value ? null : value)

  // "Nothing" is the answer that cancels the others, and they cancel it.
  const toggleFriction = (label) =>
    setFriction(list => {
      if (label === 'Nothing') return list.includes(label) ? [] : ['Nothing']
      const rest = list.filter(l => l !== 'Nothing')
      return rest.includes(label) ? rest.filter(l => l !== label) : [...rest, label]
    })

  return (
    <div
      className="screen-only rounded-2xl px-5 py-5 md:px-6 h-full flex flex-col"
      style={{ background: 'var(--surface-card)', border: '1px solid var(--line-soft)' }}
    >
      {/* One gradient for all five stars; the stop classes let dark swap it. */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <linearGradient id="surveyStarG" gradientUnits="userSpaceOnUse" x1="2" y1="12" x2="22" y2="12">
            <stop offset="0%" stopColor="#5C2ED4" className="grad-stop-0" />
            <stop offset="100%" stopColor="#A614C3" className="grad-stop-1" />
          </linearGradient>
        </defs>
      </svg>

      {sent ? (
        <div className="flex items-start gap-3">
          <span
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
            style={{ background: BRAND_GRADIENT }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <p className="text-sm font-bold text-navy leading-snug">
            Thank you.{' '}
            <span className="font-normal text-gray-400">It goes to the team that builds this.</span>
          </p>
        </div>
      ) : (
        <>
          <span className="text-[10px] font-bold tracking-widest uppercase text-gradient">
            Quick Survey
          </span>

          <Question label="How was that?">
            {/* Packed, not spread. Stretching five stars to the column's
                edges put daylight between them and they stopped reading as
                one rating. */}
            <div className="flex items-center gap-1 -ml-0.5" onMouseLeave={() => setHover(null)}>
              {SCORES.map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setScore(n)}
                  onMouseEnter={() => setHover(n)}
                  onFocus={() => setHover(n)}
                  onBlur={() => setHover(null)}
                  aria-label={`${n} out of 5`}
                  className="p-0.5 transition hover:scale-110"
                >
                  <svg className="w-6 h-6 block" viewBox="0 0 24 24">
                    <path
                      d={STAR}
                      fill={n <= shown ? 'url(#surveyStarG)' : 'none'}
                      stroke={n <= shown ? 'none' : '#9CA3AF'}
                      strokeWidth="1.4"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              ))}
            </div>
          </Question>

          <Question label="Against the system you use today?">
            <div className="grid grid-cols-3 gap-1.5">
              {AGAINST_LEGACY.map(p => (
                <Pill key={p} on={pace === p} onClick={() => pick(pace, setPace)(p)}>{p}</Pill>
              ))}
            </div>
          </Question>

          <Question label="How long did it take?">
            <div className="grid grid-cols-2 gap-1.5">
              {DURATIONS.map(d => (
                <Pill key={d} on={duration === d} onClick={() => pick(duration, setDuration)(d)}>{d}</Pill>
              ))}
            </div>
          </Question>

          <Question label="Anything slow you down?">
            <div className="grid grid-cols-2 gap-1.5">
              {FRICTION.map(f => (
                <Pill key={f} on={friction.includes(f)} onClick={() => toggleFriction(f)}>{f}</Pill>
              ))}
              <div className="col-span-2">
                <Pill
                  on={friction.includes('Nothing')}
                  onClick={() => toggleFriction('Nothing')}
                  className="w-full text-center"
                >
                  Nothing
                </Pill>
              </div>
            </div>
            {friction.includes('Other') && (
              <input
                type="text"
                value={frictionOther}
                onChange={(e) => setFrictionOther(e.target.value)}
                placeholder="What was it?"
                className="w-full mt-1.5 border rounded-lg px-2.5 py-1.5 text-[11px] text-gray-800 placeholder-gray-300 field-fill border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/10 focus:border-[#7C3AED]/40"
              />
            )}
          </Question>

          <Question label="Would you quote your next one here?">
            <div className="grid grid-cols-3 gap-1.5">
              {AGAIN.map(a => (
                <Pill key={a} on={again === a} onClick={() => pick(again, setAgain)(a)}>{a}</Pill>
              ))}
            </div>
          </Question>

          {/* The last question takes whatever height the column has left, so
              matching the column beside it buys room to write rather than a
              gap above the button. */}
          <div className="mt-4 flex-1 flex flex-col min-h-0">
            <p className="text-[12px] font-semibold mb-2 leading-snug" style={{ color: 'var(--ink)' }}>
              Anything we should change?
            </p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Optional"
              className="w-full flex-1 min-h-[72px] border rounded-lg px-3 py-2.5 text-[12.5px] text-gray-800 placeholder-gray-300 field-fill border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/10 focus:border-[#7C3AED]/40 resize-none"
            />
          </div>

          {/* Nothing to send to yet, so this only closes the card. */}
          <button
            type="button"
            onClick={() => setSent(true)}
            disabled={score === null}
            className="w-full mt-4 py-2.5 rounded-xl text-xs font-bold transition disabled:cursor-not-allowed enabled:hover:opacity-90"
            style={score === null
              ? { background: 'var(--surface-soft)', color: '#9CA3AF', border: '1px solid var(--line)' }
              : { background: BRAND_GRADIENT, color: 'white', boxShadow: '0 4px 14px rgba(92,46,212,0.22)' }}
          >
            Send feedback
          </button>
        </>
      )}
    </div>
  )
}
