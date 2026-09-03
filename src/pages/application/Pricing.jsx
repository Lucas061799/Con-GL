import { BRAND_GRADIENT } from '../../components/FormField'
import { formatUSD } from '../../lib/rating'
import { CARRIER_TERMS } from '../../data/carrierTerms'
import { APP_LIMITS, APP_DEDUCTIBLES } from '../../data/applicationOptions'

const labelOf = (options, value) => options.find(o => o.value === value)?.label ?? '—'

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

function Term({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2" style={{ borderTop: '1px solid #EAEAEA' }}>
      <span className="text-[13px] text-gray-500">{label}</span>
      <span className="text-[13px] font-bold text-navy">{value}</span>
    </div>
  )
}

// One quote, so it reads as the carrier row the indication page uses rather
// than a four-column table with a single row in it.
export default function Pricing({ form, quote, amount, onProceed }) {
  const paper = quote ? CARRIER_TERMS[quote.id]?.paper : null

  return (
    <div
      className="rounded-lg bg-white"
      style={{ border: '1.5px solid #7C3AED', boxShadow: '0 2px 12px rgba(92,46,212,0.12)' }}
    >
      <div className="px-4 py-3.5">
        {quote && (
          <div className="flex items-center gap-2.5 min-w-0 flex-wrap mb-2.5">
            <span className="rounded-full shrink-0" style={{ width: 8, height: 8, background: BRAND_GRADIENT }} />
            <span className="text-sm font-semibold text-gray-800 truncate">{quote.carrier}</span>
            <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">{quote.product}</span>
            {paper && <PaperPill paper={paper} />}
          </div>
        )}

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-gray-800">{formatUSD(amount)}</span>
              <span className="text-xs text-gray-400">/yr</span>
            </div>
            <p className="text-[11px] italic text-gray-400 mt-0.5">(Includes applicable fees)</p>
          </div>
          <button
            type="button"
            onClick={onProceed}
            className="px-6 py-2.5 rounded-xl text-[13px] font-bold text-white transition hover:opacity-90 shrink-0"
            style={{ background: BRAND_GRADIENT, boxShadow: '0 4px 14px rgba(92,46,212,0.22)' }}
          >
            Proceed with Quote
          </button>
        </div>
      </div>

      <div className="px-4 pb-4 pt-3" style={{ borderTop: '1px solid #F3F4F6' }}>
        <div className="rounded-xl p-4" style={{ background: '#F9FAFB', border: '1px solid #EAEAEA' }}>
          <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 mb-1">
            Coverage Terms
          </div>
          <Term label="Limits" value={labelOf(APP_LIMITS, form.appLimit)} />
          <Term label="Deductible" value={labelOf(APP_DEDUCTIBLES, form.appDeductible)} />
        </div>
      </div>
    </div>
  )
}
