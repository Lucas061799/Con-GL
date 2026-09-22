import CarrierMark from './CarrierMark'
import { BRAND_GRADIENT } from './FormField'
import { formatUSD } from '../lib/rating'
import {
  CC_RECOMMENDED, CC_ADDITIONAL_INSUREDS, CC_OPTIONAL, BTIS_POLICY_FEE,
} from '../data/coverageOptions'

// Everything ticked on Coverage Customization adds its legacy price to the GL
// premium; the totals blank out while the tools cover is unresolved, the way
// the legacy card does.
export function computeBreakdown(form = {}, amount = 0) {
  const priced = [...CC_RECOMMENDED, ...CC_ADDITIONAL_INSUREDS, ...CC_OPTIONAL]
    .filter(o => o.price && form[o.key])
    .reduce((sum, o) => sum + o.price, 0)
  const glPremium = Math.round(amount) + priced
  const brokerFee = Number(String(form.brokerFee ?? '').replace(/\D/g, '')) || 0
  const grossTotal = glPremium + BTIS_POLICY_FEE
  const pending = !!form.toolsEquipment &&
    (form.imClaims === 'yes' || form.imClaims == null || form.imClaims === '' ||
      (form.imClaims === 'no' && !form.imLimit))

  return { glPremium, brokerFee, grossTotal, totalDue: grossTotal + brokerFee, pending }
}

function Row({ label, value, bold = false, dark }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span
        className={`text-[12.5px] ${bold ? 'font-bold' : ''}`}
        style={{ color: bold ? (dark ? '#F9FAFB' : 'var(--ink)') : 'var(--ink-2)' }}
      >
        {label}
      </span>
      <span className="text-[12.5px] font-bold" style={{ color: dark ? '#F9FAFB' : 'var(--ink)' }}>
        {value}
      </span>
    </div>
  )
}

export default function PremiumBreakdown({ form = {}, amount = 0, quote, onBrokerFee, onSubmit, submitDisabled = false, submitHint, dark = false }) {
  const { glPremium, brokerFee, grossTotal, totalDue, pending } = computeBreakdown(form, amount)

  // Armed once the coverage is actually submittable.
  const armed = !!onSubmit && !submitDisabled

  return (
    <div
      className={`rounded-2xl p-5 mb-3 ${armed ? 'pb-armed' : ''}`}
      style={{
        background: dark ? 'rgba(255,255,255,0.04)' : 'white',
        border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'var(--line)'}`,
      }}
    >
      <h3 className="text-sm font-bold mb-4" style={{ color: dark ? '#F9FAFB' : 'var(--ink)' }}>
        Premium Breakdown
      </h3>

      <div className="flex items-center gap-3 mb-4">
        <CarrierMark carrier={quote?.carrier} product={quote?.product} logo={quote?.logo} size="sm" />
        <p className="text-[12px] font-semibold leading-snug" style={{ color: dark ? '#F9FAFB' : 'var(--ink)' }}>
          {form.dba || form.legalName || quote?.carrier}
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <p className="text-[12px] font-semibold" style={{ color: dark ? '#F9FAFB' : 'var(--ink)' }}>
            Enter your Broker Fee:
          </p>
          <p className="text-[10.5px] text-gray-400">(included in Total Due)</p>
        </div>
        <div
          className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 w-[86px] shrink-0"
          style={{
            background: dark ? 'rgba(255,255,255,0.04)' : 'white',
            border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'var(--line)'}`,
          }}
        >
          <span className="text-[12px] text-gray-400">$</span>
          <input
            value={form.brokerFee ?? ''}
            onChange={(e) => onBrokerFee && onBrokerFee(e.target.value.replace(/\D/g, ''))}
            placeholder="0"
            className="w-full bg-transparent text-[12.5px] text-right focus:outline-none"
            style={{ color: dark ? '#F9FAFB' : 'var(--ink)' }}
          />
        </div>
      </div>

      <Row label="GL Premium:" value={formatUSD(glPremium)} dark={dark} />
      <Row label="BTIS Policy Fee:" value={formatUSD(BTIS_POLICY_FEE)} dark={dark} />
      <Row label="Gross Total:" value={pending ? '---' : formatUSD(grossTotal)} bold dark={dark} />
      <Row label="Broker Fee:" value={formatUSD(brokerFee)} dark={dark} />
      <div className="my-2" style={{ borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'var(--line)'}` }} />
      <Row label="Total Due:" value={pending ? '---' : formatUSD(totalDue)} bold dark={dark} />

      {/* The coverage is submitted from the card the price lives on — but not
          before the statements above it have been read through. */}
      {onSubmit && (
        <>
          <button
            type="button"
            disabled={submitDisabled}
            onClick={() => !submitDisabled && onSubmit()}
            title={submitDisabled ? submitHint : undefined}
            className={`w-full mt-4 py-2.5 rounded-xl text-xs font-bold transition disabled:cursor-not-allowed enabled:hover:opacity-90 ${armed ? 'pb-cta-armed' : ''}`}
            style={submitDisabled
              ? dark
                ? { background: 'rgba(255,255,255,0.06)', color: '#6B7280', border: '1px solid rgba(255,255,255,0.08)' }
                : { background: '#FAFAFB', color: '#9CA3AF', border: '1px solid var(--line)' }
              // The pulse owns the shadow while it is armed.
              : { background: BRAND_GRADIENT, color: 'white' }}
          >
            Submit
          </button>
          {submitDisabled && submitHint && (
            <p className="text-[10.5px] text-gray-400 leading-snug mt-2 text-center">{submitHint}</p>
          )}
        </>
      )}
    </div>
  )
}
