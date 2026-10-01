import { useState } from 'react'
import { BRAND_GRADIENT } from './FormField'

// The receipt's survey. BTIS has a real one — server-side, Ugesh said it went
// live that morning — and nobody has sent the integration yet, so this is the
// shape it would take in our shell: one score, one optional line, and a thank
// you. Nothing is posted anywhere.
const SCORES = [1, 2, 3, 4, 5]

export default function Survey() {
  const [score, setScore] = useState(null)
  const [comment, setComment] = useState('')
  const [sent, setSent] = useState(false)

  return (
    /* Every other card on this page is the plain surface, so the survey is
       the one that is tinted and capped with the brand bar — on a receipt
       nobody has to read, it has to be the thing the eye lands on. */
    <div className="screen-only notice-brand rounded-2xl h-full flex flex-col overflow-hidden">
      <div className="h-1 shrink-0" style={{ background: BRAND_GRADIENT }} />
      <div className="px-5 py-6 flex-1 flex flex-col">
      <div className="text-center mb-5">
        <span className="text-[10px] font-bold tracking-widest uppercase text-gradient">
          Quick Survey
        </span>
        <h3 className="text-lg font-bold text-navy mt-1.5 leading-snug">
          {sent ? 'Thank you.' : 'How was that?'}
        </h3>
        <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
          {sent
            ? 'Noted — it goes to the team that builds this.'
            : 'Half a minute, and it shapes the next one.'}
        </p>
      </div>

      {!sent && (
        <>
          <div className="flex items-center justify-center gap-2">
            {SCORES.map(n => {
              const on = score === n
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setScore(n)}
                  aria-label={`${n} out of 5`}
                  className="w-10 h-10 rounded-full text-sm font-bold transition"
                  style={on
                    ? { background: BRAND_GRADIENT, color: 'white', border: '1.5px solid transparent', boxShadow: '0 4px 14px rgba(92,46,212,0.25)' }
                    : { background: 'var(--surface-card)', color: 'var(--ink-2)', border: '1.5px solid var(--line)' }}
                >
                  {n}
                </button>
              )
            })}
          </div>
          <div className="flex items-center justify-between mt-1.5 px-1">
            <span className="text-[10px] text-gray-400">Painful</span>
            <span className="text-[10px] text-gray-400">Easy</span>
          </div>

          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Anything we should change? (optional)"
            className="w-full mt-4 border rounded-lg px-3 py-2.5 text-[12.5px] text-gray-800 placeholder-gray-300 field-fill border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/10 focus:border-[#7C3AED]/40 resize-none"
          />

          {/* Nothing to send to yet, so the button only closes the card. */}
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
    </div>
  )
}
