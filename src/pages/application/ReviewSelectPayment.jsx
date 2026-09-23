import { DateInput, YesNo, BRAND_GRADIENT } from '../../components/FormField'
import { computeBreakdown } from '../../components/PremiumBreakdown'
import { FieldGroup } from '../../components/Section'
import ApplicationSummary from './ApplicationSummary'
import {
  PAYMENT_METHODS, DIRECT_BILL_NOTE, INSTALLMENT_FEE, INSTALLMENT_SHARE,
  PAY_OPTIONS, SIGN_OPTIONS,
} from '../../data/coverageOptions'

const money = (n) =>
  `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

// A small uppercase label like the field groups use — the section title above
// already carries the rule, and stacking more of them reads as clutter.
function Heading({ children }) {
  return (
    <h3 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400 mb-2.5 pl-0.5">
      {children}
    </h3>
  )
}

function Radio({ checked, onChange, label, note }) {
  return (
    // The label's first line is set to the circle's own height, so the two line
    // up exactly whether or not there is a note underneath.
    <label onClick={onChange} className="flex items-start gap-2.5 cursor-pointer select-none py-1.5">
      <span
        className="w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0"
        style={{
          border: checked ? 'none' : '1.5px solid var(--line-strong)',
          background: checked ? BRAND_GRADIENT : 'var(--surface-card)',
        }}
      >
        {checked && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
      </span>
      <span className="min-w-0">
        <span className="block text-[13px] leading-[18px]" style={{ color: 'var(--ink)' }}>{label}</span>
        {note && <span className="block text-[12px] leading-snug text-gray-400 mt-0.5">{note}</span>}
      </span>
    </label>
  )
}

function Group({ title, children }) {
  return (
    <div className="mb-4">
      <p className="text-[13px] font-bold mb-1" style={{ color: 'var(--ink)' }}>{title}</p>
      {children}
    </div>
  )
}

// The legacy step is two numbered parts: check the application over, then pick
// how the premium gets paid. Choosing a method swaps the three cards for that
// method's own questions.
export default function ReviewSelectPayment({ form, set, errorFor, amount = 0, rows = [], onContinue, onEdit }) {
  const picked = PAYMENT_METHODS.find(m => m.key === form.paymentMethod)
  const { totalDue } = computeBreakdown(form, amount)

  const onePay = totalDue + INSTALLMENT_FEE
  const financed = totalDue + INSTALLMENT_FEE * 10
  const installment = Math.round((financed * INSTALLMENT_SHARE / 9) * 100) / 100
  const down = Math.round((financed - installment * 9) * 100) / 100

  const isDirect = picked?.key === 'direct-bill'
  const ready = !!form.signMethod && (!isDirect || (!!form.installmentOption && !!form.payMethod))

  return (
    <div className="space-y-6">
      <div>
        <Heading>Step 1: Review / Edit the Application</Heading>
        <FieldGroup>
          <div className="flex flex-wrap items-start gap-x-10 gap-y-5">
            <DateInput
              label="Effective Date" required
              value={form.effectiveDate} onChange={set('effectiveDate')}
              className="w-[220px]"
              error={errorFor('effectiveDate')}
            />
            <div>
              <p className="text-[13px] font-semibold text-gray-600 mb-1.5 tracking-wide">Review Application:</p>
              {/* The pills are shorter than the date field, so they sit centred
                  in a box of the same height rather than riding high beside it. */}
              <div className="h-[42px] flex items-center">
                <YesNo value={form.reviewApplication} onChange={set('reviewApplication')} />
              </div>
            </div>
          </div>

          {/* Saying yes reads the whole application back, inside the same box
              the question is asked in. The summary's own bottom margin is
              taken off — the box already has padding. */}
          {form.reviewApplication === 'yes' && (
            <div className="mt-5 pt-5 -mb-6" style={{ borderTop: '1px solid var(--line)' }}>
              <ApplicationSummary form={form} rows={rows} onEdit={onEdit} />
            </div>
          )}
        </FieldGroup>
      </div>

      <div>
        <Heading>Step 2: Select Payment and Request to Bind</Heading>

        {!picked ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {PAYMENT_METHODS.map(m => (
                <div
                  key={m.key}
                  className={`rounded-xl overflow-hidden flex flex-col ${m.recommended ? 'pay-rec' : ''}`}
                  style={{
                    background: 'var(--surface-card)',
                    border: m.recommended ? undefined : '1.5px solid var(--line)',
                  }}
                >
                  {/* The band across the top. The other two cards answer it
                      with the same measure of padding rather than an empty
                      band of their own, so the titles line up and the space
                      reads as the card breathing. */}
                  {m.recommended && (
                    <div
                      className="h-[22px] flex items-center justify-center text-[9.5px] font-bold tracking-[0.12em] text-white"
                      style={{ background: BRAND_GRADIENT }}
                    >
                      RECOMMENDED
                    </div>
                  )}
                  <div className={`p-4 flex-1 flex flex-col ${m.recommended ? '' : 'sm:pt-[38px]'}`}>
                    {/* The name block is held to one height, so the three
                        descriptions start on the same line whether or not the
                        card has a "by" line or a title that wraps. */}
                    <div className="sm:min-h-[44px]">
                      <p className="text-[14px] font-bold" style={{ color: 'var(--ink)' }}>{m.label}</p>
                      {m.by && <p className="text-[12px] text-gray-400">{m.by}</p>}
                    </div>
                    <p className="text-[12.5px] leading-relaxed mt-2 mb-5 flex-1" style={{ color: 'var(--ink-2)' }}>
                      {m.desc}
                    </p>
                    <button
                      type="button"
                      onClick={() => set('paymentMethod')(m.key)}
                      className="w-full py-2 rounded-lg text-[12.5px] font-bold transition hover:opacity-90"
                      style={{ background: 'var(--surface-soft)', color: 'var(--ink-2)', border: '1px solid var(--line)' }}
                    >
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {errorFor('paymentMethod') && (
              <p className="text-[11px] text-red-500 mt-2">Pick how the premium will be paid.</p>
            )}
          </>
        ) : (
          <div className="rounded-xl overflow-hidden" style={{ background: 'var(--surface-card)', border: '1px solid var(--line)' }}>
            <div className="flex flex-wrap gap-4 justify-between p-4" style={{ borderBottom: '1px solid var(--line)' }}>
              <div>
                <p className="text-[14px] font-bold" style={{ color: 'var(--ink)' }}>{picked.label}</p>
                {picked.by && <p className="text-[12px] text-gray-400">{picked.by}</p>}
              </div>
              <p className="text-[12.5px] leading-relaxed max-w-[340px]" style={{ color: 'var(--ink-2)' }}>
                {picked.desc}
                {isDirect && <><br />{DIRECT_BILL_NOTE}</>}
              </p>
            </div>

            <div className="p-4">
              {isDirect && (
                <>
                  <Group title="Select installment options">
                    <Radio
                      checked={form.installmentOption === 'one-pay'}
                      onChange={() => set('installmentOption')('one-pay')}
                      label={`One payment of ${money(onePay)}`}
                    />
                    <Radio
                      checked={form.installmentOption === 'ten-pay'}
                      onChange={() => set('installmentOption')('ten-pay')}
                      label={`9 payments of ${money(installment)} with ${money(down)} down`}
                    />
                  </Group>

                  <Group title="Choose how to pay">
                    {PAY_OPTIONS.map(o => (
                      <Radio
                        key={o.key}
                        checked={form.payMethod === o.key}
                        onChange={() => set('payMethod')(o.key)}
                        label={o.label}
                      />
                    ))}
                  </Group>
                </>
              )}

              <Group title="Choose how to sign">
                {SIGN_OPTIONS.map(o => (
                  <Radio
                    key={o.key}
                    checked={form.signMethod === o.key}
                    onChange={() => set('signMethod')(o.key)}
                    label={o.label}
                    note={o.note}
                  />
                ))}
              </Group>

              <div className="flex items-center justify-between gap-4 mt-5">
                <button
                  type="button"
                  onClick={() => set('paymentMethod')('')}
                  className="px-5 py-2 rounded-lg text-[12.5px] font-semibold transition hover:opacity-90"
                  style={{ background: 'var(--surface-card)', color: 'var(--ink-2)', border: '1px solid var(--line)' }}
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!ready}
                  onClick={() => ready && onContinue && onContinue()}
                  className="px-6 py-2 rounded-lg text-[12.5px] font-bold text-white transition enabled:hover:opacity-90 disabled:cursor-not-allowed"
                  style={ready
                    ? { background: BRAND_GRADIENT, boxShadow: '0 4px 14px rgba(92,46,212,0.22)' }
                    : { background: '#FAFAFB', color: '#9CA3AF', border: '1px solid var(--line)' }}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
