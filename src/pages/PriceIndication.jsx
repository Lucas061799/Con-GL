import { forwardRef } from 'react'
import { Select, BRAND_GRADIENT } from '../components/FormField'
import CarrierMark from '../components/CarrierMark'
import Section from '../components/Section'
import { formatUSD } from '../lib/rating'
import { LIMIT_OPTIONS, DEDUCTIBLE_OPTIONS, CARRIER_PAPER } from '../data/carrierTerms'

const factorFor = (options, value) => options.find(o => o.value === value)?.factor ?? 1

export const premiumWithTerms = (quote, terms) =>
  Math.round(
    quote.premium *
    factorFor(LIMIT_OPTIONS, terms?.limit) *
    factorFor(DEDUCTIBLE_OPTIONS, terms?.deductible)
  )

function CarrierCard({ quote, terms, onTermsChange, selected, onSelect }) {
  return (
    <div
      className="rounded-2xl bg-white p-6 w-[320px]"
      style={{
        boxShadow: selected
          ? '0 0 0 2px #5C2ED4, 0 12px 32px rgba(92,46,212,0.16)'
          : '0 0 0 1px #E5E7EB',
      }}
    >
      <div className="mb-6">
        <CarrierMark carrier={quote.carrier} product={quote.product} logo={quote.logo} size="lg" />
      </div>

      <div className="space-y-4">
        <Select
          label="Limits"
          options={LIMIT_OPTIONS}
          value={terms?.limit}
          onChange={(v) => onTermsChange({ limit: v })}
        />
        <Select
          label="Deductible"
          options={DEDUCTIBLE_OPTIONS}
          value={terms?.deductible}
          onChange={(v) => onTermsChange({ deductible: v })}
        />
      </div>

      <p className="text-[14px] font-extrabold text-navy mt-6">{CARRIER_PAPER[quote.id]}</p>

      <div className="flex items-end justify-between gap-4 mt-2">
        <div>
          <p className="text-[32px] font-extrabold leading-none text-navy tracking-tight">
            {formatUSD(premiumWithTerms(quote, terms))}
          </p>
          <p className="text-[12px] font-semibold mt-1" style={{ color: '#5C2ED4' }}>annually</p>
        </div>
        <button
          type="button"
          onClick={() => onSelect(quote.id)}
          className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-[13px] font-bold uppercase tracking-wide text-white transition hover:opacity-90"
          style={{
            background: BRAND_GRADIENT,
            boxShadow: selected ? '0 4px 14px rgba(92,46,212,0.32)' : 'none',
            opacity: selected ? 1 : 0.88,
          }}
        >
          {selected && (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 13l4 4L19 7" />
            </svg>
          )}
          {selected ? 'Selected' : 'Select'}
        </button>
      </div>
    </div>
  )
}

// Section 4 — carrier comparison, and the hand-off into the full application.
const PriceIndication = forwardRef(function PriceIndication(
  { quotes, terms, onTermsChange, selected, onSelect, onContinue }, ref
) {
  return (
    <Section
      ref={ref}
      id="indication"
      title="Price Indication"
    >
      {quotes.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-[14px] font-bold text-navy">No indication yet</p>
          <p className="text-[13px] text-gray-500 mt-1.5">
            Refresh the quote in the rail to see carrier pricing.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-6">
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

          <div className="flex items-center justify-between gap-4 pt-2">
            <p className="text-[11px] text-gray-400 leading-relaxed max-w-md">
              Indication only — the final premium is set after underwriting review and may
              change based on the answers in the full application.
            </p>
            <button
              type="button"
              onClick={onContinue}
              disabled={!selected}
              title={selected ? undefined : 'Select a carrier to continue'}
              className={`shrink-0 flex items-center gap-2 px-8 py-3 rounded-xl text-[13.5px] font-bold transition ${
                selected ? 'text-white hover:opacity-90' : 'cursor-not-allowed'
              }`}
              style={
                selected
                  ? { background: BRAND_GRADIENT, boxShadow: '0 4px 14px rgba(92,46,212,0.22)' }
                  : { background: '#E5E7EB', color: '#9CA3AF' }
              }
            >
              Continue to Application
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </>
      )}
    </Section>
  )
})

export default PriceIndication
