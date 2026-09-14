import { DateInput, YesNo, BRAND_GRADIENT } from '../../components/FormField'
import { PAYMENT_METHODS } from '../../data/coverageOptions'

function Heading({ children }) {
  return (
    <h3 className="text-[13px] font-bold tracking-[0.06em] uppercase mb-3 pb-2" style={{ color: 'var(--ink)', borderBottom: '1px solid var(--line-strong)' }}>
      {children}
    </h3>
  )
}

// The legacy step is two numbered parts: check the application over, then pick
// how the premium gets paid.
export default function ReviewSelectPayment({ form, set, errorFor }) {
  return (
    <div className="space-y-6">
      <div>
        <Heading>Step 1: Review / Edit the Application</Heading>
        <div className="flex flex-wrap items-start gap-x-10 gap-y-5">
          <DateInput
            label="Effective Date" required
            value={form.effectiveDate} onChange={set('effectiveDate')}
            className="w-[220px]"
            error={errorFor('effectiveDate')}
          />
          <div>
            <p className="text-[13px] font-semibold text-gray-600 mb-1.5 tracking-wide">Review Application:</p>
            <YesNo value={form.reviewApplication} onChange={set('reviewApplication')} />
          </div>
        </div>
      </div>

      <div>
        <Heading>Step 2: Select Payment and Request to Bind</Heading>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PAYMENT_METHODS.map(m => {
            const picked = form.paymentMethod === m.key
            return (
              <div
                key={m.key}
                className="rounded-xl overflow-hidden flex flex-col"
                style={{
                  background: 'var(--surface-card)',
                  border: `1.5px solid ${picked ? '#7C3AED' : 'var(--line)'}`,
                  boxShadow: picked ? '0 6px 20px rgba(92,46,212,0.14)' : 'none',
                }}
              >
                {m.recommended && (
                  <div
                    className="py-1.5 text-center text-[10px] font-bold tracking-[0.12em] text-white"
                    style={{ background: BRAND_GRADIENT }}
                  >
                    RECOMMENDED
                  </div>
                )}
                <div className="p-4 flex-1 flex flex-col">
                  <p className="text-[14px] font-bold" style={{ color: 'var(--ink)' }}>{m.label}</p>
                  {m.by && <p className="text-[12px] text-gray-400 mb-2">{m.by}</p>}
                  <p className="text-[12.5px] leading-relaxed mt-2 mb-5 flex-1" style={{ color: 'var(--ink-2)' }}>
                    {m.desc}
                  </p>
                  <button
                    type="button"
                    onClick={() => set('paymentMethod')(picked ? '' : m.key)}
                    className="w-full py-2 rounded-lg text-[12.5px] font-bold transition hover:opacity-90"
                    style={picked
                      ? { background: BRAND_GRADIENT, color: 'white' }
                      : { background: 'var(--surface-soft)', color: 'var(--ink-2)', border: '1px solid var(--line)' }}
                  >
                    {picked ? '✓ Selected' : 'Select'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
        {errorFor('paymentMethod') && (
          <p className="text-[11px] text-red-500 mt-2">Pick how the premium will be paid.</p>
        )}
      </div>
    </div>
  )
}
