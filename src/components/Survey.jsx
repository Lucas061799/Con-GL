import { useState } from 'react'
import { BRAND_GRADIENT } from './FormField'

// The receipt's survey. BTIS has a real one — server-side, Ugesh said it went
// live that morning — and no integration has come, so this is the shape it
// would take in our shell: one score, one optional line, a thank you.
// Nothing is posted anywhere.
//
// A full-width bar directly under the receipt rather than a card off to one
// side: it is the only thing on this page we want back, and the page is
// otherwise finished business. The comment box stays folded until a star is
// picked, so the bar costs one line until someone engages with it.
const STAR = 'M12 2.6l2.9 5.88 6.49.94-4.7 4.58 1.11 6.47L12 17.42l-5.8 3.05 1.1-6.47-4.69-4.58 6.49-.94z'
const SCORES = [1, 2, 3, 4, 5]

export default function Survey() {
  const [score, setScore] = useState(null)
  const [hover, setHover] = useState(null)
  const [comment, setComment] = useState('')
  const [sent, setSent] = useState(false)
  const shown = hover ?? score ?? 0

  return (
    <div
      className="screen-only rounded-2xl px-5 py-4 md:px-6"
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
        <div className="flex items-center gap-3 py-1">
          <span
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
            style={{ background: BRAND_GRADIENT }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <p className="text-sm font-bold text-navy">
            Thank you.{' '}
            <span className="font-normal text-gray-400">It goes to the team that builds this.</span>
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
            <div className="min-w-0 md:flex-1">
              <span className="text-[10px] font-bold tracking-widest uppercase text-gradient">
                Quick Survey
              </span>
              <p className="text-sm font-bold text-navy mt-1 leading-snug">
                How was that?{' '}
                <span className="font-normal text-gray-400">
                  Half a minute, and it shapes the next one.
                </span>
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0" onMouseLeave={() => setHover(null)}>
              <div className="flex items-center gap-1">
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
                    <svg className="w-7 h-7 block" viewBox="0 0 24 24">
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

              {/* Nothing to send to yet, so this only closes the bar. */}
              <button
                type="button"
                onClick={() => setSent(true)}
                disabled={score === null}
                className="px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap disabled:cursor-not-allowed enabled:hover:opacity-90"
                style={score === null
                  ? { background: 'var(--surface-soft)', color: '#9CA3AF', border: '1px solid var(--line)' }
                  : { background: BRAND_GRADIENT, color: 'white', boxShadow: '0 4px 14px rgba(92,46,212,0.22)' }}
              >
                Send
              </button>
            </div>
          </div>

          {score !== null && (
            <textarea
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Anything we should change? (optional)"
              className="w-full mt-3 border rounded-lg px-3 py-2.5 text-[12.5px] text-gray-800 placeholder-gray-300 field-fill border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/10 focus:border-[#7C3AED]/40 resize-none"
            />
          )}
        </>
      )}
    </div>
  )
}
