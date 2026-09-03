import { useState } from 'react'
import { Select, BRAND_GRADIENT } from '../components/FormField'
import CarrierMark from '../components/CarrierMark'
import { formatUSD } from '../lib/rating'
import { CARRIER_TERMS, premiumWithTerms } from '../data/carrierTerms'

function Tick({ ok }) {
  return ok ? (
    <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24">
      <path d="M5 13l4 4L19 7" stroke="url(#featOk)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="featOk" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5C2ED4" /><stop offset="100%" stopColor="#A614C3" />
        </linearGradient>
      </defs>
    </svg>
  ) : (
    <svg className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

// Admitted / Non-Admitted takes the same two-tone pill Builder's Risk uses on
// its compare rows.
function PaperPill({ paper }) {
  const admitted = paper === 'Admitted'
  return (
    <span
      className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{
        background: admitted ? 'rgba(115,201,183,0.18)' : 'rgba(252,165,165,0.18)',
        color: admitted ? '#0D8B73' : '#B91C1C',
      }}
    >
      {paper}
    </span>
  )
}

function Panel({ title, children }) {
  return (
    <div className="rounded-xl p-4" style={{ background: '#F9FAFB', border: '1px solid #EAEAEA' }}>
      <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 mb-2.5">{title}</div>
      {children}
    </div>
  )
}

function CarrierRow({ quote, terms, onTermsChange, selected, best, onSelect }) {
  const t = CARRIER_TERMS[quote.id]
  const [open, setOpen] = useState(true)
  if (!t) return null

  const premium = premiumWithTerms(quote, terms)

  return (
    <div
      className="rounded-lg overflow-hidden transition"
      style={{
        background: 'white',
        border: `1.5px solid ${selected || best ? '#7C3AED' : '#E5E7EB'}`,
        boxShadow: selected || best ? '0 2px 12px rgba(92,46,212,0.12)' : 'none',
      }}
    >
      <div className="px-4 py-3.5 cursor-pointer" onClick={() => setOpen(o => !o)}>
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5 min-w-0 flex-wrap">
            <CarrierMark carrier={quote.carrier} product={quote.product} logo={quote.logo} size="sm" />
            <span className="text-sm font-semibold text-gray-800 truncate">{quote.carrier}</span>
            <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">{quote.product}</span>
            {best && (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white whitespace-nowrap"
                style={{ background: BRAND_GRADIENT }}
              >
                Best Value
              </span>
            )}
            <PaperPill paper={t.paper} />
          </div>
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"
            style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-gray-800">{formatUSD(premium)}</span>
            <span className="text-xs text-gray-400">/yr</span>
          </div>
          <button
            type="button"
            onClick={e => { e.stopPropagation(); onSelect(quote.id) }}
            className="px-4 py-2 rounded-lg text-xs font-bold transition shrink-0"
            style={selected
              ? { background: BRAND_GRADIENT, color: '#fff' }
              : { background: '#F3F4F6', color: '#374151' }}
          >
            {selected ? '✓ Selected' : 'Select'}
          </button>
        </div>
      </div>

      {open && (
        <div className="px-4 pb-4 pt-3" style={{ borderTop: '1px solid #F3F4F6' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Panel title="Coverage Terms">
              <div className="space-y-3" onClick={e => e.stopPropagation()}>
                <Select
                  label="Limits"
                  options={t.limits}
                  value={terms?.limit}
                  onChange={(v) => onTermsChange({ limit: v })}
                />
                <Select
                  label="Deductible"
                  options={t.deductibles}
                  value={terms?.deductible}
                  onChange={(v) => onTermsChange({ deductible: v })}
                />
              </div>
            </Panel>

            <Panel title="What's Included">
              <div className="space-y-2.5">
                {t.features.map(f => (
                  <div key={f.label} className="flex items-start gap-2.5">
                    <Tick ok={f.ok} />
                    <span className={`text-[12.5px] leading-snug ${f.ok ? 'text-gray-700' : 'text-gray-400'}`}>
                      {f.label}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      )}
    </div>
  )
}

// Its own page rather than a section of the form scroll. The carriers stack in
// one column, the way Builder's Risk lists them on Compare Your Quotes.
export default function PriceIndication({ quotes, terms, onTermsChange, selected, onSelect }) {
  const cheapest = quotes.reduce(
    (lo, q) => (lo == null || premiumWithTerms(q, terms[q.id]) < premiumWithTerms(lo, terms[lo.id]) ? q : lo),
    null,
  )

  return (
    <div className="px-4 md:px-10 py-6 md:py-8">
      {/* Same header treatment the form sections use, so the page still
          announces itself now that it lives outside the scroll. */}
      <div
        className="flex items-center justify-between gap-4 pb-3 md:pb-4 mb-8"
        style={{ borderBottom: '1px solid #D1D5DB' }}
      >
        <h2 className="text-base md:text-lg font-bold text-navy">Price Indication</h2>
      </div>

      {quotes.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-[15px] font-bold text-navy">No indication yet</p>
          <p className="text-[13px] text-gray-500 mt-1.5">
            Refresh the quote in the rail to see carrier pricing.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 grid-cols-1">
            {quotes.map(q => (
              <CarrierRow
                key={q.id}
                quote={q}
                terms={terms[q.id]}
                onTermsChange={(patch) => onTermsChange(q.id, patch)}
                selected={selected === q.id}
                best={cheapest?.id === q.id}
                onSelect={onSelect}
              />
            ))}
          </div>

          <p className="text-[12px] text-gray-400 leading-relaxed text-center mt-10 max-w-xl mx-auto">
            Indication only — the final premium is set after underwriting review and may change
            based on the answers in the full application.
          </p>
        </>
      )}
    </div>
  )
}
