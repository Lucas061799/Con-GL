import { BRAND_GRADIENT } from '../../components/FormField'
import { formatUSD } from '../../lib/rating'
import { APP_LIMITS, APP_DEDUCTIBLES } from '../../data/applicationOptions'

const labelOf = (options, value) => options.find(o => o.value === value)?.label ?? '—'

export default function Pricing({ form, amount, onProceed }) {
  return (
    <div>
      <div className="grid grid-cols-[1fr_1fr_1.4fr_auto] gap-4 pb-3" style={{ borderBottom: '1px solid #E5E7EB' }}>
        {['Limits', 'Deductible', 'Amount', 'Action'].map(h => (
          <p key={h} className="text-[13px] font-bold text-navy">{h}</p>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_1fr_1.4fr_auto] gap-4 items-center pt-5">
        <p className="text-[14px] text-navy">{labelOf(APP_LIMITS, form.appLimit)}</p>
        <p className="text-[14px] text-navy">{labelOf(APP_DEDUCTIBLES, form.appDeductible)}</p>
        <div>
          <p className="text-[15px] text-navy">
            <span className="font-extrabold">{formatUSD(amount)}</span>{' '}
            <span className="text-gray-500">per year</span>
          </p>
          <p className="text-[12px] italic text-gray-400 mt-0.5">(Includes applicable fees)</p>
        </div>
        <button
          type="button"
          onClick={onProceed}
          className="px-6 py-2.5 rounded-xl text-[13px] font-bold text-white transition hover:opacity-90"
          style={{ background: BRAND_GRADIENT, boxShadow: '0 4px 14px rgba(92,46,212,0.22)' }}
        >
          Proceed with Quote
        </button>
      </div>
    </div>
  )
}
