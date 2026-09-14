import { Select, Checkbox, InfoTip, YesNo } from '../../components/FormField'
import { FieldGroup } from '../../components/Section'
import CarrierMark from '../../components/CarrierMark'
import { formatUSD } from '../../lib/rating'
import {
  CC_DEDUCTIBLES, CC_GL_LIMITS, CC_DAMAGES_TO_PREMISES, CC_MEDICAL_LIMITS, CC_LIMIT_HELP,
  CC_RECOMMENDED, CC_IM_CLAIMS_QUESTION, CC_IM_LIMITS, CC_IM_DECLINED,
  CC_ADDITIONAL_INSUREDS, CC_OPTIONAL, BTIS_POLICY_FEE,
} from '../../data/coverageOptions'

function Heading({ children }) {
  return (
    <h3 className="text-[13px] font-bold tracking-[0.06em] uppercase mb-3 pb-2" style={{ color: 'var(--ink)', borderBottom: '1px solid var(--line-strong)' }}>
      {children}
    </h3>
  )
}

// One coverage line: label on the left, help bubble, then either a price-bearing
// checkbox or a read-only status, the way the legacy rows read.
function CoverageRow({ label, help, status, price, included, checked, onChange, children }) {
  return (
    <div className="py-2.5" style={{ borderBottom: '1px solid var(--line-soft)' }}>
      <div className="flex items-start gap-3">
        <p className="flex-1 text-[12.5px] leading-relaxed" style={{ color: 'var(--ink-2)' }}>
          {label}
        </p>
        <span className="shrink-0 mt-0.5">
          <InfoTip title={label}>{help}</InfoTip>
        </span>
        <div className="shrink-0 w-[150px] flex items-center gap-2 justify-start">
          {status ? (
            <span className="text-[12.5px] font-bold" style={{ color: 'var(--ink)' }}>{status}</span>
          ) : (
            <>
              <Checkbox checked={!!checked} onChange={onChange} />
              {/* A ticked row prints its price, or "Included" where the legacy
                  screen shows that instead. The rest just show the tick. */}
              {checked && (price != null || included) && (
                <span className="text-[12.5px] font-bold" style={{ color: 'var(--ink)' }}>
                  {price != null ? `$${price}` : 'Included'}
                </span>
              )}
            </>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}

export default function CoverageCustomization({ form, set, errorFor, quote, amount = 0 }) {
  const toolsPicked = !!form.toolsEquipment
  const toolsDeclined = toolsPicked && form.imClaims === 'yes'

  // Everything the applicant ticks adds its legacy price to the GL premium.
  const priced = [...CC_RECOMMENDED, ...CC_ADDITIONAL_INSUREDS, ...CC_OPTIONAL]
    .filter(o => o.price && form[o.key])
    .reduce((sum, o) => sum + o.price, 0)
  const glPremium = Math.round(amount) + priced
  const brokerFee = Number(String(form.brokerFee ?? '').replace(/\D/g, '')) || 0
  const grossTotal = glPremium + BTIS_POLICY_FEE
  // The legacy card blanks the totals while the tools cover is unresolved.
  const pending = toolsDeclined || (toolsPicked && form.imClaims === 'no' && !form.imLimit)

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6 items-start">
      <div className="space-y-6">
        <div>
          <Heading>Limits and Recommended Options</Heading>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            <Select
              label="Deductible" required hint={CC_LIMIT_HELP.deductible}
              options={CC_DEDUCTIBLES}
              value={form.ccDeductible} onChange={set('ccDeductible')}
              placeholder="Select One"
              error={errorFor('ccDeductible')}
            />
            <Select
              label="GL Limits" required hint={CC_LIMIT_HELP.glLimits}
              options={CC_GL_LIMITS}
              value={form.ccGlLimits} onChange={set('ccGlLimits')}
              placeholder="Select One"
              error={errorFor('ccGlLimits')}
            />
            <Select
              label="Damages to Premises Rented to You" required hint={CC_LIMIT_HELP.damagesToPremises}
              options={CC_DAMAGES_TO_PREMISES}
              value={form.ccDamagesToPremises} onChange={set('ccDamagesToPremises')}
              placeholder="Select One"
              error={errorFor('ccDamagesToPremises')}
            />
            <Select
              label="Medical Limit" required hint={CC_LIMIT_HELP.medicalLimit}
              options={CC_MEDICAL_LIMITS}
              value={form.ccMedicalLimit} onChange={set('ccMedicalLimit')}
              placeholder="Select One"
              error={errorFor('ccMedicalLimit')}
            />
          </div>
        </div>

        <div>
          <Heading>Recommended Options</Heading>
          {CC_RECOMMENDED.map(o => (
            <CoverageRow
              key={o.key}
              label={o.label} help={o.help} price={o.price}
              checked={form[o.key]} onChange={set(o.key)}
            >
              {o.key === 'toolsEquipment' && toolsPicked && (
                <div className="mt-3 pl-1 space-y-3">
                  <div className="flex items-start gap-4 flex-wrap">
                    <p className="flex-1 min-w-[240px] text-[12px] italic leading-relaxed" style={{ color: '#5C2ED4' }}>
                      {CC_IM_CLAIMS_QUESTION}
                    </p>
                    <YesNo value={form.imClaims} onChange={set('imClaims')} />
                  </div>

                  {toolsDeclined ? (
                    <div
                      className="rounded-xl px-4 py-3 text-[12.5px] leading-relaxed"
                      style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.35)', color: '#B91C1C' }}
                    >
                      {CC_IM_DECLINED}
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="text-[12.5px]" style={{ color: 'var(--ink-2)' }}>Select IM limits:</span>
                      <Select
                        options={CC_IM_LIMITS}
                        value={form.imLimit} onChange={set('imLimit')}
                        placeholder="Select One"
                        className="w-[180px]"
                        error={errorFor('imLimit')}
                      />
                    </div>
                  )}
                </div>
              )}
            </CoverageRow>
          ))}
        </div>

        <div>
          <Heading>Additional Insureds</Heading>
          {CC_ADDITIONAL_INSUREDS.map(o => (
            <CoverageRow
              key={o.key}
              label={o.label} help={o.help} status={o.status} price={o.price}
              checked={form[o.key]} onChange={set(o.key)}
            />
          ))}
        </div>

        <div>
          <Heading>Optional Coverages</Heading>
          {CC_OPTIONAL.map(o => (
            <CoverageRow
              key={o.key}
              label={o.label} help={o.help} price={o.price} included={o.included}
              checked={form[o.key]} onChange={set(o.key)}
            >
              {o.subOptions && form[o.key] && (
                <div className="mt-3 flex items-center gap-4 flex-wrap">
                  <span className="text-[12px] italic" style={{ color: '#5C2ED4' }}>{o.subLabel}</span>
                  <Select
                    options={o.subOptions}
                    value={form[`${o.key}Limit`]} onChange={set(`${o.key}Limit`)}
                    placeholder="Select One"
                    className="w-[200px]"
                    error={errorFor(`${o.key}Limit`)}
                  />
                </div>
              )}
            </CoverageRow>
          ))}
        </div>
      </div>

      {/* Premium Breakdown, as the legacy step carries it alongside the form. */}
      <div
        className="rounded-2xl p-5 xl:sticky xl:top-4"
        style={{ background: 'var(--surface-card)', border: '1px solid var(--line)', boxShadow: '0 8px 28px rgba(17,24,39,0.06)' }}
      >
        <h3 className="text-base font-bold mb-4" style={{ color: 'var(--ink)' }}>Premium Breakdown</h3>

        <div className="flex items-center gap-3 mb-4">
          <CarrierMark carrier={quote?.carrier} product={quote?.product} logo={quote?.logo} size="sm" />
          <p className="text-[12px] font-semibold leading-snug" style={{ color: 'var(--ink)' }}>
            {form.dba || form.legalName || quote?.carrier}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <p className="text-[12px] font-semibold" style={{ color: 'var(--ink)' }}>Enter your Broker Fee:</p>
            <p className="text-[10.5px] text-gray-400">(included in Total Due)</p>
          </div>
          <div
            className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 w-[96px]"
            style={{ background: 'var(--surface-card)', border: '1px solid var(--line)' }}
          >
            <span className="text-[12px] text-gray-400">$</span>
            <input
              value={form.brokerFee ?? ''}
              onChange={(e) => set('brokerFee')(e.target.value.replace(/\D/g, ''))}
              placeholder="0"
              className="w-full bg-transparent text-[12.5px] text-right focus:outline-none"
              style={{ color: 'var(--ink)' }}
            />
          </div>
        </div>

        <Row label="GL Premium:" value={formatUSD(glPremium)} />
        <Row label="BTIS Policy Fee:" value={formatUSD(BTIS_POLICY_FEE)} />
        <Row label="Gross Total:" value={pending ? '---' : formatUSD(grossTotal)} bold />
        <Row label="Broker Fee:" value={formatUSD(brokerFee)} />
        <div className="my-3" style={{ borderTop: '1px solid var(--line)' }} />
        <Row label="Total Due:" value={pending ? '---' : formatUSD(grossTotal + brokerFee)} bold />
      </div>
    </div>
  )
}

function Row({ label, value, bold = false }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className={`text-[12.5px] ${bold ? 'font-bold' : ''}`} style={{ color: bold ? 'var(--ink)' : 'var(--ink-2)' }}>
        {label}
      </span>
      <span className="text-[12.5px] font-bold" style={{ color: 'var(--ink)' }}>{value}</span>
    </div>
  )
}
