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

// Admitted / Non-Admitted is a classification, not a heading — it takes the
// badge treatment so it stops competing with the premium underneath it.
function PaperBadge({ children }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.03em]"
      style={{ background: 'rgba(92,46,212,0.08)', color: '#5C2ED4' }}
    >
      {children}
    </span>
  )
}

function CarrierCard({ quote, terms, onTermsChange, selected, onSelect }) {
  const t = CARRIER_TERMS[quote.id]
  if (!t) return null

  return (
    <div
      className="rounded-2xl bg-white p-6 w-[300px] flex flex-col transition"
      style={{
        border: `1.5px solid ${selected ? '#5C2ED4' : '#E5E7EB'}`,
        boxShadow: selected
          ? '0 6px 24px rgba(92,46,212,0.22)'
          : '0 4px 20px rgba(92,46,212,0.10)',
      }}
    >
      <div className="mb-6">
        <CarrierMark carrier={quote.carrier} product={quote.product} logo={quote.logo} size="lg" />
      </div>

      <div className="space-y-4">
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

      <div className="mt-6">
        <PaperBadge>{t.paper}</PaperBadge>
        <p className="text-[30px] font-extrabold leading-none text-navy tracking-tight mt-3">
          {formatUSD(premiumWithTerms(quote, terms))}
        </p>
        <p className="text-[12px] font-semibold mt-1" style={{ color: '#5C2ED4' }}>annually</p>
      </div>

      <button
        type="button"
        onClick={() => onSelect(quote.id)}
        className="w-full flex items-center justify-center gap-1.5 mt-4 px-6 py-2.5 rounded-xl text-[13.5px] font-bold text-white transition hover:opacity-90"
        style={{
          background: BRAND_GRADIENT,
          boxShadow: selected ? '0 4px 14px rgba(92,46,212,0.22)' : 'none',
        }}
      >
        {selected && (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" />
          </svg>
        )}
        {selected ? 'Selected' : 'Select'}
      </button>

      {/* mt-auto pins the divider to the same line on both cards even when the
          feature lists wrap differently. */}
      <div className="mt-auto pt-6 space-y-3" style={{ borderTop: '1px solid #F3F4F6', marginTop: 24 }}>
        {t.features.map(f => (
          <div key={f.label} className="flex items-start gap-2.5">
            <Tick ok={f.ok} />
            <span className={`text-[12.5px] leading-snug ${f.ok ? 'text-gray-700' : 'text-gray-400'}`}>
              {f.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Its own page rather than a section of the form scroll — the carriers need
// the full column to sit side by side with their feature lists.
export default function PriceIndication({ quotes, terms, onTermsChange, selected, onSelect }) {
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
          <div className="flex items-stretch justify-center gap-6 flex-wrap">
            {quotes.map(q => (
              <CarrierCard
                key={q.id}
                quote={q}
                terms={terms[q.id]}
                onTermsChange={(patch) => onTermsChange(q.id, patch)}
                selected={selected === q.id}
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
