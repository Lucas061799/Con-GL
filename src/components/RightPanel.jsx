import { BRAND_GRADIENT } from './FormField'
import CarrierMark from './CarrierMark'
import { formatUSD } from '../lib/rating'

function SkeletonRow() {
  return (
    <div
      className="rounded-xl px-3 py-3 flex items-center gap-3"
      style={{ background: '#FAFAFB', border: '1px solid #F3F4F6' }}
    >
      <div className="skel w-9 h-9 rounded-xl shrink-0" />
      <div className="flex-1 flex items-center justify-between gap-2">
        <div className="skel h-3 rounded w-14" />
        <div className="skel h-3 rounded w-12" />
      </div>
    </div>
  )
}

function AutoSaveIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="autoGradRP" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5C2ED4" /><stop offset="100%" stopColor="#A614C3" />
        </linearGradient>
      </defs>
      <path d="M12 16V9m0 0l-3 3m3-3l3 3" stroke="url(#autoGradRP)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 18A4.5 4.5 0 016 9.1V9a6 6 0 0111.9-.9A4.5 4.5 0 0118 18H6.5z" stroke="url(#autoGradRP)" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}

const COMPARE_STEPS = [
  { n: 1, label: 'Select Carrier' },
  { n: 2, label: 'Complete Application' },
]

// The rail's compare mode, as Builder's Risk does it: the carrier list is the
// page itself by then, so the rail keeps only the chosen quote and says where
// you are in the hand-off.
function WhereYouAre({ activeIndex }) {
  return (
    <div className="mb-6">
      <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 mb-4 pl-0.5">
        Where you are
      </div>
      <div className="space-y-5">
        {COMPARE_STEPS.map((s, i) => {
          const active = i === activeIndex
          return (
            <div key={s.n} className="flex items-center gap-4">
              <span
                className="w-9 h-9 rounded-full text-sm font-bold flex items-center justify-center shrink-0"
                style={{
                  background: 'linear-gradient(88.09deg, rgba(92,46,212,0.25) 0%, rgba(166,20,195,0.25) 100%)',
                  ...(active ? { boxShadow: '0 0 0 3px rgba(124,58,237,0.14)' } : {}),
                  opacity: active ? 1 : 0.55,
                }}
              >
                <span style={{ background: BRAND_GRADIENT, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {s.n}
                </span>
              </span>
              <span
                className="text-sm leading-tight"
                style={{ fontWeight: active ? 700 : 500, color: active ? '#111827' : '#9CA3AF' }}
              >
                {s.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Right rail, following the GL-BOP layout: progress at the top, the cheapest
// carrier promoted to a hero card, the rest as a compact list.
export default function RightPanel({
  progress, quotes = [], stale, onRefresh,
  selectedCarrier, onSelectCarrier,
  onFormReview, formComplete = false,
  inCompare = false, compareStep,
}) {
  const hasQuotes = quotes.length > 0
  const chosen = quotes.find(q => q.id === selectedCarrier)
  const top = inCompare ? (chosen ?? quotes[0]) : quotes[0]
  const rest = quotes.slice(1)

  return (
    <aside
      className="w-80 2xl:w-96 hidden xl:flex flex-col h-full shrink-0"
      style={{ background: 'white', borderLeft: '1px solid #F3F4F6' }}
    >
      <div className="p-5 flex-1 overflow-y-auto custom-scroll">

        <h2 className="text-lg font-bold text-navy mb-3">Quote in Progress</h2>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <AutoSaveIcon />
            <span className="text-xs font-medium text-gradient">All progress auto-saved</span>
          </div>
          <span className="text-xs font-bold text-gradient">{progress}%</span>
        </div>

        <div className="w-full h-1.5 rounded-full overflow-hidden mb-4" style={{ background: '#F3F4F6' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: BRAND_GRADIENT }}
          />
        </div>

        <div className="mb-5" style={{ borderTop: '1px solid #F3F4F6' }} />

        {!hasQuotes ? (
          <>
            <p className="text-[11px] text-gray-400 mb-3 leading-snug">
              Finish the quick quote to see live carrier prices.
            </p>
            <div className="space-y-2">
              {Array.from({ length: 2 }).map((_, i) => <SkeletonRow key={i} />)}
            </div>
          </>
        ) : (
          <>
            {/* Cheapest carrier gets the hero treatment */}
            {(() => {
              const isSelected = selectedCarrier === top.id
              // With nothing picked yet, the cheapest carrier carries the
              // highlight as the standing recommendation; once the applicant
              // chooses, the ring follows their choice instead.
              const isHighlighted = isSelected || !selectedCarrier
              return (
                <button
                  type="button"
                  onClick={() => onSelectCarrier?.(top.id)}
                  className="w-full rounded-2xl px-5 py-5 mb-3 flex flex-col items-center text-center relative overflow-hidden transition cursor-pointer hover:-translate-y-px"
                  style={{
                    background: 'white',
                    border: `1.5px solid ${isHighlighted ? (isSelected ? '#5C2ED4' : '#7C3AED') : '#E5E7EB'}`,
                    boxShadow: isSelected
                      ? '0 6px 24px rgba(92,46,212,0.22)'
                      : isHighlighted ? '0 4px 20px rgba(92,46,212,0.10)' : 'none',
                  }}
                >
                  <div
                    className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider text-white"
                    style={{ background: BRAND_GRADIENT }}
                  >
                    {inCompare && isSelected ? 'SELECTED' : 'BEST'}
                  </div>
                  {isSelected && (
                    <div
                      className="absolute top-2.5 left-2.5 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: BRAND_GRADIENT }}
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}

                  <CarrierMark carrier={top.carrier} product={top.product} logo={top.logo} size="lg" />

                  {inCompare && (
                    <>
                      <p className="text-base font-bold text-gray-900 mt-3">{top.carrier}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{top.product}</p>
                    </>
                  )}

                  <div className="mt-3">
                    {stale ? (
                      <span className="text-3xl font-bold text-gray-300 tracking-[0.08em]">---</span>
                    ) : (
                      <span
                        className="text-3xl font-bold"
                        style={{
                          background: BRAND_GRADIENT,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}
                      >
                        {formatUSD(top.premium)}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">Annual Premium</p>
                  <p
                    className="text-[10px] font-semibold mt-2"
                    style={{ color: isSelected ? '#5C2ED4' : '#9CA3AF' }}
                  >
                    {isSelected ? '✓ Selected' : 'Tap to select'}
                  </p>
                </button>
              )
            })()}

            {!inCompare && <div className="space-y-2">
              {rest.map(q => {
                const isSelected = selectedCarrier === q.id
                return (
                  <button
                    type="button"
                    key={q.id}
                    onClick={() => onSelectCarrier?.(q.id)}
                    className="w-full rounded-xl px-3 py-3 flex items-center gap-3 transition text-left cursor-pointer"
                    style={{
                      background: isSelected ? 'rgba(124,58,237,0.06)' : 'white',
                      border: `1.5px solid ${isSelected ? '#7C3AED' : '#E5E7EB'}`,
                      boxShadow: isSelected ? '0 4px 14px rgba(92,46,212,0.10)' : 'none',
                    }}
                  >
                    <CarrierMark carrier={q.carrier} product={q.product} logo={q.logo} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold truncate text-gray-700">{q.carrier}</p>
                      {isSelected && (
                        <p
                          className="text-[9px] font-semibold mt-0.5"
                          style={{
                            background: BRAND_GRADIENT,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                          }}
                        >
                          ✓ Selected
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      {stale ? (
                        <div className="text-sm font-bold leading-tight text-gray-300 tracking-[0.08em]">---</div>
                      ) : (
                        <>
                          <div className="text-sm font-bold leading-tight text-gray-900">{formatUSD(q.premium)}</div>
                          <div className="text-[9px] text-gray-400">per year</div>
                        </>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>}

            {inCompare && <WhereYouAre activeIndex={compareStep ?? (selectedCarrier ? 1 : 0)} />}

            {/* Answers that move the price were edited — prices stay blank
                until the applicant asks for a fresh set. */}
            {!inCompare && <button
              type="button"
              onClick={onRefresh}
              disabled={!stale}
              className="w-full inline-flex items-center justify-center gap-1.5 mt-4 py-2.5 rounded-xl text-xs font-bold transition disabled:cursor-not-allowed"
              style={stale
                ? { background: BRAND_GRADIENT, color: 'white', boxShadow: '0 4px 14px rgba(92,46,212,0.22)' }
                : { background: '#FAFAFB', color: '#9CA3AF', border: '1px solid #E5E7EB' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-2.64-6.36" /><path d="M21 3v6h-6" />
              </svg>
              Refresh My Quote
            </button>}
          </>
        )}

        <div className="my-5" style={{ borderTop: '1px solid #F3F4F6' }} />

        {/* No point handing over a half-filled application, so this only
            lights up once every section is answered. */}
        <button
          type="button"
          onClick={onFormReview}
          disabled={!formComplete}
          title={formComplete ? undefined : 'Finish the application to download the summary'}
          className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition disabled:cursor-not-allowed enabled:hover:opacity-90"
          style={formComplete
            ? { background: BRAND_GRADIENT, color: 'white', boxShadow: '0 4px 14px rgba(92,46,212,0.22)' }
            : { background: '#FAFAFB', color: '#9CA3AF', border: '1px solid #E5E7EB' }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="1" />
            <line x1="9" y1="13" x2="15" y2="13" /><line x1="9" y1="17" x2="13" y2="17" />
          </svg>
          Download Application Summary
        </button>
      </div>
    </aside>
  )
}
